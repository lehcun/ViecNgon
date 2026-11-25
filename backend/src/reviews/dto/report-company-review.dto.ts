import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ReportCompanyReviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập lý do báo cáo vi phạm.' })
  @MinLength(10, { message: 'Lý do báo cáo cần ít nhất 10 ký tự.' })
  @MaxLength(500, { message: 'Lý do báo cáo tối đa 500 ký tự.' })
  lyDoBaoCao: string;
}
