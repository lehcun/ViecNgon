import { IsString, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  tenCongViec: string;

  @IsOptional()
  @IsString()
  moTa?: string;

  @IsOptional()
  @IsString()
  yeuCauCongViec?: string;

  @IsOptional()
  @IsString()
  phucLoi?: string;

  @IsOptional()
  @IsNumber()
  mucLuongToiThieu?: number;

  @IsOptional()
  @IsNumber()
  mucLuongToiDa?: number;

  @IsOptional()
  @IsNumber()
  yeuCauKinhNghiem?: number;

  @IsOptional()
  @IsString()
  capBac?: string;

  @IsOptional()
  @IsString()
  thanhPho?: string;

  @IsString()
  loaiHinh: string;

  @IsOptional()
  @IsString()
  hinhThucLamViec?: string;

  @IsDateString()
  ngayDang: string;

  @IsOptional()
  @IsDateString()
  ngayHetHan?: string;

  @IsString()
  trangThai: string;

  @IsString()
  maNTD: string;

  @IsOptional()
  @IsString()
  maChiNhanh?: string;
}
