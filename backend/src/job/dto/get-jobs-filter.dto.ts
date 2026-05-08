import { IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetJobsFilterDto {
  @IsOptional()
  @IsString()
  thanhPho?: string; // VD: "Hồ Chí Minh", "Đà Nẵng"

  @IsOptional()
  @IsString()
  loaiHinh?: string; // VD: "Fulltime", "Parttime"

  @IsOptional()
  @IsString()
  hinhThucLamViec?: string; // VD: "TaiVanPhong", "Remote", "Hybrid"

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  mucLuong?: number; // Mức lương mong muốn của ứng viên

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1; // Phân trang, mặc định là trang 1
}
