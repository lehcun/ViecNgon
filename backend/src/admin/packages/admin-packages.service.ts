import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  AdminPackageActionResponse,
  AdminPackageBadgeType,
  AdminPackageItem,
  AdminPackageStatus,
  AdminPackagesListResponse,
  AdminTransactionItem,
  AdminTransactionStatus,
  AdminTransactionsListResponse,
  ConfirmAdminTransactionResponse,
} from '@viecngon/types';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateAdminPackageDto } from './dto/create-admin-package.dto';
import type { QueryAdminPackagesDto } from './dto/query-admin-packages.dto';
import type { QueryAdminTransactionsDto } from './dto/query-admin-transactions.dto';
import type { UpdateAdminPackageDto } from './dto/update-admin-package.dto';
import type { UpdatePackageStatusDto } from './dto/update-package-status.dto';

const SUCCESS_TX_STATUSES = ['Thành công', 'THANH_CONG', 'SUCCESS', 'PAID'];
const PENDING_TX_STATUSES = [
  'Chờ thanh toán',
  'CHO_THANH_TOAN',
  'PENDING',
  'Đang chờ',
];
const FAILED_TX_STATUSES = ['Thất bại', 'THAT_BAI', 'FAILED', 'Đã hủy', 'HUY'];

const PACKAGE_SELECT = {
  maGoi: true,
  tieuDe: true,
  loaiQuangCao: true,
  gia: true,
  thoiGianHieuLuc: true,
  soLuotDangTin: true,
  capDoUuTien: true,
  loaiHuyHieu: true,
  moTaNgan: true,
  quyenLoiJson: true,
  trangThai: true,
  ngayTao: true,
  muaQuangCaos: {
    select: {
      giaTaiThoiDiemMua: true,
    },
  },
} satisfies Prisma.GoiQuangCaoSelect;

interface PackageRow {
  maGoi: string;
  tieuDe: string;
  loaiQuangCao: string | null;
  gia: Prisma.Decimal | number;
  thoiGianHieuLuc: number | null;
  soLuotDangTin: number | null;
  capDoUuTien: number;
  loaiHuyHieu: string | null;
  moTaNgan: string | null;
  quyenLoiJson: string | null;
  trangThai: string;
  ngayTao: Date;
  muaQuangCaos: Array<{
    giaTaiThoiDiemMua: Prisma.Decimal | number;
  }>;
}

const TRANSACTION_SELECT = {
  maThanhToan: true,
  maGiaoDichDoiTac: true,
  ngayThanhToan: true,
  soTienThanhToan: true,
  phuongThucTT: true,
  trangThaiTT: true,
  ghiChu: true,
  muaQuangCao: {
    select: {
      maMua: true,
      tieuDe: true,
      trangThai: true,
      soLuotConLai: true,
      ngayBatDau: true,
      ngayKetThuc: true,
      goiQuangCao: {
        select: {
          maGoi: true,
          tieuDe: true,
          loaiHuyHieu: true,
        },
      },
      congTy: {
        select: {
          maCongTy: true,
          tenCongTy: true,
          slug: true,
          logoUrl: true,
        },
      },
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
    },
  },
} satisfies Prisma.ThanhToanSelect;

interface TransactionRow {
  maThanhToan: string;
  maGiaoDichDoiTac: string;
  ngayThanhToan: Date;
  soTienThanhToan: Prisma.Decimal | number;
  phuongThucTT: string | null;
  trangThaiTT: string | null;
  ghiChu: string | null;
  muaQuangCao: {
    maMua: string;
    tieuDe: string | null;
    trangThai: string | null;
    soLuotConLai: number | null;
    ngayBatDau: Date;
    ngayKetThuc: Date;
    goiQuangCao: {
      maGoi: string;
      tieuDe: string;
      loaiHuyHieu: string | null;
    };
    congTy: {
      maCongTy: string;
      tenCongTy: string;
      slug: string;
      logoUrl: string | null;
    } | null;
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
  };
}

@Injectable()
export class AdminPackagesService {
  constructor(private readonly prisma: PrismaService) {}

  private truncateText(value: string, maxLength: number): string {
    if (value.length <= maxLength) return value;
    return `${value.slice(0, Math.max(0, maxLength - 1))}…`;
  }

  private normalizeBadge(raw: string | null): AdminPackageBadgeType | null {
    if (
      raw === 'BASIC' ||
      raw === 'HOT' ||
      raw === 'SUPER_HOT' ||
      raw === 'DIAMOND'
    ) {
      return raw;
    }
    return null;
  }

  private normalizePackageStatus(raw: string): AdminPackageStatus {
    return raw === 'DA_AN' ? 'DA_AN' : 'HOATDONG';
  }

  private normalizeTxStatus(raw: string | null): AdminTransactionStatus {
    const val = (raw || '').trim();
    if (SUCCESS_TX_STATUSES.includes(val)) return 'THANH_CONG';
    if (FAILED_TX_STATUSES.includes(val)) return 'THAT_BAI';
    return 'CHO_THANH_TOAN';
  }

  private parseFeatures(quyenLoiJson: string | null): string[] {
    if (!quyenLoiJson) return [];
    try {
      const parsed: unknown = JSON.parse(quyenLoiJson);
      if (Array.isArray(parsed)) {
        return parsed
          .filter((item): item is string => typeof item === 'string')
          .map((item) => item.trim())
          .filter(Boolean);
      }
    } catch {
      return [];
    }
    return [];
  }

  private serializeFeatures(quyenLoi?: string[]): string | null {
    if (!quyenLoi) return null;
    const cleaned = quyenLoi.map((item) => item.trim()).filter(Boolean);
    return cleaned.length > 0 ? JSON.stringify(cleaned) : null;
  }

  private mapPackage(row: PackageRow): AdminPackageItem {
    const totalRevenue = row.muaQuangCaos.reduce(
      (sum, item) => sum + Number(item.giaTaiThoiDiemMua || 0),
      0,
    );

    return {
      maGoi: row.maGoi,
      tieuDe: row.tieuDe,
      loaiQuangCao: row.loaiQuangCao,
      gia: Number(row.gia),
      thoiGianHieuLuc: row.thoiGianHieuLuc ?? 30,
      soLuotDangTin: row.soLuotDangTin ?? 1,
      capDoUuTien: row.capDoUuTien,
      loaiHuyHieu: this.normalizeBadge(row.loaiHuyHieu),
      moTaNgan: row.moTaNgan,
      quyenLoi: this.parseFeatures(row.quyenLoiJson),
      trangThai: this.normalizePackageStatus(row.trangThai),
      ngayTao: row.ngayTao.toISOString(),
      purchasesCount: row.muaQuangCaos.length,
      totalRevenue,
    };
  }

  private mapTransaction(row: TransactionRow): AdminTransactionItem {
    const company =
      row.muaQuangCao.congTy ?? row.muaQuangCao.nhaTuyenDung.congTy ?? null;

    return {
      maThanhToan: row.maThanhToan,
      maGiaoDichDoiTac: row.maGiaoDichDoiTac,
      ngayThanhToan: row.ngayThanhToan.toISOString(),
      soTienThanhToan: Number(row.soTienThanhToan),
      phuongThucTT: row.phuongThucTT,
      trangThaiTT: this.normalizeTxStatus(row.trangThaiTT),
      rawTrangThaiTT: row.trangThaiTT,
      ghiChu: row.ghiChu,
      campaign: {
        maMua: row.muaQuangCao.maMua,
        tieuDe: row.muaQuangCao.tieuDe,
        trangThai: row.muaQuangCao.trangThai,
        soLuotConLai: row.muaQuangCao.soLuotConLai,
        ngayBatDau: row.muaQuangCao.ngayBatDau.toISOString(),
        ngayKetThuc: row.muaQuangCao.ngayKetThuc.toISOString(),
      },
      package: {
        maGoi: row.muaQuangCao.goiQuangCao.maGoi,
        tieuDe: row.muaQuangCao.goiQuangCao.tieuDe,
        loaiHuyHieu: row.muaQuangCao.goiQuangCao.loaiHuyHieu,
      },
      company: company
        ? {
            maCongTy: company.maCongTy,
            tenCongTy: company.tenCongTy,
            slug: company.slug,
            logoUrl: company.logoUrl,
          }
        : null,
      recruiter: {
        maTaiKhoan: row.muaQuangCao.nhaTuyenDung.taiKhoan.maTaiKhoan,
        tenNguoiDung: row.muaQuangCao.nhaTuyenDung.taiKhoan.tenNguoiDung,
        email: row.muaQuangCao.nhaTuyenDung.taiKhoan.email,
      },
    };
  }

  async findAllPackages(
    query: QueryAdminPackagesDto,
  ): Promise<AdminPackagesListResponse> {
    const keyword = query.q?.trim();
    const where: Prisma.GoiQuangCaoWhereInput = {};

    if (query.status && query.status !== 'ALL') {
      where.trangThai = query.status;
    }

    if (keyword) {
      where.OR = [
        { tieuDe: { contains: keyword } },
        { loaiQuangCao: { contains: keyword } },
        { moTaNgan: { contains: keyword } },
      ];
    }

    const rows = await this.prisma.goiQuangCao.findMany({
      where,
      select: PACKAGE_SELECT,
      orderBy: [{ capDoUuTien: 'asc' }, { gia: 'asc' }],
    });

    const items = rows.map((row) => this.mapPackage(row));
    const active = items.filter((item) => item.trangThai === 'HOATDONG').length;
    const hidden = items.filter((item) => item.trangThai === 'DA_AN').length;

    return {
      items,
      summary: {
        total: items.length,
        active,
        hidden,
      },
    };
  }

  async createPackage(
    dto: CreateAdminPackageDto,
  ): Promise<AdminPackageActionResponse> {
    const created = await this.prisma.goiQuangCao.create({
      data: {
        tieuDe: this.truncateText(dto.tieuDe, 100),
        loaiQuangCao: dto.loaiQuangCao
          ? this.truncateText(dto.loaiQuangCao, 50)
          : null,
        gia: Math.round(dto.gia),
        thoiGianHieuLuc: dto.thoiGianHieuLuc,
        soLuotDangTin: dto.soLuotDangTin,
        capDoUuTien: dto.capDoUuTien,
        loaiHuyHieu: dto.loaiHuyHieu ?? null,
        moTaNgan: dto.moTaNgan ? this.truncateText(dto.moTaNgan, 255) : null,
        quyenLoiJson: this.serializeFeatures(dto.quyenLoi),
        trangThai: 'HOATDONG',
        ngayTao: new Date(),
      },
      select: PACKAGE_SELECT,
    });

    return {
      message: `Đã tạo gói dịch vụ "${created.tieuDe}".`,
      package: this.mapPackage(created),
    };
  }

  async updatePackage(
    id: string,
    dto: UpdateAdminPackageDto,
  ): Promise<AdminPackageActionResponse> {
    const existing = await this.prisma.goiQuangCao.findUnique({
      where: { maGoi: id },
      select: { maGoi: true },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy gói dịch vụ.');
    }

    const data: Prisma.GoiQuangCaoUpdateInput = {};
    if (dto.tieuDe !== undefined) {
      data.tieuDe = this.truncateText(dto.tieuDe, 100);
    }
    if (dto.loaiQuangCao !== undefined) {
      data.loaiQuangCao = dto.loaiQuangCao
        ? this.truncateText(dto.loaiQuangCao, 50)
        : null;
    }
    if (dto.gia !== undefined) {
      data.gia = Math.round(dto.gia);
    }
    if (dto.thoiGianHieuLuc !== undefined) {
      data.thoiGianHieuLuc = dto.thoiGianHieuLuc;
    }
    if (dto.soLuotDangTin !== undefined) {
      data.soLuotDangTin = dto.soLuotDangTin;
    }
    if (dto.capDoUuTien !== undefined) {
      data.capDoUuTien = dto.capDoUuTien;
    }
    if (dto.loaiHuyHieu !== undefined) {
      data.loaiHuyHieu = dto.loaiHuyHieu;
    }
    if (dto.moTaNgan !== undefined) {
      data.moTaNgan = dto.moTaNgan
        ? this.truncateText(dto.moTaNgan, 255)
        : null;
    }
    if (dto.quyenLoi !== undefined) {
      data.quyenLoiJson = this.serializeFeatures(dto.quyenLoi);
    }

    const updated = await this.prisma.goiQuangCao.update({
      where: { maGoi: id },
      data,
      select: PACKAGE_SELECT,
    });

    return {
      message: `Đã cập nhật gói dịch vụ "${updated.tieuDe}".`,
      package: this.mapPackage(updated),
    };
  }

  async updatePackageStatus(
    id: string,
    dto: UpdatePackageStatusDto,
  ): Promise<AdminPackageActionResponse> {
    const existing = await this.prisma.goiQuangCao.findUnique({
      where: { maGoi: id },
      select: { maGoi: true, tieuDe: true, trangThai: true },
    });

    if (!existing) {
      throw new NotFoundException('Không tìm thấy gói dịch vụ.');
    }

    const updated = await this.prisma.goiQuangCao.update({
      where: { maGoi: id },
      data: { trangThai: dto.trangThai },
      select: PACKAGE_SELECT,
    });

    return {
      message:
        dto.trangThai === 'DA_AN'
          ? `Đã ẩn gói "${updated.tieuDe}" khỏi trang bảng giá.`
          : `Đã hiển thị lại gói "${updated.tieuDe}" trên trang bảng giá.`,
      package: this.mapPackage(updated),
    };
  }

  private buildTxStatusFilter(
    status: AdminTransactionStatus,
  ): Prisma.ThanhToanWhereInput {
    switch (status) {
      case 'THANH_CONG':
        return { trangThaiTT: { in: SUCCESS_TX_STATUSES } };
      case 'THAT_BAI':
        return { trangThaiTT: { in: FAILED_TX_STATUSES } };
      case 'CHO_THANH_TOAN':
        return { trangThaiTT: { in: PENDING_TX_STATUSES } };
    }
  }

  async findAllTransactions(
    query: QueryAdminTransactionsDto,
  ): Promise<AdminTransactionsListResponse> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 12));
    const keyword = query.q?.trim();

    const andConditions: Prisma.ThanhToanWhereInput[] = [];

    if (query.status && query.status !== 'ALL') {
      andConditions.push(this.buildTxStatusFilter(query.status));
    }

    if (query.packageId && query.packageId !== 'ALL') {
      andConditions.push({
        muaQuangCao: { maGoi: query.packageId },
      });
    }

    if (keyword) {
      andConditions.push({
        OR: [
          { maGiaoDichDoiTac: { contains: keyword } },
          { ghiChu: { contains: keyword } },
          {
            muaQuangCao: {
              goiQuangCao: { tieuDe: { contains: keyword } },
            },
          },
          {
            muaQuangCao: {
              nhaTuyenDung: {
                taiKhoan: { email: { contains: keyword } },
              },
            },
          },
          {
            muaQuangCao: {
              nhaTuyenDung: {
                congTy: { tenCongTy: { contains: keyword } },
              },
            },
          },
        ],
      });
    }

    const where: Prisma.ThanhToanWhereInput =
      andConditions.length > 0 ? { AND: andConditions } : {};

    const [
      rows,
      totalCount,
      successCount,
      pendingCount,
      failedCount,
      revenueAgg,
    ] = await Promise.all([
      this.prisma.thanhToan.findMany({
        where,
        select: TRANSACTION_SELECT,
        orderBy: { ngayThanhToan: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.thanhToan.count({ where }),
      this.prisma.thanhToan.count({
        where: { AND: [where, this.buildTxStatusFilter('THANH_CONG')] },
      }),
      this.prisma.thanhToan.count({
        where: { AND: [where, this.buildTxStatusFilter('CHO_THANH_TOAN')] },
      }),
      this.prisma.thanhToan.count({
        where: { AND: [where, this.buildTxStatusFilter('THAT_BAI')] },
      }),
      this.prisma.thanhToan.aggregate({
        where: { AND: [where, this.buildTxStatusFilter('THANH_CONG')] },
        _sum: { soTienThanhToan: true },
      }),
    ]);

    return {
      items: rows.map((row) => this.mapTransaction(row)),
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / limit)),
      },
      summary: {
        totalCount,
        successCount,
        pendingCount,
        failedCount,
        totalSuccessRevenue: Number(revenueAgg._sum.soTienThanhToan || 0),
      },
    };
  }

  async confirmTransaction(
    id: string,
  ): Promise<ConfirmAdminTransactionResponse> {
    const updatedTx = await this.prisma.$transaction(async (tx) => {
      const target = await tx.thanhToan.findUnique({
        where: { maThanhToan: id },
        select: {
          maThanhToan: true,
          maGiaoDichDoiTac: true,
          trangThaiTT: true,
          muaQuangCao: {
            select: {
              maMua: true,
              goiQuangCao: { select: { tieuDe: true } },
              nhaTuyenDung: { select: { maTaiKhoan: true } },
            },
          },
        },
      });

      if (!target) {
        throw new NotFoundException('Không tìm thấy giao dịch thanh toán.');
      }

      if (this.normalizeTxStatus(target.trangThaiTT) === 'THANH_CONG') {
        throw new BadRequestException(
          'Giao dịch này đã được xác nhận thành công trước đó.',
        );
      }

      const updated = await tx.thanhToan.update({
        where: { maThanhToan: id },
        data: { trangThaiTT: 'Thành công' },
        select: TRANSACTION_SELECT,
      });

      await tx.muaQuangCao.update({
        where: { maMua: target.muaQuangCao.maMua },
        data: { trangThai: 'Đang chạy' },
      });

      await tx.thongBao.create({
        data: {
          maTaiKhoan: target.muaQuangCao.nhaTuyenDung.maTaiKhoan,
          tieuDe: this.truncateText(
            `Đã xác nhận thanh toán gói ${target.muaQuangCao.goiQuangCao.tieuDe}`,
            255,
          ),
          noiDung: `Giao dịch ${target.maGiaoDichDoiTac} đã được Quản trị viên xác nhận thành công. Gói dịch vụ "${target.muaQuangCao.goiQuangCao.tieuDe}" của bạn đã được kích hoạt.`,
          trangThai: 'CHUA_DOC',
        },
      });

      return updated;
    });

    return {
      message: `Đã xác nhận thanh toán thành công cho giao dịch ${updatedTx.maGiaoDichDoiTac}.`,
      transaction: this.mapTransaction(updatedTx),
    };
  }
}
