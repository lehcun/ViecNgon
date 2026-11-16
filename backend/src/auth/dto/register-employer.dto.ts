import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterEmployerDto {
  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ email.' })
  @IsEmail({}, { message: 'Email không hợp lệ.' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự.' })
  email: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  @MaxLength(50, { message: 'Mật khẩu không được vượt quá 50 ký tự.' })
  password: string;

  @IsString({ message: 'Họ tên người đại diện phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Họ tên người đại diện không được để trống.' })
  @MaxLength(100, { message: 'Họ tên người đại diện tối đa 100 ký tự.' })
  employerName: string;

  @IsString({ message: 'Tên công ty phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Tên công ty không được để trống.' })
  @MaxLength(150, { message: 'Tên công ty tối đa 150 ký tự.' })
  companyName: string;

  @IsOptional()
  @IsString()
  maCongTy?: string; // Nếu chọn công ty có sẵn trong hệ thống
}
