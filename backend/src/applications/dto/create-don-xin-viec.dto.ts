import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDonXinViecDto {
  @IsNotEmpty({ message: 'Mã công việc không được để trống' })
  @IsString()
  maCongViec: string;

  @IsOptional()
  @IsString()
  chiTiet?: string; // Thư ứng tuyển (Cover letter)

  @IsOptional()
  @IsString()
  coverLetter?: string; // Alias cho thư ứng tuyển

  @IsOptional()
  @IsString()
  maCvFile?: string; // Mã file CV đã tải lên trong hệ thống

  @IsOptional()
  @IsString()
  fileCvUrl?: string; // Link file CV (PDF) trực tiếp
}
