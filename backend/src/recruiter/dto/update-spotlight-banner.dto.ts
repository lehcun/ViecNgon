import {
  ArrayMaxSize,
  IsArray,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateSpotlightBannerDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  bannerCoverUrl?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  bannerCity?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bannerTagline?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  bannerBadgeText?: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5, {
    message: 'Chỉ được chọn tối đa 5 việc làm nổi bật trên Banner',
  })
  @IsString({ each: true })
  selectedJobIds?: string[];
}
