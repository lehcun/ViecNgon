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

export class QueryAdminJobsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  q?: string;

  @IsOptional()
  @IsIn(['ALL', 'CHO_DUYET', 'DA_DUYET', 'TU_CHOI', 'DA_AN', 'HET_HAN'])
  status?: 'ALL' | 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI' | 'DA_AN' | 'HET_HAN';

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;

  @IsOptional()
  @IsIn(['ngayDang', 'tenCongViec', 'luotXem'])
  sortBy?: 'ngayDang' | 'tenCongViec' | 'luotXem' = 'ngayDang';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
