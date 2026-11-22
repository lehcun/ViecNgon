import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserStatusDto {
  @IsIn(['HOATDONG', 'KHOA'], {
    message: 'Trạng thái phải là HOATDONG hoặc KHOA',
  })
  trangThai: 'HOATDONG' | 'KHOA';

  @IsOptional()
  @IsString({ message: 'Lý do phải là chuỗi văn bản hợp lệ' })
  @MaxLength(300, { message: 'Lý do tối đa 300 ký tự' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  reason?: string;
}
