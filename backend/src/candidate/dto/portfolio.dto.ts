import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreatePortfolioDto {
  @IsNotEmpty({ message: 'Tiêu đề dự án không được để trống' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  projectUrl?: string;
}

export class UpdatePortfolioDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  projectUrl?: string;
}

