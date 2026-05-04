import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

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
      role: user.vaiTro,
      name: user.tenNguoiDung,
      email: user.email,
      // avatarUrl: user.avatarUrl,
    };

    // 4. Trả về Token và thông tin user (loại bỏ mật khẩu)
    const { matKhau, ...userInfo } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userInfo,
    };
  }

  //Chỉ dành cho ứng viên
  async signup(signupDto: SignupDto) {
    const { email, password, name, role } = signupDto;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.taiKhoan.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    // 2. Hash password (độ mặn là 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo tài khoản VÀ Profile tương ứng bằng Transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      // B1: Tạo bản ghi trong bảng TaiKhoan
      const account = await tx.taiKhoan.create({
        data: {
          email,
          matKhau: hashedPassword,
          tenNguoiDung: name,
          vaiTro: role,
          trangThai: 'HOATDONG', // Cấp trạng thái mặc định
        },
      });

      // B2: Khởi tạo Profile tương ứng dựa vào Role

      await tx.ungVien.create({
        data: {
          maTaiKhoan: account.maTaiKhoan,
          tenUngVien: name,
          chuyenMon: 'Chưa cập nhật',
          cvUrl: '',
        },
      });

      return account;
    });

    // 4. Tạo Payload cho JWT giống hệt lúc Login
    const payload = {
      sub: newUser.maTaiKhoan,
      role: newUser.vaiTro,
      name: newUser.tenNguoiDung,
      email: newUser.email,
    };

    const { matKhau, ...userInfo } = newUser;

    // 5. Trả về y hệt hàm login
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: userInfo.maTaiKhoan,
        email: userInfo.email,
        name: userInfo.tenNguoiDung,
        role: userInfo.vaiTro,
        status: userInfo.trangThai,
      },
    };
  }
}
