import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Prisma } from '@prisma/client';
import type {
  AdminJobActionResponse,
  AdminJobDetailResponse,
  AdminJobListItem,
  AdminJobStatus,
  AdminJobsListResponse,
  DeleteAdminJobResponse,
} from '@viecngon/types';
import { PrismaService } from '../../prisma/prisma.service';
import type { DeleteAdminJobDto } from './dto/delete-admin-job.dto';
import type { ModerateAdminJobDto } from './dto/moderate-admin-job.dto';
import type { QueryAdminJobsDto } from './dto/query-admin-jobs.dto';

const PENDING_STATUSES = ['CHO_DUYET', 'Chờ duyệt'];
const APPROVED_STATUSES = ['DA_DUYET', 'Đang tuyển', 'DANG_TUYEN', 'ACTIVE'];
const REJECTED_STATUSES = ['TU_CHOI', 'TU_CHUOI', 'Từ chối'];
const HIDDEN_STATUSES = ['DA_AN', 'Đã ẩn', 'Đã đóng'];
const EXPIRED_STATUSES = ['HET_HAN', 'Hết hạn'];

const JOB_LIST_SELECT = {
  maCongViec: true,
  tenCongViec: true,
  slug: true,
  trangThai: true,
  thanhPho: true,
  loaiHinh: true,
  hinhThucLamViec: true,
  capBac: true,
  mucLuongToiThieu: true,
  mucLuongToiDa: true,
  ngayDang: true,
  ngayHetHan: true,
  luotXem: true,
  nhanQuangCao: true,
  nhaTuyenDung: {
    select: {
      congTy: {
        select: {
          maCongTy: true,
          tenCongTy: true,
          slug: true,
          logoUrl: true,
        },
      },
      taiKhoan: {
        select: {
          maTaiKhoan: true,
          tenNguoiDung: true,
          email: true,
        },
      },
    },
  },
  congViecKyNangs: {
    select: {
      kyNang: {
        select: {
          tenKyNang: true,
        },
      },
    },
  },
  _count: {
    select: {
      donXinViecs: true,
    },
  },
} satisfies Prisma.CongViecSelect;

interface JobListRow {
  maCongViec: string;
  tenCongViec: string;
  slug: string;
  trangThai: string;
  thanhPho: string | null;
  loaiHinh: string;
  hinhThucLamViec: string | null;
  capBac: string | null;
  mucLuongToiThieu: Prisma.Decimal | number | null;
  mucLuongToiDa: Prisma.Decimal | number | null;
  ngayDang: Date;
  ngayHetHan: Date | null;
  luotXem: number;
  nhanQuangCao: string | null;
  nhaTuyenDung: {
    congTy: {
      maCongTy: string;
      tenCongTy: string;
      slug: string;
      logoUrl: string | null;
    };
    taiKhoan: {
      maTaiKhoan: string;
      tenNguoiDung: string;
      email: string;
    };
  };
  congViecKyNangs: Array<{
    kyNang: {
      tenKyNang: string;
    };
  }>;
  _count: {
    donXinViecs: number;
  };
}

@Injectable()
export class AdminJobsService {
  private readonly logger = new Logger(AdminJobsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mailerService: MailerService,
  ) {}

  private truncateText(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
  }

  private normalizeJobStatus(
    rawStatus: string,
    ngayHetHan: Date | null,
  ): AdminJobStatus {
    const trimmed = (rawStatus || '').trim();
    if (PENDING_STATUSES.includes(trimmed)) return 'CHO_DUYET';
    if (REJECTED_STATUSES.includes(trimmed)) return 'TU_CHOI';
    if (HIDDEN_STATUSES.includes(trimmed)) return 'DA_AN';
    if (EXPIRED_STATUSES.includes(trimmed)) return 'HET_HAN';
    if (ngayHetHan && ngayHetHan < new Date()) return 'HET_HAN';
    if (APPROVED_STATUSES.includes(trimmed)) return 'DA_DUYET';
    return 'CHO_DUYET';
  }

  private mapListItem(row: JobListRow): AdminJobListItem {
    return {
      maCongViec: row.maCongViec,
      tenCongViec: row.tenCongViec,
      slug: row.slug,
      trangThai: this.normalizeJobStatus(row.trangThai, row.ngayHetHan),
      thanhPho: row.thanhPho,
      loaiHinh: row.loaiHinh,
      hinhThucLamViec: row.hinhThucLamViec,
      capBac: row.capBac,
      mucLuongToiThieu:
        row.mucLuongToiThieu !== null ? Number(row.mucLuongToiThieu) : null,
      mucLuongToiDa:
        row.mucLuongToiDa !== null ? Number(row.mucLuongToiDa) : null,
      ngayDang: row.ngayDang.toISOString(),
      ngayHetHan: row.ngayHetHan ? row.ngayHetHan.toISOString() : null,
      luotXem: row.luotXem,
      applicationsCount: row._count.donXinViecs,
      nhanQuangCao: row.nhanQuangCao,
      company: {
        maCongTy: row.nhaTuyenDung.congTy.maCongTy,
        tenCongTy: row.nhaTuyenDung.congTy.tenCongTy,
        slug: row.nhaTuyenDung.congTy.slug,
        logoUrl: row.nhaTuyenDung.congTy.logoUrl,
      },
      recruiter: {
        maTaiKhoan: row.nhaTuyenDung.taiKhoan.maTaiKhoan,
        tenNguoiDung: row.nhaTuyenDung.taiKhoan.tenNguoiDung,
        email: row.nhaTuyenDung.taiKhoan.email,
      },
      skills: row.congViecKyNangs.map((item) => item.kyNang.tenKyNang),
    };
  }

  private buildStatusFilter(
    status: AdminJobStatus,
    now: Date,
  ): Prisma.CongViecWhereInput {
    switch (status) {
      case 'CHO_DUYET':
        return { trangThai: { in: PENDING_STATUSES } };
      case 'DA_DUYET':
        return {
          trangThai: { in: APPROVED_STATUSES },
          OR: [{ ngayHetHan: null }, { ngayHetHan: { gte: now } }],
        };
      case 'TU_CHOI':
        return { trangThai: { in: REJECTED_STATUSES } };
      case 'DA_AN':
        return { trangThai: { in: HIDDEN_STATUSES } };
      case 'HET_HAN':
        return {
          OR: [
            { trangThai: { in: EXPIRED_STATUSES } },
            {
              trangThai: { in: APPROVED_STATUSES },
              ngayHetHan: { lt: now },
            },
          ],
        };
    }
  }

  async findAll(query: QueryAdminJobsDto): Promise<AdminJobsListResponse> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 12));
    const sortBy = query.sortBy ?? 'ngayDang';
    const sortOrder = query.sortOrder ?? 'desc';
    const keyword = query.q?.trim();
    const city = query.city?.trim();
    const now = new Date();

    const andConditions: Prisma.CongViecWhereInput[] = [
      { deletedAt: null },
      { trangThai: { notIn: ['NHAP', 'Nháp'] } },
    ];

    if (query.status && query.status !== 'ALL') {
      andConditions.push(this.buildStatusFilter(query.status, now));
    }

    if (city && city !== 'ALL') {
      andConditions.push({ thanhPho: { contains: city } });
    }

    if (keyword) {
      andConditions.push({
        OR: [
          { tenCongViec: { contains: keyword } },
          {
            nhaTuyenDung: {
              congTy: {
                tenCongTy: { contains: keyword },
              },
            },
          },
          {
            nhaTuyenDung: {
              taiKhoan: {
                email: { contains: keyword },
              },
            },
          },
        ],
      });
    }

    const where: Prisma.CongViecWhereInput = { AND: andConditions };
    const orderBy: Prisma.CongViecOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [
      rows,
      total,
      pendingCount,
      approvedCount,
      rejectedCount,
      hiddenCount,
      expiredCount,
    ] = await Promise.all([
      this.prisma.congViec.findMany({
        where,
        select: JOB_LIST_SELECT,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.congViec.count({ where }),
      this.prisma.congViec.count({
        where: { AND: [where, this.buildStatusFilter('CHO_DUYET', now)] },
      }),
      this.prisma.congViec.count({
        where: { AND: [where, this.buildStatusFilter('DA_DUYET', now)] },
      }),
      this.prisma.congViec.count({
        where: { AND: [where, this.buildStatusFilter('TU_CHOI', now)] },
      }),
      this.prisma.congViec.count({
        where: { AND: [where, this.buildStatusFilter('DA_AN', now)] },
      }),
      this.prisma.congViec.count({
        where: { AND: [where, this.buildStatusFilter('HET_HAN', now)] },
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
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        hidden: hiddenCount,
        expired: expiredCount,
      },
    };
  }

  async findOne(id: string): Promise<AdminJobDetailResponse> {
    const job = await this.prisma.congViec.findFirst({
      where: { maCongViec: id, deletedAt: null },
      select: {
        ...JOB_LIST_SELECT,
        moTa: true,
        yeuCauCongViec: true,
        phucLoi: true,
        yeuCauKinhNghiem: true,
        chiNhanh: {
          select: {
            thanhPho: true,
            diaChi: true,
          },
        },
      },
    });

    if (!job) {
      throw new NotFoundException('Không tìm thấy tin tuyển dụng.');
    }

    return {
      ...this.mapListItem(job),
      moTa: job.moTa,
      yeuCauCongViec: job.yeuCauCongViec,
      phucLoi: job.phucLoi,
      yeuCauKinhNghiem: job.yeuCauKinhNghiem,
      branch: job.chiNhanh
        ? {
            thanhPho: job.chiNhanh.thanhPho,
            diaChi: job.chiNhanh.diaChi,
          }
        : null,
    };
  }

  async moderate(
    id: string,
    dto: ModerateAdminJobDto,
  ): Promise<AdminJobActionResponse> {
    const reasonText = dto.reason?.trim() || '';

    if (dto.action === 'REJECT' && !reasonText) {
      throw new BadRequestException(
        'Vui lòng nhập lý do từ chối để Nhà tuyển dụng biết cách chỉnh sửa tin.',
      );
    }

    const updatedJob = await this.prisma.$transaction(async (tx) => {
      const target = await tx.congViec.findFirst({
        where: { maCongViec: id, deletedAt: null },
        select: {
          maCongViec: true,
          tenCongViec: true,
          trangThai: true,
          ngayHetHan: true,
          nhaTuyenDung: {
            select: {
              maTaiKhoan: true,
            },
          },
        },
      });

      if (!target) {
        throw new NotFoundException('Không tìm thấy tin tuyển dụng.');
      }

      if (
        dto.action === 'APPROVE' &&
        target.ngayHetHan &&
        target.ngayHetHan < new Date()
      ) {
        throw new BadRequestException(
          'Tin tuyển dụng này đã quá hạn nộp hồ sơ. Vui lòng yêu cầu Nhà tuyển dụng gia hạn trước khi duyệt.',
        );
      }

      const nextStatus: AdminJobStatus =
        dto.action === 'APPROVE'
          ? 'DA_DUYET'
          : dto.action === 'REJECT'
            ? 'TU_CHOI'
            : 'DA_AN';

      const updated = await tx.congViec.update({
        where: { maCongViec: id },
        data: { trangThai: nextStatus },
        select: JOB_LIST_SELECT,
      });

      const notificationTitle =
        dto.action === 'APPROVE'
          ? `Tin tuyển dụng đã được duyệt: ${target.tenCongViec}`
          : dto.action === 'REJECT'
            ? `Tin tuyển dụng bị từ chối: ${target.tenCongViec}`
            : `Tin tuyển dụng đã bị ẩn bởi Quản trị viên: ${target.tenCongViec}`;

      const notificationContent =
        dto.action === 'APPROVE'
          ? `Tin tuyển dụng "${target.tenCongViec}" đã được Quản trị viên phê duyệt và hiển thị công khai trên ViecNgon.`
          : dto.action === 'REJECT'
            ? `Tin tuyển dụng "${target.tenCongViec}" chưa đạt tiêu chuẩn kiểm duyệt. Lý do: ${reasonText}. Vui lòng chỉnh sửa và gửi duyệt lại.`
            : reasonText
              ? `Tin tuyển dụng "${target.tenCongViec}" đã bị ẩn khỏi hệ thống. Lý do: ${reasonText}`
              : `Tin tuyển dụng "${target.tenCongViec}" đã bị ẩn khỏi hệ thống do vi phạm chính sách đăng tin.`;

      await tx.thongBao.create({
        data: {
          maTaiKhoan: target.nhaTuyenDung.maTaiKhoan,
          tieuDe: this.truncateText(notificationTitle, 255),
          noiDung: notificationContent,
          trangThai: 'CHUA_DOC',
        },
      });

      return updated;
    });

    await this.sendModerationEmail(
      updatedJob.nhaTuyenDung.taiKhoan.email,
      updatedJob.nhaTuyenDung.taiKhoan.tenNguoiDung,
      updatedJob.tenCongViec,
      dto.action,
      reasonText,
    );

    const actionMessage =
      dto.action === 'APPROVE'
        ? `Đã duyệt hiển thị công khai tin "${updatedJob.tenCongViec}".`
        : dto.action === 'REJECT'
          ? `Đã từ chối tin "${updatedJob.tenCongViec}".`
          : `Đã ẩn tin "${updatedJob.tenCongViec}".`;

    return {
      message: actionMessage,
      job: this.mapListItem(updatedJob),
    };
  }

  async softDelete(
    id: string,
    dto?: DeleteAdminJobDto,
  ): Promise<DeleteAdminJobResponse> {
    const reasonText = dto?.reason?.trim() || '';

    const deletedJob = await this.prisma.$transaction(async (tx) => {
      const target = await tx.congViec.findFirst({
        where: { maCongViec: id, deletedAt: null },
        select: {
          maCongViec: true,
          tenCongViec: true,
          nhaTuyenDung: {
            select: {
              maTaiKhoan: true,
            },
          },
        },
      });

      if (!target) {
        throw new NotFoundException('Không tìm thấy tin tuyển dụng.');
      }

      await tx.congViec.update({
        where: { maCongViec: id },
        data: {
          trangThai: 'DA_AN',
          deletedAt: new Date(),
        },
      });

      await tx.thongBao.create({
        data: {
          maTaiKhoan: target.nhaTuyenDung.maTaiKhoan,
          tieuDe: this.truncateText(
            `Tin tuyển dụng đã bị gỡ khỏi hệ thống: ${target.tenCongViec}`,
            255,
          ),
          noiDung: reasonText
            ? `Tin tuyển dụng "${target.tenCongViec}" đã bị xóa bởi Quản trị viên. Lý do: ${reasonText}`
            : `Tin tuyển dụng "${target.tenCongViec}" đã bị xóa bởi Quản trị viên do vi phạm chính sách.`,
          trangThai: 'CHUA_DOC',
        },
      });

      return target;
    });

    return {
      message: `Đã xóa tin tuyển dụng "${deletedJob.tenCongViec}".`,
      deletedId: deletedJob.maCongViec,
    };
  }

  private async sendModerationEmail(
    email: string,
    displayName: string,
    jobTitle: string,
    action: 'APPROVE' | 'REJECT' | 'HIDE',
    reason: string,
  ): Promise<void> {
    if (!process.env.MAIL_HOST || !process.env.MAIL_USER) {
      return;
    }

    const safeName = displayName || email;
    const isApproved = action === 'APPROVE';
    const subject = isApproved
      ? `[ViecNgon] Tin tuyển dụng đã được duyệt: ${jobTitle}`
      : action === 'REJECT'
        ? `[ViecNgon] Tin tuyển dụng cần chỉnh sửa: ${jobTitle}`
        : `[ViecNgon] Thông báo ẩn tin tuyển dụng: ${jobTitle}`;

    const reasonHtml =
      !isApproved && reason
        ? `<p style="margin:12px 0;padding:12px 16px;background:#fef2f2;border-left:4px solid #dc2626;color:#991b1b;border-radius:6px;"><strong>Lý do:</strong> ${reason}</p>`
        : '';

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#111827;line-height:1.6;">
        <h2 style="color:${isApproved ? '#059669' : '#dc2626'};margin-bottom:12px;">
          ${isApproved ? 'Tin tuyển dụng đã được phê duyệt' : action === 'REJECT' ? 'Tin tuyển dụng bị từ chối' : 'Tin tuyển dụng đã bị ẩn'}
        </h2>
        <p>Xin chào <strong>${safeName}</strong>,</p>
        <p>
          ${
            isApproved
              ? `Tin tuyển dụng <strong>${jobTitle}</strong> đã vượt qua kiểm duyệt và đang hiển thị công khai trên ViecNgon.`
              : `Tin tuyển dụng <strong>${jobTitle}</strong> đã được Quản trị viên cập nhật trạng thái kiểm duyệt.`
          }
        </p>
        ${reasonHtml}
        <p style="font-size:13px;color:#6b7280;margin-top:20px;">
          Trân trọng,<br/>Đội ngũ kiểm duyệt ViecNgon
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
        `Không thể gửi email kiểm duyệt tin cho ${email}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
