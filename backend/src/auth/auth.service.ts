import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { LoginDto } from './dto/login.dto';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterEmployerDto } from './dto/register-employer.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

interface GoogleJwtPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  // Helper dùng chung: Lấy Profile Ứng viên từ Google bằng Access Token
  private async getGoogleUserInfo(accessToken: string) {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        throw new UnauthorizedException(
          'Access Token Google không hợp lệ hoặc đã hết hạn!',
        );
      }

      const payload = (await res.json()) as GoogleJwtPayload;

      if (!payload) {
        throw new UnauthorizedException(
          'Không lấy được thông tin email từ tài khoản Google!',
        );
      }

      return payload;
    } catch (error) {
      throw new UnauthorizedException('Xác thực Google Token thất bại!');
    }
  }

  // -------------------------------------------------------------
  // 1. ĐĂNG KÝ BẰNG GOOGLE (Chỉ dành cho Ứng viên)
  // -------------------------------------------------------------
  async googleRegister(dto: GoogleAuthDto) {
    const googlePayload = await this.getGoogleUserInfo(dto.accessToken);

    const email = googlePayload.email;
    const name = googlePayload.name || 'Ứng viên Google';
    const picture = googlePayload.picture || null;
    const googleId = googlePayload.sub;

    const existingUser = await this.prisma.taiKhoan.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException(
        'Email này đã được đăng ký trên hệ thống. Vui lòng bấm Đăng nhập!',
      );
    }

    // Tạo TaiKhoan và UngVien Profile bằng Transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      const account = await tx.taiKhoan.create({
        data: {
          email,
          tenNguoiDung: name,
          matKhau: '', // Đăng ký Google không có mật khẩu local, truyền chuỗi rỗng để thỏa mãn db.VarChar(255) Not Null
          googleId,
          provider: 'GOOGLE',
          vaiTro: 'UNGVIEN',
          trangThai: 'HOATDONG',
        },
      });

      await tx.ungVien.create({
        data: {
          maTaiKhoan: account.maTaiKhoan,
          tenUngVien: name,
          avatarUrl: picture,
          chuyenMon: 'Chưa cập nhật',
          cvUrl: '',
        },
      });

      return account;
    });

    const payload = {
      sub: newUser.maTaiKhoan,
      role: newUser.vaiTro,
      name: newUser.tenNguoiDung,
      email: email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: newUser.maTaiKhoan,
        sub: newUser.maTaiKhoan,
        email: email,
        name: newUser.tenNguoiDung,
        role: newUser.vaiTro,
        status: newUser.trangThai,
      },
    };
  }

  // -------------------------------------------------------------
  // 2. ĐĂNG NHẬP BẰNG GOOGLE (Dành cho Ứng viên)
  // -------------------------------------------------------------
  async googleLogin(dto: GoogleAuthDto) {
    const googlePayload = await this.getGoogleUserInfo(dto.accessToken);

    const email = googlePayload.email;
    const googleId = googlePayload.sub;

    let user = await this.prisma.taiKhoan.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException(
        'Tài khoản Google này chưa đăng ký. Vui lòng bấm Đăng ký trước!',
      );
    }

    if (!user.googleId) {
      user = await this.prisma.taiKhoan.update({
        where: { maTaiKhoan: user.maTaiKhoan },
        data: { googleId, provider: 'GOOGLE' },
      });
    }

    if (user.trangThai === 'KHOA' || user.trangThai === 'INACTIVE') {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa!');
    }

    const payload = {
      sub: user.maTaiKhoan,
      role: user.vaiTro,
      name: user.tenNguoiDung,
      email: email,
    };

    console.log(payload);

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.maTaiKhoan,
        sub: user.maTaiKhoan,
        email: email,
        name: user.tenNguoiDung,
        role: user.vaiTro,
        status: user.trangThai,
      },
    };
  }

  async login(loginDto: LoginDto) {
    // 1. Tìm tài khoản theo Email
    const user = await this.prisma.taiKhoan.findUnique({
      where: { email: loginDto.email },
    });

    // Trường hợp 1: Email chưa tồn tại trong hệ thống
    if (!user) {
      throw new UnauthorizedException(
        'Email chưa tồn tại. Vui lòng đăng ký tài khoản!',
      );
    }

    // Trường hợp 2: Tài khoản đã đăng ký bằng Google
    // (matKhau là null / rỗng hoặc trường provider là GOOGLE)
    if (!user.matKhau || user.provider === 'GOOGLE') {
      throw new BadRequestException(
        'Mail này đã được dùng để đăng ký bằng google',
      );
    }

    // 2. Kiểm tra mật khẩu mã hóa bằng bcrypt
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.matKhau,
    );

    // Trường hợp 3: Sai mật khẩu
    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không chính xác!');
    }

    // 3. Tạo Payload cho JWT (Chỉ lưu thông tin cơ bản, không lưu mật khẩu)
    const payload = {
      sub: user.maTaiKhoan,
      role: user.vaiTro,
      name: user.tenNguoiDung,
      email: user.email,
    };

    // 4. Trả về Token và thông tin user (loại bỏ mật khẩu)
    const { matKhau, ...userInfo } = user;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: userInfo.maTaiKhoan,
        sub: userInfo.maTaiKhoan,
        email: userInfo.email,
        name: userInfo.tenNguoiDung,
        role: userInfo.vaiTro,
        status: userInfo.trangThai,
      },
    };
  }

  //1. Đăng ký dành cho ứng viên
  async registerCandidate(signupDto: RegisterCandidateDto) {
    const { email, password, name } = signupDto;

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.taiKhoan.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng!');
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo tài khoản VÀ Profile tương ứng bằng Transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      // B1: Tạo bản ghi trong bảng TaiKhoan
      const account = await tx.taiKhoan.create({
        data: {
          email,
          matKhau: hashedPassword,
          tenNguoiDung: name,
          vaiTro: 'UNGVIEN',
          trangThai: 'HOATDONG',
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

    const payload = {
      sub: newUser.maTaiKhoan,
      role: newUser.vaiTro,
      name: newUser.tenNguoiDung,
      email: newUser.email,
    };

    const { matKhau, ...userInfo } = newUser;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: userInfo.maTaiKhoan,
        sub: userInfo.maTaiKhoan,
        email: userInfo.email,
        name: userInfo.tenNguoiDung,
        role: userInfo.vaiTro,
        status: userInfo.trangThai,
      },
    };
  }

  // 2. Đăng ký Nhà tuyển dụng (HR)
  async registerEmployer(signupDto: RegisterEmployerDto) {
    const email = signupDto.email;
    const password = signupDto.password;
    const name = signupDto.employerName;
    const companyName = signupDto.companyName;
    const maCongTyInput = signupDto.maCongTy;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.taiKhoan.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng trên hệ thống!');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo tài khoản, Công ty (nếu mới) VÀ Profile NTD bằng \$transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      // B1: Tạo bản ghi trong bảng TaiKhoan
      const account = await tx.taiKhoan.create({
        data: {
          email,
          matKhau: hashedPassword,
          tenNguoiDung: name,
          vaiTro: 'NHATUYENDUNG',
          trangThai: 'CHODUYET',
        },
      });

      // B2: Xử lý Công ty
      let targetCompanyId = maCongTyInput;

      // Nếu HR không chọn công ty có sẵn -> Tự động tạo Công ty mới từ tên công ty nhập vào
      if (!targetCompanyId) {
        if (!companyName) {
          throw new BadRequestException(
            'Vui lòng chọn công ty hoặc nhập tên công ty của bạn!',
          );
        }

        // Tạo slug chuẩn SEO cho công ty mới
        const slug =
          companyName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-') + `-${Date.now().toString().slice(-4)}`;

        const newCompany = await tx.congTy.create({
          data: {
            tenCongTy: companyName,
            slug,
          },
        });
        targetCompanyId = newCompany.maCongTy;
      }

      // B3: Tạo hồ sơ Nhà Tuyển Dụng liên kết với TaiKhoan và CongTy
      await tx.nhaTuyenDung.create({
        data: {
          maTaiKhoan: account.maTaiKhoan,
          maCongTy: targetCompanyId,
        },
      });

      return account;
    });

    const payload = {
      sub: newUser.maTaiKhoan,
      role: newUser.vaiTro,
      name: newUser.tenNguoiDung,
      email: newUser.email,
    };

    const { matKhau, ...userInfo } = newUser;

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: userInfo.maTaiKhoan,
        sub: userInfo.maTaiKhoan,
        email: userInfo.email,
        name: userInfo.tenNguoiDung,
        role: userInfo.vaiTro,
        status: userInfo.trangThai,
      },
    };
  }

  async changePassword(maTaiKhoan: string, dto: ChangePasswordDto) {
    // 1. Tìm tài khoản trong Database
    const user = await this.prisma.taiKhoan.findUnique({
      where: { maTaiKhoan },
    });

    if (!user) {
      throw new NotFoundException('Tài khoản không tồn tại trên hệ thống!');
    }

    // 2. Chặn đổi mật khẩu nếu là tài khoản đăng nhập bằng Google
    if (user.provider === 'GOOGLE' || !user.matKhau) {
      throw new BadRequestException(
        'Tài khoản Google không hỗ trợ tính năng đổi mật khẩu!',
      );
    }

    // 3. Kiểm tra mật khẩu cũ có khớp với DB hay không
    const isPasswordValid = await bcrypt.compare(dto.matKhauCu, user.matKhau);
    if (!isPasswordValid) {
      throw new BadRequestException('Mật khẩu hiện tại không chính xác!');
    }

    // 4. Băm (Hash) mật khẩu mới trước khi lưu
    const hashedNewPassword = await bcrypt.hash(dto.matKhauMoi, 10);

    // 5. Cập nhật mật khẩu mới vào Database
    await this.prisma.taiKhoan.update({
      where: { maTaiKhoan },
      data: { matKhau: hashedNewPassword },
    });

    return { message: 'Đổi mật khẩu thành công!' };
  }
}
