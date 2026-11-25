import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCandidateEvaluationDto {
  @IsInt()
  @Min(1)
  @Max(5)
  diemChuyenMon: number;

  @IsInt()
  @Min(1)
  @Max(5)
  diemThaiDo: number;

  @IsInt()
  @Min(1)
  @Max(5)
  diemGiaiQuyetVanDe: number;

  @IsInt()
  @Min(1)
  @Max(5)
  diemPhuHopVanHoa: number;

  @IsString()
  @IsIn(['DAT', 'CAN_NHAC', 'CHUA_PHU_HOP'], {
    message: 'Kết quả đánh giá phải là DAT, CAN_NHAC hoặc CHUA_PHU_HOP.',
  })
  ketQuaDanhGia: 'DAT' | 'CAN_NHAC' | 'CHUA_PHU_HOP';

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập tóm tắt đánh giá.' })
  @MaxLength(100, { message: 'Tóm tắt đánh giá tối đa 100 ký tự.' })
  tieuDe: string;

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập nhận xét chi tiết.' })
  @MaxLength(500, { message: 'Nhận xét chi tiết tối đa 500 ký tự.' })
  noiDung: string;

  @IsBoolean()
  chiaSeUngVien: boolean;
}
