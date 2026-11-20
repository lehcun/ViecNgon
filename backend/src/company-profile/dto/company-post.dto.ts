import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import type {
  CreateCompanyPostPayload,
  UpdateCompanyPostPayload,
} from '@viecngon/types';
import {
  COMPANY_PROFILE_CONSTANTS,
  VALID_URL_OPTIONS,
} from '../company-profile.constants';
import { TrimToNull } from './transformers';

export class CreateCompanyPostDto implements CreateCompanyPostPayload {
  @TrimToNull()
  @IsString({ message: 'Tiêu đề bài viết phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề bài viết không được để trống' })
  @MaxLength(255, { message: 'Tiêu đề bài viết tối đa 255 ký tự' })
  tieuDe!: string;

  @IsOptional()
  @TrimToNull()
  @IsUrl(VALID_URL_OPTIONS, {
    message: 'Đường dẫn ảnh bìa không đúng định dạng HTTP/HTTPS',
  })
  @MaxLength(255, { message: 'Đường dẫn ảnh bìa tối đa 255 ký tự' })
  anhBiaUrl?: string | null;

  @TrimToNull()
  @IsString({ message: 'Nội dung bài viết phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung bài viết không được để trống' })
  @MaxLength(COMPANY_PROFILE_CONSTANTS.MAX_RICH_TEXT_LENGTH, {
    message: 'Nội dung bài viết vượt quá giới hạn độ dài cho phép',
  })
  noiDung!: string;
}

export class UpdateCompanyPostDto implements UpdateCompanyPostPayload {
  @ValidateIf((_: UpdateCompanyPostDto, value: unknown) => value !== undefined)
  @TrimToNull()
  @IsString({ message: 'Tiêu đề bài viết phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề bài viết không được để trống' })
  @MaxLength(255, { message: 'Tiêu đề bài viết tối đa 255 ký tự' })
  tieuDe?: string;

  @IsOptional()
  @TrimToNull()
  @IsUrl(VALID_URL_OPTIONS, {
    message: 'Đường dẫn ảnh bìa không đúng định dạng HTTP/HTTPS',
  })
  @MaxLength(255, { message: 'Đường dẫn ảnh bìa tối đa 255 ký tự' })
  anhBiaUrl?: string | null;

  @ValidateIf((_: UpdateCompanyPostDto, value: unknown) => value !== undefined)
  @TrimToNull()
  @IsString({ message: 'Nội dung bài viết phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung bài viết không được để trống' })
  @MaxLength(COMPANY_PROFILE_CONSTANTS.MAX_RICH_TEXT_LENGTH, {
    message: 'Nội dung bài viết vượt quá giới hạn độ dài cho phép',
  })
  noiDung?: string;
}
