import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type {
  CompanyBranchItem,
  CompanyInfo,
  CompanyProfileCompletion,
  CompanyProfileCompletionField,
  CompanyProfilePostItem,
  CompanyProfileResponse,
  CompanyProfileReviewItem,
  CompanyProfileStats,
  CompanySectionImages,
  HrProfileInfo,
  UpdateCompanyProfileResponse,
  UpsertCompanyBranchPayload,
} from '@viecngon/types';
import { PrismaService } from '../prisma/prisma.service';
import { COMPANY_PROFILE_CONSTANTS } from './company-profile.constants';
import {
  sanitizeRichText,
  sanitizePlainText,
  stripHtml,
} from '../common/utils/sanitize-html.util';
import {
  CreateCompanyPostDto,
  UpdateCompanyPostDto,
} from './dto/company-post.dto';
import {
  UpdateCompanyInfoDto,
  UpdateCompanyProfileDto,
} from './dto/update-company-profile.dto';
import { UpdateHrProfileDto } from './dto/update-hr-profile.dto';

/** Cấu hình truy vấn include đồng bộ */
const RECRUITER_PROFILE_INCLUDE = {
  taiKhoan: { select: { email: true, tenNguoiDung: true } },
  congTy: {
    include: {
      chiNhanhs: { orderBy: { thanhPho: 'asc' } },
      baiViets: { orderBy: { ngayDang: 'desc' }, take: 30 },
      _count: {
        select: {
          nguoiTheoDois: true,
          baiViets: true,
        },
      },
    },
  },
} satisfies Prisma.NhaTuyenDungInclude;

type RecruiterProfileResult = Prisma.NhaTuyenDungGetPayload<{
  include: typeof RECRUITER_PROFILE_INCLUDE;
}>;

type CompanyWithBranches = RecruiterProfileResult['congTy'];

@Injectable()
export class CompanyProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 1. LẤY HỒ SƠ DOANH NGHIỆP
   * Truy vấn thông tin Công ty + HR + Chi nhánh + Chỉ số hoàn thiện dựa trên maTaiKhoan.
   */
  async getCompanyProfile(userId: string): Promise<CompanyProfileResponse> {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
      include: RECRUITER_PROFILE_INCLUDE,
    });

    if (!recruiter || !recruiter.congTy) {
      throw new NotFoundException(
        'Không tìm thấy hồ sơ doanh nghiệp liên kết với tài khoản này.',
      );
    }

    const { congTy } = recruiter;
    const { reviews, stats } = await this.getCompanyReviewsAndStats(congTy);

    return {
      company: this.mapCompanyInfo(congTy),
      hr: this.mapHrInfo(recruiter),
      branches: this.mapBranches(congTy),
      posts: this.mapPosts(congTy),
      reviews,
      completion: this.calculateCompletion(congTy),
      stats,
    };
  }

  /**
   * 3. QUẢN LÝ BÀI VIẾT CÔNG TY (TAB BÀI VIẾT TRÊN DETAIL COMPANY)
   */
  async createCompanyPost(
    userId: string,
    dto: CreateCompanyPostDto,
  ): Promise<CompanyProfilePostItem> {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
      select: { maCongTy: true },
    });
    if (!recruiter) {
      throw new NotFoundException(
        'Không tìm thấy tài khoản nhà tuyển dụng trong hệ thống.',
      );
    }

    const tieuDe = this.truncateText(stripHtml(dto.tieuDe), 255);
    const noiDung = sanitizePlainText(dto.noiDung);
    if (!tieuDe || !noiDung) {
      throw new BadRequestException(
        'Tiêu đề và nội dung bài viết không được để trống.',
      );
    }

    const created = await this.prisma.baiViet.create({
      data: {
        maCongTy: recruiter.maCongTy,
        tieuDe,
        anhBiaUrl: this.truncateText(dto.anhBiaUrl, 255),
        noiDung,
      },
    });

    return {
      maBaiViet: created.maBaiViet,
      tieuDe: created.tieuDe,
      anhBiaUrl: created.anhBiaUrl ?? null,
      noiDung: created.noiDung,
      ngayDang: created.ngayDang,
    };
  }

  async updateCompanyPost(
    userId: string,
    postId: string,
    dto: UpdateCompanyPostDto,
  ): Promise<CompanyProfilePostItem> {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
      select: { maCongTy: true },
    });
    if (!recruiter) {
      throw new NotFoundException(
        'Không tìm thấy tài khoản nhà tuyển dụng trong hệ thống.',
      );
    }

    const existing = await this.prisma.baiViet.findFirst({
      where: { maBaiViet: postId, maCongTy: recruiter.maCongTy },
      select: { maBaiViet: true },
    });
    if (!existing) {
      throw new NotFoundException(
        'Không tìm thấy bài viết thuộc doanh nghiệp của bạn.',
      );
    }

    const data: Prisma.BaiVietUpdateInput = {};
    if (dto.tieuDe !== undefined) {
      const tieuDe = this.truncateText(stripHtml(dto.tieuDe), 255);
      if (!tieuDe) {
        throw new BadRequestException('Tiêu đề bài viết không được để trống.');
      }
      data.tieuDe = tieuDe;
    }
    if (dto.anhBiaUrl !== undefined) {
      data.anhBiaUrl = this.truncateText(dto.anhBiaUrl, 255);
    }
    if (dto.noiDung !== undefined) {
      const noiDung = sanitizePlainText(dto.noiDung);
      if (!noiDung) {
        throw new BadRequestException('Nội dung bài viết không được để trống.');
      }
      data.noiDung = noiDung;
    }

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Không có dữ liệu hợp lệ nào để cập nhật bài viết.',
      );
    }

    const updated = await this.prisma.baiViet.update({
      where: { maBaiViet: postId },
      data,
    });

    return {
      maBaiViet: updated.maBaiViet,
      tieuDe: updated.tieuDe,
      anhBiaUrl: updated.anhBiaUrl ?? null,
      noiDung: updated.noiDung,
      ngayDang: updated.ngayDang,
    };
  }

  async deleteCompanyPost(
    userId: string,
    postId: string,
  ): Promise<{ message: string; deletedId: string }> {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
      select: { maCongTy: true },
    });
    if (!recruiter) {
      throw new NotFoundException(
        'Không tìm thấy tài khoản nhà tuyển dụng trong hệ thống.',
      );
    }

    const existing = await this.prisma.baiViet.findFirst({
      where: { maBaiViet: postId, maCongTy: recruiter.maCongTy },
      select: { maBaiViet: true },
    });
    if (!existing) {
      throw new NotFoundException(
        'Không tìm thấy bài viết thuộc doanh nghiệp của bạn.',
      );
    }

    await this.prisma.baiViet.delete({
      where: { maBaiViet: postId },
    });

    return {
      message: 'Đã xóa bài viết thành công.',
      deletedId: postId,
    };
  }

  /**
   * 2. CẬP NHẬT HỒ SƠ DOANH NGHIỆP
   * - Áp dụng sanitize-html dọn dẹp các trường Rich Text (moTa, phucLoi, chuyenMon) chống XSS.
   * - Thực hiện trong Prisma Transaction để cập nhật đồng bộ cả Công ty và HR.
   */
  async updateCompanyProfile(
    userId: string,
    dto: UpdateCompanyProfileDto,
  ): Promise<UpdateCompanyProfileResponse> {
    const recruiter = await this.prisma.nhaTuyenDung.findUnique({
      where: { maTaiKhoan: userId },
      select: { maNTD: true, maCongTy: true },
    });

    if (!recruiter) {
      throw new NotFoundException(
        'Không tìm thấy tài khoản nhà tuyển dụng trong hệ thống.',
      );
    }

    // Xử lý và chuẩn hóa dữ liệu trước khi mở transaction
    const companyUpdateData = dto.company
      ? this.buildCompanyUpdatePayload(dto.company)
      : null;
    const hrUpdateData = dto.hr ? this.buildHrUpdatePayload(dto.hr) : null;
    const hasBranchUpdates = Array.isArray(dto.branches);

    const hasCompanyUpdates =
      companyUpdateData !== null && Object.keys(companyUpdateData).length > 0;
    const hasHrUpdates =
      hrUpdateData !== null && Object.keys(hrUpdateData).length > 0;

    if (!hasCompanyUpdates && !hasHrUpdates && !hasBranchUpdates) {
      throw new BadRequestException(
        'Không có dữ liệu hợp lệ nào được gửi lên để cập nhật.',
      );
    }

    // Thực hiện cập nhật an toàn trong transaction
    await this.prisma.$transaction(async (tx) => {
      if (hasCompanyUpdates && companyUpdateData) {
        await tx.congTy.update({
          where: { maCongTy: recruiter.maCongTy },
          data: companyUpdateData,
        });
      }

      if (hasHrUpdates && hrUpdateData) {
        await tx.nhaTuyenDung.update({
          where: { maNTD: recruiter.maNTD },
          data: hrUpdateData,
        });
      }

      if (hasBranchUpdates && dto.branches) {
        await this.syncCompanyBranches(tx, recruiter.maCongTy, dto.branches);
      }
    });

    return {
      message: 'Cập nhật hồ sơ doanh nghiệp thành công.',
      data: await this.getCompanyProfile(userId),
    };
  }

  // =====================================================================
  // CÁC HÀM XỬ LÝ NỘI BỘ (PRIVATE HELPERS)
  // =====================================================================

  /** Xây dựng payload cập nhật cho bảng CONGTY (đã sanitize kỹ lưỡng) */
  private buildCompanyUpdatePayload(
    dto: UpdateCompanyInfoDto,
  ): Prisma.CongTyUpdateInput {
    const data: Prisma.CongTyUpdateInput = {};

    if (dto.tenCongTy !== undefined) {
      const truncatedName = this.truncateText(dto.tenCongTy, 150);
      if (truncatedName) data.tenCongTy = truncatedName;
    }
    if (dto.tenPhapLy !== undefined) {
      data.tenPhapLy = this.truncateText(dto.tenPhapLy, 255);
    }
    if (dto.aboutMe !== undefined) {
      data.aboutMe = sanitizeRichText(dto.aboutMe);
    }
    if (dto.logoUrl !== undefined) {
      data.logoUrl = this.truncateText(dto.logoUrl, 255);
    }

    // Dọn dẹp Rich Text HTML chống XSS qua shared util
    if (dto.moTa !== undefined) data.moTa = sanitizeRichText(dto.moTa);
    if (dto.phucLoi !== undefined) data.phucLoi = sanitizeRichText(dto.phucLoi);
    if (dto.chuyenMon !== undefined)
      data.chuyenMon = sanitizeRichText(dto.chuyenMon);

    // Chuẩn hóa và serialize mảng Tag lĩnh vực hoạt động
    if (dto.linhVuc !== undefined) {
      data.linhVuc = this.serializeSectors(dto.linhVuc);
    }

    if (dto.website !== undefined)
      data.website = this.truncateText(dto.website, 100);
    if (dto.thanhPho !== undefined)
      data.thanhPho = this.truncateText(dto.thanhPho, 100);
    if (dto.diaChi !== undefined)
      data.diaChi = this.truncateText(dto.diaChi, 255);
    if (dto.moHinhCongTy !== undefined) {
      data.moHinhCongTy = this.truncateText(dto.moHinhCongTy, 100);
    }
    if (dto.quyMo !== undefined) data.quyMo = this.truncateText(dto.quyMo, 100);
    if (dto.quocGia !== undefined)
      data.quocGia = this.truncateText(dto.quocGia, 100);
    if (dto.thoiGianLamViec !== undefined) {
      data.thoiGianLamViec = this.truncateText(dto.thoiGianLamViec, 100);
    }
    if (dto.chinhSachOT !== undefined) {
      data.chinhSachOT = this.truncateText(dto.chinhSachOT, 150);
    }
    if (dto.giaiThuong !== undefined) {
      data.giaiThuong = this.truncateText(dto.giaiThuong, 255);
    }

    if (dto.sectionImages !== undefined) {
      data.hinhAnhCongTyJson = JSON.stringify({
        introImages: this.sanitizeImageArray(dto.sectionImages.introImages),
        cultureImages: this.sanitizeImageArray(dto.sectionImages.cultureImages),
      } satisfies CompanySectionImages);
    }

    return data;
  }

  /** Đồng bộ danh sách chi nhánh và tọa độ trong transaction */
  private async syncCompanyBranches(
    tx: Prisma.TransactionClient,
    maCongTy: string,
    branches: UpsertCompanyBranchPayload[],
  ): Promise<void> {
    const existing = await tx.chiNhanh.findMany({
      where: { maCongTy },
      select: { maChiNhanh: true },
    });
    const existingIds = new Set(existing.map((b) => b.maChiNhanh));

    const keepIds = new Set(
      branches
        .map((b) => b.maChiNhanh)
        .filter((id): id is string => Boolean(id && existingIds.has(id))),
    );
    const deletedIds = Array.from(existingIds).filter((id) => !keepIds.has(id));

    if (deletedIds.length > 0) {
      await tx.congViec.updateMany({
        where: { maChiNhanh: { in: deletedIds } },
        data: { maChiNhanh: null },
      });
      await tx.chiNhanh.deleteMany({
        where: { maCongTy, maChiNhanh: { in: deletedIds } },
      });
    }

    for (const branch of branches) {
      const thanhPho = this.truncateText(branch.thanhPho, 100);
      const diaChi = this.truncateText(branch.diaChi, 255);
      if (!thanhPho || !diaChi) continue;

      const data = {
        thanhPho,
        diaChi,
        mapUrl: this.truncateText(branch.mapUrl, 500),
        viDo:
          typeof branch.viDo === 'number' && Number.isFinite(branch.viDo)
            ? branch.viDo
            : null,
        kinhDo:
          typeof branch.kinhDo === 'number' && Number.isFinite(branch.kinhDo)
            ? branch.kinhDo
            : null,
      };

      if (branch.maChiNhanh && existingIds.has(branch.maChiNhanh)) {
        await tx.chiNhanh.update({
          where: { maChiNhanh: branch.maChiNhanh },
          data,
        });
      } else {
        await tx.chiNhanh.create({
          data: { maCongTy, ...data },
        });
      }
    }
  }

  /** Chuẩn hóa chuỗi cơ bản & cắt độ dài an toàn chống lỗi tràn SQL Server */
  private normalizeString(value?: string | null): string | null {
    if (value === undefined || value === null) return null;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  }

  private truncateText(
    value: string | null | undefined,
    maxLength: number,
  ): string | null {
    const normalized = this.normalizeString(value);
    return normalized ? normalized.slice(0, maxLength) : null;
  }

  private sanitizeImageArray(urls?: unknown): string[] {
    if (!Array.isArray(urls)) return [];
    return urls
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim().slice(0, 500))
      .filter(
        (item) => item.startsWith('http://') || item.startsWith('https://'),
      )
      .slice(0, 8);
  }

  private parseSectionImages(raw?: string | null): CompanySectionImages {
    if (!raw) return { introImages: [], cultureImages: [] };
    try {
      const parsed = JSON.parse(raw) as Partial<CompanySectionImages>;
      return {
        introImages: this.sanitizeImageArray(parsed.introImages),
        cultureImages: this.sanitizeImageArray(parsed.cultureImages),
      };
    } catch {
      return { introImages: [], cultureImages: [] };
    }
  }

  /** Xây dựng payload cập nhật cho bảng NHATUYENDUNG */
  private buildHrUpdatePayload(
    dto: UpdateHrProfileDto,
  ): Prisma.NhaTuyenDungUpdateInput {
    const data: Prisma.NhaTuyenDungUpdateInput = {};
    if (dto.hoTen !== undefined) data.hoTen = this.truncateText(dto.hoTen, 100);
    if (dto.chucVu !== undefined)
      data.chucVu = this.truncateText(dto.chucVu, 100);
    if (dto.soDienThoai !== undefined)
      data.soDienThoai = this.truncateText(dto.soDienThoai, 20);
    return data;
  }

  /** Serialize mảng tags lĩnh vực thành chuỗi lưu DB (loại bỏ trùng lặp) */
  private serializeSectors(sectors: string[]): string | null {
    const seen = new Set<string>();
    const unique = sectors
      .map((s) => stripHtml(s) || '')
      .map((s) => s.trim())
      .filter((s) => {
        const key = s.toLowerCase();
        if (s === '' || seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    if (unique.length === 0) return null;

    const result = unique.join(COMPANY_PROFILE_CONSTANTS.SECTOR_SEPARATOR);
    if (
      result.length > COMPANY_PROFILE_CONSTANTS.MAX_SECTORS_SERIALIZED_LENGTH
    ) {
      throw new BadRequestException(
        `Tổng độ dài các lĩnh vực vượt quá giới hạn cho phép (${COMPANY_PROFILE_CONSTANTS.MAX_SECTORS_SERIALIZED_LENGTH} ký tự).`,
      );
    }
    return result;
  }

  /** Parse chuỗi từ DB ra mảng tags */
  private parseSectors(raw?: string | null): string[] {
    if (!raw) return [];
    return raw
      .split(/[,;|]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  /** Map dữ liệu bảng CONGTY ra Interface chuẩn */
  private mapCompanyInfo(congTy: CompanyWithBranches): CompanyInfo {
    return {
      maCongTy: congTy.maCongTy,
      tenCongTy: congTy.tenCongTy,
      tenPhapLy: congTy.tenPhapLy ?? null,
      slug: congTy.slug,
      moTa: congTy.moTa ?? null,
      phucLoi: congTy.phucLoi ?? null,
      chuyenMon: congTy.chuyenMon ?? null,
      aboutMe: congTy.aboutMe ?? null,
      logoUrl: congTy.logoUrl ?? null,
      website: congTy.website ?? null,
      thanhPho: congTy.thanhPho ?? null,
      diaChi: congTy.diaChi ?? null,
      moHinhCongTy: congTy.moHinhCongTy ?? null,
      linhVuc: this.parseSectors(congTy.linhVuc),
      quyMo: congTy.quyMo ?? null,
      quocGia: congTy.quocGia ?? null,
      thoiGianLamViec: congTy.thoiGianLamViec ?? null,
      chinhSachOT: congTy.chinhSachOT ?? null,
      giaiThuong: congTy.giaiThuong ?? null,
      sectionImages: this.parseSectionImages(congTy.hinhAnhCongTyJson),
    };
  }

  /** Map thông tin HR */
  private mapHrInfo(recruiter: RecruiterProfileResult): HrProfileInfo {
    return {
      maNTD: recruiter.maNTD,
      hoTen: recruiter.hoTen ?? null,
      chucVu: recruiter.chucVu ?? null,
      soDienThoai: recruiter.soDienThoai ?? null,
      email: recruiter.taiKhoan?.email ?? '',
    };
  }

  /** Map danh sách chi nhánh và nhận diện Trụ sở chính */
  private mapBranches(congTy: CompanyWithBranches): CompanyBranchItem[] {
    const mainAddress = congTy.diaChi?.trim().toLowerCase() ?? '';

    return congTy.chiNhanhs
      .map(
        (branch): CompanyBranchItem => ({
          maChiNhanh: branch.maChiNhanh,
          thanhPho: branch.thanhPho,
          diaChi: branch.diaChi,
          mapUrl: branch.mapUrl ?? null,
          viDo: branch.viDo ?? null,
          kinhDo: branch.kinhDo ?? null,
          laTruSoChinh:
            mainAddress !== '' &&
            branch.diaChi.trim().toLowerCase() === mainAddress,
        }),
      )
      .sort((a, b) => Number(b.laTruSoChinh) - Number(a.laTruSoChinh));
  }

  /** Tính toán % độ hoàn thiện hồ sơ */
  private calculateCompletion(
    congTy: CompanyWithBranches,
  ): CompanyProfileCompletion {
    const checkFields: Record<CompanyProfileCompletionField, boolean> = {
      tenCongTy: Boolean(congTy.tenCongTy?.trim()),
      logoUrl: Boolean(congTy.logoUrl?.trim()),
      aboutMe: Boolean(congTy.aboutMe?.trim()),
      moTa: Boolean(congTy.moTa?.trim()),
      phucLoi: Boolean(congTy.phucLoi?.trim()),
      linhVuc: this.parseSectors(congTy.linhVuc).length > 0,
      website: Boolean(congTy.website?.trim()),
      thanhPho: Boolean(congTy.thanhPho?.trim()),
      diaChi: Boolean(congTy.diaChi?.trim()),
      quyMo: Boolean(congTy.quyMo?.trim()),
      quocGia: Boolean(congTy.quocGia?.trim()),
      moHinhCongTy: Boolean(congTy.moHinhCongTy?.trim()),
      thoiGianLamViec: Boolean(congTy.thoiGianLamViec?.trim()),
      chiNhanhs: congTy.chiNhanhs.length > 0,
    };

    const allKeys = Object.keys(checkFields) as CompanyProfileCompletionField[];
    const missingFields = allKeys.filter((k) => !checkFields[k]);
    const percent = Math.round(
      ((allKeys.length - missingFields.length) / allKeys.length) * 100,
    );

    return { percent, missingFields };
  }

  private mapPosts(congTy: CompanyWithBranches): CompanyProfilePostItem[] {
    return (congTy.baiViets ?? []).map((post) => ({
      maBaiViet: post.maBaiViet,
      tieuDe: post.tieuDe,
      anhBiaUrl: post.anhBiaUrl ?? null,
      noiDung: post.noiDung,
      ngayDang: post.ngayDang,
    }));
  }

  /** Lấy danh sách đánh giá thực tế và chỉ số thống kê đồng bộ với DetailCompany */
  private async getCompanyReviewsAndStats(
    congTy: CompanyWithBranches,
  ): Promise<{
    reviews: CompanyProfileReviewItem[];
    stats: CompanyProfileStats;
  }> {
    const now = new Date();
    const reviewWhere = {
      maDoiTuongDuocDanhGia: congTy.maCongTy,
      loaiDoiTuong: COMPANY_PROFILE_CONSTANTS.REVIEW_TARGET_COMPANY,
      trangThai: 'DA_DUYET',
      deletedAt: null,
    };

    const [rawReviews, reviewAggregate, recommendCount, totalActiveJobs] =
      await Promise.all([
        this.prisma.danhGia.findMany({
          where: reviewWhere,
          orderBy: { ngayDanhGia: 'desc' },
          take: 30,
        }),
        this.prisma.danhGia.aggregate({
          where: reviewWhere,
          _avg: { rating: true },
          _count: { _all: true },
        }),
        this.prisma.danhGia.count({
          where: {
            ...reviewWhere,
            khuyenLamViec: true,
          },
        }),
        this.prisma.congViec.count({
          where: {
            nhaTuyenDung: { maCongTy: congTy.maCongTy },
            trangThai: { in: ['Đang tuyển', 'DA_DUYET'] },
            deletedAt: null,
            OR: [{ ngayHetHan: null }, { ngayHetHan: { gte: now } }],
          },
        }),
      ]);

    const reviews: CompanyProfileReviewItem[] = rawReviews.map((review) => ({
      id: review.maDanhGia,
      title: review.tieuDe?.trim() || 'Đánh giá môi trường làm việc',
      content: review.noiDung ?? null,
      pros: review.noiDungUuDiem ?? null,
      cons: review.noiDungCaiThien ?? null,
      rating: review.rating !== null ? Number(review.rating) : 5,
      recommend: review.khuyenLamViec ?? true,
      createdAt: review.ngayDanhGia,
    }));

    const totalReviews = reviewAggregate._count._all;
    const avgDecimal = reviewAggregate._avg.rating;
    const averageRating =
      avgDecimal !== null ? Math.round(avgDecimal.toNumber() * 10) / 10 : null;
    const recommendPercent =
      totalReviews > 0
        ? Math.round((recommendCount / totalReviews) * 100)
        : null;

    return {
      reviews,
      stats: {
        totalBranches: congTy.chiNhanhs.length,
        averageRating,
        totalReviews,
        recommendPercent,
        totalPosts: congTy._count?.baiViets ?? congTy.baiViets.length,
        totalActiveJobs,
        followerCount: congTy._count?.nguoiTheoDois ?? 0,
      },
    };
  }
}
