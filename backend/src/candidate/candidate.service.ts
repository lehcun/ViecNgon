import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidateProfileResponse } from '@viecngon/types';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { formatSalaryDisplay } from 'src/common/utils/format-salary';

interface MockMulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype: string;
}

@Injectable()
export class CandidateService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  //  Lấy thông tin chi tiết ứng viên dựa trên ID tài khoản đang login
  async getProfile(maTaiKhoan: string): Promise<CandidateProfileResponse> {
    // 1. Kéo toàn bộ dữ liệu từ Database
    const profile = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan: maTaiKhoan },
      include: {
        taiKhoan: { select: { email: true, sdt: true, tenNguoiDung: true } },
        kyNangs: { include: { kyNang: true } },
        kinhNghiems: { orderBy: { ngayBatDau: 'desc' } },
        hocVans: { orderBy: { ngayBatDau: 'desc' } },
        chungChis: { orderBy: { ngayCap: 'desc' } },
        ngoaiNgus: true,
        danhSachFileCv: { orderBy: { ngayTaiLen: 'desc' } },
      },
    });

    if (!profile) {
      throw new NotFoundException(
        'Không tìm thấy hồ sơ ứng viên cho tài khoản này.',
      );
    }

    // HÀM HELPER XỬ LÝ NGÀY THÁNG Ở BACKEND (Chuyển thành MM/YYYY)
    const formatMonthYear = (date: Date | null | undefined): string => {
      if (!date) return '';
      return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    };

    // ========================================================
    // 🔥 LOGIC MỚI: TÌM SẴN THÔNG TIN FILE CV MẶC ĐỊNH Ở BACKEND
    // ========================================================
    const defaultFileDb = profile.maFileCvMacDinh
      ? profile.danhSachFileCv.find(
          (f) => f.maFileCv === profile.maFileCvMacDinh,
        )
      : null;

    const defaultCvFile = defaultFileDb
      ? {
          id: defaultFileDb.maFileCv,
          fileName: defaultFileDb.tenFile,
          fileUrl: defaultFileDb.fileUrl,
          uploadedAt: defaultFileDb.ngayTaiLen,
        }
      : null;

    // 2. Format dữ liệu chuẩn hóa sang tiếng Anh trả về Frontend
    return {
      candidateId: profile.maUngVien,
      accountId: profile.maTaiKhoan,
      candidateName: profile.tenUngVien,
      dateOfBirth: profile.ngaySinh,
      gender: profile.gioiTinh,
      yearsOfExperience: profile.soNamKinhNghiem,
      avatarUrl: profile.avatarUrl,
      profession: profile.chuyenMon,
      cvUrl: profile.cvUrl,
      address: profile.diaChi,

      aboutMe: profile.gioiThieuBanThan,
      defaultCvType: profile.loaiCvMacDinh,
      defaultCvFileId: profile.maFileCvMacDinh,

      // TRẢ VỀ LUÔN OBJECT CHỨA THÔNG TIN FILE MẶC ĐỊNH
      defaultCvFile: defaultCvFile,

      account: {
        email: profile.taiKhoan.email,
        userName: profile.taiKhoan.tenNguoiDung,
        phoneNumber: profile.taiKhoan.sdt,
      },

      skills: profile.kyNangs.map((k) => ({
        skillId: k.maKyNang,
        skillName: k.kyNang.tenKyNang,
        level: k.mucDo,
      })),

      experiences: profile.kinhNghiems.map((kn) => ({
        id: kn.maKinhNghiem,
        companyName: kn.tenCongTy,
        position: kn.viTri,
        startDate: formatMonthYear(kn.ngayBatDau),
        endDate: formatMonthYear(kn.ngayKetThuc),
        description: kn.moTaChiTiet,
      })),

      educations: profile.hocVans.map((hv) => ({
        id: hv.maHocVan,
        schoolName: hv.tenTruong,
        major: hv.nganhHoc,
        startDate: formatMonthYear(hv.ngayBatDau),
        endDate: formatMonthYear(hv.ngayTotNghiep),
        gpa: hv.gpa,
      })),

      certificates: profile.chungChis.map((cc) => ({
        id: cc.maChungChi,
        name: cc.tenChungChi,
        organization: cc.toChucCap,
        issueDate: formatMonthYear(cc.ngayCap),
        expirationDate: formatMonthYear(cc.ngayHetHan),
      })),

      languages: profile.ngoaiNgus.map((nn) => ({
        id: nn.maNgoaiNgu,
        name: nn.tenNgoaiNgu,
        proficiency: nn.trinhDo,
      })),

      uploadedCvs: profile.danhSachFileCv.map((file) => ({
        id: file.maFileCv,
        fileName: file.tenFile,
        fileUrl: file.fileUrl,
        uploadedAt: file.ngayTaiLen,
      })),
    };
  }

  // Cập nhật thông tin (Dùng Transaction để update 2 bảng cùng lúc)
  async updateProfile(userId: string, data: UpdateCandidateDto) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Cập nhật bảng TaiKhoan
      if (data.userName || data.phoneNumber) {
        await tx.taiKhoan.update({
          where: { maTaiKhoan: userId },
          data: {
            tenNguoiDung: data.userName,
            sdt: data.phoneNumber,
          },
        });
      }

      // 2. Cập nhật bảng UngVien
      const updatedProfile = await tx.ungVien.update({
        where: { maTaiKhoan: userId },
        data: {
          tenUngVien: data.userName || undefined,
          ngaySinh: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
          gioiTinh: data.gender,
          soNamKinhNghiem: data.yearsOfExperience,
          avatarUrl: data.avatarUrl,
          chuyenMon: data.profession,
          cvUrl: data.cvUrl,
          diaChi: data.address,
        },
      });

      return {
        message: 'Cập nhật thành công',
        candidateId: updatedProfile.maUngVien,
      };
    });
  }

  async uploadGeneratedCv(maTaiKhoan: string, file: MockMulterFile) {
    if (!file) {
      throw new BadRequestException('Không tìm thấy file CV.');
    }

    try {
      // 1. Upload file lên Cloud (Thực hiện NGOÀI transaction để tránh khóa Database quá lâu)
      const fileUrl = await this.cloudinaryService.uploadCvPdf(file);

      // Tìm maUngVien theo maTaiKhoan
      const ungVien = await this.prisma.ungVien.findUnique({
        where: { maTaiKhoan: maTaiKhoan },
        select: { maUngVien: true },
      });

      if (!ungVien) {
        throw new NotFoundException(
          'Không tìm thấy ứng viên với tài khoản này.',
        );
      }

      // 2. Mở Transaction để ghi dữ liệu
      return await this.prisma.$transaction(async (tx) => {
        // 2.1 Tạo bản ghi mới trong bảng FileCv
        const newFileCv = await tx.fileCv.create({
          data: {
            tenFile: file.originalname || 'CV_ViecNgon.pdf',
            fileUrl: fileUrl,
            maUngVien: ungVien.maUngVien, // Khóa ngoại
          },
        });

        // 2.2 Cập nhật bảng UngVien
        await tx.ungVien.update({
          where: { maUngVien: ungVien.maUngVien },
          data: {
            loaiCvMacDinh: 'ONLINE', // Đặt loại CV mặc định là ONLINE
            maFileCvMacDinh: newFileCv.maFileCv, // Trỏ đến ID của file vừa tạo
          },
        });

        return {
          message: 'Lưu CV mặc định thành công',
          fileId: newFileCv.maFileCv,
          fileUrl: newFileCv.fileUrl,
        };
      });
    } catch (error) {
      console.error('Lỗi khi lưu CV tạo từ web:', error);
      throw new InternalServerErrorException(
        'Không thể lưu CV vào hệ thống. Vui lòng thử lại.',
      );
    }
  }

  async getAppliedJobs(userId: string) {
    // 1. Tìm thông tin Ứng viên từ mã tài khoản
    const candidate = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan: userId },
      select: { maUngVien: true },
    });

    if (!candidate) {
      throw new NotFoundException('Không tìm thấy thông tin hồ sơ ứng viên.');
    }

    // 2. Truy vấn danh sách đơn xin việc lồng sang Công việc và Công ty
    const applications = await this.prisma.donXinViec.findMany({
      where: { maUngVien: candidate.maUngVien },
      orderBy: { ngayNop: 'desc' }, // Đơn mới nộp đưa lên đầu
      include: {
        congViec: {
          include: {
            nhaTuyenDung: {
              include: {
                congTy: {
                  select: {
                    tenCongTy: true,
                    logoUrl: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // 3. Format dữ liệu chuẩn hóa (Clean Data) trả về cho Frontend
    return applications.map((app) => {
      const job = app.congViec;
      const company = job.nhaTuyenDung?.congTy;

      return {
        applicationId: app.maDon,
        appliedDate: app.ngayNop,
        applicationStatus: app.trangThai, // 'CHO_DUYET', 'DA_XEM', 'PHONG_VAN', 'TRUNG_TUYEN'...
        cvUrl: app.fileCvUrl,
        job: {
          id: job.maCongViec,
          title: job.tenCongViec,
          slug: job.slug,
          location: job.thanhPho,
          workModel: job.hinhThucLamViec, // 'Remote', 'Hybrid', 'Tại văn phòng'
          salaryDisplay: formatSalaryDisplay(
            job.mucLuongToiThieu,
            job.mucLuongToiDa,
          ),
          status: job.trangThai, // 'Đang tuyển', 'Đã đóng'
          deadline: job.ngayHetHan,
          company: company
            ? {
                name: company.tenCongTy,
                logo: company.logoUrl,
                slug: company.slug,
              }
            : null,
        },
      };
    });
  }
}
