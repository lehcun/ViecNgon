import { Transform } from 'class-transformer';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateAdminSkillDto {
  @IsString({ message: 'Tên kỹ năng phải là chuỗi hợp lệ' })
  @MinLength(1, { message: 'Vui lòng nhập tên kỹ năng' })
  @MaxLength(100, { message: 'Tên kỹ năng tối đa 100 ký tự' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : ''))
  tenKyNang: string;
}
