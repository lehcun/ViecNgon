import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateRecruiterDto {
  // Thông tin cá nhân HR (Bảng TaiKhoan)
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // Thông tin công ty (Bảng CongTy)
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Website không đúng định dạng' })
  @IsOptional()
  website?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;
}
