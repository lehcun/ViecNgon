import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { GoogleGenAI, Schema } from '@google/genai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly client: GoogleGenAI | null;
  private readonly defaultModel =
    process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  private readonly fallbackModels = (process.env.GEMINI_FALLBACK_MODELS || '')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean);
  private discoveredModelsCache: string[] | null = null;
  private activeModel: string | null = null;
  private readonly deadModels = new Set<string>();

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        'GEMINI_API_KEY chưa được cấu hình trong biến môi trường.',
      );
      this.client = null;
    } else {
      this.client = new GoogleGenAI({ apiKey });
    }
  }

  /**
   * Gọi Google Gemini với Structured Outputs (JSON Schema),
   * tích hợp retry cho lỗi 429/503 và timeout bảo vệ.
   */
  async generateStructuredJson<T>(options: {
    systemInstruction: string;
    prompt: string;
    responseSchema: Schema;
    model?: string;
    timeoutMs?: number;
  }): Promise<T> {
    if (!this.client) {
      throw new ServiceUnavailableException(
        'Tính năng AI chưa được cấu hình (thiếu GEMINI_API_KEY).',
      );
    }

    const {
      systemInstruction,
      prompt,
      responseSchema,
      model = this.activeModel || this.defaultModel,
      timeoutMs = 20000,
    } = options;

    const dynamicFallbacks = await this.getAvailableFallbackModels();
    const candidateModels = Array.from(
      new Set([model, ...this.fallbackModels, ...dynamicFallbacks]),
    ).filter((m) => !this.deadModels.has(m));

    const maxAttemptsPerModel = 2;
    let lastError: unknown;

    for (const currentModel of candidateModels) {
      for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
        try {
          const response = await this.withTimeout(
            this.client.models.generateContent({
              model: currentModel,
              contents: prompt,
              config: {
                systemInstruction,
                responseMimeType: 'application/json',
                responseSchema,
                temperature: 0.1,
              },
            }),
            timeoutMs,
          );

          const rawText = response.text;
          if (!rawText) {
            throw new InternalServerErrorException(
              'AI không trả về dữ liệu hợp lệ.',
            );
          }

          if (this.activeModel !== currentModel) {
            this.activeModel = currentModel;
            this.logger.log(`Sử dụng model Gemini khả dụng: ${currentModel}`);
          }

          return JSON.parse(rawText) as T;
        } catch (error) {
          lastError = error;
          const isRetryable = this.isRetryableError(error);

          if (this.isNotFoundError(error)) {
            this.deadModels.add(currentModel);
            this.logger.warn(
              `Model ${currentModel} không khả dụng (404), bỏ qua cho các lần gọi sau.`,
            );
            break;
          }

          if (isRetryable && attempt < maxAttemptsPerModel) {
            const delayMs = attempt * 1000;
            this.logger.warn(
              `Gemini API (${currentModel}) gặp lỗi tạm thời (lần ${attempt}/${maxAttemptsPerModel}), thử lại sau ${delayMs}ms...`,
            );
            await this.sleep(delayMs);
            continue;
          }

          if (isRetryable) {
            this.logger.warn(
              `Model ${currentModel} đang quá tải, chuyển sang model dự phòng nếu có...`,
            );
          }
          break;
        }
      }

      if (
        !this.isRetryableError(lastError) &&
        !this.isNotFoundError(lastError)
      ) {
        break;
      }
    }

    this.logger.error('Lỗi khi gọi Gemini API:', lastError);

    if (this.isRetryableError(lastError)) {
      throw new ServiceUnavailableException(
        'Hệ thống AI đang quá tải hoặc vượt giới hạn lượt gọi. Vui lòng thử lại sau ít phút.',
      );
    }

    if (
      lastError instanceof SyntaxError ||
      lastError instanceof InternalServerErrorException
    ) {
      throw new InternalServerErrorException(
        'Không thể phân tích dữ liệu trả về từ AI.',
      );
    }

    throw new ServiceUnavailableException(
      'Không thể kết nối đến dịch vụ AI. Vui lòng thử lại sau.',
    );
  }

  private async getAvailableFallbackModels(): Promise<string[]> {
    if (this.discoveredModelsCache) {
      return this.discoveredModelsCache;
    }
    if (!this.client) return [];

    try {
      const pager = await this.client.models.list();
      const models: string[] = [];
      for await (const m of pager) {
        const name = (m.name || '').replace(/^models\//, '');
        if (
          name.startsWith('gemini-') &&
          !name.includes('embedding') &&
          !name.includes('image') &&
          !name.includes('tts') &&
          !name.includes('audio') &&
          (!m.supportedActions ||
            m.supportedActions.includes('generateContent'))
        ) {
          models.push(name);
        }
      }
      // Ưu tiên flash trước pro
      models.sort((a, b) => {
        const aFlash = a.includes('flash') ? 0 : 1;
        const bFlash = b.includes('flash') ? 0 : 1;
        return aFlash - bFlash;
      });
      this.discoveredModelsCache = models.slice(0, 5);
      return this.discoveredModelsCache;
    } catch {
      return [];
    }
  }

  private isNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const err = error as { status?: number; code?: number; message?: string };
    return (
      err.status === 404 ||
      err.code === 404 ||
      (err.message ?? '').includes('NOT_FOUND')
    );
  }

  private isRetryableError(error: unknown): boolean {
    if (!error || typeof error !== 'object') return false;
    const err = error as { status?: number; code?: number; message?: string };
    const status = err.status ?? err.code;
    if (status === 429 || status === 503) return true;

    const message = (err.message ?? '').toLowerCase();
    return (
      message.includes('429') ||
      message.includes('rate limit') ||
      message.includes('resource_exhausted') ||
      message.includes('503') ||
      message.includes('timeout')
    );
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => {
            reject(new Error(`Gemini request timeout after ${ms}ms`));
          }, ms);
        }),
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
