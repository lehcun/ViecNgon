import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCertificateDto {
  @IsNotEmpty({ message: 'Tên chứng chỉ không được để trống' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Tổ chức cấp không được để trống' })
  @IsString()
  organization: string;

  @IsNotEmpty({ message: 'Ngày cấp không được để trống' })
  @IsDateString({}, { message: 'Ngày cấp phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  issueDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày hết hạn phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  expirationDate?: string;
}

export class UpdateCertificateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày cấp phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  issueDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày hết hạn phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  expirationDate?: string;
}

