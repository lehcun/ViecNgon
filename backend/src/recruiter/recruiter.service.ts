import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
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
}
