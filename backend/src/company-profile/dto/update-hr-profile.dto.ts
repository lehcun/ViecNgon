import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import type { UpdateHrProfilePayload } from '@viecngon/types';
import { TrimToNull } from './transformers';

/**
 * DTO Cập nhật hồ sơ Nhà tuyển dụng / HR (Bảng NHATUYENDUNG)
 * Implements Type-safe từ UpdateHrProfilePayload của shared types.
 */
export class UpdateHrProfileDto implements UpdateHrProfilePayload {
  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Họ tên HR phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Họ tên tối đa 100 ký tự' })
  hoTen?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Chức vụ phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Chức vụ tối đa 100 ký tự' })
  chucVu?: string | null;

  @IsOptional()
  @TrimToNull()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @MaxLength(20, { message: 'Số điện thoại tối đa 20 ký tự' })
  @Matches(/^\+?[0-9][0-9\s.-]{7,18}$/, {
    message: 'Số điện thoại không đúng định dạng',
  })
  soDienThoai?: string | null;
}

