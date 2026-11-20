import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import type {
  CompanySectionImages,
  UpdateCompanyInfoPayload,
  UpdateCompanyProfilePayload,
  UpsertCompanyBranchPayload,
} from '@viecngon/types';
import { COMPANY_PROFILE_CONSTANTS, VALID_URL_OPTIONS } from '../company-profile.constants';
import { TrimToNull } from './transformers';
import { UpdateHrProfileDto } from './update-hr-profile.dto';

export class CompanySectionImagesDto implements CompanySectionImages {
  @IsOptional()
  @IsArray({ message: 'Danh sách ảnh giới thiệu phải là mảng chuỗi' })
  @ArrayMaxSize(8, { message: 'Tối đa 8 ảnh cho phần Giới thiệu công ty' })
  @IsString({ each: true, message: 'Mỗi đường dẫn ảnh phải là chuỗi ký tự' })
  @MaxLength(500, { each: true, message: 'Đường dẫn ảnh tối đa 500 ký tự' })
  introImages!: string[];

  @IsOptional()
  @IsArray({ message: 'Danh sách ảnh văn hóa phải là mảng chuỗi' })
  @ArrayMaxSize(8, { message: 'Tối đa 8 ảnh cho phần Văn hóa & Phúc lợi' })
  @IsString({ each: true, message: 'Mỗi đường dẫn ảnh phải là chuỗi ký tự' })
  @MaxLength(500, { each: true, message: 'Đường dẫn ảnh tối đa 500 ký tự' })
  cultureImages!: string[];
}

function parseNullableCoordinate({ value }: TransformFnParams): unknown {
  if (value === '' || value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : NaN;
  if (typeof value === 'string') {
    const parsed = Number(value.trim());
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
}

export class UpsertCompanyBranchDto implements UpsertCompanyBranchPayload {
  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Mã chi nhánh phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Mã chi nhánh tối đa 50 ký tự' })
  maChiNhanh?: string;

  @TrimToNull()
  @IsString({ message: 'Thành phố chi nhánh phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Thành phố chi nhánh không được để trống' })
  @MaxLength(100, { message: 'Thành phố chi nhánh tối đa 100 ký tự' })
  thanhPho!: string;

  @TrimToNull()
  @IsString({ message: 'Địa chỉ chi nhánh phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Địa chỉ chi nhánh không được để trống' })
  @MaxLength(255, { message: 'Địa chỉ chi nhánh tối đa 255 ký tự' })
  diaChi!: string;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Đường dẫn bản đồ phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Đường dẫn bản đồ tối đa 500 ký tự' })
  mapUrl?: string | null;

  @IsOptional()
  @Transform(parseNullableCoordinate)
  @IsNumber({}, { message: 'Vĩ độ (Latitude) phải là số hợp lệ' })
  @Min(-90, { message: 'Vĩ độ phải nằm trong khoảng -90 đến 90' })
  @Max(90, { message: 'Vĩ độ phải nằm trong khoảng -90 đến 90' })
  viDo?: number | null;

  @IsOptional()
  @Transform(parseNullableCoordinate)
  @IsNumber({}, { message: 'Kinh độ (Longitude) phải là số hợp lệ' })
  @Min(-180, { message: 'Kinh độ phải nằm trong khoảng -180 đến 180' })
  @Max(180, { message: 'Kinh độ phải nằm trong khoảng -180 đến 180' })
  kinhDo?: number | null;
}

/**
 * DTO Cập nhật thông tin Công ty (Bảng CONGTY)
 * Độ dài tối đa bám sát các cột trong Prisma schema (SQL Server).
 */
export class UpdateCompanyInfoDto implements UpdateCompanyInfoPayload {
  // --- Khối Thông tin chung & Header ---
  @ValidateIf((_: UpdateCompanyInfoDto, value: unknown) => value !== undefined)
  @TrimToNull()
  @IsString({ message: 'Tên công ty phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  @MaxLength(150, { message: 'Tên công ty tối đa 150 ký tự' })
  tenCongTy?: string;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Tên pháp lý phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Tên pháp lý tối đa 255 ký tự' })
  tenPhapLy?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Slogan / Giới thiệu ngắn phải là chuỗi ký tự' })
  @MaxLength(500, { message: 'Slogan tối đa 500 ký tự' })
  aboutMe?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsUrl(VALID_URL_OPTIONS, { message: 'Logo URL không đúng định dạng HTTP/HTTPS' })
  @MaxLength(255, { message: 'Logo URL tối đa 255 ký tự' })
  logoUrl?: string | null;

  // --- Khối Rich Text (Sẽ được sanitize-html dọn dẹp) ---
  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Mô tả công ty phải là chuỗi ký tự' })
  @MaxLength(COMPANY_PROFILE_CONSTANTS.MAX_RICH_TEXT_LENGTH, {
    message: 'Nội dung mô tả giới thiệu quá dài',
  })
  moTa?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Chính sách phúc lợi phải là chuỗi ký tự' })
  @MaxLength(COMPANY_PROFILE_CONSTANTS.MAX_RICH_TEXT_LENGTH, {
    message: 'Nội dung phúc lợi quá dài',
  })
  phucLoi?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Nội dung chuyên môn phải là chuỗi ký tự' })
  @MaxLength(COMPANY_PROFILE_CONSTANTS.MAX_RICH_TEXT_LENGTH, {
    message: 'Nội dung chuyên môn quá dài',
  })
  chuyenMon?: string | null;

  // --- Lĩnh vực hoạt động trọng tâm (Tags) ---
  @IsOptional()
  @IsArray({ message: 'Lĩnh vực hoạt động phải là một mảng chuỗi' })
  @ArrayMaxSize(COMPANY_PROFILE_CONSTANTS.MAX_SECTORS, {
    message: `Tối đa ${COMPANY_PROFILE_CONSTANTS.MAX_SECTORS} lĩnh vực hoạt động`,
  })
  @Transform(({ value }: TransformFnParams): unknown => {
    if (!Array.isArray(value)) return value;
    return value
      .map((item: unknown) => (typeof item === 'string' ? item.trim() : item))
      .filter((item: unknown) => typeof item === 'string' && item !== '');
  })
  @IsString({ each: true, message: 'Mỗi tag lĩnh vực phải là chuỗi ký tự' })
  @MaxLength(COMPANY_PROFILE_CONSTANTS.MAX_SECTOR_LENGTH, {
    each: true,
    message: `Mỗi tag lĩnh vực tối đa ${COMPANY_PROFILE_CONSTANTS.MAX_SECTOR_LENGTH} ký tự`,
  })
  @Matches(/^[^,;|]+$/, {
    each: true,
    message: 'Tag lĩnh vực không được chứa các ký tự phân tách đặc biệt (, ; |)',
  })
  linhVuc?: string[];

  // --- Khối Thông tin bổ sung & Vận hành ---
  @IsOptional()
  @TrimToNull()
  @IsUrl(VALID_URL_OPTIONS, { message: 'Website không đúng định dạng HTTP/HTTPS' })
  @MaxLength(100, { message: 'Website tối đa 100 ký tự' })
  website?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Tỉnh/Thành phố phải là chuỗi ký tự' })
  @MaxLength(50, { message: 'Thành phố tối đa 50 ký tự' })
  thanhPho?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Địa chỉ trụ sở phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Địa chỉ tối đa 255 ký tự' })
  diaChi?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Mô hình công ty phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Mô hình công ty tối đa 100 ký tự' })
  moHinhCongTy?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Quy mô nhân sự phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Quy mô tối đa 100 ký tự' })
  quyMo?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Thị trường / Quốc gia phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Quốc gia / Thị trường tối đa 100 ký tự' })
  quocGia?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Thời gian làm việc phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Thời gian làm việc tối đa 100 ký tự' })
  thoiGianLamViec?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Chính sách OT phải là chuỗi ký tự' })
  @MaxLength(150, { message: 'Chính sách OT tối đa 150 ký tự' })
  chinhSachOT?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Giải thưởng phải là chuỗi ký tự' })
  @MaxLength(255, { message: 'Giải thưởng tối đa 255 ký tự' })
  giaiThuong?: string | null;

  @IsOptional()
  @IsObject({ message: 'Hình ảnh section phải là một đối tượng' })
  @ValidateNested()
  @Type(() => CompanySectionImagesDto)
  sectionImages?: CompanySectionImagesDto;
}

/**
 * Root DTO nhận payload cập nhật hồ sơ doanh nghiệp toàn diện
 */
export class UpdateCompanyProfileDto implements UpdateCompanyProfilePayload {
  @IsOptional()
  @IsObject({ message: 'Thông tin công ty phải là một đối tượng' })
  @ValidateNested()
  @Type(() => UpdateCompanyInfoDto)
  company?: UpdateCompanyInfoDto;

  @IsOptional()
  @IsObject({ message: 'Thông tin HR phải là một đối tượng' })
  @ValidateNested()
  @Type(() => UpdateHrProfileDto)
  hr?: UpdateHrProfileDto;

  @IsOptional()
  @IsArray({ message: 'Danh sách chi nhánh phải là mảng' })
  @ArrayMaxSize(20, { message: 'Tối đa 20 chi nhánh cho mỗi doanh nghiệp' })
  @ValidateNested({ each: true })
  @Type(() => UpsertCompanyBranchDto)
  branches?: UpsertCompanyBranchDto[];
}

