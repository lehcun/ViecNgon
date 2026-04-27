import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

export interface AuthUser {
  maTaiKhoan: string;
  vaiTro: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Kích hoạt logic xác thực của Strategy bên trên
    return super.canActivate(context);
  }

  // Xử lý kết quả sau khi Strategy chạy xong
  handleRequest<TUser = AuthUser>(err: any, user: TUser) {
    // Nếu có lỗi, hoặc không có user (do token sai, hết hạn, hoặc không có cookie)
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException(
          'Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn!',
        )
      );
    }
    // Trả về user để NestJS tự động nhét vào đối tượng request (req.user)
    return user;
  }
}
