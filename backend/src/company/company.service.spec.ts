import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { CompanyService } from './company.service';

describe('CompanyService', () => {
  let service: CompanyService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  it('xếp hạng getCompaniesWithJobCount ưu tiên gói Kim Cương và tổng số việc làm', async () => {
    prisma.congTy.findMany.mockResolvedValue([
      {
        maCongTy: 'ct-1',
        tenCongTy: 'Basic Corp',
        logoUrl: null,
        thanhPho: 'Hà Nội',
        slug: 'basic-corp',
        nhaTuyenDungs: [
          {
            muaQuangCaos: [{ goiQuangCao: { capDoUuTien: 1 } }],
            _count: { congViecs: 10 },
          },
        ],
      },
      {
        maCongTy: 'ct-2',
        tenCongTy: 'Diamond Corp',
        logoUrl: null,
        thanhPho: 'Hồ Chí Minh',
        slug: 'diamond-corp',
        nhaTuyenDungs: [
          {
            muaQuangCaos: [{ goiQuangCao: { capDoUuTien: 4 } }],
            _count: { congViecs: 2 },
          },
        ],
      },
    ]);

    const result = await service.getCompaniesWithJobCount();
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('diamond-corp');
    expect(result[0].jobs).toBe(2);
  });

  it('trả về getFeaturedBannerEmployers với tagline đã stripHtml tuyến tính', async () => {
    prisma.congTy.findMany.mockResolvedValue([
      {
        maCongTy: 'ct-diamond',
        tenCongTy: 'ViecNgon Tech',
        slug: 'viecngon-tech',
        logoUrl: 'https://img.example/logo.png',
        thanhPho: 'Hà Nội',
        chuyenMon: 'React, NestJS',
        linhVuc: 'Fintech',
        bannerCoverUrl: null,
        bannerCity: '  Đà Nẵng  ',
        bannerTagline: '<p>Top&nbsp;<b>IT</b> &amp; AI &lt;2026&gt;</p>',
        bannerBadgeText: null,
        bannerJobIdsJson: JSON.stringify(['job-2']),
        nhaTuyenDungs: [
          {
            _count: { congViecs: 2 },
            congViecs: [
              { maCongViec: 'job-1', tenCongViec: 'Job 1', slug: 'job-1' },
              { maCongViec: 'job-2', tenCongViec: 'Job 2', slug: 'job-2' },
            ],
          },
        ],
      },
    ]);

    const items = await service.getFeaturedBannerEmployers();
    expect(items).toHaveLength(1);
    expect(items[0].city).toBe('Đà Nẵng');
    expect(items[0].tagline).toBe('Top IT & AI <2026>');
    expect(items[0].featuredJobs.map((j) => j.id)).toEqual(['job-2']);
  });
});
