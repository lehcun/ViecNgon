import { BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Test, TestingModule } from '@nestjs/testing';
import { AiMatchService } from 'src/ai/ai-match.service';
import { GoogleCalendarService } from 'src/calender/google-calendar.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { ApplicationsService } from './applications.service';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        { provide: PrismaService, useValue: prisma },
        { provide: MailerService, useValue: { sendMail: jest.fn() } },
        { provide: GoogleCalendarService, useValue: { createEvent: jest.fn() } },
        {
          provide: AiMatchService,
          useValue: { triggerBackgroundAnalysis: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('chặn nộp đơn bằng CV hệ thống khi hồ sơ dưới 70% nhưng cho phép dùng link CV ngoài', async () => {
    const lowCompletionCandidate = {
      maUngVien: 'uv-1',
      tenUngVien: 'Nguyễn A',
      chuyenMon: null,
      ngaySinh: null,
      diaChi: null,
      gioiThieuBanThan: null,
      maFileCvMacDinh: 'cv-1',
      cvUrl: 'https://cdn/system-cv.pdf',
      taiKhoan: { tenNguoiDung: 'Nguyễn A', sdt: '0901234567' },
      kinhNghiems: [],
      hocVans: [],
      kyNangs: [],
      danhSachFileCv: [
        { maFileCv: 'cv-1', fileUrl: 'https://cdn/system-cv.pdf' },
      ],
    };

    prisma.ungVien.findUnique.mockResolvedValue(lowCompletionCandidate);
    prisma.congViec.findUnique.mockResolvedValue({
      maCongViec: 'job-1',
      ngayHetHan: null,
    });
    prisma.donXinViec.findFirst.mockResolvedValue(null);

    await expect(
      service.createApplication(
        {
          maCongViec: 'job-1',
          maCvFile: 'cv-1',
          fileCvUrl: 'https://cdn/system-cv.pdf',
        },
        'tk-1',
      ),
    ).rejects.toThrow(BadRequestException);

    await expect(
      service.createApplication(
        {
          maCongViec: 'job-1',
          fileCvUrl: 'https://cdn/system-cv.pdf',
        },
        'tk-1',
      ),
    ).rejects.toThrow(BadRequestException);

    prisma.donXinViec.create.mockResolvedValue({
      maDon: 'don-ext',
      fileCvUrl: 'https://drive.google.com/file/d/external',
    });

    const externalRes = await service.createApplication(
      {
        maCongViec: 'job-1',
        fileCvUrl: 'https://drive.google.com/file/d/external',
      },
      'tk-1',
    );
    expect(externalRes.data.maDon).toBe('don-ext');
  });

  it('cho phép nộp đơn bằng CV hệ thống khi hồ sơ đạt >= 70%', async () => {
    prisma.ungVien.findUnique.mockResolvedValue({
      maUngVien: 'uv-1',
      tenUngVien: 'Nguyễn A',
      chuyenMon: 'Backend Developer',
      ngaySinh: new Date('1998-01-01'),
      diaChi: 'Đà Nẵng',
      gioiThieuBanThan: '<p>Backend NodeJS và NestJS nhiều kinh nghiệm.</p>',
      maFileCvMacDinh: 'cv-1',
      cvUrl: 'https://cdn/system-cv.pdf',
      taiKhoan: { tenNguoiDung: 'Nguyễn A', sdt: '0901234567' },
      kinhNghiems: [{ maKinhNghiem: 'kn-1' }, { maKinhNghiem: 'kn-2' }],
      hocVans: [{ maHocVan: 'hv-1' }],
      portfolios: [{ maPortfolio: 'p-1' }],
      kyNangs: [{ maKyNang: 's-1' }, { maKyNang: 's-2' }],
      chungChis: [],
      danhSachFileCv: [
        { maFileCv: 'cv-1', fileUrl: 'https://cdn/system-cv.pdf' },
      ],
    });
    prisma.congViec.findUnique.mockResolvedValue({
      maCongViec: 'job-1',
      ngayHetHan: null,
    });
    prisma.donXinViec.findFirst.mockResolvedValue(null);
    prisma.donXinViec.create.mockResolvedValue({
      maDon: 'don-sys',
      fileCvUrl: 'https://cdn/system-cv.pdf',
    });

    const res = await service.createApplication(
      {
        maCongViec: 'job-1',
        maCvFile: 'cv-1',
        fileCvUrl: 'https://cdn/system-cv.pdf',
      },
      'tk-1',
    );
    expect(res.data.maDon).toBe('don-sys');
  });
});
