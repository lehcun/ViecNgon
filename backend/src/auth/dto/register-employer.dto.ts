import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterEmployerDto {
  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ email công ty.' })
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

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự.' })
  @Matches(/^(0|\+84)[0-9\s.-]{8,14}$/, {
    message: 'Số điện thoại Việt Nam không hợp lệ.',
  })
  @MaxLength(20, { message: 'Số điện thoại tối đa 20 ký tự.' })
  phone?: string;

  @IsOptional()
  @IsString({ message: 'Chức vụ phải là chuỗi ký tự.' })
  @MaxLength(100, { message: 'Chức vụ tối đa 100 ký tự.' })
  title?: string;

  @IsString({ message: 'Tên công ty phải là chuỗi ký tự.' })
  @IsNotEmpty({ message: 'Tên công ty không được để trống.' })
  @MaxLength(150, { message: 'Tên công ty tối đa 150 ký tự.' })
  companyName: string;

  @IsOptional()
  @IsString({ message: 'Thành phố phải là chuỗi ký tự.' })
  @MaxLength(100, { message: 'Thành phố tối đa 100 ký tự.' })
  location?: string;

  @IsOptional()
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự.' })
  @MaxLength(255, { message: 'Địa chỉ tối đa 255 ký tự.' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'Website phải là chuỗi ký tự.' })
  @MaxLength(100, { message: 'Website tối đa 100 ký tự.' })
  website?: string;

  @IsOptional()
  @IsString({ message: 'Mô hình công ty phải là chuỗi ký tự.' })
  @MaxLength(100, { message: 'Mô hình công ty tối đa 100 ký tự.' })
  companyModel?: string;

  @IsOptional()
  @IsString({ message: 'Quy mô nhân sự phải là chuỗi ký tự.' })
  @MaxLength(100, { message: 'Quy mô nhân sự tối đa 100 ký tự.' })
  companySize?: string;

  @IsOptional()
  @IsString()
  maCongTy?: string; // Dùng cho luồng nội bộ nếu cần liên kết công ty có sẵn
}
