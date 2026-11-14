import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  CompanyDetailResponse,
  FeaturedEmployerBannerItem,
  FormattedTopCompany,
} from '@viecngon/types';
import { formatSalaryDisplay } from 'src/common/utils/format-salary';

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
    return value
      .replace(/<\/(li|p|div|br|h[1-6])>/gi, ' ')
      .replace(/<[^>]*>/g, ' ')
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
    const now = new Date();
    const companies = await this.prisma.congTy.findMany({
      where: {
        nhaTuyenDungs: {
          some: {
            muaQuangCaos: {
              some: {
                trangThai: { in: ['Đang chạy', 'DANG_CHAY'] },
                ngayKetThuc: { gte: now },
                goiQuangCao: {
                  capDoUuTien: { gte: 4 },
                },
              },
            },
          },
        },
      },
      select: {
        maCongTy: true,
        tenCongTy: true,
        slug: true,
        logoUrl: true,
        thanhPho: true,
        chuyenMon: true,
        linhVuc: true,
        nhaTuyenDungs: {
          select: {
            _count: {
              select: {
                congViecs: {
                  where: {
                    trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
                  },
                },
              },
            },
            congViecs: {
              where: {
                trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
              },
              orderBy: [{ doUuTien: 'desc' }, { ngayDang: 'desc' }],
              take: 3,
              select: {
                maCongViec: true,
                tenCongViec: true,
                slug: true,
              },
            },
          },
        },
      },
      take: 4,
    });

    return companies.map((company) => {
      const featuredJobs = company.nhaTuyenDungs
        .flatMap((hr) => hr.congViecs || [])
        .map((job) => ({
          id: job.maCongViec,
          title: job.tenCongViec,
          slug: job.slug,
        }))
        .slice(0, 3);

      return {
        companyId: company.maCongTy,
        companyName: company.tenCongTy,
        slug: company.slug,
        logo: company.logoUrl,
        city: company.thanhPho,
        tagline:
          this.stripHtml(company.linhVuc) ||
          this.stripHtml(company.chuyenMon) ||
          'Doanh nghiệp công nghệ nổi bật đang mở tuyển kỹ sư IT',
        activeJobsCount: company.nhaTuyenDungs.reduce(
          (sum, hr) => sum + (hr._count?.congViecs ?? 0),
          0,
        ),
        featuredJobs,
      };
    });
  }

  async getCompanyDetailBySlug(slug: string): Promise<CompanyDetailResponse> {
    // Bước 1: Truy vấn thông tin công ty và lồng bảng lấy các việc làm đang tuyển
    const company = await this.prisma.congTy.findUnique({
      where: { slug: slug },
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
        chiNhanhs: true, // Lấy danh sách đa chi nhánh
        nhaTuyenDungs: {
          select: {
            congViecs: {
              where: {
                trangThai: 'Đang tuyển', // Chỉ lấy các job còn hạn
              },
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

    // Nếu người dùng gõ sai tên công ty trên URL
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty này');
    }

    // Bước 2: Gom tất cả việc làm từ các HR khác nhau vào chung một mảng phẳng (flat array)
    // flatMap sẽ lấy mảng congViecs của từng HR và trải phẳng chúng ra thành 1 mảng duy nhất
    const allActiveJobs = company.nhaTuyenDungs
      .flatMap((hr) => hr.congViecs)
      .map((job) => {
        return {
          id: job.maCongViec,
          title: job.tenCongViec,
          slug: job.slug,
          salaryMin: job.mucLuongToiThieu ? Number(job.mucLuongToiThieu) : null,
          salaryMax: job.mucLuongToiDa ? Number(job.mucLuongToiDa) : null,
          salaryDisplay: formatSalaryDisplay(
            job.mucLuongToiThieu,
            job.mucLuongToiDa,
          ),
          location: job.thanhPho,
          workModel: job.hinhThucLamViec ?? 'Linh hoạt',
          postedAt: job.ngayDang,
          benefits: job.phucLoi ?? '',
          skills: job.congViecKyNangs.map((cvkn) => cvkn.kyNang.tenKyNang),
        };
      });

    // Bước 3: Trả về dữ liệu đã được Format gọn gàng
    return {
      id: company.maCongTy,
      name: company.tenCongTy,
      logo: company.logoUrl,
      location: company.diaChi,
      website: company.website,
      slug: company.slug,
      description: company.moTa,
      benefits: company.phucLoi,
      skills: company.chuyenMon
        ? company.chuyenMon.split(',').map((s) => s.trim())
        : [],
      aboutMe: company.aboutMe,
      country: company.quocGia,
      city: company.thanhPho,
      companyModel: company.moHinhCongTy,
      industry: company.linhVuc,
      size: company.quyMo,
      workingTime: company.thoiGianLamViec,
      otPolicy: company.chinhSachOT,
      totalJobs: allActiveJobs.length,
      activeJobs: allActiveJobs,
    };
  }
}
