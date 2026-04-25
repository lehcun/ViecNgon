import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import express from 'express';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: number; // Thường dùng sub để lưu ID
  email: string;
  role?: string; // Có thể có hoặc không
  iat?: number; // Thời gian tạo token (thư viện tự thêm)
  exp?: number; // Thời gian hết hạn (thư viện tự thêm)
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('me')
  async getProfile(@Req() req: express.Request) {
    const cookies = req.cookies as Record<string, string> | undefined;
    const token = cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      return payload;
    } catch {
      throw new UnauthorizedException(
        'Token không hợp lệ hoặc đã hết hạn & err: ',
      );
    }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    // Xóa cookie chứa token
    res.clearCookie('access_token', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
    return { message: 'Đăng xuất thành công' };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, user } = await this.authService.login(loginDto);

    console.log('access_token: ', access_token);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { message: 'Đăng nhập thành công', user };
  }
}
