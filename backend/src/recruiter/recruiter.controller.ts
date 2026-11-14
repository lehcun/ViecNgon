import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RecruiterService } from './recruiter.service';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { UpdateSpotlightBannerDto } from './dto/update-spotlight-banner.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import * as jwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import type { UploadedBinaryFile } from 'src/cloudinary/cloudinary.service';

@Controller('recruiter')
@UseGuards(jwtAuthGuard.JwtAuthGuard, RolesGuard)
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('profile')
  @Roles('NHATUYENDUNG') // Chỉ HR mới gọi được
  async getProfile(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return this.recruiterService.getProfile(user.id);
  }

  @Patch('profile')
  @Roles('NHATUYENDUNG')
  async updateProfile(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() updateDto: UpdateRecruiterDto,
  ) {
    return this.recruiterService.updateProfile(user.id, updateDto);
  }

  @Get('job/metrics')
  async getJobMetrics(@CurrentUser() user: { id: string }) {
    return await this.recruiterService.getJobMetrics(user.id);
  }

  @Get('spotlight-banner')
  @Roles('NHATUYENDUNG')
  async getSpotlightBannerConfig(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return await this.recruiterService.getSpotlightBannerConfig(user.id);
  }

  @Patch('spotlight-banner')
  @Roles('NHATUYENDUNG')
  async updateSpotlightBanner(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() dto: UpdateSpotlightBannerDto,
  ) {
    return await this.recruiterService.updateSpotlightBanner(user.id, dto);
  }

  @Post('spotlight-banner/cover')
  @Roles('NHATUYENDUNG')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadSpotlightBannerCover(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @UploadedFile() file: UploadedBinaryFile,
  ) {
    return await this.recruiterService.uploadSpotlightBannerCover(
      user.id,
      file,
    );
  }
}
