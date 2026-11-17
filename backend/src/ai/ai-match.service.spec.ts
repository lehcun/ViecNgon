import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { AiMatchService } from './ai-match.service';
import { GeminiService } from './gemini.service';

describe('AiMatchService', () => {
  let service: AiMatchService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let geminiService: { generateStructuredJson: jest.Mock };

  beforeEach(async () => {
    prisma = createPrismaMock();
    geminiService = {
      generateStructuredJson: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiMatchService,
        { provide: PrismaService, useValue: prisma },
        { provide: GeminiService, useValue: geminiService },
      ],
    }).compile();

    service = module.get<AiMatchService>(AiMatchService);
  });

  it('ném NotFoundException nếu không tìm thấy ứng viên hoặc công việc', async () => {
    prisma.ungVien.findUnique.mockResolvedValue(null);
    prisma.congViec.findFirst.mockResolvedValue(null);

    await expect(
      service.previewJobMatchForCandidate('user-1', 'job-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('làm sạch HTML ở mô tả, chuẩn hóa điểm NaN/vượt biên và cache kết quả', async () => {
    prisma.ungVien.findUnique.mockResolvedValue({
      maUngVien: 'uv-1',
      chuyenMon: null,
      kinhNghiemNam: 2,
      capBacHienTai: 'Junior',
      aboutMe: '<p>Fullstack&nbsp;Developer</p>',
      kyNangs: [{ kyNang: { tenKyNang: 'React' }, soNamKinhNghiem: 2 }],
      kinhNghiems: [
        {
          viTri: 'Dev',
          tenCongTy: 'ABC',
          ngayBatDau: new Date('2023-01-01'),
          ngayKetThuc: null,
          moTaChiTiet: '<p>Build <b>UI</b></p>',
        },
      ],
      hocVans: [{ tenTruong: 'HUST', nganhHoc: 'CNTT', gpa: '3.5' }],
      chungChis: [],
    });

    prisma.congViec.findFirst.mockResolvedValue({
      maCongViec: 'job-1',
      tenCongViec: 'React Engineer',
      capBac: 'Junior',
      yeuCauKinhNghiem: 1,
      moTa: '<div>Mô tả<script>x</script></div>',
      yeuCauCongViec: '<p>Yêu cầu&nbsp;TS</p>',
      congViecKyNangs: [{ kyNang: { tenKyNang: 'TypeScript' } }],
    });

    geminiService.generateStructuredJson.mockResolvedValue({
      matchScore: 120,
      strengths: ['Khớp React'],
      weaknesses: ['Cần thêm GraphQL'],
      summary: 'Phù hợp tốt',
      breakdown: {
        skillsScore: Number.NaN,
        experienceScore: -5,
        educationScore: 84.6,
        domainScore: 70,
      },
    });

    const firstResult = await service.previewJobMatchForCandidate(
      'user-1',
      'job-1',
    );
    expect(firstResult.matchScore).toBe(100);
    expect(firstResult.breakdown).toEqual({
      skillsScore: 0,
      experienceScore: 0,
      educationScore: 85,
      domainScore: 70,
    });
    expect(firstResult.cached).toBe(false);

    const cachedResult = await service.previewJobMatchForCandidate(
      'user-1',
      'job-1',
    );
    expect(cachedResult.cached).toBe(true);
    expect(geminiService.generateStructuredJson).toHaveBeenCalledTimes(1);
  });

  it('chặn HR xem phân tích AI của đơn không thuộc công ty mình', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({ maCongTy: 'ct-1' });
    prisma.donXinViec.findUnique.mockResolvedValue({
      maDon: 'don-1',
      congViec: {
        congViecKyNangs: [],
        nhaTuyenDung: { maCongTy: 'ct-2' },
      },
      ungVien: {
        kyNangs: [],
        kinhNghiems: [],
        hocVans: [],
        chungChis: [],
      },
    });

    await expect(
      service.analyzeApplicationForEmployer('hr-1', 'don-1'),
    ).rejects.toThrow(ForbiddenException);
  });
});
