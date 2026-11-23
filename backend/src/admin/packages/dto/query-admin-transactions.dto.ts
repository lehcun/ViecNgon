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

export class QueryAdminTransactionsDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  q?: string;

  @IsOptional()
  @IsIn(['ALL', 'THANH_CONG', 'CHO_THANH_TOAN', 'THAT_BAI'])
  status?: 'ALL' | 'THANH_CONG' | 'CHO_THANH_TOAN' | 'THAT_BAI';

  @IsOptional()
  @IsString()
  @MaxLength(50)
  packageId?: string;

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
}
