import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { NotificationFilter } from './dto/get-notifications.dto';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('lọc danh sách thông báo theo từ khóa q và trạng thái UNREAD', async () => {
    prisma.thongBao.findMany.mockResolvedValue([
      {
        maThongBao: 'tb-1',
        tieuDe: 'Nhà tuyển dụng mới chờ kích hoạt: MoMo',
        noiDung: 'HR MoMo vừa đăng ký',
        trangThai: 'CHUA_DOC',
        ngayTao: new Date('2026-04-01T08:00:00.000Z'),
      },
    ]);
    prisma.thongBao.count
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(1)
      .mockResolvedValueOnce(2);

    const res = await service.getNotifications('admin-1', {
      filter: NotificationFilter.UNREAD,
      q: 'MoMo',
      page: 1,
      limit: 10,
    });

    expect(res.data).toHaveLength(1);
    expect(res.unreadCount).toBe(1);
    expect(res.allCount).toBe(3);
  });

  it('chặn xóa thông báo không thuộc sở hữu người dùng hiện tại (chống IDOR)', async () => {
    prisma.thongBao.findFirst.mockResolvedValue(null);

    await expect(
      service.deleteNotification('tb-other', 'admin-1'),
    ).rejects.toThrow(NotFoundException);
  });

  it('xóa thành công 1 thông báo thuộc sở hữu của Admin', async () => {
    prisma.thongBao.findFirst.mockResolvedValue({ maThongBao: 'tb-1' });
    prisma.thongBao.delete.mockResolvedValue({ maThongBao: 'tb-1' });

    const res = await service.deleteNotification('tb-1', 'admin-1');

    expect(res.deletedCount).toBe(1);
    expect(prisma.thongBao.delete).toHaveBeenCalledWith({
      where: { maThongBao: 'tb-1' },
    });
  });

  it('xóa toàn bộ thông báo đã đọc của người dùng hiện tại', async () => {
    prisma.thongBao.deleteMany.mockResolvedValue({ count: 4 });

    const res = await service.deleteReadNotifications('admin-1');

    expect(res.deletedCount).toBe(4);
    expect(prisma.thongBao.deleteMany).toHaveBeenCalledWith({
      where: { maTaiKhoan: 'admin-1', trangThai: 'DA_DOC' },
    });
  });
});
