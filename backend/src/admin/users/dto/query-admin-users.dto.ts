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

export class QueryAdminUsersDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  q?: string;

  @IsOptional()
  @IsIn(['ALL', 'UNGVIEN', 'NHATUYENDUNG', 'ADMIN'])
  role?: 'ALL' | 'UNGVIEN' | 'NHATUYENDUNG' | 'ADMIN';

  @IsOptional()
  @IsIn(['ALL', 'HOATDONG', 'KHOA', 'CHUAKICHHOAT'])
  status?: 'ALL' | 'HOATDONG' | 'KHOA' | 'CHUAKICHHOAT';

  @IsOptional()
  @IsIn(['ALL', 'LOCAL', 'GOOGLE'])
  provider?: 'ALL' | 'LOCAL' | 'GOOGLE';

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
  @IsIn(['ngayTao', 'tenNguoiDung', 'email'])
  sortBy?: 'ngayTao' | 'tenNguoiDung' | 'email' = 'ngayTao';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
