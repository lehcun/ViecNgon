import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryAdminPackagesDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  q?: string;

  @IsOptional()
  @IsIn(['ALL', 'HOATDONG', 'DA_AN'])
  status?: 'ALL' | 'HOATDONG' | 'DA_AN';
}
