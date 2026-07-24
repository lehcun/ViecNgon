import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationItemResponse } from '@viecngon/types';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Lấy danh sách thông báo của 1 user
  async getMyNotifications(
    maTaiKhoan: string,
  ): Promise<NotificationItemResponse[]> {
    const notifications = await this.prisma.thongBao.findMany({
      where: { maTaiKhoan: maTaiKhoan },
      orderBy: { ngayTao: 'desc' }, // Mới nhất lên đầu
      take: 20, // Giới hạn lấy 20 thông báo gần nhất để tránh lag web
    });

    return notifications.map((noti) => ({
      id: noti.maThongBao,
      title: noti.tieuDe,
      content: noti.noiDung,
      status: noti.trangThai as 'CHUA_DOC' | 'DA_DOC',
      createdAt: noti.ngayTao,
    }));
  }

  // 2. Đánh dấu 1 thông báo là đã đọc
  async markAsRead(maThongBao: string, maTaiKhoan: string) {
    // Kiểm tra xem thông báo này có đúng là của user đang đăng nhập không
    const noti = await this.prisma.thongBao.findUnique({
      where: { maThongBao },
    });

    if (!noti || noti.maTaiKhoan !== maTaiKhoan) {
      throw new NotFoundException('Không tìm thấy thông báo');
    }

    return this.prisma.thongBao.update({
      where: { maThongBao },
      data: { trangThai: 'DA_DOC' },
    });
  }
}
