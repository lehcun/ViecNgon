import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCvFileDto {
  @IsNotEmpty({ message: 'Tên file không được để trống' })
  @IsString()
  fileName: string;

  @IsNotEmpty({ message: 'URL file không được để trống' })
  @IsString()
  fileUrl: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

