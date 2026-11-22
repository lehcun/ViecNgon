import { Transform } from 'class-transformer';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class DeleteUserDto {
  @IsOptional()
  @IsString({ message: 'Lý do phải là chuỗi văn bản hợp lệ' })
  @MaxLength(300, { message: 'Lý do tối đa 300 ký tự' })
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : undefined,
  )
  reason?: string;
}
