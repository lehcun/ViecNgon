import { IsString, IsOptional, IsNumber, IsDateString, IsIn } from 'class-validator';

export class UpdateCandidateDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
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

  @IsOptional()
  @IsString()
  aboutMe?: string;

  @IsOptional()
  @IsIn(['ONLINE', 'PDF'])
  defaultCvType?: string;

  @IsOptional()
  @IsString()
  defaultCvFileId?: string;

  @IsOptional()
  @IsString()
  trangThaiPortfolio?: string;
}
