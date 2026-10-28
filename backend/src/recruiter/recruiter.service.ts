import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';

export interface RecruiterJobMetricsResponse {
  totalJobs: {
    count: number;
    changeThisMonth: number; // Ví dụ: +4 tháng này
  };
  activeJobs: {
    count: number; // Số vị trí đang hoạt động ('DANG_TUYEN')
  };
  pendingJobs: {
    count: number; // Số tin đang chờ Admin kiểm duyệt ('CHO_DUYET')
    avgReviewTimeText: string; // "~2h xét duyệt"
  };
  totalApplications: {
    count: number; // Tổng số CV đã nộp
    percentChangeThisWeek: number; // Ví dụ: +23% tuần này
  };
  averageResponseRate: number; // Ví dụ: 94.2 (%)
}
@Injectable()
export class RecruiterService {
  constructor(private prisma: PrismaService) {}

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

    // Return dữ liệu mapping sang Tiếng Anh
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
}
