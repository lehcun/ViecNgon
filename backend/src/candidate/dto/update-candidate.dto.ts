import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class UpdateCandidateDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  // Sử dụng IsDateString để đảm bảo định dạng chuỗi ngày tháng (ISO 8601) hợp lệ
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  cvUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
