import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // 1. Tìm tài khoản theo Email
    const user = await this.prisma.taiKhoan.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 2. Kiểm tra mật khẩu (giả định mật khẩu trong DB đã được hash bằng bcrypt)
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.matKhau,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 3. Tạo Payload cho JWT (Chỉ lưu thông tin cơ bản, KHÔNG lưu mật khẩu)
    const payload = {
      sub: user.maTaiKhoan,
      email: user.email,
      role: user.vaiTro,
    };

    // 4. Trả về Token và thông tin user (loại bỏ mật khẩu)
    const { matKhau, ...userInfo } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userInfo,
    };
  }
}
