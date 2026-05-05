import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthUser } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector là một class tiện ích của NestJS dùng để đọc Metadata
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách các quyền được phép truy cập từ Decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // Lấy ở mức hàm (Method)
        context.getClass(), // Lấy ở mức lớp (Controller)
      ],
    );

    // Nếu API này không gắn @Roles(), tức là ai cũng vào được (Public hoặc chỉ cần đăng nhập)
    if (!requiredRoles) {
      return true;
    }

    // 2. Lấy thông tin user từ Request
    // (Thông tin user này đã được giải mã từ Token bởi JwtAuthGuard chạy ngay trước đó)
    const { user } = context.switchToHttp().getRequest<{ user: AuthUser }>();

    // Nếu không có user (chưa đăng nhập), chặn luôn
    if (!user) {
      return false;
    }

    // 3. Kiểm tra xem role của user hiện tại có nằm trong danh sách quyền được phép không
    return requiredRoles.includes(user.role);
  }
}
