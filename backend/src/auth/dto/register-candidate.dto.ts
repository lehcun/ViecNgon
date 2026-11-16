import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class RegisterCandidateDto {
  @IsNotEmpty({ message: 'Vui lòng nhập địa chỉ email.' })
  @IsEmail({}, { message: 'Email không đúng định dạng (VD: tenban@gmail.com).' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự.' })
  email: string;

  @IsNotEmpty({ message: 'Vui lòng nhập họ và tên.' })
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự.' })
  @MaxLength(100, { message: 'Họ và tên không được vượt quá 100 ký tự.' })
  name: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu.' })
  @IsString({ message: 'Mật khẩu phải là chuỗi ký tự.' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự.' })
  @MaxLength(50, { message: 'Mật khẩu quá dài (tối đa 50 ký tự).' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    {
      message:
        'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&#).',
    },
  )
  password: string;

  @IsOptional()
  @IsString({ message: 'Họ tên phải là chuỗi ký tự.' })
  @MaxLength(100, { message: 'Họ tên không được vượt quá 100 ký tự.' })
  hoTen?: string;

  @IsOptional()
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự.' })
  @MaxLength(20, { message: 'Số điện thoại không được vượt quá 20 ký tự.' })
  soDienThoai?: string;
}
