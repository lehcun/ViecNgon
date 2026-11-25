import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type {
  CompanyReviewsResponse,
  PublicCompanyReviewItem,
  ReviewModerationStatus,
} from '@viecngon/types';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyReviewDto } from './dto/create-company-review.dto';
import { ReportCompanyReviewDto } from './dto/report-company-review.dto';

const PUBLIC_REVIEW_SELECT = {
  maDanhGia: true,
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
  biBaoCao: true,
  ngayDanhGia: true,
} as const;

type SelectedPublicReview = {
  maDanhGia: string;
  rating: unknown;
  diemLuongPhucLoi: number | null;
  diemDaoTao: number | null;
  diemQuanLy: number | null;
  diemVanHoa: number | null;
  diemVanPhong: number | null;
  khuyenLamViec: boolean | null;
  coOtTot: boolean | null;
  tieuDe: string | null;
  noiDung: string | null;
  noiDungUuDiem: string | null;
  noiDungCaiThien: string | null;
  trangThai: string;
  biBaoCao: boolean;
  ngayDanhGia: Date;
};

@Injectable()
export class CompanyReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapPublicReview(row: SelectedPublicReview): PublicCompanyReviewItem {
    return {
      id: row.maDanhGia,
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
      biBaoCao: Boolean(row.biBaoCao),
      createdAt: row.ngayDanhGia.toISOString(),
    };
  }

  async getCompanyReviews(
    companyId: string,
    currentUserId?: string,
  ): Promise<CompanyReviewsResponse> {
    const company = await this.prisma.congTy.findUnique({
      where: { maCongTy: companyId },
      select: { maCongTy: true },
    });
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty.');
    }

    const approvedRows = await this.prisma.danhGia.findMany({
      where: {
        maDoiTuongDuocDanhGia: companyId,
        loaiDoiTuong: 'CONGTY',
        trangThai: 'DA_DUYET',
        deletedAt: null,
      },
      orderBy: { ngayDanhGia: 'desc' },
      select: PUBLIC_REVIEW_SELECT,
    });

    let myPendingReview: PublicCompanyReviewItem | null = null;
    let hasReviewed = false;

    if (currentUserId) {
      const existingOwn = await this.prisma.danhGia.findFirst({
        where: {
          maNguoiDanhGia: currentUserId,
          maDoiTuongDuocDanhGia: companyId,
          loaiDoiTuong: 'CONGTY',
          deletedAt: null,
        },
        orderBy: { ngayDanhGia: 'desc' },
        select: PUBLIC_REVIEW_SELECT,
      });

      if (existingOwn) {
        hasReviewed = true;
        if (existingOwn.trangThai === 'CHO_DUYET') {
          myPendingReview = this.mapPublicReview(existingOwn);
        }
      }
    }

    return {
      reviews: approvedRows.map((row) => this.mapPublicReview(row)),
      myPendingReview,
      hasReviewed,
    };
  }

  async createCompanyReview(
    companyId: string,
    userId: string,
    dto: CreateCompanyReviewDto,
  ): Promise<PublicCompanyReviewItem> {
    const company = await this.prisma.congTy.findUnique({
      where: { maCongTy: companyId },
      select: { maCongTy: true, tenCongTy: true },
    });
    if (!company) {
      throw new NotFoundException('Không tìm thấy thông tin công ty.');
    }

    const duplicated = await this.prisma.danhGia.findFirst({
      where: {
        maNguoiDanhGia: userId,
        maDoiTuongDuocDanhGia: companyId,
        loaiDoiTuong: 'CONGTY',
        deletedAt: null,
      },
      select: { maDanhGia: true },
    });
    if (duplicated) {
      throw new ConflictException(
        'Bạn đã gửi đánh giá cho công ty này rồi. Mỗi tài khoản chỉ được đánh giá 1 lần.',
      );
    }

    const avgRating = Number(
      (
        (dto.diemLuongPhucLoi +
          dto.diemDaoTao +
          dto.diemQuanLy +
          dto.diemVanHoa +
          dto.diemVanPhong) /
        5
      ).toFixed(1),
    );

    const created = await this.prisma.$transaction(async (tx) => {
      const review = await tx.danhGia.create({
        data: {
          maNguoiDanhGia: userId,
          maDoiTuongDuocDanhGia: companyId,
          loaiDoiTuong: 'CONGTY',
          anDanh: true,
          daXacThuc: false,
          trangThai: 'CHO_DUYET',
          rating: avgRating,
          diemLuongPhucLoi: dto.diemLuongPhucLoi,
          diemDaoTao: dto.diemDaoTao,
          diemQuanLy: dto.diemQuanLy,
          diemVanHoa: dto.diemVanHoa,
          diemVanPhong: dto.diemVanPhong,
          khuyenLamViec: dto.khuyenLamViec,
          coOtTot: dto.coOtTot,
          tieuDe: dto.tieuDe.trim().slice(0, 100),
          noiDung: (dto.noiDung ?? '').trim().slice(0, 500) || null,
          noiDungUuDiem: (dto.noiDungUuDiem ?? '').trim() || null,
          noiDungCaiThien: (dto.noiDungCaiThien ?? '').trim() || null,
        },
        select: PUBLIC_REVIEW_SELECT,
      });

      const admins = await tx.taiKhoan.findMany({
        where: { vaiTro: 'ADMIN', deletedAt: null },
        select: { maTaiKhoan: true },
      });

      if (admins.length > 0) {
        const companyLabel = company.tenCongTy || 'doanh nghiệp';
        await tx.thongBao.createMany({
          data: admins.map((admin) => ({
            maTaiKhoan: admin.maTaiKhoan,
            tieuDe: `Đánh giá công ty mới chờ duyệt: ${companyLabel}`.slice(
              0,
              150,
            ),
            noiDung:
              `Có bài đánh giá mới (${avgRating}/5 sao) dành cho ${companyLabel} đang chờ Quản trị viên kiểm duyệt tại mục Kiểm duyệt đánh giá.`.slice(
                0,
                500,
              ),
            trangThai: 'CHUA_DOC',
          })),
        });
      }

      return review;
    });

    return this.mapPublicReview(created);
  }

  async reportCompanyReview(
    reviewId: string,
    recruiterUserId: string,
    dto: ReportCompanyReviewDto,
  ): Promise<{ message: string; id: string }> {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: recruiterUserId },
      select: { maCongTy: true, congTy: { select: { tenCongTy: true } } },
    });
    if (!recruiter?.maCongTy) {
      throw new ForbiddenException(
        'Tài khoản Nhà tuyển dụng chưa liên kết với doanh nghiệp nào.',
      );
    }

    const review = await this.prisma.danhGia.findFirst({
      where: {
        maDanhGia: reviewId,
        loaiDoiTuong: 'CONGTY',
        deletedAt: null,
      },
      select: {
        maDanhGia: true,
        maDoiTuongDuocDanhGia: true,
        trangThai: true,
        tieuDe: true,
        biBaoCao: true,
      },
    });
    if (!review) {
      throw new NotFoundException('Không tìm thấy bài đánh giá này.');
    }
    if (review.maDoiTuongDuocDanhGia !== recruiter.maCongTy) {
      throw new ForbiddenException(
        'Bạn chỉ có thể báo cáo bài đánh giá thuộc doanh nghiệp của mình.',
      );
    }
    if (review.trangThai !== 'DA_DUYET') {
      throw new BadRequestException(
        'Chỉ có thể báo cáo các bài đánh giá đang hiển thị công khai.',
      );
    }
    if (review.biBaoCao) {
      throw new ConflictException(
        'Bài đánh giá này đã được báo cáo lên Quản trị viên trước đó.',
      );
    }

    const cleanReason = dto.lyDoBaoCao.trim().slice(0, 500);
    const companyName = recruiter.congTy?.tenCongTy || 'Doanh nghiệp';

    await this.prisma.$transaction(async (tx) => {
      await tx.danhGia.update({
        where: { maDanhGia: reviewId },
        data: {
          biBaoCao: true,
          lyDoBaoCao: cleanReason,
          ngayBaoCao: new Date(),
        },
      });

      const admins = await tx.taiKhoan.findMany({
        where: { vaiTro: 'ADMIN', deletedAt: null },
        select: { maTaiKhoan: true },
      });

      if (admins.length > 0) {
        await tx.thongBao.createMany({
          data: admins.map((admin) => ({
            maTaiKhoan: admin.maTaiKhoan,
            tieuDe: `Báo cáo vi phạm đánh giá từ ${companyName}`.slice(0, 150),
            noiDung:
              `${companyName} vừa báo cáo vi phạm bài đánh giá "${review.tieuDe || ''}". Lý do: ${cleanReason}`.slice(
                0,
                500,
              ),
            trangThai: 'CHUA_DOC',
          })),
        });
      }
    });

    return {
      id: reviewId,
      message: 'Đã gửi báo cáo vi phạm lên Quản trị viên để xem xét.',
    };
  }
}
