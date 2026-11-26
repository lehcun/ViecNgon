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
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import express from 'express';
import { JwtService } from '@nestjs/jwt';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterEmployerDto } from './dto/register-employer.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string;
  tenNguoiDung?: string;
  role?: string;
  status?: string;
  iat?: number;
  exp?: number;
}

type SameSiteOption = 'lax' | 'strict' | 'none';

function resolveSameSite(isProd: boolean): SameSiteOption {
  const raw = process.env.COOKIE_SAME_SITE?.trim().toLowerCase();
  if (raw === 'lax' || raw === 'strict' || raw === 'none') {
    return raw;
  }
  return isProd ? 'none' : 'lax';
}

function getBaseCookieOptions(): express.CookieOptions {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite = resolveSameSite(isProd);
  const domain = process.env.COOKIE_DOMAIN?.trim() || undefined;

  return {
    httpOnly: true,
    secure: isProd || sameSite === 'none',
    sameSite,
    path: '/',
    ...(domain ? { domain } : {}),
  };
}

function getAuthCookieOptions(): express.CookieOptions {
  return {
    ...getBaseCookieOptions(),
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 ngày
  };
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Get('me')
  async getProfile(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const cookies = req.cookies as Record<string, string> | undefined;
    const token = cookies?.['access_token'];

    if (!token) {
      throw new UnauthorizedException('Chưa đăng nhập');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (!payload?.sub) {
        throw new UnauthorizedException('Token không hợp lệ');
      }
      const user = await this.authService.getMeProfile(payload.sub);

      // Đồng bộ lại cookie JWT nếu Admin vừa kích hoạt tài khoản hoặc thay đổi vai trò
      if (user.status !== payload.status || user.role !== payload.role) {
        const refreshedToken = await this.jwtService.signAsync({
          sub: user.id,
          role: user.role,
          status: user.status,
          name: user.name,
          email: user.email,
        });
        res.cookie('access_token', refreshedToken, getAuthCookieOptions());
      }

      return {
        ...user,
        exp: payload.exp,
        iat: payload.iat,
      };
    } catch {
      res.clearCookie('access_token', getBaseCookieOptions());
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn');
    }
  }

  // Đăng xuất
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    // Xóa cookie chứa token với đúng thuộc tính (sameSite/secure/domain)
    res.clearCookie('access_token', getBaseCookieOptions());
    return { message: 'Đăng xuất thành công' };
  }

  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, user } = await this.authService.login(loginDto);

    res.cookie('access_token', access_token, getAuthCookieOptions());

    return { message: 'Đăng nhập thành công', user, access_token };
  }

  // Đăng ký cho Ứng viên (Public)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('register/candidate')
  async registerCandidate(
    @Body() dto: RegisterCandidateDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, user } =
      await this.authService.registerCandidate(dto);

    res.cookie('access_token', access_token, getAuthCookieOptions());

    return { message: 'Đăng ký tài khoản thành công', user };
  }

  // Đăng ký cho HR (Public - Admin-Managed Onboarding)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('register/employer')
  async registerEmployer(
    @Body() dto: RegisterEmployerDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, pendingApproval, user } =
      await this.authService.registerEmployer(dto);

    // Chỉ cấp cookie đăng nhập nếu tài khoản đã ở trạng thái hoạt động
    if (!pendingApproval) {
      res.cookie('access_token', access_token, getAuthCookieOptions());
    }

    return {
      message: pendingApproval
        ? 'Đăng ký doanh nghiệp thành công! Hồ sơ của bạn đang chờ Quản trị viên xét duyệt.'
        : 'Đăng ký nhà tuyển dụng thành công',
      pendingApproval,
      user,
    };
  }

  // ==========================================
  // OAUTH2: ĐĂNG KÝ BẰNG GOOGLE (Dành cho Ứng viên)
  // ==========================================
  @Post('google/register')
  async googleRegister(
    @Body() dto: GoogleAuthDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, user } = await this.authService.googleRegister(dto);

    res.cookie('access_token', access_token, getAuthCookieOptions());

    return { message: 'Đăng ký tài khoản bằng Google thành công', user };
  }

  // ==========================================
  // OAUTH2: ĐĂNG NHẬP BẰNG GOOGLE
  // ==========================================
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('google/login')
  async googleLogin(
    @Body() dto: GoogleAuthDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { access_token, user } = await this.authService.googleLogin(dto);

    res.cookie('access_token', access_token, getAuthCookieOptions());

    return { message: 'Đăng nhập bằng Google thành công', user };
  }

  // ==========================================
  // QUÊN MẬT KHẨU & ĐẶT LẠI MẬT KHẨU QUA EMAIL
  // ==========================================
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('forgot-password')
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(dto);
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return await this.authService.resetPassword(dto);
  }

  // ==========================================
  // ĐỔI MẬT KHẨU
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  async changePassword(
    @CurrentUser() user: { id: string }, // Lấy thông tin user đã được Guard giải mã từ Cookie
    @Body() dto: ChangePasswordDto,
  ) {
    // Gọi Service xử lý bằng maTaiKhoan lấy trực tiếp từ Token, an toàn tuyệt đối trước việc giả mạo ID[cite: 4]
    return await this.authService.changePassword(user.id, dto);
  }
}
