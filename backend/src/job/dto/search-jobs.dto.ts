import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum JobSortBy {
  NEWEST = 'NEWEST',
  SALARY_DESC = 'SALARY_DESC',
  MOST_VIEWED = 'MOST_VIEWED',
}

export class SearchJobsDto {
  @IsOptional()
  @IsString()
  keyword?: string; // Tìm theo Tên việc làm, Kỹ năng hoặc Tên công ty

  @IsOptional()
  @IsString()
  thanhPho?: string; // Hà Nội, Hồ Chí Minh, Đà Nẵng...

  @IsOptional()
  @IsString()
  hinhThucLamViec?: string; // 'Remote' | 'Tại văn phòng' | 'Hybrid'

  @IsOptional()
  @IsString()
  loaiHinh?: string; // 'Full-time' | 'Part-time' | 'Freelance'

  @IsOptional()
  @IsString()
  capBac?: string; // 'Intern' | 'Fresher' | 'Junior' | 'Senior' | 'Manager'

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yeuCauKinhNghiem?: number; // 0, 1, 2, 3, 5+

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mucLuongMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mucLuongMax?: number;

  @IsOptional()
  @IsString()
  salaryRange?: string; // 'UNDER_10' | '10_20' | '20_30' | 'OVER_30' | 'NEGOTIABLE'

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  negotiable?: boolean;

  @IsOptional()
  @IsEnum(JobSortBy)
  sortBy?: JobSortBy = JobSortBy.NEWEST;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}

