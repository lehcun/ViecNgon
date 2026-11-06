import { IsDateString, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @IsNotEmpty({ message: 'Tên trường không được để trống' })
  @IsString()
  schoolName: string;

  @IsNotEmpty({ message: 'Ngành học không được để trống' })
  @IsString()
  major: string;

  @IsNotEmpty({ message: 'Ngày bắt đầu không được để trống' })
  @IsDateString({}, { message: 'Ngày bắt đầu phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  startDate: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày tốt nghiệp phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  endDate?: string;

  @IsOptional()
  @IsString()
  gpa?: string;
}

export class UpdateEducationDto {
  @IsOptional()
  @IsString()
  schoolName?: string;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày bắt đầu phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Ngày tốt nghiệp phải là định dạng ngày hợp lệ (YYYY-MM-DD)' })
  endDate?: string;

  @IsOptional()
  @IsString()
  gpa?: string;
}

