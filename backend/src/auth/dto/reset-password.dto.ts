import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Mã khôi phục không hợp lệ.' })
  @IsNotEmpty({ message: 'Thiếu mã khôi phục mật khẩu.' })
  token: string;

  @IsString({ message: 'Mật khẩu mới không hợp lệ.' })
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới.' })
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự.' })
  @MaxLength(50, { message: 'Mật khẩu mới không được vượt quá 50 ký tự.' })
  newPassword: string;
}
