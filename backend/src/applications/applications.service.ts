import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonXinViecDto } from './dto/create-don-xin-viec.dto';

@Injectable()
export class ApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async createApplication(dto: CreateDonXinViecDto, userId: string) {
    const { maCongViec, chiTiet, fileCvUrl } = dto;

    // 1. Kiểm tra xem Công việc có tồn tại và đang mở không
    const job = await this.prisma.congViec.findUnique({
      where: { maCongViec: maCongViec },
    });

    if (!job) {
      throw new NotFoundException('Công việc này không tồn tại.');
    }
    // if (job.trangThai !== 'Đang tuyển') {
    //   throw new BadRequestException(
    //     'Công việc này đã đóng hoặc hết hạn tuyển dụng.',
    //   );
    // }

    // 2. Kiểm tra xem Ứng viên này đã nộp đơn cho công việc này chưa
    const existingApplication = await this.prisma.donXinViec.findFirst({
      where: {
        maCongViec: maCongViec,
        maUngVien: userId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('Bạn đã nộp đơn cho công việc này rồi.');
    }

    const candidate = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan: userId },
      select: { maUngVien: true },
    });

    if (!candidate) {
      throw new NotFoundException('Ứng viên này không tồn tại.');
    }

    // 3. Tiến hành lưu Đơn xin việc vào cơ sở dữ liệu
    const newApplication = await this.prisma.donXinViec.create({
      data: {
        maCongViec: maCongViec,
        maUngVien: candidate.maUngVien,
        chiTiet: chiTiet,
        fileCvUrl: fileCvUrl,
        ngayNop: new Date(), // Set thời gian thực tế lúc nộp
        trangThai: 'Chờ xử lý', // Trạng thái mặc định ban đầu
      },
    });

    return {
      message: 'Nộp đơn xin việc thành công!',
      data: newApplication,
    };
  }

  async getCandidatesForEmployer(maTaiKhoan: string) {
    const nhaTuyenDung = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: maTaiKhoan },
      select: { maNTD: true },
    });

    // BẢO MẬT: Bắt lỗi nếu tài khoản này không có hồ sơ Nhà tuyển dụng
    if (!nhaTuyenDung) {
      throw new NotFoundException(
        'Không tìm thấy thông tin Nhà tuyển dụng hợp lệ cho tài khoản này.',
      );
    }

    const maNTD = nhaTuyenDung.maNTD;
    // Bước 1: Query qua bảng DonXinViec
    const applications = await this.prisma.donXinViec.findMany({
      where: {
        // BẢO MẬT: Chỉ lấy những đơn xin việc nộp vào CÔNG VIỆC thuộc về HR này
        congViec: {
          maNTD: maNTD,
        },
      },
      include: {
        // Kéo thông tin Ứng viên (để in ra Avatar và Tên)
        ungVien: {
          select: {
            maUngVien: true,
            tenUngVien: true,
            avatarUrl: true,
            cvUrl: true,
            chuyenMon: true,
            taiKhoan: {
              select: { email: true, sdt: true }, // Lấy thông tin liên lạc
            },
          },
        },
        // Kéo thông tin Công việc (để in ra chữ: "Ứng tuyển: Senior ReactJS")
        congViec: {
          select: {
            maCongViec: true,
            tenCongViec: true,
          },
        },
      },
      orderBy: {
        ngayNop: 'desc', // Sắp xếp hồ sơ mới nộp lên đầu tiên
      },
    });

    // Bước 2: Chuẩn hóa dữ liệu (Format) trả về cho Frontend UI
    return applications.map((app) => ({
      applicationId: app.maDon,
      candidateId: app.ungVien.maUngVien,
      candidateName: app.ungVien.tenUngVien,
      avatarUrl: app.ungVien.avatarUrl,
      contactEmail: app.ungVien.taiKhoan.email,

      jobId: app.congViec.maCongViec,
      jobTitle: app.congViec.tenCongViec,

      appliedAt: app.ngayNop,
      status: app.trangThai, // Các trạng thái: CHUA_XEM, PHU_HOP...
      cvUrl: app.fileCvUrl || app.ungVien.cvUrl, // Ưu tiên CV tải lên riêng, nếu không có thì lấy CV gốc
    }));
  }

  async updateApplicationStatus(maDon: string, trangThai: string) {
    // Các trạng thái hợp lệ như đã thống nhất: CHUA_XEM, DA_XEM, PHU_HOP, KHONG_PHU_HOP, PHONG_VAN [3]
    return this.prisma.donXinViec.update({
      where: { maDon: maDon },
      data: { trangThai: trangThai },
    });
  }

  async getApplicationDetail(maDon: string) {
    // Bước 1: Query qua bảng DonXinViec và include lồng sâu xuống UngVien
    const application = await this.prisma.donXinViec.findUnique({
      where: { maDon: maDon },
      include: {
        // Lấy thông tin Công việc đang ứng tuyển
        congViec: {
          select: {
            maCongViec: true,
            tenCongViec: true,
          },
        },
        // Lấy thông tin Ứng viên & Hybrid CV của họ
        ungVien: {
          include: {
            taiKhoan: {
              select: { email: true, sdt: true },
            },
            kinhNghiems: {
              orderBy: { ngayBatDau: 'desc' },
            },
            hocVans: {
              orderBy: { ngayBatDau: 'desc' },
            },
            kyNangs: {
              include: { kyNang: true },
            },
            danhSachFileCv: true, // Để đối chiếu file nếu cần
          },
        },
      },
    });

    // Bắt lỗi nếu mã đơn không tồn tại (Ví dụ: Ứng viên đã rút đơn)
    if (!application) {
      throw new NotFoundException(
        'Không tìm thấy đơn ứng tuyển này hoặc đơn đã bị thu hồi.',
      );
    }

    // Bước 2: Format dữ liệu chuẩn hóa sang tiếng Anh trả về cho Frontend
    const ungVien = application.ungVien;

    return {
      // --- THÔNG TIN ĐƠN ỨNG TUYỂN (APPLICATION INFO) ---
      applicationId: application.maDon,
      appliedAt: application.ngayNop,
      status: application.trangThai,
      coverLetter: application.chiTiet, // Thư giới thiệu ứng viên viết lúc nộp

      // Ưu tiên file CV đính kèm lúc nộp. Nếu không có, lấy CV mặc định của ứng viên
      cvUrl: application.fileCvUrl || ungVien.cvUrl,

      // --- THÔNG TIN CÔNG VIỆC (JOB INFO) ---
      jobId: application.congViec.maCongViec,
      jobTitle: application.congViec.tenCongViec,

      // --- THÔNG TIN ỨNG VIÊN (CANDIDATE INFO) ---
      candidateId: ungVien.maUngVien,
      candidateName: ungVien.tenUngVien,
      avatarUrl: ungVien.avatarUrl,
      profession: ungVien.chuyenMon,
      aboutMe: ungVien.gioiThieuBanThan,

      contact: {
        email: ungVien.taiKhoan.email,
        phoneNumber: ungVien.taiKhoan.sdt,
        address: ungVien.diaChi,
      },

      // --- DỮ LIỆU HỒ SƠ TRỰC TUYẾN (Dành cho HR đọc nếu không có file PDF) ---
      skills: ungVien.kyNangs.map((k) => ({
        skillName: k.kyNang.tenKyNang,
        level: k.mucDo,
      })),

      experiences: ungVien.kinhNghiems.map((exp) => ({
        id: exp.maKinhNghiem,
        companyName: exp.tenCongTy,
        position: exp.viTri,
        startDate: exp.ngayBatDau,
        endDate: exp.ngayKetThuc,
        description: exp.moTaChiTiet,
      })),

      educations: ungVien.hocVans.map((edu) => ({
        id: edu.maHocVan,
        schoolName: edu.tenTruong,
        major: edu.nganhHoc,
        startDate: edu.ngayBatDau,
        endDate: edu.ngayTotNghiep,
        gpa: edu.gpa,
      })),
    };
  }
}
