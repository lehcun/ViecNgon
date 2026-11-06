import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsNotEmpty({ message: 'Tên công ty không được để trống' })
  @IsString()
  companyName: string;

  @IsNotEmpty({ message: 'Vị trí công việc không được để trống' })
  @IsString()
  position: string;

  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  @IsDateString({}, { message: 'Ngày bắt đầu phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  endDate?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateExperienceDto {
  @IsOptional()
  @IsString()
  companyName?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày kết thúc phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  endDate?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

