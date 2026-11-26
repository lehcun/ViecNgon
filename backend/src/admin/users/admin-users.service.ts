import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Prisma } from '@prisma/client';
import type {
  AdminUserActionResponse,
  AdminUserDetailResponse,
  AdminUserListItem,
  AdminUserProvider,
  AdminUserRole,
  AdminUserStatus,
  AdminUsersListResponse,
  DeleteAdminUserResponse,
} from '@viecngon/types';
import { PrismaService } from '../../prisma/prisma.service';
import type { DeleteUserDto } from './dto/delete-user.dto';
import type { QueryAdminUsersDto } from './dto/query-admin-users.dto';
import type { UpdateUserRoleDto } from './dto/update-user-role.dto';
import type { UpdateUserStatusDto } from './dto/update-user-status.dto';

const USER_LIST_SELECT = {
  maTaiKhoan: true,
  email: true,
  tenNguoiDung: true,
  sdt: true,
  provider: true,
  vaiTro: true,
  trangThai: true,
  ngayTao: true,
  ngayCapNhat: true,
  ungVien: {
    select: {
      avatarUrl: true,
    },
  },
  nhaTuyenDung: {
    select: {
      vaiTroTrongCongTy: true,
      congTy: {
        select: {
          tenCongTy: true,
          slug: true,
          logoUrl: true,
        },
      },
    },
  },
} satisfies Prisma.TaiKhoanSelect;

interface UserListRow {
  maTaiKhoan: string;
  email: string;
  tenNguoiDung: string;
  sdt: string | null;
  provider: string;
  vaiTro: string;
  trangThai: string;
  ngayTao: Date;
  ngayCapNhat: Date;
  ungVien: {
    avatarUrl: string | null;
  } | null;
  nhaTuyenDung: {
    vaiTroTrongCongTy: string;
    congTy: {
      tenCongTy: string;
      slug: string;
      logoUrl: string | null;
    };
  } | null;
}

const COMPANY_ROLE_LABELS: Record<'OWNER' | 'RECRUITER', string> = {
  OWNER: 'Quản trị viên công ty (Owner)',
  RECRUITER: 'Chuyên viên tuyển dụng (HR)',
};

@Injectable()
export class AdminUsersService {
  private readonly logger = new Logger(AdminUsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  private truncateText(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
  }

  private normalizeRole(role: string): AdminUserRole {
    if (role === 'ADMIN' || role === 'NHATUYENDUNG' || role === 'UNGVIEN') {
      return role;
    }
    return 'UNGVIEN';
  }

  private normalizeStatus(status: string): AdminUserStatus {
    if (
      status === 'HOATDONG' ||
      status === 'KHOA' ||
      status === 'CHUAKICHHOAT'
    ) {
      return status;
    }
    return 'CHUAKICHHOAT';
  }

  private normalizeProvider(provider: string): AdminUserProvider {
    return provider === 'GOOGLE' ? 'GOOGLE' : 'LOCAL';
  }

  private mapListItem(row: UserListRow): AdminUserListItem {
    return {
      maTaiKhoan: row.maTaiKhoan,
      email: row.email,
      tenNguoiDung: row.tenNguoiDung,
      sdt: row.sdt,
      provider: this.normalizeProvider(row.provider),
      vaiTro: this.normalizeRole(row.vaiTro),
      trangThai: this.normalizeStatus(row.trangThai),
      ngayTao: row.ngayTao.toISOString(),
      ngayCapNhat: row.ngayCapNhat.toISOString(),
      avatarUrl:
        row.ungVien?.avatarUrl ?? row.nhaTuyenDung?.congTy?.logoUrl ?? null,
      companyName: row.nhaTuyenDung?.congTy?.tenCongTy ?? null,
      companySlug: row.nhaTuyenDung?.congTy?.slug ?? null,
      companyRole:
        row.nhaTuyenDung?.vaiTroTrongCongTy === 'OWNER'
          ? 'OWNER'
          : row.nhaTuyenDung
            ? 'RECRUITER'
            : null,
    };
  }

  async findAll(query: QueryAdminUsersDto): Promise<AdminUsersListResponse> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 12));
    const sortBy = query.sortBy ?? 'ngayTao';
    const sortOrder = query.sortOrder ?? 'desc';
    const keyword = query.q?.trim();

    const where: Prisma.TaiKhoanWhereInput = {
      deletedAt: null,
    };

    if (query.role && query.role !== 'ALL') {
      where.vaiTro = query.role;
    }

    if (query.status && query.status !== 'ALL') {
      where.trangThai =
        query.status === 'CHUAKICHHOAT'
          ? { in: ['CHUAKICHHOAT', 'CHODUYET'] }
          : query.status;
    }

    if (query.provider && query.provider !== 'ALL') {
      where.provider = query.provider;
    }

    if (keyword) {
      where.OR = [
        { email: { contains: keyword } },
        { tenNguoiDung: { contains: keyword } },
        { sdt: { contains: keyword } },
        {
          nhaTuyenDung: {
            congTy: {
              tenCongTy: { contains: keyword },
            },
          },
        },
      ];
    }

    const orderBy: Prisma.TaiKhoanOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [
      rows,
      total,
      activeCount,
      lockedCount,
      unactivatedCount,
      adminsCount,
      candidatesCount,
      recruitersCount,
    ] = await Promise.all([
      this.prisma.taiKhoan.findMany({
        where,
        select: USER_LIST_SELECT,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.taiKhoan.count({ where }),
      this.prisma.taiKhoan.count({
        where: { AND: [where, { trangThai: 'HOATDONG' }] },
      }),
      this.prisma.taiKhoan.count({
        where: { AND: [where, { trangThai: 'KHOA' }] },
      }),
      this.prisma.taiKhoan.count({
        where: {
          AND: [where, { trangThai: { in: ['CHUAKICHHOAT', 'CHODUYET'] } }],
        },
      }),
      this.prisma.taiKhoan.count({
        where: { AND: [where, { vaiTro: 'ADMIN' }] },
      }),
      this.prisma.taiKhoan.count({
        where: { AND: [where, { vaiTro: 'UNGVIEN' }] },
      }),
      this.prisma.taiKhoan.count({
        where: { AND: [where, { vaiTro: 'NHATUYENDUNG' }] },
      }),
    ]);

    return {
      items: rows.map((row) => this.mapListItem(row)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
      summary: {
        total,
        active: activeCount,
        locked: lockedCount,
        unactivated: unactivatedCount,
        admins: adminsCount,
        candidates: candidatesCount,
        recruiters: recruitersCount,
      },
    };
  }

  async findOne(id: string): Promise<AdminUserDetailResponse> {
    const account = await this.prisma.taiKhoan.findFirst({
      where: { maTaiKhoan: id, deletedAt: null },
      select: {
        ...USER_LIST_SELECT,
        ungVien: {
          select: {
            maUngVien: true,
            tenUngVien: true,
            avatarUrl: true,
            chuyenMon: true,
            diaChi: true,
            soNamKinhNghiem: true,
            cvUrl: true,
            _count: {
              select: {
                donXinViecs: true,
                congViecDaLuus: true,
                kyNangs: true,
              },
            },
          },
        },
        nhaTuyenDung: {
          select: {
            maNTD: true,
            hoTen: true,
            chucVu: true,
            soDienThoai: true,
            vaiTroTrongCongTy: true,
            congTy: {
              select: {
                maCongTy: true,
                tenCongTy: true,
                slug: true,
                logoUrl: true,
                thanhPho: true,
                diaChi: true,
                website: true,
                moHinhCongTy: true,
                quyMo: true,
              },
            },
            _count: {
              select: {
                congViecs: true,
              },
            },
          },
        },
        thongBaos: {
          select: {
            maThongBao: true,
            tieuDe: true,
            noiDung: true,
            ngayTao: true,
          },
          orderBy: { ngayTao: 'desc' },
          take: 5,
        },
      },
    });

    if (!account) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng.');
    }

    const base = this.mapListItem(account);

    return {
      ...base,
      candidateProfile: account.ungVien
        ? {
            maUngVien: account.ungVien.maUngVien,
            tenUngVien: account.ungVien.tenUngVien,
            chuyenMon: account.ungVien.chuyenMon,
            diaChi: account.ungVien.diaChi,
            soNamKinhNghiem: account.ungVien.soNamKinhNghiem,
            cvUrl: account.ungVien.cvUrl,
            applicationsCount: account.ungVien._count.donXinViecs,
            savedJobsCount: account.ungVien._count.congViecDaLuus,
            skillsCount: account.ungVien._count.kyNangs,
          }
        : null,
      recruiterProfile: account.nhaTuyenDung
        ? {
            maNTD: account.nhaTuyenDung.maNTD,
            hoTen: account.nhaTuyenDung.hoTen,
            chucVu: account.nhaTuyenDung.chucVu,
            soDienThoai: account.nhaTuyenDung.soDienThoai,
            vaiTroTrongCongTy: account.nhaTuyenDung.vaiTroTrongCongTy,
            maCongTy: account.nhaTuyenDung.congTy.maCongTy,
            tenCongTy: account.nhaTuyenDung.congTy.tenCongTy,
            slug: account.nhaTuyenDung.congTy.slug,
            logoUrl: account.nhaTuyenDung.congTy.logoUrl,
            thanhPho: account.nhaTuyenDung.congTy.thanhPho,
            diaChi: account.nhaTuyenDung.congTy.diaChi,
            website: account.nhaTuyenDung.congTy.website,
            moHinhCongTy: account.nhaTuyenDung.congTy.moHinhCongTy,
            quyMo: account.nhaTuyenDung.congTy.quyMo,
            jobsCount: account.nhaTuyenDung._count.congViecs,
          }
        : null,
      recentNotifications: account.thongBaos.map((item) => ({
        maThongBao: item.maThongBao,
        tieuDe: item.tieuDe,
        noiDung: item.noiDung,
        ngayTao: item.ngayTao.toISOString(),
      })),
    };
  }

  async updateStatus(
    targetId: string,
    dto: UpdateUserStatusDto,
    currentAdminId: string,
  ): Promise<AdminUserActionResponse> {
    if (targetId === currentAdminId && dto.trangThai === 'KHOA') {
      throw new BadRequestException(
        'Không thể tự khóa tài khoản quản trị đang đăng nhập.',
      );
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const target = await tx.taiKhoan.findFirst({
        where: { maTaiKhoan: targetId, deletedAt: null },
        select: {
          maTaiKhoan: true,
          email: true,
          tenNguoiDung: true,
          vaiTro: true,
          trangThai: true,
        },
      });

      if (!target) {
        throw new NotFoundException('Không tìm thấy tài khoản người dùng.');
      }

      if (target.trangThai === dto.trangThai) {
        throw new BadRequestException(
          dto.trangThai === 'KHOA'
            ? 'Tài khoản này hiện đã ở trạng thái bị khóa.'
            : 'Tài khoản này hiện đã đang hoạt động.',
        );
      }

      // Bảo vệ tài khoản ADMIN hoạt động cuối cùng
      if (target.vaiTro === 'ADMIN' && dto.trangThai === 'KHOA') {
        const activeAdmins = await tx.taiKhoan.count({
          where: {
            vaiTro: 'ADMIN',
            trangThai: 'HOATDONG',
            deletedAt: null,
          },
        });
        if (activeAdmins <= 1) {
          throw new BadRequestException(
            'Không thể khóa tài khoản quản trị viên hoạt động cuối cùng của hệ thống.',
          );
        }
      }

      const updated = await tx.taiKhoan.update({
        where: { maTaiKhoan: targetId },
        data: { trangThai: dto.trangThai },
        select: USER_LIST_SELECT,
      });

      if (dto.trangThai === 'KHOA') {
        await tx.passwordResetToken.updateMany({
          where: { maTaiKhoan: targetId, usedAt: null },
          data: { usedAt: new Date() },
        });
      }

      const reasonText = dto.reason?.trim();
      const title =
        dto.trangThai === 'KHOA'
          ? 'Tài khoản của bạn đã bị khóa bởi Quản trị viên'
          : target.trangThai === 'CHUAKICHHOAT'
            ? 'Tài khoản của bạn đã được kích hoạt'
            : 'Tài khoản của bạn đã được mở khóa';

      const content =
        dto.trangThai === 'KHOA'
          ? reasonText
            ? `Tài khoản đã bị tạm khóa do vi phạm chính sách hệ thống. Lý do: ${reasonText}`
            : 'Tài khoản đã bị tạm khóa do vi phạm chính sách sử dụng của ViecNgon. Vui lòng liên hệ bộ phận hỗ trợ để biết thêm chi tiết.'
          : 'Tài khoản của bạn đã sẵn sàng hoạt động trở lại trên hệ thống ViecNgon.';

      await tx.thongBao.create({
        data: {
          maTaiKhoan: targetId,
          tieuDe: this.truncateText(title, 255),
          noiDung: content,
          trangThai: 'CHUA_DOC',
        },
      });

      return updated;
    });

    await this.sendStatusNotificationEmail(
      updatedUser.email,
      updatedUser.tenNguoiDung,
      dto.trangThai,
      dto.reason,
    );

    return {
      message:
        dto.trangThai === 'KHOA'
          ? `Đã khóa tài khoản ${updatedUser.email}.`
          : `Đã kích hoạt tài khoản ${updatedUser.email}.`,
      user: this.mapListItem(updatedUser),
    };
  }

  async updateRole(
    targetId: string,
    dto: UpdateUserRoleDto,
    currentAdminId: string,
  ): Promise<AdminUserActionResponse> {
    if (targetId === currentAdminId) {
      throw new BadRequestException(
        'Không thể thay đổi chức vụ của tài khoản quản trị đang đăng nhập.',
      );
    }

    const updatedUser = await this.prisma.$transaction(async (tx) => {
      const target = await tx.taiKhoan.findFirst({
        where: { maTaiKhoan: targetId, deletedAt: null },
        select: {
          maTaiKhoan: true,
          email: true,
          vaiTro: true,
          trangThai: true,
          nhaTuyenDung: {
            select: {
              maNTD: true,
              vaiTroTrongCongTy: true,
              congTy: {
                select: {
                  tenCongTy: true,
                },
              },
            },
          },
        },
      });

      if (!target) {
        throw new NotFoundException('Không tìm thấy tài khoản người dùng.');
      }

      if (target.vaiTro !== 'NHATUYENDUNG' || !target.nhaTuyenDung) {
        throw new BadRequestException(
          'Chỉ được phép đổi chức vụ trong công ty (Owner / HR) cho tài khoản Nhà tuyển dụng. Không thể thay đổi vai trò hệ thống của Ứng viên hoặc Quản trị viên.',
        );
      }

      if (target.nhaTuyenDung.vaiTroTrongCongTy === dto.vaiTroTrongCongTy) {
        throw new BadRequestException(
          `Nhà tuyển dụng này hiện đã giữ chức vụ ${COMPANY_ROLE_LABELS[dto.vaiTroTrongCongTy]}.`,
        );
      }

      await tx.nhaTuyenDung.update({
        where: { maNTD: target.nhaTuyenDung.maNTD },
        data: { vaiTroTrongCongTy: dto.vaiTroTrongCongTy },
      });

      const updated = await tx.taiKhoan.findUniqueOrThrow({
        where: { maTaiKhoan: targetId },
        select: USER_LIST_SELECT,
      });

      const companyLabel = target.nhaTuyenDung.congTy?.tenCongTy || 'doanh nghiệp';
      await tx.thongBao.create({
        data: {
          maTaiKhoan: targetId,
          tieuDe: this.truncateText(
            `Chức vụ tại ${companyLabel} đã được cập nhật thành ${COMPANY_ROLE_LABELS[dto.vaiTroTrongCongTy]}`,
            255,
          ),
          noiDung: `Quản trị viên hệ thống đã cập nhật chức vụ của bạn tại ${companyLabel} thành ${COMPANY_ROLE_LABELS[dto.vaiTroTrongCongTy]}.`,
          trangThai: 'CHUA_DOC',
        },
      });

      return updated;
    });

    return {
      message: `Đã cập nhật chức vụ của ${updatedUser.email} thành ${COMPANY_ROLE_LABELS[dto.vaiTroTrongCongTy]}.`,
      user: this.mapListItem(updatedUser),
    };
  }

  async softDelete(
    targetId: string,
    dto: DeleteUserDto | undefined,
    currentAdminId: string,
  ): Promise<DeleteAdminUserResponse> {
    if (targetId === currentAdminId) {
      throw new BadRequestException(
        'Không thể tự xóa tài khoản quản trị đang đăng nhập.',
      );
    }

    const deletedAccount = await this.prisma.$transaction(async (tx) => {
      const target = await tx.taiKhoan.findFirst({
        where: { maTaiKhoan: targetId, deletedAt: null },
        select: {
          maTaiKhoan: true,
          email: true,
          vaiTro: true,
          trangThai: true,
        },
      });

      if (!target) {
        throw new NotFoundException('Không tìm thấy tài khoản người dùng.');
      }

      if (target.vaiTro === 'ADMIN' && target.trangThai === 'HOATDONG') {
        const activeAdmins = await tx.taiKhoan.count({
          where: {
            vaiTro: 'ADMIN',
            trangThai: 'HOATDONG',
            deletedAt: null,
          },
        });
        if (activeAdmins <= 1) {
          throw new BadRequestException(
            'Không thể xóa tài khoản quản trị viên hoạt động cuối cùng của hệ thống.',
          );
        }
      }

      const now = new Date();
      await tx.taiKhoan.update({
        where: { maTaiKhoan: targetId },
        data: {
          trangThai: 'KHOA',
          deletedAt: now,
        },
      });

      await tx.passwordResetToken.updateMany({
        where: { maTaiKhoan: targetId, usedAt: null },
        data: { usedAt: now },
      });

      const reasonText = dto?.reason?.trim();
      await tx.thongBao.create({
        data: {
          maTaiKhoan: targetId,
          tieuDe: this.truncateText(
            'Tài khoản của bạn đã bị xóa khỏi hệ thống bởi Quản trị viên',
            255,
          ),
          noiDung: reasonText
            ? `Tài khoản đã bị vô hiệu hóa và xóa khỏi hệ thống. Lý do: ${reasonText}`
            : 'Tài khoản đã bị vô hiệu hóa và xóa khỏi hệ thống bởi Quản trị viên.',
          trangThai: 'CHUA_DOC',
        },
      });

      return target;
    });

    return {
      message: `Đã xóa tài khoản ${deletedAccount.email} khỏi hệ thống.`,
      deletedId: deletedAccount.maTaiKhoan,
    };
  }

  private async sendStatusNotificationEmail(
    email: string,
    displayName: string,
    status: 'HOATDONG' | 'KHOA',
    reason?: string,
  ): Promise<void> {
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER) {
      return;
    }

    const safeName = displayName || email;
    const isLocked = status === 'KHOA';
    const subject = isLocked
      ? '[ViecNgon] Thông báo tạm khóa tài khoản'
      : '[ViecNgon] Tài khoản của bạn đã được kích hoạt';

    const reasonHtml =
      isLocked && reason?.trim()
        ? `<p style="margin:12px 0;padding:12px 16px;background:#fef2f2;border-left:4px solid #dc2626;color:#991b1b;border-radius:6px;"><strong>Lý do:</strong> ${reason.trim()}</p>`
        : '';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111827;line-height:1.6;">
        <h2 style="color:${isLocked ? '#dc2626' : '#059669'};margin-bottom:12px;">
          ${isLocked ? 'Tài khoản của bạn đã bị tạm khóa' : 'Tài khoản của bạn đã sẵn sàng hoạt động'}
        </h2>
        <p>Xin chào <strong>${safeName}</strong>,</p>
        <p>
          ${
            isLocked
              ? 'Quản trị viên ViecNgon vừa tạm khóa tài khoản của bạn do vi phạm chính sách sử dụng hệ thống.'
              : 'Quản trị viên ViecNgon đã kích hoạt tài khoản của bạn. Bạn có thể đăng nhập và sử dụng đầy đủ các tính năng trên hệ thống.'
          }
        </p>
        ${reasonHtml}
        <p style="font-size:13px;color:#6b7280;margin-top:20px;">
          Nếu bạn có thắc mắc, vui lòng liên hệ đội ngũ hỗ trợ ViecNgon.
        </p>
      </div>
    `;

    try {
      await this.mailerService.sendMail({
        to: email,
        subject,
        html,
      });
    } catch (error) {
      this.logger.warn(
        `Không thể gửi email thông báo trạng thái cho ${email}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
