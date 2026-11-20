import { Injectable, NotFoundException } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  CompanyActiveJobItem,
  CompanyBranchDetailItem,
  CompanyDetailResponse,
  CompanyFollowResponse,
  CompanyPostItem,
  CompanyReviewItem,
  CompanySectionImages,
  FeaturedEmployerBannerItem,
  FormattedTopCompany,
  JobPromotionBadge,
} from '@viecngon/types';
import { formatSalaryDisplay } from 'src/common/utils/format-salary';
import { stripHtmlTags } from 'src/common/utils/html.util';

interface CompanyDetailBranchRow {
  maChiNhanh: string;
  thanhPho: string;
  diaChi: string;
  mapUrl: string | null;
  viDo: number | null;
  kinhDo: number | null;
}

interface CompanyDetailPostRow {
  maBaiViet: string;
  tieuDe: string;
  anhBiaUrl: string | null;
  noiDung: string;
  ngayDang: Date;
}

interface CompanyDetailJobRow {
  maCongViec: string;
  tenCongViec: string;
  slug: string;
  mucLuongToiThieu: Prisma.Decimal | null;
  mucLuongToiDa: Prisma.Decimal | null;
  hinhThucLamViec: string | null;
  phucLoi: string | null;
  thanhPho: string | null;
  ngayDang: Date;
  capBac: string | null;
  doUuTien: number;
  nhanQuangCao: string | null;
  congViecKyNangs: Array<{ kyNang: { tenKyNang: string } }>;
}

interface CompanyDetailRecord {
  maCongTy: string;
  tenCongTy: string;
  logoUrl: string | null;
  diaChi: string | null;
  website: string | null;
  slug: string;
  moTa: string | null;
  phucLoi: string | null;
  chuyenMon: string | null;
  aboutMe: string | null;
  quocGia: string | null;
  thanhPho: string | null;
  moHinhCongTy: string | null;
  linhVuc: string | null;
  quyMo: string | null;
  thoiGianLamViec: string | null;
  chinhSachOT: string | null;
  giaiThuong: string | null;
  hinhAnhCongTyJson: string | null;
  chiNhanhs: CompanyDetailBranchRow[];
  baiViets: CompanyDetailPostRow[];
  _count?: { nguoiTheoDois: number };
  nhaTuyenDungs: Array<{ congViecs: CompanyDetailJobRow[] }>;
}

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  // async createCompany(data: CreateCompanyDto) {
  //   const baseSlug = generateSlug(data.tenCongTy);

  //   // Logic xử lý nếu trùng slug (thêm chuỗi ngẫu nhiên hoặc timestamp)
  //   const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

  //   return this.prisma.congTy.create({
  //     data: {
  //       ...data,
  //       slug: uniqueSlug,
  //     },
  //   });
  // }

  findAll() {
    return this.prisma.congTy.findMany({});
  }

  async getCompaniesWithJobCount() {
    const now = new Date();
    // Bước 1: Query database bằng Prisma kèm trạng thái gói Kim Cương đang chạy
    const companies = await this.prisma.congTy.findMany({
      select: {
        maCongTy: true,
        tenCongTy: true,
        logoUrl: true,
        thanhPho: true,
        slug: true,
        nhaTuyenDungs: {
          select: {
            muaQuangCaos: {
              where: {
                trangThai: { in: ['Đang chạy', 'DANG_CHAY'] },
                ngayKetThuc: { gte: now },
              },
              select: {
                goiQuangCao: {
                  select: { capDoUuTien: true },
                },
              },
            },
            _count: {
              select: {
                congViecs: {
                  where: {
                    trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
                    deletedAt: null,
                    OR: [{ ngayHetHan: null }, { ngayHetHan: { gte: now } }],
                  },
                },
              },
            },
          },
        },
      },
    });

    // Bước 2: Ưu tiên các công ty có Gói Kim Cương (level >= 4) lên đầu danh sách "Nhà tuyển dụng hàng đầu"
    const rankedCompanies = companies
      .map((company) => {
        const totalJobs = company.nhaTuyenDungs.reduce(
          (sum, hr) => sum + (hr._count?.congViecs ?? 0),
          0,
        );
        const maxTier = company.nhaTuyenDungs.reduce((max, hr) => {
          const hrMax = hr.muaQuangCaos.reduce(
            (m, c) => Math.max(m, c.goiQuangCao?.capDoUuTien ?? 0),
            0,
          );
          return Math.max(max, hrMax);
        }, 0);

        return {
          maxTier,
          formatted: {
            id: company.maCongTy,
            name: company.tenCongTy,
            logo: company.logoUrl,
            location: company.thanhPho,
            slug: company.slug,
            jobs: totalJobs,
          } satisfies FormattedTopCompany,
        };
      })
      .sort((a, b) => {
        if (b.maxTier !== a.maxTier) return b.maxTier - a.maxTier;
        return b.formatted.jobs - a.formatted.jobs;
      })
      .slice(0, 8)
      .map((item) => item.formatted);

    return rankedCompanies;
  }

  private stripHtml(value?: string | null): string {
    if (!value) return '';
    const withoutBreaks = value.replace(/<\/(li|p|div|br|h[1-6])>/gi, ' ');
    return stripHtmlTags(withoutBreaks, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Lấy danh sách doanh nghiệp đang sở hữu Gói Kim Cương (cấp >= 4)
   * để hiển thị tại Banner "Nhà Tuyển Dụng Nổi Bật" đầu trang /jobs
   */
  async getFeaturedBannerEmployers(): Promise<FeaturedEmployerBannerItem[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const companies = await this.prisma.congTy.findMany({
      where: {
        nhaTuyenDungs: {
          some: {
            muaQuangCaos: {
              some: {
                trangThai: { in: ['Đang chạy', 'DANG_CHAY'] },
                ngayKetThuc: { gte: startOfToday },
                goiQuangCao: {
                  capDoUuTien: { gte: 4 },
                },
              },
            },
          },
        },
      },
      orderBy: { maCongTy: 'asc' },
      select: {
        maCongTy: true,
        tenCongTy: true,
        slug: true,
        logoUrl: true,
        thanhPho: true,
        chuyenMon: true,
        linhVuc: true,
        bannerCoverUrl: true,
        bannerCity: true,
        bannerTagline: true,
        bannerBadgeText: true,
        bannerJobIdsJson: true,
        nhaTuyenDungs: {
          select: {
            _count: {
              select: {
                congViecs: {
                  where: {
                    trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
                    deletedAt: null,
                    OR: [
                      { ngayHetHan: null },
                      { ngayHetHan: { gte: startOfToday } },
                    ],
                  },
                },
              },
            },
            congViecs: {
              where: {
                trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
                deletedAt: null,
                OR: [
                  { ngayHetHan: null },
                  { ngayHetHan: { gte: startOfToday } },
                ],
              },
              orderBy: [{ doUuTien: 'desc' }, { ngayDang: 'desc' }],
              take: 20,
              select: {
                maCongViec: true,
                tenCongViec: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return companies.map((company) => {
      const uniqueJobsMap = new Map<
        string,
        { id: string; title: string; slug: string }
      >();

      for (const hr of company.nhaTuyenDungs) {
        for (const job of hr.congViecs || []) {
          if (!uniqueJobsMap.has(job.maCongViec)) {
            uniqueJobsMap.set(job.maCongViec, {
              id: job.maCongViec,
              title: job.tenCongViec,
              slug: job.slug,
            });
          }
        }
      }

      const allActiveJobs = Array.from(uniqueJobsMap.values());
      let featuredJobs = allActiveJobs.slice(0, 3);

      // Nếu nhà tuyển dụng gói Kim Cương đã cấu hình danh sách job (0..5 job)
      if (
        company.bannerJobIdsJson !== null &&
        company.bannerJobIdsJson !== undefined
      ) {
        try {
          const parsedIds: unknown = JSON.parse(company.bannerJobIdsJson);
          if (Array.isArray(parsedIds)) {
            featuredJobs = parsedIds
              .filter((id): id is string => typeof id === 'string')
              .map((id) => uniqueJobsMap.get(id))
              .filter(
                (item): item is { id: string; title: string; slug: string } =>
                  Boolean(item),
              )
              .slice(0, 5);
          }
        } catch {
          featuredJobs = allActiveJobs.slice(0, 3);
        }
      }

      return {
        companyId: company.maCongTy,
        companyName: company.tenCongTy,
        slug: company.slug,
        logo: company.logoUrl,
        city: company.bannerCity?.trim() || company.thanhPho,
        tagline:
          this.stripHtml(company.bannerTagline) ||
          this.stripHtml(company.linhVuc) ||
          this.stripHtml(company.chuyenMon) ||
          'Doanh nghiệp công nghệ nổi bật đang mở tuyển kỹ sư IT',
        bannerCoverUrl: company.bannerCoverUrl || null,
        bannerBadgeText: company.bannerBadgeText?.trim() || 'TOP HIRING',
        activeJobsCount: company.nhaTuyenDungs.reduce(
          (sum, hr) => sum + (hr._count?.congViecs ?? 0),
          0,
        ),
        featuredJobs,
      };
    });
  }

  private canonicalCityKey(city: string): string {
    const lower = city
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replaceAll('đ', 'd')
      .replace(/[.,]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (
      lower === 'hcm' ||
      lower === 'tp hcm' ||
      lower === 'ho chi minh' ||
      lower === 'tp ho chi minh' ||
      lower === 'thanh pho ho chi minh'
    ) {
      return 'hcm';
    }
    if (
      lower === 'ha noi' ||
      lower === 'tp ha noi' ||
      lower === 'thanh pho ha noi'
    ) {
      return 'hanoi';
    }
    if (
      lower === 'da nang' ||
      lower === 'tp da nang' ||
      lower === 'thanh pho da nang'
    ) {
      return 'danang';
    }
    return lower;
  }

  private formatCityLabel(city: string): string {
    const key = this.canonicalCityKey(city);
    if (key === 'hcm') return 'TP.HCM';
    if (key === 'hanoi') return 'Hà Nội';
    if (key === 'danang') return 'Đà Nẵng';
    return city.trim();
  }

  private buildCitiesDisplay(
    branches: Array<{ thanhPho: string }>,
    fallbackCity?: string | null,
  ): string {
    const seen = new Set<string>();
    const labels: string[] = [];

    const candidates = [
      ...branches.map((b) => b.thanhPho),
      ...(fallbackCity ? [fallbackCity] : []),
    ];

    for (const raw of candidates) {
      const trimmed = raw?.trim();
      if (!trimmed) continue;
      const key = this.canonicalCityKey(trimmed);
      if (!key || seen.has(key)) continue;
      seen.add(key);
      labels.push(this.formatCityLabel(trimmed));
    }

    return labels.length > 0 ? labels.join(' - ') : 'Việt Nam';
  }

  private parseSectionImages(raw?: string | null): CompanySectionImages {
    if (!raw) return { introImages: [], cultureImages: [] };
    try {
      const parsed = JSON.parse(raw) as Partial<CompanySectionImages>;
      const filterUrls = (arr: unknown): string[] =>
        Array.isArray(arr)
          ? arr
              .filter((item): item is string => typeof item === 'string')
              .map((item) => item.trim())
              .filter(
                (item) =>
                  item.startsWith('http://') || item.startsWith('https://'),
              )
              .slice(0, 8)
          : [];
      return {
        introImages: filterUrls(parsed.introImages),
        cultureImages: filterUrls(parsed.cultureImages),
      };
    } catch {
      return { introImages: [], cultureImages: [] };
    }
  }

  private parseAwards(raw?: string | null): string[] {
    if (!raw?.trim()) {
      return [
        'Công ty IT tốt nhất Việt Nam 2026',
        'Công ty IT tốt nhất Việt Nam 2025',
        'Công ty IT tốt nhất Việt Nam 2023',
      ];
    }
    const items = raw
      .split(/[;\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);
    return items.length > 0
      ? items
      : [
          'Công ty IT tốt nhất Việt Nam 2026',
          'Công ty IT tốt nhất Việt Nam 2025',
          'Công ty IT tốt nhất Việt Nam 2023',
        ];
  }

  private extractBenefitHighlights(html?: string | null): string[] {
    if (!html) return [];
    const liMatches = html.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
    if (liMatches && liMatches.length > 0) {
      return liMatches
        .map((li) => this.stripHtml(li))
        .filter(Boolean)
        .slice(0, 3);
    }
    const plain = this.stripHtml(html);
    if (!plain) return [];
    return plain
      .split(/[;\n•]+/)
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  private resolvePromotionBadge(
    badge?: string | null,
    priorityLevel = 0,
  ): JobPromotionBadge | null {
    if (
      badge === 'DIAMOND' ||
      badge === 'SUPER_HOT' ||
      badge === 'HOT' ||
      badge === 'BASIC' ||
      badge === 'HEADHUNT'
    ) {
      return badge;
    }
    if (priorityLevel >= 4) return 'DIAMOND';
    if (priorityLevel === 3) return 'SUPER_HOT';
    if (priorityLevel === 2) return 'HOT';
    if (priorityLevel === 1) return 'BASIC';
    return null;
  }

  private async fetchCompanyDetailRecord(
    slug: string,
    now: Date,
  ): Promise<CompanyDetailRecord | null> {
    return this.prisma.congTy.findUnique({
      where: { slug },
      select: {
        maCongTy: true,
        tenCongTy: true,
        logoUrl: true,
        diaChi: true,
        website: true,
        slug: true,
        moTa: true,
        phucLoi: true,
        chuyenMon: true,
        aboutMe: true,
        quocGia: true,
        thanhPho: true,
        moHinhCongTy: true,
        linhVuc: true,
        quyMo: true,
        thoiGianLamViec: true,
        chinhSachOT: true,
        giaiThuong: true,
        hinhAnhCongTyJson: true,
        chiNhanhs: {
          orderBy: { thanhPho: 'asc' },
          select: {
            maChiNhanh: true,
            thanhPho: true,
            diaChi: true,
            mapUrl: true,
            viDo: true,
            kinhDo: true,
          },
        },
        baiViets: {
          orderBy: { ngayDang: 'desc' },
          take: 20,
          select: {
            maBaiViet: true,
            tieuDe: true,
            anhBiaUrl: true,
            noiDung: true,
            ngayDang: true,
          },
        },
        _count: {
          select: { nguoiTheoDois: true },
        },
        nhaTuyenDungs: {
          select: {
            congViecs: {
              where: {
                trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
                deletedAt: null,
                OR: [{ ngayHetHan: null }, { ngayHetHan: { gte: now } }],
              },
              orderBy: [{ doUuTien: 'desc' }, { ngayDang: 'desc' }],
              select: {
                maCongViec: true,
                tenCongViec: true,
                slug: true,
                mucLuongToiThieu: true,
                mucLuongToiDa: true,
                hinhThucLamViec: true,
                phucLoi: true,
                thanhPho: true,
                ngayDang: true,
                capBac: true,
                doUuTien: true,
                nhanQuangCao: true,

                // Lấy mảng kỹ năng thông qua bảng trung gian
                congViecKyNangs: {
                  include: {
                    kyNang: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getCompanyDetailBySlug(slug: string): Promise<CompanyDetailResponse> {
    const now = new Date();
    // Bước 1: Truy vấn thông tin công ty kèm chi nhánh, bài viết, lượt theo dõi và việc làm đang tuyển
    const company: CompanyDetailRecord | null =
      await this.fetchCompanyDetailRecord(slug, now);

    // Nếu người dùng gõ sai tên công ty trên URL
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty này');
    }

    // Bước 2: Truy vấn đánh giá của công ty (bảng DANHGIA)
    const rawReviews =
      (await this.prisma.danhGia.findMany({
        where: {
          maDoiTuongDuocDanhGia: company.maCongTy,
          loaiDoiTuong: 'CONGTY',
          deletedAt: null,
        },
        orderBy: { ngayDanhGia: 'desc' },
        take: 30,
      })) ?? [];

    const reviews: CompanyReviewItem[] = rawReviews.map((review) => ({
      id: review.maDanhGia,
      title: review.tieuDe?.trim() || 'Đánh giá môi trường làm việc',
      content: review.noiDung ?? null,
      pros: review.noiDungUuDiem ?? null,
      cons: review.noiDungCaiThien ?? null,
      rating: review.rating !== null ? Number(review.rating) : 5,
      recommend: review.khuyenLamViec ?? true,
      createdAt: review.ngayDanhGia,
    }));

    const averageRating =
      reviews.length > 0
        ? Math.round(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) *
              10,
          ) / 10
        : 4.8;

    const recommendPercent =
      reviews.length > 0
        ? Math.round(
            (reviews.filter((r) => r.recommend).length / reviews.length) * 100,
          )
        : 97;

    // Bước 3: Gom tất cả việc làm từ các HR khác nhau vào chung một mảng phẳng (flat array)
    const allActiveJobs: CompanyActiveJobItem[] = (company.nhaTuyenDungs ?? [])
      .flatMap((hr): CompanyDetailJobRow[] => hr.congViecs ?? [])
      .sort((a: CompanyDetailJobRow, b: CompanyDetailJobRow): number => {
        const pDiff = (b.doUuTien ?? 0) - (a.doUuTien ?? 0);
        if (pDiff !== 0) return pDiff;
        return new Date(b.ngayDang).getTime() - new Date(a.ngayDang).getTime();
      })
      .map((job: CompanyDetailJobRow): CompanyActiveJobItem => {
        const priorityLevel = job.doUuTien ?? 0;
        const salaryDisplay = formatSalaryDisplay(
          job.mucLuongToiThieu,
          job.mucLuongToiDa,
        );
        const skills: string[] = (job.congViecKyNangs ?? []).map(
          (cvkn): string => cvkn.kyNang.tenKyNang,
        );

        return {
          id: job.maCongViec,
          title: job.tenCongViec,
          slug: job.slug,
          salaryDisplay,
          location: job.thanhPho,
          workModel: job.hinhThucLamViec ?? 'Linh hoạt',
          level: job.capBac ?? null,
          priorityLevel,
          promotionBadge: this.resolvePromotionBadge(
            job.nhanQuangCao,
            priorityLevel,
          ),
          highlights: this.extractBenefitHighlights(job.phucLoi),
          postedAt: job.ngayDang,
          benefits: job.phucLoi ?? '',
          skills,
        };
      });

    // Bước 4: Chuẩn hóa danh sách chi nhánh + fallback trụ sở chính
    const mainAddress = company.diaChi?.trim().toLowerCase() ?? '';
    const rawBranches: CompanyDetailBranchRow[] = company.chiNhanhs ?? [];
    const branches: CompanyBranchDetailItem[] =
      rawBranches.length > 0
        ? rawBranches
            .map(
              (branch: CompanyDetailBranchRow): CompanyBranchDetailItem => ({
                id: branch.maChiNhanh,
                city: this.formatCityLabel(branch.thanhPho),
                address: branch.diaChi,
                mapUrl: branch.mapUrl ?? null,
                lat: branch.viDo ?? null,
                lng: branch.kinhDo ?? null,
                isHeadquarters:
                  mainAddress !== '' &&
                  branch.diaChi.trim().toLowerCase() === mainAddress,
              }),
            )
            .sort(
              (
                a: CompanyBranchDetailItem,
                b: CompanyBranchDetailItem,
              ): number => Number(b.isHeadquarters) - Number(a.isHeadquarters),
            )
        : company.diaChi || company.thanhPho
          ? [
              {
                id: 'hq-default',
                city: this.formatCityLabel(company.thanhPho || 'Việt Nam'),
                address: company.diaChi || company.thanhPho || 'Việt Nam',
                mapUrl: null,
                lat: null,
                lng: null,
                isHeadquarters: true,
              },
            ]
          : [];

    const rawPosts: CompanyDetailPostRow[] = company.baiViets ?? [];
    const posts: CompanyPostItem[] = rawPosts.map(
      (post: CompanyDetailPostRow): CompanyPostItem => ({
        id: post.maBaiViet,
        title: post.tieuDe,
        coverUrl: post.anhBiaUrl ?? null,
        content: post.noiDung,
        publishedAt: post.ngayDang,
      }),
    );

    const followerCount: number =
      typeof company._count?.nguoiTheoDois === 'number'
        ? company._count.nguoiTheoDois
        : 0;

    // Bước 5: Trả về dữ liệu đã được Format gọn gàng
    return {
      id: company.maCongTy,
      name: company.tenCongTy,
      logo: company.logoUrl,
      location: company.diaChi,
      citiesDisplay: this.buildCitiesDisplay(rawBranches, company.thanhPho),
      website: company.website,
      slug: company.slug,
      description: company.moTa,
      benefits: company.phucLoi,
      skills: company.chuyenMon
        ? company.chuyenMon.split(',').map((s) => s.trim())
        : [],
      expertise: company.chuyenMon,
      aboutMe: company.aboutMe,
      country: company.quocGia,
      city: company.thanhPho,
      companyModel: company.moHinhCongTy,
      industry: company.linhVuc,
      size: company.quyMo,
      workingTime: company.thoiGianLamViec,
      otPolicy: company.chinhSachOT,
      awards: this.parseAwards(company.giaiThuong),
      sectionImages: this.parseSectionImages(company.hinhAnhCongTyJson),
      branches,
      totalJobs: allActiveJobs.length,
      activeJobs: allActiveJobs,
      reviewSummary: {
        averageRating,
        recommendPercent,
        totalReviews: reviews.length,
        latestReview: reviews[0] ?? null,
      },
      reviews,
      totalPosts: posts.length,
      posts,
      followerCount,
    };
  }

  async getFollowStatus(
    companyId: string,
    userId: string,
  ): Promise<CompanyFollowResponse> {
    const candidate = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan: userId },
      select: { maUngVien: true },
    });
    if (!candidate) {
      throw new NotFoundException('Không tìm thấy hồ sơ ứng viên');
    }

    const [existing, followerCount] = await Promise.all([
      this.prisma.theoDoiCongTy.findUnique({
        where: {
          maUngVien_maCongTy: {
            maUngVien: candidate.maUngVien,
            maCongTy: companyId,
          },
        },
      }),
      this.prisma.theoDoiCongTy.count({
        where: { maCongTy: companyId },
      }),
    ]);

    return {
      isFollowing: Boolean(existing),
      followerCount,
    };
  }

  async toggleFollow(
    companyId: string,
    userId: string,
  ): Promise<CompanyFollowResponse> {
    const [company, candidate] = await Promise.all([
      this.prisma.congTy.findUnique({
        where: { maCongTy: companyId },
        select: { maCongTy: true },
      }),
      this.prisma.ungVien.findUnique({
        where: { maTaiKhoan: userId },
        select: { maUngVien: true },
      }),
    ]);

    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty');
    }
    if (!candidate) {
      throw new NotFoundException('Không tìm thấy hồ sơ ứng viên');
    }

    const key = {
      maUngVien: candidate.maUngVien,
      maCongTy: companyId,
    };

    const existing = await this.prisma.theoDoiCongTy.findUnique({
      where: { maUngVien_maCongTy: key },
    });

    if (existing) {
      await this.prisma.theoDoiCongTy.delete({
        where: { maUngVien_maCongTy: key },
      });
    } else {
      await this.prisma.theoDoiCongTy.create({ data: key });
    }

    const followerCount = await this.prisma.theoDoiCongTy.count({
      where: { maCongTy: companyId },
    });

    const isFollowing = !existing;
    return {
      isFollowing,
      followerCount,
      message: isFollowing
        ? 'Đã theo dõi công ty. Bạn sẽ nhận được thông báo khi có việc làm mới!'
        : 'Đã bỏ theo dõi công ty.',
    };
  }
}
