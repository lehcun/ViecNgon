import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateDonXinViecDto {
  @IsNotEmpty({ message: 'Mã công việc không được để trống' })
  @IsString()
  maCongViec: string;

  @IsOptional()
  @IsString()
  chiTiet?: string; // Thư ứng tuyển (Cover letter)

  @IsOptional()
  @IsString()
  // @IsUrl()
  fileCvUrl?: string; // Link file CV (PDF) đã upload lên server/cloud
}
