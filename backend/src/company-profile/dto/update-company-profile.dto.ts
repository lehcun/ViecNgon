import { Transform, TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import type {
  UpdateCompanyInfoPayload,
  UpdateCompanyProfilePayload,
} from '@viecngon/types';
import { COMPANY_PROFILE_CONSTANTS, VALID_URL_OPTIONS } from '../company-profile.constants';
import { TrimToNull } from './transformers';
import { UpdateHrProfileDto } from './update-hr-profile.dto';

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
}

