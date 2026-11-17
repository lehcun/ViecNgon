import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { PrismaService } from '../prisma/prisma.service';
import { RecruiterService } from './recruiter.service';

describe('RecruiterService', () => {
  let service: RecruiterService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let cloudinaryService: { uploadImage: jest.Mock };

  beforeEach(async () => {
    prisma = createPrismaMock();
    cloudinaryService = {
      uploadImage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecruiterService,
        { provide: PrismaService, useValue: prisma },
        { provide: CloudinaryService, useValue: cloudinaryService },
      ],
    }).compile();

    service = module.get<RecruiterService>(RecruiterService);
  });

  it('tính toán đúng các chỉ số getJobMetrics', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({ maCongTy: 'ct-1' });
    prisma.congViec.count
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(1);
    prisma.donXinViec.count
      .mockResolvedValueOnce(25)
      .mockResolvedValueOnce(6)
      .mockResolvedValueOnce(4);

    const metrics = await service.getJobMetrics('user-hr');
    expect(metrics.totalJobs.count).toBe(10);
    expect(metrics.activeJobs.count).toBe(6);
    expect(metrics.pendingJobs.count).toBe(1);
    expect(metrics.totalApplications.percentChangeThisWeek).toBe(50);
  });

  it('trả về getSpotlightBannerConfig và làm sạch HTML ở defaultTagline', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({
      maNTD: 'hr-1',
      maCongTy: 'ct-1',
      congTy: {
        maCongTy: 'ct-1',
        tenCongTy: 'Tech VN',
        slug: 'tech-vn',
        logoUrl: null,
        thanhPho: 'Hà Nội',
        linhVuc: '<div>AI &amp; Cloud&nbsp;<br/>Platform</div>',
        chuyenMon: 'NodeJS',
        bannerCoverUrl: null,
        bannerCity: null,
        bannerTagline: null,
        bannerBadgeText: null,
        bannerJobIdsJson: 'invalid-json',
      },
    });
    prisma.muaQuangCao.findFirst.mockResolvedValue({ maMua: 'mua-1' });
    prisma.congViec.findMany.mockResolvedValue([
      {
        maCongViec: 'job-1',
        tenCongViec: 'Backend NestJS',
        slug: 'backend-nestjs',
        thanhPho: 'Hà Nội',
      },
    ]);

    const config = await service.getSpotlightBannerConfig('user-hr');
    expect(config.hasDiamondAccess).toBe(true);
    expect(config.defaultTagline).toBe('AI & Cloud Platform');
    expect(config.selectedJobIds).toEqual(['job-1']);
  });

  it('chặn updateSpotlightBanner nếu công ty không có gói Kim Cương', async () => {
    prisma.nhaTuyenDung.findUnique.mockResolvedValue({
      maNTD: 'hr-1',
      maCongTy: 'ct-1',
      congTy: { maCongTy: 'ct-1' },
    });
    prisma.muaQuangCao.findFirst.mockResolvedValue(null);

    await expect(
      service.updateSpotlightBanner('user-hr', {
        bannerTagline: 'New',
      }),
    ).rejects.toThrow(ForbiddenException);
  });
});
