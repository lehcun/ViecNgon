import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Schema, Type } from '@google/genai';
import type { AiMatchResult } from '@viecngon/types';
import { PrismaService } from 'src/prisma/prisma.service';
import { GeminiService } from './gemini.service';

const MATCH_SYSTEM_INSTRUCTION = `Bạn là chuyên gia đánh giá mức độ phù hợp ứng viên (AI Technical Recruiter).
Hãy đối chiếu Hồ sơ ứng viên với Mô tả công việc (JD) và chấm điểm tương thích trên thang 0-100 theo đúng trọng số:
- Kỹ năng cốt lõi (Skills): 40%
- Kinh nghiệm làm việc (Experience & Years): 30%
- Học vấn / Bằng cấp / Chứng chỉ (Education): 15%
- Lĩnh vực chuyên môn & Mức độ liên quan (Domain Fit): 15%

Yêu cầu bắt buộc:
1. Trả lời hoàn toàn bằng tiếng Việt, khách quan, súc tích và mang tính xây dựng.
2. matchScore phải là số nguyên từ 0 đến 100 phản ánh đúng tổng điểm theo 4 trọng số trên.
3. strengths: liệt kê 3-5 điểm mạnh nổi bật của ứng viên khớp với JD.
4. weaknesses: liệt kê 2-4 điểm còn thiếu hoặc khoảng cách so với JD (nếu rất phù hợp thì nêu điểm cần lưu ý/phát triển thêm).
5. summary: 2-3 câu nhận xét tổng quan giúp ứng viên hoặc nhà tuyển dụng ra quyết định nhanh.`;

const MATCH_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    matchScore: { type: Type.INTEGER },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    weaknesses: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    summary: { type: Type.STRING },
    breakdown: {
      type: Type.OBJECT,
      properties: {
        skillsScore: { type: Type.INTEGER },
        experienceScore: { type: Type.INTEGER },
        educationScore: { type: Type.INTEGER },
        domainScore: { type: Type.INTEGER },
      },
      required: [
        'skillsScore',
        'experienceScore',
        'educationScore',
        'domainScore',
      ],
    },
  },
  required: ['matchScore', 'strengths', 'weaknesses', 'summary', 'breakdown'],
};

@Injectable()
export class AiMatchService {
  private readonly logger = new Logger(AiMatchService.name);
  private readonly previewCache = new Map<
    string,
    { data: AiMatchResult; expiresAt: number }
  >();
  private readonly previewCacheTtlMs = 15 * 60 * 1000;

  constructor(
    private readonly prisma: PrismaService,
    private readonly geminiService: GeminiService,
  ) {}

  /**
   * Ứng viên xem trước điểm tương thích trước khi nộp đơn (POST /jobs/:id/match-preview)
   */
  async previewJobMatchForCandidate(
    userId: string,
    jobIdOrSlug: string,
  ): Promise<AiMatchResult> {
    const [candidate, job] = await Promise.all([
      this.prisma.ungVien.findUnique({
        where: { maTaiKhoan: userId },
        include: {
          kyNangs: { include: { kyNang: true } },
          kinhNghiems: { orderBy: { ngayBatDau: 'desc' } },
          hocVans: { orderBy: { ngayBatDau: 'desc' } },
          chungChis: { orderBy: { ngayCap: 'desc' } },
        },
      }),
      this.prisma.congViec.findFirst({
        where: {
          OR: [{ maCongViec: jobIdOrSlug }, { slug: jobIdOrSlug }],
        },
        include: {
          congViecKyNangs: { include: { kyNang: true } },
        },
      }),
    ]);

    if (!candidate) {
      throw new NotFoundException('Không tìm thấy hồ sơ ứng viên.');
    }
    if (!job) {
      throw new NotFoundException('Không tìm thấy công việc.');
    }

    const cacheKey = `${candidate.maUngVien}_${job.maCongViec}`;
    const cachedEntry = this.previewCache.get(cacheKey);
    if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
      return {
        ...cachedEntry.data,
        cached: true,
      };
    }

    const result = await this.evaluateMatch(candidate, job);
    const analyzedAt = new Date().toISOString();
    const resultWithMeta: AiMatchResult = {
      ...result,
      analyzedAt,
      cached: false,
    };

    this.previewCache.set(cacheKey, {
      data: resultWithMeta,
      expiresAt: Date.now() + this.previewCacheTtlMs,
    });

    return resultWithMeta;
  }

  /**
   * Nhà tuyển dụng phân tích độ phù hợp của 1 đơn ứng tuyển (GET /employer/applications/:id/ai-analysis)
   */
  async analyzeApplicationForEmployer(
    userId: string,
    applicationId: string,
    forceRefresh = false,
  ): Promise<AiMatchResult> {
    const [employer, application] = await Promise.all([
      this.prisma.nhaTuyenDung.findUnique({
        where: { maTaiKhoan: userId },
        select: { maCongTy: true },
      }),
      this.prisma.donXinViec.findUnique({
        where: { maDon: applicationId },
        include: {
          ungVien: {
            include: {
              kyNangs: { include: { kyNang: true } },
              kinhNghiems: { orderBy: { ngayBatDau: 'desc' } },
              hocVans: { orderBy: { ngayBatDau: 'desc' } },
              chungChis: { orderBy: { ngayCap: 'desc' } },
            },
          },
          congViec: {
            include: {
              congViecKyNangs: { include: { kyNang: true } },
              nhaTuyenDung: { select: { maCongTy: true } },
            },
          },
        },
      }),
    ]);

    if (!application) {
      throw new NotFoundException('Không tìm thấy đơn ứng tuyển.');
    }

    if (
      !employer ||
      employer.maCongTy !== application.congViec.nhaTuyenDung.maCongTy
    ) {
      throw new ForbiddenException(
        'Bạn không có quyền xem phân tích AI cho đơn ứng tuyển này.',
      );
    }

    if (!forceRefresh && application.aiAnalysisJson) {
      try {
        const parsed = JSON.parse(application.aiAnalysisJson) as AiMatchResult;
        return {
          ...parsed,
          matchScore: application.aiMatchScore ?? parsed.matchScore,
          analyzedAt: application.aiAnalyzedAt,
          cached: true,
        };
      } catch {
        this.logger.warn(
          `aiAnalysisJson của đơn ${applicationId} bị lỗi định dạng, tiến hành chấm lại...`,
        );
      }
    }

    const result = await this.evaluateMatch(
      application.ungVien,
      application.congViec,
    );
    const now = new Date();

    await this.prisma.donXinViec.update({
      where: { maDon: applicationId },
      data: {
        aiMatchScore: result.matchScore,
        aiAnalysisJson: JSON.stringify(result),
        aiAnalyzedAt: now,
      },
    });

    return {
      ...result,
      analyzedAt: now.toISOString(),
      cached: false,
    };
  }

  /**
   * Chạy ngầm chấm điểm AI ngay sau khi ứng viên nộp đơn, lưu sẵn vào DB cho HR.
   */
  async triggerBackgroundAnalysis(applicationId: string): Promise<void> {
    try {
      const application = await this.prisma.donXinViec.findUnique({
        where: { maDon: applicationId },
        include: {
          ungVien: {
            include: {
              kyNangs: { include: { kyNang: true } },
              kinhNghiems: { orderBy: { ngayBatDau: 'desc' } },
              hocVans: { orderBy: { ngayBatDau: 'desc' } },
              chungChis: { orderBy: { ngayCap: 'desc' } },
            },
          },
          congViec: {
            include: {
              congViecKyNangs: { include: { kyNang: true } },
            },
          },
        },
      });

      if (!application) return;

      const result = await this.evaluateMatch(
        application.ungVien,
        application.congViec,
      );

      await this.prisma.donXinViec.update({
        where: { maDon: applicationId },
        data: {
          aiMatchScore: result.matchScore,
          aiAnalysisJson: JSON.stringify(result),
          aiAnalyzedAt: new Date(),
        },
      });
    } catch (error) {
      this.logger.warn(
        `Chấm điểm AI ngầm thất bại cho đơn ${applicationId}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  private async evaluateMatch(
    candidate: {
      tenUngVien: string;
      chuyenMon: string;
      soNamKinhNghiem: number | null;
      gioiThieuBanThan: string | null;
      kyNangs: { kyNang: { tenKyNang: string }; mucDo: string | null }[];
      kinhNghiems: {
        tenCongTy: string;
        viTri: string;
        ngayBatDau: Date;
        ngayKetThuc: Date | null;
        moTaChiTiet: string | null;
      }[];
      hocVans: {
        tenTruong: string;
        nganhHoc: string;
        gpa: string | null;
      }[];
      chungChis: {
        tenChungChi: string;
        toChucCap: string;
      }[];
    },
    job: {
      tenCongViec: string;
      moTa: string | null;
      yeuCauCongViec: string | null;
      yeuCauKinhNghiem: number | null;
      capBac: string | null;
      congViecKyNangs: { kyNang: { tenKyNang: string } }[];
    },
  ): Promise<AiMatchResult> {
    const candidateSummary = {
      chuyenMon: candidate.chuyenMon,
      soNamKinhNghiem: candidate.soNamKinhNghiem ?? 0,
      gioiThieu:
        this.stripHtml(candidate.gioiThieuBanThan)?.slice(0, 600) ?? null,
      kyNang: candidate.kyNangs.map((k) =>
        k.mucDo ? `${k.kyNang.tenKyNang} (${k.mucDo})` : k.kyNang.tenKyNang,
      ),
      kinhNghiem: candidate.kinhNghiems.slice(0, 5).map((e) => ({
        congTy: e.tenCongTy,
        viTri: e.viTri,
        tu: e.ngayBatDau.toISOString().slice(0, 7),
        den: e.ngayKetThuc
          ? e.ngayKetThuc.toISOString().slice(0, 7)
          : 'Hiện tại',
        moTa: this.stripHtml(e.moTaChiTiet)?.slice(0, 300) ?? null,
      })),
      hocVan: candidate.hocVans.map((h) => ({
        truong: h.tenTruong,
        nganh: h.nganhHoc,
        gpa: h.gpa,
      })),
      chungChi: candidate.chungChis.map(
        (c) => `${c.tenChungChi} (${c.toChucCap})`,
      ),
    };

    const jobSummary = {
      tenCongViec: job.tenCongViec,
      capBac: job.capBac,
      yeuCauKinhNghiemNam: job.yeuCauKinhNghiem,
      kyNangYeuCau: job.congViecKyNangs.map((k) => k.kyNang.tenKyNang),
      moTa: this.stripHtml(job.moTa)?.slice(0, 1500) ?? null,
      yeuCauCongViec:
        this.stripHtml(job.yeuCauCongViec)?.slice(0, 1500) ?? null,
    };

    const prompt = `Hãy đánh giá mức độ phù hợp giữa HỒ SƠ ỨNG VIÊN và CÔNG VIỆC dưới đây:

=== HỒ SƠ ỨNG VIÊN ===
${JSON.stringify(candidateSummary, null, 2)}

=== MÔ TẢ CÔNG VIỆC (JD) ===
${JSON.stringify(jobSummary, null, 2)}`;

    const result =
      await this.geminiService.generateStructuredJson<AiMatchResult>({
        systemInstruction: MATCH_SYSTEM_INSTRUCTION,
        prompt,
        responseSchema: MATCH_RESPONSE_SCHEMA,
      });

    const clampScore = (val: number | undefined): number => {
      if (typeof val !== 'number' || isNaN(val)) return 0;
      return Math.max(0, Math.min(100, Math.round(val)));
    };

    return {
      matchScore: clampScore(result.matchScore),
      strengths: Array.isArray(result.strengths) ? result.strengths : [],
      weaknesses: Array.isArray(result.weaknesses) ? result.weaknesses : [],
      summary: result.summary ?? '',
      breakdown: result.breakdown
        ? {
            skillsScore: clampScore(result.breakdown.skillsScore),
            experienceScore: clampScore(result.breakdown.experienceScore),
            educationScore: clampScore(result.breakdown.educationScore),
            domainScore: clampScore(result.breakdown.domainScore),
          }
        : undefined,
    };
  }

  private stripHtml(input: string | null | undefined): string | null {
    if (!input) return null;
    const cleaned = input
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned || null;
  }
}
