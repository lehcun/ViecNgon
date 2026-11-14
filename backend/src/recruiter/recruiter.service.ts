import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { UpdateSpotlightBannerDto } from './dto/update-spotlight-banner.dto';
import {
  RecruiterJobMetricsResponse,
  SpotlightBannerConfigResponse,
} from '@viecngon/types';
import {
  CloudinaryService,
  type UploadedBinaryFile,
} from 'src/cloudinary/cloudinary.service';

@Injectable()
export class RecruiterService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // 1. Lấy hồ sơ nhà tuyển dụng (Gộp cả thông tin công ty)
  async getProfile(userId: string) {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
      include: {
        taiKhoan: {
          select: {
            email: true,
            tenNguoiDung: true,
            sdt: true,
          },
        },
        congTy: true, // Lấy toàn bộ thông tin công ty
        // Lấy danh sách công việc
        congViecs: {
          // Lấy thêm số lượng hồ sơ nộp vào từng công việc
          include: {
            _count: {
              select: { donXinViecs: true },
            },
            congViecKyNangs: {
              select: {
                kyNang: {
                  select: {
                    maKyNang: true,
                    tenKyNang: true,
                  },
                },
              },
            },
            donXinViecs: {
              include: {
                ungVien: {
                  select: {
                    maUngVien: true,
                    tenUngVien: true,
                    avatarUrl: true,
                    chuyenMon: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!recruiter) {
      throw new NotFoundException('Không tìm thấy thông tin nhà tuyển dụng.');
    }

    // 1. Dùng reduce để tính tổng số lượt xem của tất cả công việc
    const totalViews = recruiter.congViecs.reduce(
      (sum, job) => sum + (job.luotXem || 0),
      0,
    );

    // 2. Dùng reduce để tính tổng số hồ sơ đã nộp vào tất cả công việc
    const totalApplications = recruiter.congViecs.reduce(
      (sum, job) => sum + job._count.donXinViecs,
      0,
    );

    // 3. MỚI: Lấy danh sách ID ứng viên duy nhất (trường hợp 1 ứng viên nộp nhiều job cho cùng 1 công ty)
    const uniqueCandidateIds = new Set(
      recruiter.congViecs.flatMap((job) =>
        job.donXinViecs.map((dxv) => dxv.maUngVien),
      ),
    );

    const allApplicants = recruiter.congViecs.flatMap((job) =>
      job.donXinViecs.map((dxv) => ({
        applicationId: dxv.maDon, // Hoặc ID của bảng DonXinViec trong schema của bạn
        candidateId: dxv.ungVien.maUngVien,
        candidateName: dxv.ungVien.tenUngVien,
        avatarUrl: dxv.ungVien.avatarUrl,
        status: dxv.trangThai,
        appliedAt: dxv.ngayNop,
        jobTitle: job.tenCongViec, // Đính kèm tên Job
      })),
    );

    const recentApplicants = allApplicants
      .sort(
        (a, b) =>
          new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
      )
      .slice(0, 4);

    return {
      recruiterId: recruiter.maNTD,
      accountId: recruiter.maTaiKhoan,
      companyId: recruiter.maCongTy,
      account: {
        email: recruiter.taiKhoan.email,
        userName: recruiter.taiKhoan.tenNguoiDung,
        phoneNumber: recruiter.taiKhoan.sdt,
      },
      company: {
        name: recruiter.congTy.tenCongTy,
        legalName: recruiter.congTy.tenPhapLy,
        slug: recruiter.congTy.slug,
        description: recruiter.congTy.moTa,
        logo: recruiter.congTy.logoUrl,
        website: recruiter.congTy.website,
        address: recruiter.congTy.diaChi,
        city: recruiter.congTy.thanhPho,
        industry: recruiter.congTy.linhVuc,
        size: recruiter.congTy.quyMo,
      },
      statistics: {
        totalJobs: recruiter.congViecs.length,
        totalViews: totalViews,
        totalApplications: totalApplications,
        totalCandidates: uniqueCandidateIds.size,
      },
      //Danh sách các ứng viên mới nhất
      recentApplicants: recentApplicants,
      jobs: {
        count: recruiter.congViecs.length,
        list: recruiter.congViecs.map((job) => ({
          id: job.maCongViec,
          title: job.tenCongViec,
          slug: job.slug,
          location: job.thanhPho,
          type: job.loaiHinh, // VD: Full-time, Part-time
          views: job.luotXem, // Lượt xem để HR thống kê
          applicationsCount: job._count.donXinViecs, // Số lượng hồ sơ đã nộp
          status: job.trangThai, // Đang mở, Đã đóng...
          postedAt: job.ngayDang,
          deadline: job.ngayHetHan,
          skills:
            job.congViecKyNangs?.map((cvkn) => cvkn.kyNang.tenKyNang) || [],
        })),
      },
    };
  }

  // 2. Cập nhật thông tin (HR & Công ty)
  async updateProfile(userId: string, data: UpdateRecruiterDto) {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
    });

    if (!recruiter) throw new NotFoundException('Recruiter not found');

    return await this.prisma.$transaction(async (tx) => {
      // Cập nhật bảng TaiKhoan
      if (data.userName || data.phoneNumber) {
        await tx.taiKhoan.update({
          where: { maTaiKhoan: userId },
          data: {
            tenNguoiDung: data.userName,
            sdt: data.phoneNumber,
          },
        });
      }

      // Cập nhật bảng CongTy
      await tx.congTy.update({
        where: { maCongTy: recruiter.maCongTy },
        data: {
          tenCongTy: data.companyName,
          moTa: data.description,
          website: data.website,
          diaChi: data.address,
          thanhPho: data.city,
          logoUrl: data.logoUrl,
        },
      });

      return { message: 'Recruiter profile updated successfully' };
    });
  }

  async getJobMetrics(userId: string): Promise<RecruiterJobMetricsResponse> {
    // 1. Tìm thông tin Nhà tuyển dụng và Công ty từ mã tài khoản
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
      select: { maNTD: true, maCongTy: true },
    });

    if (!recruiter) {
      throw new NotFoundException('Không tìm thấy thông tin Nhà tuyển dụng.');
    }

    const companyId = recruiter.maCongTy;

    // Các mốc thời gian để so sánh tăng trưởng
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfCurrentWeek = new Date(now);
    startOfCurrentWeek.setDate(now.getDate() - now.getDay()); // Đầu tuần này (Chủ nhật/Thứ 2)
    startOfCurrentWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfCurrentWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Đầu tuần trước

    // 2. Chạy truy vấn song song (Parallel Execution) để tối ưu hiệu năng
    const [
      totalJobsCount,
      jobsCreatedThisMonth,
      activeJobsCount,
      pendingJobsCount,
      totalApplicationsCount,
      appsThisWeekCount,
      appsLastWeekCount,
    ] = await Promise.all([
      // A. Tổng số tin đăng của công ty
      this.prisma.congViec.count({
        where: { nhaTuyenDung: { maCongTy: companyId } },
      }),

      // B. Số tin tạo mới trong tháng này
      this.prisma.congViec.count({
        where: {
          nhaTuyenDung: { maCongTy: companyId },
          ngayDang: { gte: startOfCurrentMonth },
        },
      }),

      // C. Số tin đang tuyển / đang hoạt động
      this.prisma.congViec.count({
        where: {
          nhaTuyenDung: { maCongTy: companyId },
          trangThai: { in: ['DANG_TUYEN', 'Đang tuyển'] },
        },
      }),

      // D. Số tin chờ kiểm duyệt
      this.prisma.congViec.count({
        where: {
          nhaTuyenDung: { maCongTy: companyId },
          trangThai: { in: ['CHO_DUYET', 'Chờ duyệt'] },
        },
      }),

      // E. Tổng số lượt ứng tuyển vào các bài đăng của công ty
      this.prisma.donXinViec.count({
        where: {
          congViec: { nhaTuyenDung: { maCongTy: companyId } },
        },
      }),

      // F. Số CV nộp trong tuần này
      this.prisma.donXinViec.count({
        where: {
          congViec: { nhaTuyenDung: { maCongTy: companyId } },
          ngayNop: { gte: startOfCurrentWeek },
        },
      }),

      // G. Số CV nộp trong tuần trước (để tính % tăng trưởng)
      this.prisma.donXinViec.count({
        where: {
          congViec: { nhaTuyenDung: { maCongTy: companyId } },
          ngayNop: { gte: startOfLastWeek, lt: startOfCurrentWeek },
        },
      }),
    ]);

    // 3. Tính toán % tăng trưởng hồ sơ so với tuần trước
    let percentChangeThisWeek = 0;
    if (appsLastWeekCount > 0) {
      percentChangeThisWeek = Number(
        (
          ((appsThisWeekCount - appsLastWeekCount) / appsLastWeekCount) *
          100
        ).toFixed(1),
      );
    } else if (appsThisWeekCount > 0) {
      percentChangeThisWeek = 100;
    }

    // 4. Trả về cấu trúc dữ liệu chuẩn
    return {
      totalJobs: {
        count: totalJobsCount,
        changeThisMonth: jobsCreatedThisMonth,
      },
      activeJobs: {
        count: activeJobsCount,
      },
      pendingJobs: {
        count: pendingJobsCount,
        avgReviewTimeText: '~2h xét duyệt',
      },
      totalApplications: {
        count: totalApplicationsCount,
        percentChangeThisWeek,
      },
      averageResponseRate: 94.2, // Tỷ lệ phản hồi trung bình (%)
    };
  }

  private stripHtmlText(value?: string | null): string {
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

  private async getRecruiterCompanyAndDiamondAccess(userId: string) {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
      include: { congTy: true },
    });

    if (!recruiter) {
      throw new NotFoundException('Không tìm thấy thông tin nhà tuyển dụng.');
    }

    if (!recruiter.maCongTy || !recruiter.congTy) {
      throw new BadRequestException(
        'Tài khoản chưa liên kết thông tin công ty.',
      );
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const activeDiamond = await this.prisma.muaQuangCao.findFirst({
      where: {
        nhaTuyenDung: { maCongTy: recruiter.maCongTy },
        trangThai: { in: ['Đang chạy', 'DANG_CHAY'] },
        ngayKetThuc: { gte: startOfToday },
        goiQuangCao: {
          capDoUuTien: { gte: 4 },
        },
      },
      select: { maMua: true },
    });

    return {
      recruiter,
      company: recruiter.congTy,
      hasDiamondAccess: Boolean(activeDiamond),
    };
  }

  async getSpotlightBannerConfig(
    userId: string,
  ): Promise<SpotlightBannerConfigResponse> {
    const { company, hasDiamondAccess } =
      await this.getRecruiterCompanyAndDiamondAccess(userId);

    const activeJobs = await this.prisma.congViec.findMany({
      where: {
        nhaTuyenDung: { maCongTy: company.maCongTy },
        trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
      },
      orderBy: [{ doUuTien: 'desc' }, { ngayDang: 'desc' }],
      select: {
        maCongViec: true,
        tenCongViec: true,
        slug: true,
        thanhPho: true,
      },
    });

    const availableJobs = activeJobs.map((job) => ({
      id: job.maCongViec,
      title: job.tenCongViec,
      slug: job.slug,
      city: job.thanhPho,
    }));

    const availableIdSet = new Set(availableJobs.map((j) => j.id));
    let selectedJobIds = availableJobs.slice(0, 3).map((j) => j.id);

    if (
      company.bannerJobIdsJson !== null &&
      company.bannerJobIdsJson !== undefined
    ) {
      try {
        const parsed: unknown = JSON.parse(company.bannerJobIdsJson);
        if (Array.isArray(parsed)) {
          selectedJobIds = parsed
            .filter(
              (id): id is string =>
                typeof id === 'string' && availableIdSet.has(id),
            )
            .slice(0, 5);
        }
      } catch {
        selectedJobIds = availableJobs.slice(0, 3).map((j) => j.id);
      }
    }

    const defaultTagline =
      this.stripHtmlText(company.linhVuc) ||
      this.stripHtmlText(company.chuyenMon) ||
      'Doanh nghiệp công nghệ nổi bật đang mở tuyển kỹ sư IT';

    return {
      hasDiamondAccess,
      companyId: company.maCongTy,
      companyName: company.tenCongTy,
      slug: company.slug,
      logo: company.logoUrl,
      defaultCity: company.thanhPho,
      defaultTagline,
      bannerCoverUrl: company.bannerCoverUrl || null,
      bannerCity: company.bannerCity || company.thanhPho || '',
      bannerTagline: company.bannerTagline || defaultTagline,
      bannerBadgeText: company.bannerBadgeText || 'TOP HIRING',
      selectedJobIds,
      availableJobs,
      activeJobsCount: availableJobs.length,
    };
  }

  async updateSpotlightBanner(
    userId: string,
    dto: UpdateSpotlightBannerDto,
  ): Promise<SpotlightBannerConfigResponse> {
    const { company, hasDiamondAccess } =
      await this.getRecruiterCompanyAndDiamondAccess(userId);

    if (!hasDiamondAccess) {
      throw new ForbiddenException(
        'Chỉ doanh nghiệp đang sử dụng Gói Kim Cương mới được tùy chỉnh Banner Nhà Tuyển Dụng Nổi Bật.',
      );
    }

    await this.prisma.$transaction(async (tx) => {
      const updateData: {
        bannerCoverUrl?: string | null;
        bannerCity?: string | null;
        bannerTagline?: string | null;
        bannerBadgeText?: string | null;
        bannerJobIdsJson?: string | null;
      } = {};

      if (dto.bannerCoverUrl !== undefined) {
        const cleanUrl = dto.bannerCoverUrl?.trim() || null;
        updateData.bannerCoverUrl = cleanUrl ? cleanUrl.slice(0, 255) : null;
      }

      if (dto.bannerCity !== undefined) {
        const cleanCity = dto.bannerCity?.trim() || null;
        updateData.bannerCity = cleanCity ? cleanCity.slice(0, 100) : null;
      }

      if (dto.bannerTagline !== undefined) {
        const cleanTagline = this.stripHtmlText(dto.bannerTagline);
        updateData.bannerTagline = cleanTagline
          ? cleanTagline.slice(0, 200)
          : null;
      }

      if (dto.bannerBadgeText !== undefined) {
        const cleanBadge = this.stripHtmlText(dto.bannerBadgeText);
        updateData.bannerBadgeText = cleanBadge
          ? cleanBadge.slice(0, 40)
          : null;
      }

      if (dto.selectedJobIds !== undefined) {
        const dedupedIds = Array.from(
          new Set(
            dto.selectedJobIds
              .map((id) => (typeof id === 'string' ? id.trim() : ''))
              .filter(Boolean),
          ),
        ).slice(0, 5);

        if (dedupedIds.length === 0) {
          updateData.bannerJobIdsJson = JSON.stringify([]);
        } else {
          const ownedJobs = await tx.congViec.findMany({
            where: {
              maCongViec: { in: dedupedIds },
              nhaTuyenDung: { maCongTy: company.maCongTy },
              trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
            },
            select: { maCongViec: true },
          });

          const ownedSet = new Set(ownedJobs.map((j) => j.maCongViec));
          const orderedValidIds = dedupedIds.filter((id) => ownedSet.has(id));
          updateData.bannerJobIdsJson = JSON.stringify(orderedValidIds);
        }
      }

      await tx.congTy.update({
        where: { maCongTy: company.maCongTy },
        data: updateData,
      });
    });

    return this.getSpotlightBannerConfig(userId);
  }

  async uploadSpotlightBannerCover(userId: string, file: UploadedBinaryFile) {
    const { hasDiamondAccess } =
      await this.getRecruiterCompanyAndDiamondAccess(userId);

    if (!hasDiamondAccess) {
      throw new ForbiddenException(
        'Chỉ doanh nghiệp đang sử dụng Gói Kim Cương mới được tải ảnh Banner.',
      );
    }

    const url = await this.cloudinaryService.uploadImage(
      file,
      'viecngon_banners',
    );
    return { url };
  }
}
