import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof createPrismaMock>;
  let mailerService: { sendMail: jest.Mock };

  beforeEach(async () => {
    prisma = createPrismaMock();
    mailerService = { sendMail: jest.fn().mockResolvedValue(undefined) };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
        { provide: MailerService, useValue: mailerService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('getMeProfile trả về name và avatarUrl thực tế từ DB cho ứng viên', async () => {
    prisma.taiKhoan.findUnique.mockResolvedValue({
      maTaiKhoan: 'tk-1',
      email: 'uv@viecngon.vn',
      tenNguoiDung: 'Tài khoản A',
      vaiTro: 'UNGVIEN',
      trangThai: 'HOATDONG',
      ungVien: {
        tenUngVien: 'Nguyễn Quang Ý',
        avatarUrl: 'https://res.cloudinary.com/demo/avatar.png',
      },
      nhaTuyenDung: null,
    });

    const result = await service.getMeProfile('tk-1');
    expect(result).toEqual({
      id: 'tk-1',
      sub: 'tk-1',
      email: 'uv@viecngon.vn',
      name: 'Nguyễn Quang Ý',
      role: 'UNGVIEN',
      status: 'HOATDONG',
      avatarUrl: 'https://res.cloudinary.com/demo/avatar.png',
    });
  });

  it('getMeProfile cho phép Nhà tuyển dụng CHUAKICHHOAT giữ phiên và trả status CHUAKICHHOAT', async () => {
    prisma.taiKhoan.findUnique.mockResolvedValue({
      maTaiKhoan: 'tk-hr-pending',
      email: 'pending@company.vn',
      tenNguoiDung: 'HR Pending',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'CHUAKICHHOAT',
      deletedAt: null,
      ungVien: null,
      nhaTuyenDung: {
        hoTen: 'HR Pending',
        congTy: { logoUrl: null },
      },
    });

    const result = await service.getMeProfile('tk-hr-pending');
    expect(result).toEqual({
      id: 'tk-hr-pending',
      sub: 'tk-hr-pending',
      email: 'pending@company.vn',
      name: 'HR Pending',
      role: 'NHATUYENDUNG',
      status: 'CHUAKICHHOAT',
      avatarUrl: undefined,
    });
  });

  it('getMeProfile ném UnauthorizedException khi tài khoản không còn trong DB (sau khi re-seed)', async () => {
    prisma.taiKhoan.findUnique.mockResolvedValue(null);
    await expect(service.getMeProfile('old-uuid')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('forgotPassword tạo token hash trong DB và gửi đúng link theo vai trò LOCAL', async () => {
    prisma.taiKhoan.findUnique.mockResolvedValue({
      maTaiKhoan: 'tk-emp-1',
      email: 'hr@company.vn',
      tenNguoiDung: 'HR Tech',
      matKhau: '$2b$10$hash',
      provider: 'LOCAL',
      vaiTro: 'NHATUYENDUNG',
      trangThai: 'HOATDONG',
      deletedAt: null,
    });
    prisma.passwordResetToken.updateMany.mockResolvedValue({ count: 0 });
    prisma.passwordResetToken.create.mockResolvedValue({ maToken: 'rt-1' });

    const res = await service.forgotPassword({
      email: '  HR@company.vn  ',
      portal: 'employer',
    });

    expect(res.message).toContain('Nếu email tồn tại');
    expect(prisma.passwordResetToken.create).toHaveBeenCalledTimes(1);
    const createdData = prisma.passwordResetToken.create.mock.calls[0][0].data;
    expect(createdData.tokenHash).toHaveLength(64);
    expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    const mailArgs = mailerService.sendMail.mock.calls[0][0];
    expect(mailArgs.to).toBe('hr@company.vn');
    expect(mailArgs.html).toContain('/employer/reset-password?token=');
  });

  it('forgotPassword gửi mail nhắc Google đối với tài khoản GOOGLE và không sinh token', async () => {
    prisma.taiKhoan.findUnique.mockResolvedValue({
      maTaiKhoan: 'tk-gg-1',
      email: 'google.user@gmail.com',
      tenNguoiDung: 'Google User',
      matKhau: null,
      provider: 'GOOGLE',
      vaiTro: 'UNGVIEN',
      trangThai: 'HOATDONG',
      deletedAt: null,
    });

    await service.forgotPassword({ email: 'google.user@gmail.com' });

    expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    expect(mailerService.sendMail).toHaveBeenCalledTimes(1);
    expect(mailerService.sendMail.mock.calls[0][0].subject).toContain('Google');
  });

  it('forgotPassword không gửi mail với email không tồn tại hoặc tài khoản ADMIN', async () => {
    prisma.taiKhoan.findUnique.mockResolvedValue(null);
    await service.forgotPassword({ email: 'missing@viecngon.vn' });

    prisma.taiKhoan.findUnique.mockResolvedValue({
      maTaiKhoan: 'tk-admin',
      email: 'admin@viecngon.vn',
      vaiTro: 'ADMIN',
      trangThai: 'HOATDONG',
      deletedAt: null,
    });
    await service.forgotPassword({ email: 'admin@viecngon.vn' });

    expect(mailerService.sendMail).not.toHaveBeenCalled();
  });

  it('resetPassword đổi mật khẩu thành công khi token hợp lệ và chặn khi token hết hạn hoặc đã dùng', async () => {
    prisma.passwordResetToken.findUnique.mockResolvedValue({
      maToken: 'rt-1',
      maTaiKhoan: 'tk-1',
      usedAt: null,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      taiKhoan: {
        maTaiKhoan: 'tk-1',
        vaiTro: 'UNGVIEN',
        trangThai: 'HOATDONG',
        deletedAt: null,
      },
    });
    prisma.passwordResetToken.updateMany.mockResolvedValue({ count: 1 });
    prisma.taiKhoan.update.mockResolvedValue({ maTaiKhoan: 'tk-1' });

    const ok = await service.resetPassword({
      token: 'raw-token-abc',
      newPassword: 'NewPassword123!',
    });
    expect(ok.role).toBe('UNGVIEN');
    expect(prisma.taiKhoan.update).toHaveBeenCalledTimes(1);

    prisma.passwordResetToken.findUnique.mockResolvedValue({
      maToken: 'rt-exp',
      maTaiKhoan: 'tk-1',
      usedAt: new Date(),
      expiresAt: new Date(Date.now() + 60_000),
      taiKhoan: {
        maTaiKhoan: 'tk-1',
        vaiTro: 'UNGVIEN',
        trangThai: 'HOATDONG',
        deletedAt: null,
      },
    });

    await expect(
      service.resetPassword({
        token: 'raw-token-abc',
        newPassword: 'NewPassword123!',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
