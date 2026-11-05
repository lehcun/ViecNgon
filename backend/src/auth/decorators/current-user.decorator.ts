import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../guards/jwt-auth.guard';

/**
 * Các thuộc tính có thể trích xuất từ user đã xác thực
 * 'userId' là bí danh thân thiện của 'id' (maTaiKhoan)
 */
export type CurrentUserField = keyof AuthUser | 'userId';

/**
 * Custom Decorator trích xuất thông tin user từ JWT Payload (HttpOnly Cookie)
 * - `@CurrentUser()`          => Trả về toàn bộ AuthUser { id, role, ... }
 * - `@CurrentUser('userId')`  => Trả về maTaiKhoan (string)
 * - `@CurrentUser('role')`    => Trả về role (string)
 */
export const CurrentUser = createParamDecorator(
  (
    data: CurrentUserField | undefined,
    ctx: ExecutionContext,
  ): AuthUser | AuthUser[keyof AuthUser] | string => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    const user = request.user;

    if (!user) return undefined as unknown as string;
    if (!data) return user;
    if (data === 'userId') return user.id;
    return user[data as keyof AuthUser] as string;
  },
);
