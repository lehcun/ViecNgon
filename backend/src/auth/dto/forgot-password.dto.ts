import { IsEmail, IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class ForgotPasswordDto {
  @IsNotEmpty({ message: 'Vui lòng nhập email.' })
  @IsEmail({}, { message: 'Email không đúng định dạng.' })
  email: string;

  @IsOptional()
  @IsIn(['candidate', 'employer'], {
    message: 'Cổng đăng nhập không hợp lệ.',
  })
  portal?: 'candidate' | 'employer';
}
