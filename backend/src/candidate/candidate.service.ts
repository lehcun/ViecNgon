import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  // 1. Lấy thông tin chi tiết ứng viên dựa trên ID tài khoản đang login
  async getProfile(maTaiKhoan: string) {
    const profile = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan: maTaiKhoan },
      include: {
        taiKhoan: {
          select: {
            email: true,
            sdt: true,
            tenNguoiDung: true,
          },
        },
        kyNangs: {
          include: { kyNang: true },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException(
        'Không tìm thấy hồ sơ ứng viên cho tài khoản này.',
      );
    }

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

      account: {
        email: profile.taiKhoan.email,
        userName: profile.taiKhoan.tenNguoiDung,
        phoneNumber: profile.taiKhoan.sdt,
      },

      // Mổ xẻ mảng kỹ năng và gom gọn lại
      skills: profile.kyNangs.map((k) => ({
        skillId: k.maKyNang,
        skillName: k.kyNang.tenKyNang,
        level: k.mucDo,
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
