import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

interface payloadType {
  sub: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // BÍ QUYẾT Ở ĐÂY: Viết một hàm tự động lấy Token từ Cookie
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies['access_token'] as string | null;
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  // Hàm này chỉ chạy khi Token hợp lệ. Nó sẽ nhét dữ liệu vào req.user
  validate(payload: payloadType) {
    // payload chính là dữ liệu bạn đã nhét vào token lúc login (vd: sub(maTaiKhoan), vaiTro)
    return {
      maTaiKhoan: payload.sub,
      vaiTro: payload.role,
    };
  }
}
