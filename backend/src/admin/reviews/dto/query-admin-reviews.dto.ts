import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryAdminReviewsDto {
  @IsOptional()
  @IsIn(['ALL', 'CHO_DUYET', 'REPORTED', 'DA_DUYET', 'REJECTED'])
  tab?: 'ALL' | 'CHO_DUYET' | 'REPORTED' | 'DA_DUYET' | 'REJECTED';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsIn(['ALL', 'TODAY', 'LAST_7_DAYS', 'LAST_30_DAYS', 'THIS_MONTH', 'CUSTOM'])
  datePreset?:
    | 'ALL'
    | 'TODAY'
    | 'LAST_7_DAYS'
    | 'LAST_30_DAYS'
    | 'THIS_MONTH'
    | 'CUSTOM';

  @IsOptional()
  @IsString()
  dateFrom?: string;

  @IsOptional()
  @IsString()
  dateTo?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
