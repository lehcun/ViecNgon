import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { MailerService } from '@nestjs-modules/mailer';
import { AuthService } from './auth.service';
import type { PrismaService } from '../prisma/prisma.service';

describe('AuthService.registerEmployer (Admin-Managed 2-step onboarding)', () => {
  const createMocks = () => {
    const tx = {
      taiKhoan: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
      congTy: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      chiNhanh: {
        create: jest.fn(),
      },
      nhaTuyenDung: {
        create: jest.fn(),
      },
      thongBao: {
        createMany: jest.fn(),
      },
    };

    const prisma = {
      taiKhoan: {
        findUnique: jest.fn(),
      },
      congTy: {
        findFirst: jest.fn(),
      },
      $transaction: jest.fn(
        async (cb: (client: typeof tx) => Promise<unknown>) => cb(tx),
      ),
    };

    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-jwt-token'),
    } as unknown as JwtService;

    const sendMailMock = jest.fn().mockResolvedValue(undefined);
    const mailerService = {
      sendMail: sendMailMock,
    } as unknown as MailerService;

    const service = new AuthService(
      prisma as unknown as PrismaService,
      jwtService,
      mailerService,
    );

    return { service, prisma, tx, jwtService, sendMailMock };
  };

  const validDto = {
    employerName: 'Nguyễn Minh Quân',
    email: 'hr@acme-tech.vn',
    phone: '0912345678',
    title: 'HR Manager',
    password: 'Password123',
    companyName: 'ACME Tech Vietnam',
    location: 'TP. Hồ Chí Minh',
    address: '123 Nguyễn Huệ, Quận 1',
    website: 'acme-tech.vn',
    companyModel: 'Product',
    companySize: '51-150 nhân viên',
  };

  it('tạo đầy đủ TaiKhoan (CHUAKICHHOAT), CongTy, ChiNhanh, NhaTuyenDung (OWNER), ThongBao Admin và gửi email xác nhận', async () => {
    const { service, prisma, tx, sendMailMock } = createMocks();

    prisma.taiKhoan.findUnique.mockResolvedValue(null);
    prisma.congTy.findFirst.mockResolvedValue(null);
    tx.taiKhoan.create.mockResolvedValue({
      maTaiKhoan: 'acc-1',
      email: 'hr@acme-tech.vn',
      tenNguoiDung: 'Nguyễn Minh Quân',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'CHUAKICHHOAT',
    });
    tx.congTy.findUnique.mockResolvedValue(null);
    tx.congTy.create.mockResolvedValue({
      maCongTy: 'ct-1',
      tenCongTy: 'ACME Tech Vietnam',
      slug: 'acme-tech-vietnam-123456',
    });
    tx.taiKhoan.findMany.mockResolvedValue([{ maTaiKhoan: 'admin-1' }]);

    const result = await service.registerEmployer(validDto);

    expect(result.pendingApproval).toBe(true);
    expect(result.user.status).toBe('CHUAKICHHOAT');
    expect(result.user.companyName).toBe('ACME Tech Vietnam');

    const accountArg = (
      tx.taiKhoan.create.mock.calls[0] as [{ data: Record<string, unknown> }]
    )[0];
    expect(accountArg.data).toMatchObject({
      email: 'hr@acme-tech.vn',
      sdt: '0912345678',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'CHUAKICHHOAT',
    });

    const companyArg = (
      tx.congTy.create.mock.calls[0] as [{ data: Record<string, unknown> }]
    )[0];
    expect(companyArg.data).toMatchObject({
      tenCongTy: 'ACME Tech Vietnam',
      thanhPho: 'TP. Hồ Chí Minh',
      diaChi: '123 Nguyễn Huệ, Quận 1',
      website: 'https://acme-tech.vn',
      moHinhCongTy: 'Product',
      quyMo: '51-150 nhân viên',
    });

    expect(tx.chiNhanh.create).toHaveBeenCalledWith({
      data: {
        maCongTy: 'ct-1',
        thanhPho: 'TP. Hồ Chí Minh',
        diaChi: '123 Nguyễn Huệ, Quận 1',
      },
    });

    expect(tx.nhaTuyenDung.create).toHaveBeenCalledWith({
      data: {
        maTaiKhoan: 'acc-1',
        maCongTy: 'ct-1',
        hoTen: 'Nguyễn Minh Quân',
        chucVu: 'HR Manager',
        soDienThoai: '0912345678',
        vaiTroTrongCongTy: 'OWNER',
      },
    });

    expect(tx.thongBao.createMany).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'hr@acme-tech.vn' }),
    );
  });

  it('từ chối với fieldErrors.email nếu email đã tồn tại', async () => {
    const { service, prisma } = createMocks();
    prisma.taiKhoan.findUnique.mockResolvedValue({ maTaiKhoan: 'existing-1' });

    await expect(service.registerEmployer(validDto)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('chặn đăng ký trùng tên doanh nghiệp (mô hình ITviec / Admin-Managed)', async () => {
    const { service, prisma } = createMocks();
    prisma.taiKhoan.findUnique.mockResolvedValue(null);
    prisma.congTy.findFirst.mockResolvedValue({ maCongTy: 'existing-ct' });

    try {
      await service.registerEmployer(validDto);
      fail('Phải ném lỗi khi trùng tên công ty');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      const response = (err as BadRequestException).getResponse() as {
        fieldErrors?: Record<string, string>;
      };
      expect(response.fieldErrors?.companyName).toContain('love@viecngon.vn');
    }
  });

  it('vẫn hoàn tất đăng ký dù gửi email SMTP thất bại', async () => {
    const { service, prisma, tx, sendMailMock } = createMocks();
    prisma.taiKhoan.findUnique.mockResolvedValue(null);
    prisma.congTy.findFirst.mockResolvedValue(null);
    tx.taiKhoan.create.mockResolvedValue({
      maTaiKhoan: 'acc-2',
      email: 'hr@acme-tech.vn',
      tenNguoiDung: 'Nguyễn Minh Quân',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'CHUAKICHHOAT',
    });
    tx.congTy.findUnique.mockResolvedValue(null);
    tx.congTy.create.mockResolvedValue({
      maCongTy: 'ct-2',
      tenCongTy: 'ACME Tech Vietnam',
      slug: 'acme-tech-vietnam-999999',
    });
    tx.taiKhoan.findMany.mockResolvedValue([]);
    sendMailMock.mockRejectedValue(new Error('SMTP connection timeout'));

    const result = await service.registerEmployer(validDto);
    expect(result.pendingApproval).toBe(true);
    expect(result.user.id).toBe('acc-2');
  });
});
