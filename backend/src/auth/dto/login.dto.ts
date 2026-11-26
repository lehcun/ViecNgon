import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ email.' })
  @IsEmail(
    {},
    { message: 'Email không đúng định dạng (VD: tenban@gmail.com).' },
  )
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự.' })
  email: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự.' })
  @MaxLength(50, { message: 'Mật khẩu không được vượt quá 50 ký tự.' })
  password: string;

  @IsOptional()
  @IsIn(['UNGVIEN', 'NHATUYENDUNG', 'ADMIN'], {
    message: 'Vai trò đăng nhập không hợp lệ.',
  })
  expectedRole?: 'UNGVIEN' | 'NHATUYENDUNG' | 'ADMIN';
}
