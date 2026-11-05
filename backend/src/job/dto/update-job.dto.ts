import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  tenCongViec?: string;

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

  @IsOptional()
  @IsString()
  loaiHinh?: string;

  @IsOptional()
  @IsString()
  hinhThucLamViec?: string;

  @IsOptional()
  @IsDateString()
  ngayHetHan?: string;

  @IsOptional()
  @IsString()
  maChiNhanh?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  kyNangs?: string[];

  @IsOptional()
  @IsString()
  trangThai?: string;
}

