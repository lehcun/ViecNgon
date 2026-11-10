import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from './roles.decorator';

/**
 * Decorator tiện ích bảo vệ toàn bộ API thuộc phân hệ Quản trị viên (Admin).
 * Tự động kích hoạt:
 * 1. JwtAuthGuard: Bắt buộc đăng nhập & xác thực JWT qua Cookie/Bearer.
 * 2. RolesGuard + @Roles('ADMIN'): Đảm bảo tài khoản mang role ADMIN.
 */
export function AdminOnly() {
  return applyDecorators(
    UseGuards(JwtAuthGuard, RolesGuard),
    Roles('ADMIN'),
  );
}

