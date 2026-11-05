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
  CompanyProfileResponse,
  CompanyProfileStats,
  HrProfileInfo,
  UpdateCompanyProfileResponse,
} from '@viecngon/types';
import { PrismaService } from '../prisma/prisma.service';
import { COMPANY_PROFILE_CONSTANTS } from './company-profile.constants';
import {
  sanitizeRichText,
  sanitizePlainText,
  stripHtml,
} from '../common/utils/sanitize-html.util';
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
    const stats = await this.getCompanyStats(congTy);

    return {
      company: this.mapCompanyInfo(congTy),
      hr: this.mapHrInfo(recruiter),
      branches: this.mapBranches(congTy),
      completion: this.calculateCompletion(congTy),
      stats,
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

    const hasCompanyUpdates =
      companyUpdateData !== null && Object.keys(companyUpdateData).length > 0;
    const hasHrUpdates =
      hrUpdateData !== null && Object.keys(hrUpdateData).length > 0;

    if (!hasCompanyUpdates && !hasHrUpdates) {
      throw new BadRequestException('Không có dữ liệu hợp lệ nào được gửi lên để cập nhật.');
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

    if (dto.tenCongTy !== undefined) data.tenCongTy = dto.tenCongTy;
    if (dto.tenPhapLy !== undefined) data.tenPhapLy = this.normalizeString(dto.tenPhapLy);
    if (dto.aboutMe !== undefined) data.aboutMe = sanitizePlainText(dto.aboutMe);
    if (dto.logoUrl !== undefined) data.logoUrl = this.normalizeString(dto.logoUrl);

    // Dọn dẹp Rich Text HTML chống XSS qua shared util
    if (dto.moTa !== undefined) data.moTa = sanitizeRichText(dto.moTa);
    if (dto.phucLoi !== undefined) data.phucLoi = sanitizeRichText(dto.phucLoi);
    if (dto.chuyenMon !== undefined) data.chuyenMon = sanitizeRichText(dto.chuyenMon);

    // Chuẩn hóa và serialize mảng Tag lĩnh vực hoạt động
    if (dto.linhVuc !== undefined) {
      data.linhVuc = this.serializeSectors(dto.linhVuc);
    }

    if (dto.website !== undefined) data.website = this.normalizeString(dto.website);
    if (dto.thanhPho !== undefined) data.thanhPho = this.normalizeString(dto.thanhPho);
    if (dto.diaChi !== undefined) data.diaChi = this.normalizeString(dto.diaChi);
    if (dto.moHinhCongTy !== undefined) data.moHinhCongTy = this.normalizeString(dto.moHinhCongTy);
    if (dto.quyMo !== undefined) data.quyMo = this.normalizeString(dto.quyMo);
    if (dto.quocGia !== undefined) data.quocGia = this.normalizeString(dto.quocGia);
    if (dto.thoiGianLamViec !== undefined) data.thoiGianLamViec = this.normalizeString(dto.thoiGianLamViec);
    if (dto.chinhSachOT !== undefined) data.chinhSachOT = this.normalizeString(dto.chinhSachOT);
    if (dto.giaiThuong !== undefined) data.giaiThuong = this.normalizeString(dto.giaiThuong);

    return data;
  }

  /** Xây dựng payload cập nhật cho bảng NHATUYENDUNG */
  private buildHrUpdatePayload(
    dto: UpdateHrProfileDto,
  ): Prisma.NhaTuyenDungUpdateInput {
    const data: Prisma.NhaTuyenDungUpdateInput = {};
    if (dto.hoTen !== undefined) data.hoTen = this.normalizeString(dto.hoTen);
    if (dto.chucVu !== undefined) data.chucVu = this.normalizeString(dto.chucVu);
    if (dto.soDienThoai !== undefined) data.soDienThoai = this.normalizeString(dto.soDienThoai);
    return data;
  }

  /** Chuẩn hóa chuỗi cơ bản */
  private normalizeString(value?: string | null): string | null {
    if (value === undefined || value === null) return null;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
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
    if (result.length > COMPANY_PROFILE_CONSTANTS.MAX_SECTORS_SERIALIZED_LENGTH) {
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
      .map((branch): CompanyBranchItem => ({
        maChiNhanh: branch.maChiNhanh,
        thanhPho: branch.thanhPho,
        diaChi: branch.diaChi,
        mapUrl: branch.mapUrl ?? null,
        laTruSoChinh:
          mainAddress !== '' && branch.diaChi.trim().toLowerCase() === mainAddress,
      }))
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

  /** Tính các chỉ số thống kê hiển thị trên Tab */
  private async getCompanyStats(
    congTy: CompanyWithBranches,
  ): Promise<CompanyProfileStats> {
    const reviewData = await this.prisma.danhGia.aggregate({
      where: {
        maDoiTuongDuocDanhGia: congTy.maCongTy,
        loaiDoiTuong: COMPANY_PROFILE_CONSTANTS.REVIEW_TARGET_COMPANY,
      },
      _avg: { rating: true },
      _count: { _all: true },
    });

    const avgDecimal = reviewData._avg.rating;
    const averageRating =
      avgDecimal !== null ? Math.round(avgDecimal.toNumber() * 10) / 10 : null;

    return {
      totalBranches: congTy.chiNhanhs.length,
      averageRating,
      totalReviews: reviewData._count._all,
    };
  }
}
