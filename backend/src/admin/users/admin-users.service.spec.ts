import { BadRequestException, NotFoundException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminUsersService } from './admin-users.service';

describe('AdminUsersService', () => {
  let service: AdminUsersService;
  let prismaMock: {
    taiKhoan: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      count: jest.Mock;
      update: jest.Mock;
    };
    passwordResetToken: {
      updateMany: jest.Mock;
    };
    thongBao: {
      create: jest.Mock;
    };
    $transaction: jest.Mock;
  };
  let mailerMock: { sendMail: jest.Mock };

  const sampleRow = {
    maTaiKhoan: 'user-1',
    email: 'candidate@viecngon.vn',
    tenNguoiDung: 'Nguyen Van A',
    sdt: '0901234567',
    provider: 'LOCAL',
    vaiTro: 'UNGVIEN',
    trangThai: 'HOATDONG',
    ngayTao: new Date('2026-01-01T00:00:00.000Z'),
    ngayCapNhat: new Date('2026-01-02T00:00:00.000Z'),
    ungVien: { avatarUrl: null },
    nhaTuyenDung: null,
  };

  beforeEach(() => {
    prismaMock = {
      taiKhoan: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
      },
      passwordResetToken: {
        updateMany: jest.fn(),
      },
      thongBao: {
        create: jest.fn(),
      },
      $transaction: jest.fn(async (cb: (tx: typeof prismaMock) => unknown) =>
        cb(prismaMock),
      ),
    };

    mailerMock = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    };

    service = new AdminUsersService(
      prismaMock as unknown as PrismaService,
      mailerMock as unknown as MailerService,
    );
  });

  it('trả về danh sách phân trang và summary đúng chuẩn 3 trạng thái tiếng Việt', async () => {
    prismaMock.taiKhoan.findMany.mockResolvedValue([sampleRow]);
    prismaMock.taiKhoan.count
      .mockResolvedValueOnce(1) // filtered total
      .mockResolvedValueOnce(10) // totalAll
      .mockResolvedValueOnce(7) // HOATDONG
      .mockResolvedValueOnce(2) // KHOA
      .mockResolvedValueOnce(1) // CHUAKICHHOAT
      .mockResolvedValueOnce(1) // ADMIN
      .mockResolvedValueOnce(6) // UNGVIEN
      .mockResolvedValueOnce(3); // NHATUYENDUNG

    const res = await service.findAll({ page: 1, limit: 12, q: 'candidate' });

    expect(res.items).toHaveLength(1);
    expect(res.items[0].trangThai).toBe('HOATDONG');
    expect(res.summary).toEqual({
      total: 10,
      active: 7,
      locked: 2,
      unactivated: 1,
      admins: 1,
      candidates: 6,
      recruiters: 3,
    });
  });

  it('ném NotFoundException khi xem chi tiết tài khoản không tồn tại', async () => {
    prismaMock.taiKhoan.findFirst.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('chặn Admin tự khóa chính tài khoản của mình', async () => {
    await expect(
      service.updateStatus(
        'admin-1',
        { trangThai: 'KHOA', reason: 'test' },
        'admin-1',
      ),
    ).rejects.toThrow(BadRequestException);
  });

  it('chặn khóa tài khoản ADMIN hoạt động cuối cùng', async () => {
    prismaMock.taiKhoan.findFirst.mockResolvedValue({
      maTaiKhoan: 'admin-2',
      email: 'last-admin@viecngon.vn',
      tenNguoiDung: 'Last Admin',
      vaiTro: 'ADMIN',
      trangThai: 'HOATDONG',
    });
    prismaMock.taiKhoan.count.mockResolvedValue(1);

    await expect(
      service.updateStatus('admin-2', { trangThai: 'KHOA' }, 'admin-1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('khóa tài khoản vi phạm: cập nhật KHOA, vô hiệu hóa token reset và ghi ThongBao', async () => {
    prismaMock.taiKhoan.findFirst.mockResolvedValue({
      maTaiKhoan: 'user-1',
      email: 'candidate@viecngon.vn',
      tenNguoiDung: 'Nguyen Van A',
      vaiTro: 'UNGVIEN',
      trangThai: 'HOATDONG',
    });
    prismaMock.taiKhoan.update.mockResolvedValue({
      ...sampleRow,
      trangThai: 'KHOA',
    });

    const result = await service.updateStatus(
      'user-1',
      { trangThai: 'KHOA', reason: 'Spam tin tuyển dụng giả mạo' },
      'admin-1',
    );

    expect(result.user.trangThai).toBe('KHOA');
    expect(prismaMock.passwordResetToken.updateMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.thongBao.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          maTaiKhoan: 'user-1',
          trangThai: 'CHUA_DOC',
        }),
      }),
    );
  });

  it('kích hoạt tài khoản từ CHUAKICHHOAT sang HOATDONG', async () => {
    prismaMock.taiKhoan.findFirst.mockResolvedValue({
      maTaiKhoan: 'user-2',
      email: 'new@viecngon.vn',
      tenNguoiDung: 'New User',
      vaiTro: 'UNGVIEN',
      trangThai: 'CHUAKICHHOAT',
    });
    prismaMock.taiKhoan.update.mockResolvedValue({
      ...sampleRow,
      maTaiKhoan: 'user-2',
      email: 'new@viecngon.vn',
      trangThai: 'HOATDONG',
    });

    const result = await service.updateStatus(
      'user-2',
      { trangThai: 'HOATDONG' },
      'admin-1',
    );

    expect(result.user.trangThai).toBe('HOATDONG');
    expect(prismaMock.passwordResetToken.updateMany).not.toHaveBeenCalled();
  });

  it('chặn Admin tự hạ quyền của chính mình', async () => {
    await expect(
      service.updateRole('admin-1', { vaiTro: 'UNGVIEN' }, 'admin-1'),
    ).rejects.toThrow(BadRequestException);
  });

  it('phân quyền ADMIN thành công cho người dùng hợp lệ', async () => {
    prismaMock.taiKhoan.findFirst.mockResolvedValue({
      maTaiKhoan: 'user-1',
      email: 'candidate@viecngon.vn',
      vaiTro: 'UNGVIEN',
      trangThai: 'HOATDONG',
    });
    prismaMock.taiKhoan.update.mockResolvedValue({
      ...sampleRow,
      vaiTro: 'ADMIN',
    });

    const result = await service.updateRole(
      'user-1',
      { vaiTro: 'ADMIN' },
      'admin-1',
    );

    expect(result.user.vaiTro).toBe('ADMIN');
    expect(prismaMock.thongBao.create).toHaveBeenCalledTimes(1);
  });
});
