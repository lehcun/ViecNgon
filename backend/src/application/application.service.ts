import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDonXinViecDto } from './dto/create-don-xin-viec.dto';

@Injectable()
export class ApplicationService {
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
}
