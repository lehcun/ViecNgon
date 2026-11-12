import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import type { ApplyParsedCvPayload } from '@viecngon/types';

export class ParsedSkillDto {
  @IsString()
  skillName: string;

  @IsOptional()
  @IsString()
  level: string | null = null;
}

export class ParsedExperienceDto {
  @IsString()
  companyName: string;

  @IsString()
  position: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string | null = null;

  @IsOptional()
  @IsString()
  description: string | null = null;
}

export class ParsedEducationDto {
  @IsString()
  schoolName: string;

  @IsString()
  major: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string | null = null;

  @IsOptional()
  @IsString()
  gpa: string | null = null;
}

export class ParsedCertificateDto {
  @IsString()
  name: string;

  @IsString()
  organization: string;

  @IsString()
  issueDate: string;

  @IsOptional()
  @IsString()
  expirationDate: string | null = null;
}

export class ApplyParsedCvDto implements ApplyParsedCvPayload {
  @IsOptional()
  @IsString()
  fullName: string | null = null;

  @IsOptional()
  @IsString()
  phoneNumber: string | null = null;

  @IsOptional()
  @IsString()
  dateOfBirth: string | null = null;

  @IsOptional()
  @IsString()
  gender: string | null = null;

  @IsOptional()
  @IsString()
  address: string | null = null;

  @IsOptional()
  @IsString()
  profession: string | null = null;

  @IsOptional()
  @IsInt()
  @Min(0)
  yearsOfExperience: number | null = null;

  @IsOptional()
  @IsString()
  aboutMe: string | null = null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParsedSkillDto)
  skills: ParsedSkillDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParsedExperienceDto)
  experiences: ParsedExperienceDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParsedEducationDto)
  educations: ParsedEducationDto[] = [];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ParsedCertificateDto)
  certificates: ParsedCertificateDto[] = [];

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsBoolean()
  setAsDefaultCv?: boolean;

  @IsOptional()
  @IsBoolean()
  replaceExisting?: boolean;
}