import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class QueryAdminSkillsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  q?: string;

  @IsOptional()
  @IsIn(['ALL', 'IN_USE', 'UNUSED'])
  usage?: 'ALL' | 'IN_USE' | 'UNUSED';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 15;

  @IsOptional()
  @IsIn(['tenKyNang', 'jobsCount', 'candidatesCount'])
  sortBy?: 'tenKyNang' | 'jobsCount' | 'candidatesCount' = 'tenKyNang';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'asc';
}
