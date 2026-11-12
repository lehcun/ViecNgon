import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as jwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { CandidateService } from './candidate.service';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CreateExperienceDto, UpdateExperienceDto } from './dto/experience.dto';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import { CreateCertificateDto, UpdateCertificateDto } from './dto/certificate.dto';
import { CreatePortfolioDto, UpdatePortfolioDto } from './dto/portfolio.dto';
import { CreateCvFileDto } from './dto/cv-file.dto';
import { ApplyParsedCvDto } from './dto/apply-parsed-cv.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('candidate')
@UseGuards(jwtAuthGuard.JwtAuthGuard)
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) { }

  // ==========================================
  // THÔNG TIN HỒ SƠ CHÍNH
  // ==========================================
  @Get('profile')
  async getProfile(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return await this.candidateService.getProfile(user.id);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() updateData: UpdateCandidateDto,
  ) {
    return await this.candidateService.updateProfile(user.id, updateData);
  }

  // ==========================================
  // KINH NGHIỆM LÀM VIỆC (EXPERIENCES)
  // ==========================================
  @Post('experiences')
  async createExperience(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() dto: CreateExperienceDto,
  ) {
    return await this.candidateService.createExperience(user.id, dto);
  }

  @Patch('experiences/:id')
  async updateExperience(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateExperienceDto,
  ) {
    return await this.candidateService.updateExperience(user.id, id, dto);
  }

  @Delete('experiences/:id')
  async deleteExperience(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
  ) {
    return await this.candidateService.deleteExperience(user.id, id);
  }

  // ==========================================
  // HỌC VẤN (EDUCATIONS)
  // ==========================================
  @Post('educations')
  async createEducation(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() dto: CreateEducationDto,
  ) {
    return await this.candidateService.createEducation(user.id, dto);
  }

  @Patch('educations/:id')
  async updateEducation(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return await this.candidateService.updateEducation(user.id, id, dto);
  }

  @Delete('educations/:id')
  async deleteEducation(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
  ) {
    return await this.candidateService.deleteEducation(user.id, id);
  }

  // ==========================================
  // CHỨNG CHỈ (CERTIFICATES)
  // ==========================================
  @Post('certificates')
  async createCertificate(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() dto: CreateCertificateDto,
  ) {
    return await this.candidateService.createCertificate(user.id, dto);
  }

  @Patch('certificates/:id')
  async updateCertificate(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCertificateDto,
  ) {
    return await this.candidateService.updateCertificate(user.id, id, dto);
  }

  @Delete('certificates/:id')
  async deleteCertificate(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
  ) {
    return await this.candidateService.deleteCertificate(user.id, id);
  }

  // ==========================================
  // DỰ ÁN NỔI BẬT (PORTFOLIOS)
  // ==========================================
  @Post('portfolios')
  async createPortfolio(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() dto: CreatePortfolioDto,
  ) {
    return await this.candidateService.createPortfolio(user.id, dto);
  }

  @Patch('portfolios/:id')
  async updatePortfolio(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdatePortfolioDto,
  ) {
    return await this.candidateService.updatePortfolio(user.id, id, dto);
  }

  @Delete('portfolios/:id')
  async deletePortfolio(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
  ) {
    return await this.candidateService.deletePortfolio(user.id, id);
  }

  // ==========================================
  // FILE CV (CV FILES)
  // ==========================================
  @Post('cv-files')
  async createCvFile(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() dto: CreateCvFileDto,
  ) {
    return await this.candidateService.createCvFile(user.id, dto);
  }

  @Delete('cv-files/:id')
  async deleteCvFile(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Param('id') id: string,
  ) {
    return await this.candidateService.deleteCvFile(user.id, id);
  }

  // ==========================================
  // TIỆN ÍCH KHÁC (UPLOAD GENERATED CV & APPLIED JOBS)
  // ==========================================
  @Post('cv/upload-generated')
  @UseInterceptors(FileInterceptor('file'))
  async uploadGeneratedCv(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @UploadedFile() file: any,
  ) {
    return await this.candidateService.uploadGeneratedCv(user.id, file);
  }

  @Post('cv/apply-parsed-data')
  async applyParsedCvData(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() dto: ApplyParsedCvDto,
  ) {
    return await this.candidateService.applyParsedCvData(user.id, dto);
  }

  @Get('applied-jobs')
  async getAppliedJobs(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return await this.candidateService.getAppliedJobs(user.id);
  }
}
