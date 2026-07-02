import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidateProfileResponse } from '@viecngon/types';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  // 1. Lấy thông tin chi tiết ứng viên dựa trên ID tài khoản đang login
  async getProfile(maTaiKhoan: string): Promise<CandidateProfileResponse> {
    // 1. Kéo toàn bộ dữ liệu từ Database
    const profile = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan: maTaiKhoan },
      include: {
        taiKhoan: {
          select: { email: true, sdt: true, tenNguoiDung: true },
        },
        kyNangs: {
          include: { kyNang: true },
        },
        // --- INCLUDE CÁC BẢNG MỚI CỦA HYBRID CV ---
        kinhNghiems: {
          orderBy: { ngayBatDau: 'desc' }, // Sắp xếp kinh nghiệm mới nhất lên đầu
        },
        hocVans: {
          orderBy: { ngayBatDau: 'desc' }, // Sắp xếp học vấn mới nhất lên đầu
        },
        chungChis: {
          orderBy: { ngayCap: 'desc' },
        },
        ngoaiNgus: true,
        danhSachFileCv: {
          orderBy: { ngayTaiLen: 'desc' }, // CV mới tải lên nằm trên cùng
        },
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

      // Dữ liệu mới
      aboutMe: profile.gioiThieuBanThan,
      defaultCvType: profile.loaiCvMacDinh,
      defaultCvFileId: profile.maFileCvMacDinh,

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

      // Mapping các mảng dữ liệu mới
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
}
