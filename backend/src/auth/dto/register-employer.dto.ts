import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterEmployerDto {
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @MinLength(6, { message: 'Mật khẩu phải từ 6 ký tự' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Họ tên người đại diện không được để trống' })
  employerName: string;

  @IsString()
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  companyName: string;

  @IsString()
  maCongTy?: string; // Nếu chọn công ty có sẵn trong hệ thống
}
