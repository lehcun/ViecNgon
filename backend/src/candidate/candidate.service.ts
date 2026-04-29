import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CandidateService {
  constructor(private prisma: PrismaService) {}

  async getMyProfile(maTaiKhoan: string) {
    // Chặn ngay lập tức nếu mã bị rỗng/undefined
    if (!maTaiKhoan) {
      throw new BadRequestException('Mã tài khoản không hợp lệ');
    }

    const profile = await this.prisma.ungVien.findUnique({
      where: { maTaiKhoan },
      include: {
        kyNangs: {
          include: { kyNang: true }, // Lấy chi tiết tên kỹ năng từ bảng KYNANG
        },
        portfolios: true, // Lấy danh sách dự án
      },
    });

    if (!profile) {
      throw new NotFoundException('Không tìm thấy thông tin ứng viên!');
    }

    return profile;
  }
}
