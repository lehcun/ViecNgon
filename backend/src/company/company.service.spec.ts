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
        chuyenMon: 'React, TypeScript',
        nhaTuyenDungs: [
          {
            muaQuangCaos: [{ goiQuangCao: { capDoUuTien: 4 } }],
            congViecs: [
              {
                congViecKyNangs: [
                  { kyNang: { tenKyNang: 'NestJS' } },
                  { kyNang: { tenKyNang: 'Next.js' } },
                ],
              },
            ],
            _count: { congViecs: 2 },
          },
        ],
      },
    ]);

    const result = await service.getCompaniesWithJobCount();
    expect(result).toHaveLength(2);
    expect(result[0].slug).toBe('diamond-corp');
    expect(result[0].jobs).toBe(2);
    expect(result[0].isTopHiring).toBe(true);
    expect(result[0].skills).toEqual(['NestJS', 'Next.js']);
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

  it('trả về getCompanyDetailBySlug đầy đủ citiesDisplay, branches kèm tọa độ, reviews và sectionImages', async () => {
    prisma.congTy.findUnique.mockResolvedValue({
      maCongTy: 'ct-1',
      tenCongTy: 'MoMo',
      logoUrl: null,
      diaChi: 'Quận 7, TP.HCM',
      website: 'https://momo.vn',
      slug: 'momo',
      moTa: '<p>Fintech</p>',
      phucLoi: '<p>Bảo hiểm</p>',
      chuyenMon: 'ReactJS, NestJS',
      aboutMe: 'Ví điện tử',
      quocGia: 'Việt Nam',
      thanhPho: 'TP.HCM',
      moHinhCongTy: 'Sản phẩm',
      linhVuc: 'Fintech',
      quyMo: '1000+ nhân viên',
      thoiGianLamViec: 'Thứ 2 - Thứ 6',
      chinhSachOT: 'Nghỉ bù linh hoạt',
      giaiThuong: 'Top IT 2026; Top Fintech 2025',
      hinhAnhCongTyJson: JSON.stringify({
        introImages: ['https://res.cloudinary.com/demo/image/upload/intro1.jpg'],
        cultureImages: ['https://res.cloudinary.com/demo/image/upload/cul1.jpg'],
      }),
      chiNhanhs: [
        {
          maChiNhanh: 'cn-hn',
          thanhPho: 'Hà Nội',
          diaChi: 'Cầu Giấy, Hà Nội',
          mapUrl: null,
          viDo: 21.0285,
          kinhDo: 105.8542,
        },
        {
          maChiNhanh: 'cn-hcm',
          thanhPho: 'Thành phố Hồ Chí Minh',
          diaChi: 'Quận 7, TP.HCM',
          mapUrl: null,
          viDo: 10.7295,
          kinhDo: 106.7218,
        },
      ],
      baiViets: [
        {
          maBaiViet: 'bv-1',
          tieuDe: 'Kỹ thuật hệ thống thanh toán',
          anhBiaUrl: null,
          noiDung: 'Nội dung bài viết',
          ngayDang: new Date('2026-11-01T00:00:00Z'),
        },
      ],
      _count: { nguoiTheoDois: 12 },
      nhaTuyenDungs: [],
    });

    prisma.danhGia.findMany.mockResolvedValue([
      {
        maDanhGia: 'dg-1',
        rating: 5,
        tieuDe: 'Môi trường tuyệt vời',
        noiDung: null,
        noiDungUuDiem: 'Lương thưởng tốt',
        noiDungCaiThien: null,
        khuyenLamViec: true,
        ngayDanhGia: new Date('2026-11-10T00:00:00Z'),
      },
    ]);

    const detail = await service.getCompanyDetailBySlug('momo');
    expect(detail.citiesDisplay).toBe('Hà Nội - TP.HCM');
    expect(detail.branches).toHaveLength(2);
    expect(detail.branches?.[0].isHeadquarters).toBe(true);
    expect(detail.branches?.[0].lat).toBe(10.7295);
    expect(detail.sectionImages?.introImages).toHaveLength(1);
    expect(detail.awards).toEqual(['Top IT 2026', 'Top Fintech 2025']);
    expect(detail.reviewSummary?.totalReviews).toBe(1);
    expect(detail.reviewSummary?.latestReview?.title).toBe('Môi trường tuyệt vời');
    expect(detail.totalPosts).toBe(1);
    expect(detail.followerCount).toBe(12);
  });

  it('toggleFollow thêm mới và xóa theo dõi công ty cho ứng viên', async () => {
    prisma.congTy.findUnique.mockResolvedValue({ maCongTy: 'ct-1' });
    prisma.ungVien.findUnique.mockResolvedValue({ maUngVien: 'uv-1' });
    prisma.theoDoiCongTy.findUnique.mockResolvedValue(null);
    prisma.theoDoiCongTy.count.mockResolvedValue(5);

    const followed = await service.toggleFollow('ct-1', 'tk-1');
    expect(followed.isFollowing).toBe(true);
    expect(followed.followerCount).toBe(5);
    expect(prisma.theoDoiCongTy.create).toHaveBeenCalled();

    prisma.theoDoiCongTy.findUnique.mockResolvedValue({
      maUngVien: 'uv-1',
      maCongTy: 'ct-1',
    });
    prisma.theoDoiCongTy.count.mockResolvedValue(4);

    const unfollowed = await service.toggleFollow('ct-1', 'tk-1');
    expect(unfollowed.isFollowing).toBe(false);
    expect(unfollowed.followerCount).toBe(4);
    expect(prisma.theoDoiCongTy.delete).toHaveBeenCalled();
  });

  it('getEmployerLandingData trả về stats, packages (parse JSON an toàn) và partners', async () => {
    prisma.taiKhoan.count.mockResolvedValue(48);
    prisma.congTy.count.mockResolvedValue(9);
    prisma.congViec.count.mockResolvedValue(16);
    prisma.goiQuangCao.findMany.mockResolvedValue([
      {
        maGoi: 'pkg-1',
        tieuDe: 'Gói Cơ Bản',
        gia: 1_500_000,
        thoiGianHieuLuc: 30,
        soLuotDangTin: 3,
        capDoUuTien: 1,
        loaiHuyHieu: 'BASIC',
        moTaNgan: 'Phù hợp startup',
        quyenLoiJson: JSON.stringify(['Hiển thị 30 ngày', 'AI Match Score']),
      },
      {
        maGoi: 'pkg-2',
        tieuDe: 'Gói Diamond',
        gia: 15_000_000,
        thoiGianHieuLuc: 60,
        soLuotDangTin: 20,
        capDoUuTien: 4,
        loaiHuyHieu: 'DIAMOND',
        moTaNgan: 'Gói cao cấp',
        quyenLoiJson: '{broken-json',
      },
    ]);
    prisma.congTy.findMany.mockResolvedValue([
      {
        maCongTy: 'ct-fpt',
        tenCongTy: 'FPT Software',
        slug: 'fpt-software',
        logoUrl: 'https://img.example/fpt.png',
        thanhPho: 'Hà Nội',
        nhaTuyenDungs: [{ _count: { congViecs: 4 } }],
      },
    ]);

    const res = await service.getEmployerLandingData();
    expect(res.stats).toEqual({
      candidatesCount: 48,
      companiesCount: 9,
      activeJobsCount: 16,
    });
    expect(res.packages).toHaveLength(2);
    expect(res.packages[0].quyenLois).toEqual([
      'Hiển thị 30 ngày',
      'AI Match Score',
    ]);
    expect(res.packages[1].quyenLois).toEqual([]);
    expect(res.partners).toEqual([
      {
        maCongTy: 'ct-fpt',
        tenCongTy: 'FPT Software',
        slug: 'fpt-software',
        logoUrl: 'https://img.example/fpt.png',
        thanhPho: 'Hà Nội',
        jobsCount: 4,
      },
    ]);
  });
});
