import { IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class RepostJobDto {
  @IsOptional()
  @IsDateString()
  ngayHetHanMoi?: string;

  @IsOptional()
  @IsBoolean()
  updateContent?: boolean;
}

