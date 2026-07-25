import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ScheduleInterviewDto {
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề phỏng vấn không được để trống' })
  tieuDe: string;

  @IsDateString({}, { message: 'Thời gian phải là định dạng ISO 8601' })
  @IsNotEmpty({ message: 'Thời gian phỏng vấn không được để trống' })
  thoiGian: string; // Hứng chuỗi ISO String từ Frontend

  @IsString()
  @IsOptional()
  moTa?: string;

  @IsBoolean()
  @IsNotEmpty()
  taoGoogleMeet: boolean;
}
