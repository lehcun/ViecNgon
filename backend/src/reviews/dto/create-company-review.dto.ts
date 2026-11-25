import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCompanyReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  diemLuongPhucLoi: number;

  @IsInt()
  @Min(1)
  @Max(5)
  diemDaoTao: number;

  @IsInt()
  @Min(1)
  @Max(5)
  diemQuanLy: number;

  @IsInt()
  @Min(1)
  @Max(5)
  diemVanHoa: number;

  @IsInt()
  @Min(1)
  @Max(5)
  diemVanPhong: number;

  @IsBoolean()
  khuyenLamViec: boolean;

  @IsBoolean()
  coOtTot: boolean;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập tiêu đề đánh giá.' })
  @MaxLength(100, { message: 'Tiêu đề tối đa 100 ký tự.' })
  tieuDe: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Nhận xét chung tối đa 500 ký tự.' })
  noiDung?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Nội dung điểm cộng tối đa 2000 ký tự.' })
  noiDungUuDiem?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'Nội dung cần cải thiện tối đa 2000 ký tự.' })
  noiDungCaiThien?: string;
}
