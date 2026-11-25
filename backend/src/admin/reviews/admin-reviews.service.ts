import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  AdminReviewGrowthBucket,
  AdminReviewListItem,
  AdminReviewsListResponse,
  ReviewModerationStatus,
} from '@viecngon/types';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAdminReviewsDto } from './dto/query-admin-reviews.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@Injectable()
export class AdminReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private buildDateRange(query: QueryAdminReviewsDto): {
    gte?: Date;
    lte?: Date;
  } | null {
    const preset = query.datePreset || 'ALL';
    if (preset === 'ALL') return null;

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    if (preset === 'TODAY') return { gte: startOfToday };
    if (preset === 'LAST_7_DAYS') {
      return { gte: new Date(startOfToday.getTime() - 6 * 86400000) };
    }
    if (preset === 'LAST_30_DAYS') {
      return { gte: new Date(startOfToday.getTime() - 29 * 86400000) };
    }
    if (preset === 'THIS_MONTH') {
      return { gte: new Date(now.getFullYear(), now.getMonth(), 1) };
    }
    if (preset === 'CUSTOM') {
      const range: { gte?: Date; lte?: Date } = {};
      if (query.dateFrom) {
        const parsedFrom = new Date(`${query.dateFrom}T00:00:00`);
        if (!Number.isNaN(parsedFrom.getTime())) range.gte = parsedFrom;
      }
      if (query.dateTo) {
        const parsedTo = new Date(`${query.dateTo}T23:59:59`);
        if (!Number.isNaN(parsedTo.getTime())) range.lte = parsedTo;
      }
      return range.gte || range.lte ? range : null;
    }
    return null;
  }

  private computeGrowthBucket(
    rows: { ngayDanhGia: Date; trangThai: string; biBaoCao: boolean }[],
    since: Date,
  ): AdminReviewGrowthBucket {
    const recent = rows.filter((r) => r.ngayDanhGia >= since);
    return {
      total: recent.length,
      pending: recent.filter((r) => r.trangThai === 'CHO_DUYET').length,
      reported: recent.filter((r) => r.biBaoCao).length,
      approved: recent.filter((r) => r.trangThai === 'DA_DUYET').length,
    };
  }

  async getAdminReviews(
    query: QueryAdminReviewsDto,
  ): Promise<AdminReviewsListResponse> {
    const allCompanyReviews = await this.prisma.danhGia.findMany({
      where: { loaiDoiTuong: 'CONGTY', deletedAt: null },
      orderBy: { ngayDanhGia: 'desc' },
      select: {
        maDanhGia: true,
        maDoiTuongDuocDanhGia: true,
        rating: true,
        diemLuongPhucLoi: true,
        diemDaoTao: true,
        diemQuanLy: true,
        diemVanHoa: true,
        diemVanPhong: true,
        khuyenLamViec: true,
        coOtTot: true,
        tieuDe: true,
        noiDung: true,
        noiDungUuDiem: true,
        noiDungCaiThien: true,
        trangThai: true,
        lyDoTuChoi: true,
        biBaoCao: true,
        lyDoBaoCao: true,
        ngayBaoCao: true,
        ngayDanhGia: true,
      },
    });

    const companyIds = Array.from(
      new Set(
        allCompanyReviews
          .map((r) => r.maDoiTuongDuocDanhGia)
          .filter((id): id is string => Boolean(id)),
      ),
    );

    const companies =
      companyIds.length > 0
        ? await this.prisma.congTy.findMany({
            where: { maCongTy: { in: companyIds } },
            select: { maCongTy: true, tenCongTy: true, logoUrl: true },
          })
        : [];

    const companyMap = new Map(companies.map((c) => [c.maCongTy, c]));

    const counts = {
      total: allCompanyReviews.length,
      pending: allCompanyReviews.filter((r) => r.trangThai === 'CHO_DUYET')
        .length,
      reported: allCompanyReviews.filter((r) => r.biBaoCao).length,
      approved: allCompanyReviews.filter((r) => r.trangThai === 'DA_DUYET')
        .length,
      rejected: allCompanyReviews.filter(
        (r) => r.trangThai === 'TU_CHOI' || r.trangThai === 'DA_AN',
      ).length,
    };

    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const startOfWeek = new Date(startOfToday.getTime() - 6 * 86400000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const growth = {
      today: this.computeGrowthBucket(allCompanyReviews, startOfToday),
      week: this.computeGrowthBucket(allCompanyReviews, startOfWeek),
      month: this.computeGrowthBucket(allCompanyReviews, startOfMonth),
    };

    const dateRange = this.buildDateRange(query);
    const q = (query.search || '').trim().toLowerCase();
    const tab = query.tab || 'ALL';

    const filtered = allCompanyReviews.filter((row) => {
      const matchTab =
        tab === 'ALL'
          ? true
          : tab === 'CHO_DUYET'
            ? row.trangThai === 'CHO_DUYET'
            : tab === 'REPORTED'
              ? Boolean(row.biBaoCao)
              : tab === 'DA_DUYET'
                ? row.trangThai === 'DA_DUYET'
                : row.trangThai === 'TU_CHOI' || row.trangThai === 'DA_AN';

      if (!matchTab) return false;

      if (
        query.rating !== undefined &&
        Math.round(Number(row.rating ?? 0)) !== query.rating
      ) {
        return false;
      }

      if (dateRange?.gte && row.ngayDanhGia < dateRange.gte) return false;
      if (dateRange?.lte && row.ngayDanhGia > dateRange.lte) return false;

      if (q) {
        const companyName = (
          companyMap.get(row.maDoiTuongDuocDanhGia || '')?.tenCongTy || ''
        ).toLowerCase();
        const title = (row.tieuDe || '').toLowerCase();
        const content = (row.noiDung || '').toLowerCase();
        if (
          !companyName.includes(q) &&
          !title.includes(q) &&
          !content.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });

    const items: AdminReviewListItem[] = filtered.map((row) => {
      const company = companyMap.get(row.maDoiTuongDuocDanhGia || '');
      return {
        id: row.maDanhGia,
        companyId: row.maDoiTuongDuocDanhGia || '',
        companyName: company?.tenCongTy || 'Doanh nghiệp',
        companyLogo: company?.logoUrl || null,
        rating: Number(row.rating ?? 0),
        diemLuongPhucLoi: row.diemLuongPhucLoi ?? 0,
        diemDaoTao: row.diemDaoTao ?? 0,
        diemQuanLy: row.diemQuanLy ?? 0,
        diemVanHoa: row.diemVanHoa ?? 0,
        diemVanPhong: row.diemVanPhong ?? 0,
        khuyenLamViec: Boolean(row.khuyenLamViec),
        coOtTot: Boolean(row.coOtTot),
        tieuDe: row.tieuDe ?? '',
        noiDung: row.noiDung ?? '',
        noiDungUuDiem: row.noiDungUuDiem ?? '',
        noiDungCaiThien: row.noiDungCaiThien ?? '',
        trangThai: (row.trangThai as ReviewModerationStatus) || 'DA_DUYET',
        lyDoTuChoi: row.lyDoTuChoi ?? null,
        biBaoCao: Boolean(row.biBaoCao),
        lyDoBaoCao: row.lyDoBaoCao ?? null,
        ngayBaoCao: row.ngayBaoCao ? row.ngayBaoCao.toISOString() : null,
        createdAt: row.ngayDanhGia.toISOString(),
      };
    });

    return { items, counts, growth };
  }

  async approveReview(reviewId: string) {
    const existing = await this.prisma.danhGia.findFirst({
      where: { maDanhGia: reviewId, loaiDoiTuong: 'CONGTY', deletedAt: null },
      select: {
        maDanhGia: true,
        maNguoiDanhGia: true,
        maDoiTuongDuocDanhGia: true,
        tieuDe: true,
      },
    });
    if (!existing) {
      throw new NotFoundException('Không tìm thấy bài đánh giá cần duyệt.');
    }

    const company = existing.maDoiTuongDuocDanhGia
      ? await this.prisma.congTy.findUnique({
          where: { maCongTy: existing.maDoiTuongDuocDanhGia },
          select: { tenCongTy: true },
        })
      : null;

    const companyName = company?.tenCongTy || 'doanh nghiệp';

    await this.prisma.$transaction(async (tx) => {
      await tx.danhGia.update({
        where: { maDanhGia: reviewId },
        data: {
          trangThai: 'DA_DUYET',
          biBaoCao: false,
          lyDoTuChoi: null,
        },
      });

      await tx.thongBao.create({
        data: {
          maTaiKhoan: existing.maNguoiDanhGia,
          tieuDe: `Đánh giá về ${companyName} đã được duyệt`.slice(0, 150),
          noiDung:
            `Bài đánh giá "${existing.tieuDe || ''}" của bạn dành cho ${companyName} đã được Quản trị viên duyệt và hiển thị ẩn danh công khai.`.slice(
              0,
              500,
            ),
          trangThai: 'CHUA_DOC',
        },
      });
    });

    return {
      id: reviewId,
      trangThai: 'DA_DUYET',
      message: 'Đã duyệt bài đánh giá.',
    };
  }

  async moderateReview(reviewId: string, dto: ModerateReviewDto) {
    const existing = await this.prisma.danhGia.findFirst({
      where: { maDanhGia: reviewId, loaiDoiTuong: 'CONGTY', deletedAt: null },
      select: {
        maDanhGia: true,
        maNguoiDanhGia: true,
        maDoiTuongDuocDanhGia: true,
        trangThai: true,
        tieuDe: true,
      },
    });
    if (!existing) {
      throw new NotFoundException('Không tìm thấy bài đánh giá cần xử lý.');
    }
    if (dto.trangThai === 'TU_CHOI' && existing.trangThai !== 'CHO_DUYET') {
      throw new BadRequestException(
        'Chỉ có thể từ chối bài đánh giá đang ở trạng thái Chờ duyệt.',
      );
    }

    const company = existing.maDoiTuongDuocDanhGia
      ? await this.prisma.congTy.findUnique({
          where: { maCongTy: existing.maDoiTuongDuocDanhGia },
          select: { tenCongTy: true },
        })
      : null;

    const companyName = company?.tenCongTy || 'doanh nghiệp';
    const cleanReason = dto.lyDoTuChoi.trim().slice(0, 500);

    await this.prisma.$transaction(async (tx) => {
      await tx.danhGia.update({
        where: { maDanhGia: reviewId },
        data: {
          trangThai: dto.trangThai,
          lyDoTuChoi: cleanReason,
          biBaoCao: false,
        },
      });

      const actionLabel =
        dto.trangThai === 'DA_AN' ? 'đã bị ẩn do vi phạm' : 'chưa được duyệt';
      await tx.thongBao.create({
        data: {
          maTaiKhoan: existing.maNguoiDanhGia,
          tieuDe: `Đánh giá về ${companyName} ${actionLabel}`.slice(0, 150),
          noiDung:
            `Bài đánh giá "${existing.tieuDe || ''}" của bạn ${actionLabel}. Lý do: ${cleanReason}`.slice(
              0,
              500,
            ),
          trangThai: 'CHUA_DOC',
        },
      });
    });

    return {
      id: reviewId,
      trangThai: dto.trangThai,
      message:
        dto.trangThai === 'DA_AN'
          ? 'Đã ẩn bài đánh giá vi phạm.'
          : 'Đã từ chối bài đánh giá.',
    };
  }
}
