import {
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ModerateReviewDto {
  @IsString()
  @IsIn(['TU_CHOI', 'DA_AN'], {
    message: 'Trạng thái kiểm duyệt phải là TU_CHOI hoặc DA_AN.',
  })
  trangThai: 'TU_CHOI' | 'DA_AN';

  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập lý do từ chối hoặc ẩn bài.' })
  @MinLength(10, { message: 'Lý do cần tối thiểu 10 ký tự.' })
  @MaxLength(500, { message: 'Lý do tối đa 500 ký tự.' })
  lyDoTuChoi: string;
}
