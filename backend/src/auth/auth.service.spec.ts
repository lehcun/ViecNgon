import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { createPrismaMock } from 'src/test/prisma-mock.util';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: ReturnType<typeof createPrismaMock>;

  beforeEach(async () => {
    prisma = createPrismaMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
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
      avatarUrl: 'https://res.cloudinary.com/demo/avatar.png',
    });
  });

  it('getMeProfile ném UnauthorizedException khi tài khoản không còn trong DB (sau khi re-seed)', async () => {
    prisma.taiKhoan.findUnique.mockResolvedValue(null);
    await expect(service.getMeProfile('old-uuid')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
