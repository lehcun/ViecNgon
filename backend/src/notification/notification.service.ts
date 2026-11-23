import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  DeleteNotificationResponse,
  NotificationItemResponse,
  NotificationListResponse,
  UnreadCountResponse,
} from '@viecngon/types';
import {
  GetNotificationsDto,
  NotificationFilter,
} from './dto/get-notifications.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) { }

  // =========================================================================
  // 1. LẤY DANH SÁCH THÔNG BÁO (PHÂN TRANG & BỘ LỌC ALL | UNREAD | READ)
  // =========================================================================
  async getNotifications(
    maTaiKhoan: string,
    query: GetNotificationsDto,
  ): Promise<NotificationListResponse> {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 20);
    const skip = (page - 1) * limit;

    const keyword = query.q?.trim();
    const whereCondition: Prisma.ThongBaoWhereInput = {
      maTaiKhoan,
    };

    if (query.filter === NotificationFilter.UNREAD) {
      whereCondition.trangThai = 'CHUA_DOC';
    } else if (query.filter === NotificationFilter.READ) {
      whereCondition.trangThai = 'DA_DOC';
    }

    if (keyword) {
      whereCondition.OR = [
        { tieuDe: { contains: keyword } },
        { noiDung: { contains: keyword } },
      ];
    }

    const [items, totalFiltered, unreadCount, readCount] = await Promise.all([
      this.prisma.thongBao.findMany({
        where: whereCondition,
        orderBy: { ngayTao: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.thongBao.count({ where: whereCondition }),
      this.prisma.thongBao.count({
        where: { maTaiKhoan, trangThai: 'CHUA_DOC' },
      }),
      this.prisma.thongBao.count({
        where: { maTaiKhoan, trangThai: 'DA_DOC' },
      }),
    ]);

    const data: NotificationItemResponse[] = items.map((noti) => ({
      id: noti.maThongBao,
      title: noti.tieuDe,
      content: noti.noiDung,
      status: noti.trangThai as 'CHUA_DOC' | 'DA_DOC',
      createdAt: noti.ngayTao,
    }));

    return {
      data,
      total: totalFiltered,
      allCount: unreadCount + readCount,
      unreadCount,
      readCount,
      page,
      limit,
      totalPages: Math.ceil(totalFiltered / limit) || 1,
    };
  }

  // =========================================================================
  // 2. LẤY SỐ LƯỢNG THÔNG BÁO CHƯA ĐỌC ĐỂ HIỂN THỊ BADGE ĐỎ
  // =========================================================================
  async getUnreadCount(maTaiKhoan: string): Promise<UnreadCountResponse> {
    const count = await this.prisma.thongBao.count({
      where: {
        maTaiKhoan,
        trangThai: 'CHUA_DOC',
      },
    });

    return { count };
  }

  // =========================================================================
  // 3. ĐÁNH DẤU 1 THÔNG BÁO LÀ ĐÃ ĐỌC (KIỂM TRA QUYỀN SỞ HỮU CHỐNG IDOR)
  // =========================================================================
  async markAsRead(maThongBao: string, maTaiKhoan: string) {
    const noti = await this.prisma.thongBao.findFirst({
      where: {
        maThongBao,
        maTaiKhoan,
      },
    });

    if (!noti) {
      throw new NotFoundException(
        'Không tìm thấy thông báo hoặc bạn không có quyền thao tác.',
      );
    }

    const updated = await this.prisma.thongBao.update({
      where: { maThongBao },
      data: { trangThai: 'DA_DOC' },
    });

    return {
      message: 'Đã đánh dấu thông báo là đã đọc',
      id: updated.maThongBao,
      status: updated.trangThai,
    };
  }

  // =========================================================================
  // 4. ĐÁNH DẤU TẤT CẢ THÔNG BÁO LÀ ĐÃ ĐỌC
  // =========================================================================
  async markAllAsRead(maTaiKhoan: string) {
    const result = await this.prisma.thongBao.updateMany({
      where: {
        maTaiKhoan,
        trangThai: 'CHUA_DOC',
      },
      data: {
        trangThai: 'DA_DOC',
      },
    });

    return {
      message: 'Đã đánh dấu tất cả thông báo là đã đọc',
      updatedCount: result.count,
    };
  }

  // =========================================================================
  // 5. XÓA 1 THÔNG BÁO (KIỂM TRA QUYỀN SỞ HỮU CHỐNG IDOR)
  // =========================================================================
  async deleteNotification(
    maThongBao: string,
    maTaiKhoan: string,
  ): Promise<DeleteNotificationResponse> {
    const existing = await this.prisma.thongBao.findFirst({
      where: {
        maThongBao,
        maTaiKhoan,
      },
      select: { maThongBao: true },
    });

    if (!existing) {
      throw new NotFoundException(
        'Không tìm thấy thông báo hoặc bạn không có quyền xóa.',
      );
    }

    await this.prisma.thongBao.delete({
      where: { maThongBao },
    });

    return {
      message: 'Đã xóa thông báo.',
      deletedCount: 1,
    };
  }

  // =========================================================================
  // 6. XÓA TẤT CẢ THÔNG BÁO ĐÃ ĐỌC CỦA NGƯỜI DÙNG HIỆN TẠI
  // =========================================================================
  async deleteReadNotifications(
    maTaiKhoan: string,
  ): Promise<DeleteNotificationResponse> {
    const result = await this.prisma.thongBao.deleteMany({
      where: {
        maTaiKhoan,
        trangThai: 'DA_DOC',
      },
    });

    return {
      message:
        result.count > 0
          ? `Đã dọn ${result.count} thông báo đã đọc.`
          : 'Không có thông báo đã đọc nào để xóa.',
      deletedCount: result.count,
    };
  }

  // Phương thức tương thích ngược cho endpoint cũ
  async getMyNotifications(
    maTaiKhoan: string,
  ): Promise<NotificationItemResponse[]> {
    const res = await this.getNotifications(maTaiKhoan, {
      page: 1,
      limit: 20,
      filter: NotificationFilter.ALL,
    });
    return res.data;
  }
}
