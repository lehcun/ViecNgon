import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterCandidateDto {
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng (VD: tenban@gmail.com)' })
  @MaxLength(100, { message: 'Email không được vượt quá 100 ký tự' })
  email: string;

  @IsNotEmpty({ message: 'Tên người dùng không được để trống' })
  @IsString({ message: 'Tên người dùng phải là chuỗi ký tự' })
  @MaxLength(100, { message: 'Tên không được vượt quá 100 ký tự' })
  name: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @MaxLength(50, { message: 'Mật khẩu quá dài (tối đa 50 ký tự)' })
  // Regex cực chuẩn: Ít nhất 1 hoa, 1 thường, 1 số, 1 ký tự đặc biệt
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt (@$!%*?&)',
    },
  )
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  hoTen: string;

  @IsString()
  soDienThoai?: string;
}
