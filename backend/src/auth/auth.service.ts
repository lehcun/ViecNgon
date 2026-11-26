import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { MailerService } from '@nestjs-modules/mailer';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { LoginDto } from './dto/login.dto';
import { RegisterCandidateDto } from './dto/register-candidate.dto';
import { RegisterEmployerDto } from './dto/register-employer.dto';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import {
  fieldBadRequest,
  fieldUnauthorized,
} from '../common/exceptions/field-validation.exception';

interface GoogleJwtPayload {
  sub: string;
  email: string;
  name?: string;
  picture?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  constructor(
    private readonly prisma: PrismaService,
    private jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  private normalizeAccountStatus(
    status: string,
  ): 'HOATDONG' | 'KHOA' | 'CHUAKICHHOAT' {
    if (status === 'HOATDONG' || status === 'KHOA') {
      return status;
    }
    return 'CHUAKICHHOAT';
  }

  private truncateText(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
  }

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
    } catch {
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
      status: this.normalizeAccountStatus(newUser.trangThai),
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

    if (user.vaiTro !== 'UNGVIEN') {
      throw new UnauthorizedException(
        'Đăng nhập bằng Google chỉ dành cho tài khoản Ứng viên. Vui lòng sử dụng cổng đăng nhập đúng vai trò!',
      );
    }

    if (user.trangThai === 'KHOA') {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa!');
    }
    if (user.trangThai === 'CHUAKICHHOAT') {
      throw new UnauthorizedException(
        'Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên!',
      );
    }

    const payload = {
      sub: user.maTaiKhoan,
      role: user.vaiTro,
      status: this.normalizeAccountStatus(user.trangThai),
      name: user.tenNguoiDung,
      email: email,
    };

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
    const normalizedEmail = loginDto.email.trim().slice(0, 100);

    // 1. Tìm tài khoản theo Email
    const user = await this.prisma.taiKhoan.findUnique({
      where: { email: normalizedEmail },
    });

    // Trường hợp 1: Email chưa tồn tại trong hệ thống
    if (!user) {
      throw fieldUnauthorized({
        email: 'Email chưa tồn tại. Vui lòng đăng ký tài khoản!',
      });
    }

    // Trường hợp 2: Tài khoản đã đăng ký bằng Google
    // (matKhau là null / rỗng hoặc trường provider là GOOGLE)
    if (!user.matKhau || user.provider === 'GOOGLE') {
      throw fieldBadRequest({
        email: 'Mail này đã được dùng để đăng ký bằng google',
      });
    }

    // 2. Kiểm tra mật khẩu mã hóa bằng bcrypt
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.matKhau,
    );

    // Trường hợp 3: Sai mật khẩu
    if (!isPasswordValid) {
      throw fieldUnauthorized({
        password: 'Mật khẩu không chính xác!',
      });
    }

    // Trường hợp 3.5: Sai cổng đăng nhập theo vai trò
    if (loginDto.expectedRole && user.vaiTro !== loginDto.expectedRole) {
      const roleMessages: Record<'UNGVIEN' | 'NHATUYENDUNG' | 'ADMIN', string> =
        {
          UNGVIEN:
            'Tài khoản này không phải Ứng viên. Vui lòng đăng nhập tại cổng Nhà tuyển dụng hoặc Quản trị viên!',
          NHATUYENDUNG:
            'Tài khoản này không có quyền truy cập cổng Nhà tuyển dụng!',
          ADMIN:
            'Tài khoản này không có quyền truy cập cổng Quản trị viên (ADMIN)!',
        };
      throw new UnauthorizedException(roleMessages[loginDto.expectedRole]);
    }

    // Trường hợp 4: Tài khoản bị khóa hoặc chưa kích hoạt
    const normalizedStatus = this.normalizeAccountStatus(user.trangThai);
    if (user.deletedAt || normalizedStatus === 'KHOA') {
      throw new UnauthorizedException(
        'Tài khoản của bạn đã bị khóa do vi phạm chính sách hệ thống.',
      );
    }
    // Nhà tuyển dụng chưa kích hoạt vẫn được đăng nhập để duyệt web như khách vãng lai (kèm banner chờ duyệt)
    if (normalizedStatus === 'CHUAKICHHOAT' && user.vaiTro !== 'NHATUYENDUNG') {
      throw new UnauthorizedException(
        'Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên!',
      );
    }

    // 3. Tạo Payload cho JWT (Chỉ lưu thông tin cơ bản, không lưu mật khẩu)
    const payload = {
      sub: user.maTaiKhoan,
      role: user.vaiTro,
      status: normalizedStatus,
      name: user.tenNguoiDung,
      email: user.email,
    };

    // 4. Trả về Token và thông tin user (loại bỏ mật khẩu)
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.maTaiKhoan,
        sub: user.maTaiKhoan,
        email: user.email,
        name: user.tenNguoiDung,
        role: user.vaiTro,
        status: normalizedStatus,
      },
    };
  }

  //1. Đăng ký dành cho ứng viên
  async registerCandidate(signupDto: RegisterCandidateDto) {
    const email = signupDto.email.trim().slice(0, 100);
    const password = signupDto.password;
    const name = (signupDto.name || signupDto.hoTen || '').trim().slice(0, 100);

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.taiKhoan.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw fieldBadRequest({ email: 'Email này đã được sử dụng!' });
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
      status: this.normalizeAccountStatus(newUser.trangThai),
      name: newUser.tenNguoiDung,
      email: newUser.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: newUser.maTaiKhoan,
        sub: newUser.maTaiKhoan,
        email: newUser.email,
        name: newUser.tenNguoiDung,
        role: newUser.vaiTro,
        status: newUser.trangThai,
      },
    };
  }

  private normalizeWebsiteUrl(raw?: string): string | null {
    const trimmed = raw?.trim();
    if (!trimmed) return null;
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    return withProtocol.slice(0, 100);
  }

  private buildCompanySlug(companyName: string): string {
    const base = companyName
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const suffix = `${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 89)}`;
    return `${(base || 'cong-ty').slice(0, 185)}-${suffix}`;
  }

  private async sendEmployerPendingEmail(
    email: string,
    employerName: string,
    companyName: string,
  ): Promise<void> {
    const frontendUrl =
      process.env.FRONTEND_URL?.trim() || 'http://localhost:3000';
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: `[ViecNgon] Đã tiếp nhận hồ sơ doanh nghiệp ${companyName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2 style="color: #0f172a;">Xin chào ${employerName},</h2>
            <p>Cảm ơn bạn đã đăng ký tài khoản Nhà tuyển dụng cho doanh nghiệp <strong>${companyName}</strong> trên <strong>ViecNgon</strong>.</p>
            <p>Hồ sơ doanh nghiệp của bạn đã được chuyển tới Quản trị viên để xác thực thông tin (dự kiến trong vòng 24 giờ làm việc).</p>
            <p>Ngay khi tài khoản được kích hoạt, chúng tôi sẽ gửi email thông báo để bạn có thể đăng nhập tại <a href="${frontendUrl}/employer/login" style="color: #2563eb; font-weight: 600;">Cổng Nhà tuyển dụng ViecNgon</a>.</p>
            <p style="margin-top: 24px; font-size: 13px; color: #64748b;">Cần hỗ trợ nhanh? Liên hệ love@viecngon.vn hoặc hotline 1900 6868.</p>
          </div>
        `,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown SMTP error';
      this.logger.warn(
        `Không thể gửi email xác nhận đăng ký NTD tới ${email}: ${msg}`,
      );
    }
  }

  // 2. Đăng ký Nhà tuyển dụng (HR - Admin-Managed Onboarding)
  async registerEmployer(signupDto: RegisterEmployerDto) {
    const email = signupDto.email.trim().toLowerCase().slice(0, 100);
    const password = signupDto.password;
    const name = signupDto.employerName.trim().slice(0, 100);
    const phone = signupDto.phone?.trim().slice(0, 20) || null;
    const title = signupDto.title?.trim().slice(0, 100) || null;
    const companyName = signupDto.companyName
      .trim()
      .replace(/\s+/g, ' ')
      .slice(0, 150);
    const location = signupDto.location?.trim().slice(0, 100) || null;
    const address = signupDto.address?.trim().slice(0, 255) || null;
    const website = this.normalizeWebsiteUrl(signupDto.website);
    const companyModel = signupDto.companyModel?.trim().slice(0, 100) || null;
    const companySize = signupDto.companySize?.trim().slice(0, 100) || null;
    const maCongTyInput = signupDto.maCongTy?.trim();

    // 1. Kiểm tra email đã tồn tại chưa
    const existingUser = await this.prisma.taiKhoan.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw fieldBadRequest({
        email: 'Email này đã được sử dụng trên hệ thống!',
      });
    }

    // 2. Nếu đăng ký doanh nghiệp mới: kiểm tra chống trùng tên công ty (mô hình ITviec / Admin-Managed)
    if (!maCongTyInput) {
      if (!companyName) {
        throw fieldBadRequest({
          companyName: 'Vui lòng nhập tên công ty của bạn!',
        });
      }

      const existingCompany = await this.prisma.congTy.findFirst({
        where: {
          tenCongTy: companyName,
          deletedAt: null,
        },
        select: { maCongTy: true },
      });

      if (existingCompany) {
        throw fieldBadRequest({
          companyName:
            'Doanh nghiệp này đã có tài khoản trên ViecNgon. Để cấp thêm tài khoản HR cho công ty, vui lòng liên hệ quản trị viên ViecNgon (love@viecngon.vn).',
        });
      }
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo tài khoản, Công ty, Chi nhánh chính, Profile NTD & Thông báo Admin trong $transaction
    const created = await this.prisma.$transaction(async (tx) => {
      // B1: Tạo bản ghi trong bảng TaiKhoan (mặc định CHUAKICHHOAT để chờ Admin duyệt)
      const account = await tx.taiKhoan.create({
        data: {
          email,
          matKhau: hashedPassword,
          tenNguoiDung: name,
          sdt: phone,
          vaiTro: 'NHATUYENDUNG',
          trangThai: 'CHUAKICHHOAT',
        },
      });

      // B2: Xử lý Công ty
      let targetCompanyId = maCongTyInput;
      let resolvedCompanyName = companyName;
      let resolvedCompanySlug = '';

      if (!targetCompanyId) {
        let slug = this.buildCompanySlug(companyName);
        const slugCollision = await tx.congTy.findUnique({
          where: { slug },
          select: { maCongTy: true },
        });
        if (slugCollision) {
          slug = `${slug.slice(0, 188)}-${randomBytes(3).toString('hex')}`;
        }

        const newCompany = await tx.congTy.create({
          data: {
            tenCongTy: companyName,
            slug,
            thanhPho: location,
            diaChi: address,
            website,
            moHinhCongTy: companyModel,
            quyMo: companySize,
          },
        });
        targetCompanyId = newCompany.maCongTy;
        resolvedCompanyName = newCompany.tenCongTy;
        resolvedCompanySlug = newCompany.slug;

        if (location) {
          await tx.chiNhanh.create({
            data: {
              maCongTy: targetCompanyId,
              thanhPho: location,
              diaChi: address || location,
            },
          });
        }
      } else {
        const existingComp = await tx.congTy.findUnique({
          where: { maCongTy: targetCompanyId },
          select: { tenCongTy: true, slug: true },
        });
        if (!existingComp) {
          throw fieldBadRequest({
            companyName: 'Không tìm thấy doanh nghiệp đã chọn.',
          });
        }
        resolvedCompanyName = existingComp.tenCongTy;
        resolvedCompanySlug = existingComp.slug;
      }

      // B3: Tạo hồ sơ Nhà Tuyển Dụng liên kết với TaiKhoan và CongTy
      await tx.nhaTuyenDung.create({
        data: {
          maTaiKhoan: account.maTaiKhoan,
          maCongTy: targetCompanyId,
          hoTen: name,
          chucVu: title,
          soDienThoai: phone,
          vaiTroTrongCongTy: maCongTyInput ? 'RECRUITER' : 'OWNER',
        },
      });

      // B4: Gửi thông báo cho toàn bộ Quản trị viên đang hoạt động để duyệt kích hoạt
      const activeAdmins = await tx.taiKhoan.findMany({
        where: {
          vaiTro: 'ADMIN',
          trangThai: 'HOATDONG',
          deletedAt: null,
        },
        select: { maTaiKhoan: true },
      });

      if (activeAdmins.length > 0) {
        const companyLabel = resolvedCompanyName || 'Doanh nghiệp mới';
        const tieuDe = this.truncateText(
          `Nhà tuyển dụng mới chờ duyệt: ${companyLabel}`,
          255,
        );
        const detailParts = [
          `Người đại diện: ${name}${title ? ` (${title})` : ''}`,
          `Email: ${email}`,
          phone ? `SĐT: ${phone}` : null,
          location ? `Địa điểm: ${location}` : null,
        ]
          .filter(Boolean)
          .join(' • ');

        const noiDung = `Doanh nghiệp ${companyLabel} vừa đăng ký tài khoản Nhà tuyển dụng (${detailParts}) và đang chờ Quản trị viên xét duyệt tại trang Quản lý người dùng.`;

        await tx.thongBao.createMany({
          data: activeAdmins.map((admin) => ({
            maTaiKhoan: admin.maTaiKhoan,
            tieuDe,
            noiDung,
            trangThai: 'CHUA_DOC',
          })),
        });
      }

      return {
        account,
        companyName: resolvedCompanyName,
        companySlug: resolvedCompanySlug,
      };
    });

    // 5. Gửi email xác nhận tiếp nhận hồ sơ (không block transaction nếu SMTP lỗi)
    await this.sendEmployerPendingEmail(
      created.account.email,
      created.account.tenNguoiDung,
      created.companyName,
    );

    const normalizedStatus = this.normalizeAccountStatus(
      created.account.trangThai,
    );

    const payload = {
      sub: created.account.maTaiKhoan,
      role: created.account.vaiTro,
      status: normalizedStatus,
      name: created.account.tenNguoiDung,
      email: created.account.email,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      pendingApproval: normalizedStatus === 'CHUAKICHHOAT',
      user: {
        id: created.account.maTaiKhoan,
        sub: created.account.maTaiKhoan,
        email: created.account.email,
        name: created.account.tenNguoiDung,
        role: created.account.vaiTro,
        status: normalizedStatus,
        companyName: created.companyName,
        companySlug: created.companySlug,
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
      throw fieldBadRequest({
        matKhauCu: 'Mật khẩu hiện tại không chính xác!',
      });
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

  /**
   * Lấy thông tin phiên đăng nhập hiện tại từ DB theo maTaiKhoan trong JWT.
   * Ngăn tình trạng cookie JWT cũ (sau khi re-seed DB hoặc tài khoản bị xóa/khóa) vẫn qua được /auth/me.
   */
  async getMeProfile(maTaiKhoan: string) {
    const account = await this.prisma.taiKhoan.findUnique({
      where: { maTaiKhoan },
      select: {
        maTaiKhoan: true,
        email: true,
        tenNguoiDung: true,
        vaiTro: true,
        trangThai: true,
        deletedAt: true,
        ungVien: {
          select: {
            avatarUrl: true,
            tenUngVien: true,
          },
        },
        nhaTuyenDung: {
          select: {
            hoTen: true,
            congTy: {
              select: {
                logoUrl: true,
              },
            },
          },
        },
      },
    });

    if (!account || account.deletedAt) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại hoặc phiên đăng nhập đã hết hiệu lực.',
      );
    }

    const normalizedStatus = this.normalizeAccountStatus(account.trangThai);
    if (
      normalizedStatus === 'KHOA' ||
      (normalizedStatus === 'CHUAKICHHOAT' && account.vaiTro !== 'NHATUYENDUNG')
    ) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại hoặc phiên đăng nhập đã hết hiệu lực.',
      );
    }

    return {
      id: account.maTaiKhoan,
      sub: account.maTaiKhoan,
      email: account.email,
      name:
        account.ungVien?.tenUngVien ||
        account.nhaTuyenDung?.hoTen ||
        account.tenNguoiDung,
      role: account.vaiTro,
      status: normalizedStatus,
      avatarUrl:
        account.ungVien?.avatarUrl ??
        account.nhaTuyenDung?.congTy?.logoUrl ??
        undefined,
    };
  }

  private hashResetToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  private getFrontendBaseUrl(): string {
    return (process.env.FRONTEND_URL || 'http://localhost:3000').replace(
      /\/+$/,
      '',
    );
  }

  private buildResetPasswordEmailHtml(params: {
    displayName: string;
    resetUrl: string;
    isEmployer: boolean;
  }): string {
    const portalLabel = params.isEmployer
      ? 'Nhà tuyển dụng ViecNgon'
      : 'Ứng viên ViecNgon';
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; color: #0f172a;">
        <div style="margin-bottom: 20px;">
          <span style="display: inline-block; padding: 6px 12px; border-radius: 8px; background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 14px;">ViecNgon • ${portalLabel}</span>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 20px; color: #0f172a;">Đặt lại mật khẩu tài khoản</h2>
        <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #334155;">
          Xin chào <strong>${params.displayName}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #334155;">
          Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng nhấn nút bên dưới để tạo mật khẩu mới (liên kết có hiệu lực trong <strong>15 phút</strong> và chỉ sử dụng được một lần):
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${params.resetUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 8px;">Đặt lại mật khẩu</a>
        </div>
        <p style="margin: 0 0 8px; font-size: 12px; color: #64748b;">Nếu nút không hoạt động, hãy sao chép đường dẫn sau vào trình duyệt:</p>
        <p style="margin: 0 0 20px; font-size: 12px; color: #2563eb; word-break: break-all;">${params.resetUrl}</p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.5;">
          Nếu bạn không gửi yêu cầu này, hãy bỏ qua email và không chia sẻ liên kết này với bất kỳ ai.
        </p>
      </div>
    `;
  }

  private buildGoogleReminderEmailHtml(params: {
    displayName: string;
    loginUrl: string;
  }): string {
    return `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; color: #0f172a;">
        <div style="margin-bottom: 20px;">
          <span style="display: inline-block; padding: 6px 12px; border-radius: 8px; background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 14px;">ViecNgon</span>
        </div>
        <h2 style="margin: 0 0 12px; font-size: 20px; color: #0f172a;">Tài khoản liên kết với Google</h2>
        <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6; color: #334155;">
          Xin chào <strong>${params.displayName}</strong>,
        </p>
        <p style="margin: 0 0 20px; font-size: 14px; line-height: 1.6; color: #334155;">
          Tài khoản ViecNgon của bạn được đăng ký thông qua Google nên không sử dụng mật khẩu riêng. Vui lòng quay lại trang đăng nhập và chọn nút <strong>Đăng nhập với Google</strong>.
        </p>
        <div style="margin: 24px 0; text-align: center;">
          <a href="${params.loginUrl}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 8px;">Quay lại đăng nhập</a>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="margin: 0; font-size: 12px; color: #64748b;">Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.</p>
      </div>
    `;
  }

  // -------------------------------------------------------------
  // QUÊN MẬT KHẨU - GỬI LINK KHÔI PHỤC QUA EMAIL (PHƯƠNG ÁN 1)
  // -------------------------------------------------------------
  async forgotPassword(dto: ForgotPasswordDto) {
    const genericResponse = {
      message:
        'Nếu email tồn tại trên hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi tới hộp thư của bạn.',
    };

    const emailNormalized = dto.email.trim().toLowerCase();
    const account = await this.prisma.taiKhoan.findUnique({
      where: { email: emailNormalized },
      select: {
        maTaiKhoan: true,
        email: true,
        tenNguoiDung: true,
        matKhau: true,
        provider: true,
        vaiTro: true,
        trangThai: true,
        deletedAt: true,
      },
    });

    if (
      !account ||
      account.deletedAt ||
      account.trangThai === 'KHOA' ||
      account.trangThai === 'CHUAKICHHOAT' ||
      account.vaiTro === 'ADMIN'
    ) {
      return genericResponse;
    }

    const frontendUrl = this.getFrontendBaseUrl();
    const isEmployer =
      account.vaiTro === 'NHATUYENDUNG' || dto.portal === 'employer';
    const displayName = account.tenNguoiDung || account.email;

    // Tài khoản Google thuần (Phương án a): gửi email nhắc đăng nhập bằng Google
    if (account.provider === 'GOOGLE' && !account.matKhau) {
      const loginUrl = `${frontendUrl}${account.vaiTro === 'NHATUYENDUNG' ? '/employer/login' : '/login'}`;
      try {
        await this.mailerService.sendMail({
          to: account.email,
          subject: '[ViecNgon] Hướng dẫn đăng nhập tài khoản Google',
          html: this.buildGoogleReminderEmailHtml({ displayName, loginUrl }),
        });
      } catch (error) {
        this.logger.error('Không thể gửi email nhắc đăng nhập Google', error);
      }
      return genericResponse;
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashResetToken(rawToken);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await this.prisma.$transaction(async (tx) => {
      await tx.passwordResetToken.updateMany({
        where: { maTaiKhoan: account.maTaiKhoan, usedAt: null },
        data: { usedAt: new Date() },
      });

      await tx.passwordResetToken.create({
        data: {
          tokenHash,
          expiresAt,
          maTaiKhoan: account.maTaiKhoan,
        },
      });
    });

    const resetPath =
      account.vaiTro === 'NHATUYENDUNG'
        ? '/employer/reset-password'
        : '/reset-password';
    const resetUrl = `${frontendUrl}${resetPath}?token=${encodeURIComponent(rawToken)}`;

    try {
      await this.mailerService.sendMail({
        to: account.email,
        subject: '[ViecNgon] Đặt lại mật khẩu tài khoản',
        html: this.buildResetPasswordEmailHtml({
          displayName,
          resetUrl,
          isEmployer,
        }),
      });
    } catch (error) {
      this.logger.error('Không thể gửi email đặt lại mật khẩu', error);
    }

    return genericResponse;
  }

  // -------------------------------------------------------------
  // ĐẶT LẠI MẬT KHẨU BẰNG TOKEN
  // -------------------------------------------------------------
  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = this.hashResetToken(dto.token.trim());
    const resetRecord = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: {
        taiKhoan: {
          select: {
            maTaiKhoan: true,
            vaiTro: true,
            trangThai: true,
            deletedAt: true,
          },
        },
      },
    });

    if (
      !resetRecord ||
      resetRecord.usedAt ||
      resetRecord.expiresAt < new Date() ||
      !resetRecord.taiKhoan ||
      resetRecord.taiKhoan.deletedAt ||
      resetRecord.taiKhoan.trangThai === 'KHOA' ||
      resetRecord.taiKhoan.trangThai === 'CHUAKICHHOAT'
    ) {
      throw new BadRequestException(
        'Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng gửi lại yêu cầu mới.',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.passwordResetToken.updateMany({
        where: { maToken: resetRecord.maToken, usedAt: null },
        data: { usedAt: new Date() },
      });

      if (claimed.count !== 1) {
        throw new BadRequestException(
          'Liên kết đặt lại mật khẩu đã được sử dụng.',
        );
      }

      await tx.taiKhoan.update({
        where: { maTaiKhoan: resetRecord.maTaiKhoan },
        data: { matKhau: hashedPassword },
      });
    });

    return {
      message:
        'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.',
      role: resetRecord.taiKhoan.vaiTro,
    };
  }
}
