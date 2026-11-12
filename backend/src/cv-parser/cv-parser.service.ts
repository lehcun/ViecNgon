import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Schema, Type } from '@google/genai';
import { ParsedCvData, ParseCvResponse } from '@viecngon/types';
import { GeminiService } from 'src/ai/gemini.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParseModule = require('pdf-parse');

const MIN_EXTRACTED_TEXT_LENGTH = 50;
const MAX_CV_TEXT_CHARS = 30000;

const CV_PARSER_SYSTEM_INSTRUCTION = `Bạn là chuyên gia tuyển dụng IT và hệ thống bóc tách dữ liệu CV (ATS Parser).
Nhiệm vụ của bạn là đọc văn bản thô từ CV (tiếng Việt hoặc tiếng Anh) và trích xuất chính xác thông tin ứng viên theo đúng JSON Schema được cung cấp.

Quy tắc bắt buộc:
1. KHÔNG bịa đặt thông tin không có trong CV. Nếu trường nào không có, trả về null (hoặc mảng rỗng []).
2. Chuẩn hóa mọi ngày tháng về định dạng YYYY-MM-DD.
   - Nếu CV chỉ ghi MM/YYYY (VD: 05/2022) -> chuẩn hóa thành 2022-05-01.
   - Nếu CV chỉ ghi YYYY (VD: 2021) -> chuẩn hóa thành 2021-01-01.
   - Nếu đang làm việc / "Hiện tại" / "Present" / "Nay" -> endDate trả về null.
3. yearsOfExperience: ước tính tổng số năm kinh nghiệm làm việc chuyên môn (số nguyên, làm tròn). Nếu chưa có kinh nghiệm hoặc là sinh viên mới ra trường, trả về 0.
4. skills: tách từng kỹ năng độc lập (VD: "ReactJS", "TypeScript", "NestJS"), không gộp nhiều kỹ năng vào cùng một chuỗi.
5. aboutMe: tóm tắt ngắn gọn phần giới thiệu bản thân / mục tiêu nghề nghiệp nếu có trong CV.`;

const CV_PARSER_RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    fullName: { type: Type.STRING, nullable: true },
    phoneNumber: { type: Type.STRING, nullable: true },
    dateOfBirth: { type: Type.STRING, nullable: true },
    gender: { type: Type.STRING, nullable: true },
    address: { type: Type.STRING, nullable: true },
    profession: { type: Type.STRING, nullable: true },
    yearsOfExperience: { type: Type.INTEGER, nullable: true },
    aboutMe: { type: Type.STRING, nullable: true },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          skillName: { type: Type.STRING },
          level: { type: Type.STRING, nullable: true },
        },
        required: ['skillName'],
      },
    },
    experiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          companyName: { type: Type.STRING },
          position: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING, nullable: true },
          description: { type: Type.STRING, nullable: true },
        },
        required: ['companyName', 'position', 'startDate'],
      },
    },
    educations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          schoolName: { type: Type.STRING },
          major: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING, nullable: true },
          gpa: { type: Type.STRING, nullable: true },
        },
        required: ['schoolName', 'major', 'startDate'],
      },
    },
    certificates: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          organization: { type: Type.STRING },
          issueDate: { type: Type.STRING },
          expirationDate: { type: Type.STRING, nullable: true },
        },
        required: ['name', 'organization', 'issueDate'],
      },
    },
  },
  required: [
    'fullName',
    'phoneNumber',
    'dateOfBirth',
    'gender',
    'address',
    'profession',
    'yearsOfExperience',
    'aboutMe',
    'skills',
    'experiences',
    'educations',
    'certificates',
  ],
};

export interface UploadedPdfFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

@Injectable()
export class CvParserService {
  constructor(
    private readonly geminiService: GeminiService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  /**
   * Trích xuất văn bản thô UTF-8 từ Buffer của file PDF.
   */
  async extractTextFromPdf(buffer: Buffer): Promise<string> {
    if (!buffer || buffer.length < 4) {
      throw new BadRequestException('File PDF không hợp lệ hoặc bị rỗng.');
    }

    // Kiểm tra magic bytes "%PDF" để chặn file giả mạo mimetype
    const header = buffer.subarray(0, 4).toString('utf8');
    if (header !== '%PDF') {
      throw new BadRequestException(
        'Nội dung file không đúng định dạng PDF hợp lệ.',
      );
    }

    let rawText = '';
    try {
      if (typeof pdfParseModule === 'function') {
        const result = await pdfParseModule(buffer);
        rawText = result?.text ?? '';
      } else if (typeof pdfParseModule?.PDFParse === 'function') {
        const parser = new pdfParseModule.PDFParse({ data: buffer });
        const result = await parser.getText();
        rawText = result?.text ?? '';
      } else {
        throw new Error('Không tìm thấy hàm đọc PDF từ thư viện pdf-parse.');
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new UnprocessableEntityException(
        'Không thể đọc nội dung file PDF. Vui lòng kiểm tra file không bị hỏng hoặc đặt mật khẩu.',
      );
    }

    const normalizedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    if (normalizedText.replace(/\s+/g, '').length < MIN_EXTRACTED_TEXT_LENGTH) {
      throw new UnprocessableEntityException(
        'File PDF không chứa văn bản có thể đọc được (có thể là file ảnh scan). Vui lòng tải lên CV PDF xuất từ Word, Canva hoặc TopCV.',
      );
    }

    return normalizedText.slice(0, MAX_CV_TEXT_CHARS);
  }

  /**
   * Pipeline: Đọc PDF -> Gọi Gemini bóc tách JSON -> Upload file gốc lên Cloudinary.
   */
  async parseCvPdf(file: UploadedPdfFile): Promise < ParseCvResponse > {
      const cvText = await this.extractTextFromPdf(file.buffer);

      const parsedData =
        await this.geminiService.generateStructuredJson<ParsedCvData>({
          systemInstruction: CV_PARSER_SYSTEM_INSTRUCTION,
          prompt: `Hãy bóc tách thông tin CV từ nội dung văn bản dưới đây:\n\n---\n${cvText}\n---`,
          responseSchema: CV_PARSER_RESPONSE_SCHEMA,
        });

      const fileUrl = await this.cloudinaryService.uploadCvPdf(file);

      return {
        message: 'Bóc tách CV thành công',
        parsedData: {
          fullName: parsedData.fullName ?? null,
          phoneNumber: parsedData.phoneNumber ?? null,
          dateOfBirth: parsedData.dateOfBirth ?? null,
          gender: parsedData.gender ?? null,
          address: parsedData.address ?? null,
          profession: parsedData.profession ?? null,
          yearsOfExperience: parsedData.yearsOfExperience ?? null,
          aboutMe: parsedData.aboutMe ?? null,
          skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
          experiences: Array.isArray(parsedData.experiences)
            ? parsedData.experiences
            : [],
          educations: Array.isArray(parsedData.educations)
            ? parsedData.educations
            : [],
          certificates: Array.isArray(parsedData.certificates)
            ? parsedData.certificates
            : [],
        },
        uploadedFile: {
          fileName: file.originalname || 'CV_Uploaded.pdf',
          fileUrl,
        },
      };
    }
  }

