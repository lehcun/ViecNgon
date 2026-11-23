import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateAdminPackageDto {
  @IsString({ message: 'Tên gói dịch vụ không hợp lệ' })
  @MinLength(2, { message: 'Tên gói dịch vụ tối thiểu 2 ký tự' })
  @MaxLength(100, { message: 'Tên gói dịch vụ tối đa 100 ký tự' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  tieuDe: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  loaiQuangCao?: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Giá gói phải là số hợp lệ' })
  @Min(0, { message: 'Giá gói không được âm' })
  gia: number;

  @Type(() => Number)
  @IsInt({ message: 'Thời gian hiệu lực phải là số nguyên (ngày)' })
  @Min(1, { message: 'Thời gian hiệu lực tối thiểu 1 ngày' })
  @Max(365, { message: 'Thời gian hiệu lực tối đa 365 ngày' })
  thoiGianHieuLuc: number;

  @Type(() => Number)
  @IsInt({ message: 'Số lượt đăng tin phải là số nguyên' })
  @Min(1, { message: 'Số lượt đăng tin tối thiểu 1 lượt' })
  @Max(500, { message: 'Số lượt đăng tin tối đa 500 lượt' })
  soLuotDangTin: number;

  @Type(() => Number)
  @IsInt({ message: 'Cấp độ ưu tiên phải là số nguyên từ 1 đến 4' })
  @Min(1, { message: 'Cấp độ ưu tiên tối thiểu là 1' })
  @Max(4, { message: 'Cấp độ ưu tiên tối đa là 4' })
  capDoUuTien: number;

  @IsOptional()
  @IsIn(['BASIC', 'HOT', 'SUPER_HOT', 'DIAMOND'], {
    message: 'Huy hiệu phải thuộc BASIC, HOT, SUPER_HOT hoặc DIAMOND',
  })
  loaiHuyHieu?: 'BASIC' | 'HOT' | 'SUPER_HOT' | 'DIAMOND' | null;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'Mô tả ngắn tối đa 255 ký tự' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  moTaNgan?: string;

  @IsOptional()
  @IsArray({ message: 'Danh sách quyền lợi phải là mảng chuỗi' })
  @IsString({ each: true })
  quyenLoi?: string[];
}
