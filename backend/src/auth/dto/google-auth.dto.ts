import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  @IsNotEmpty({ message: 'Google Token không được để trống' })
  accessToken: string;

  @IsOptional()
  @IsString()
  role?: string; // 'UNGVIEN' hoặc 'NHATUYENDUNG' (dành cho Đăng ký)
}
