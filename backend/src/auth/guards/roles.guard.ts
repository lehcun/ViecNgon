import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthUser } from './jwt-auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: AuthUser }>();

    if (!user) {
      return false;
    }

    if (!requiredRoles.includes(user.role)) {
      return false;
    }

    // Chặn Nhà tuyển dụng chưa kích hoạt truy cập các API nghiệp vụ NTD
    if (
      user.role === 'NHATUYENDUNG' &&
      requiredRoles.includes('NHATUYENDUNG') &&
      (user.status === 'CHUAKICHHOAT' || user.status === 'CHODUYET')
    ) {
      throw new ForbiddenException(
        'Tài khoản Nhà tuyển dụng của bạn đang chờ Quản trị viên kích hoạt.',
      );
    }

    return true;
  }
}
