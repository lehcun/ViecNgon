import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import * as jwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { CreateDonXinViecDto } from '../applications/dto/create-don-xin-viec.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ApplicationsService } from './applications.service';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationService: ApplicationsService) {}

  // =========================================================
  // 1. API DÀNH CHO ỨNG VIÊN (CANDIDATE)
  // =========================================================
  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Post()
  async applyForJob(
    @CurrentUser() user: { id: string },
    @Body() createDonXinViecDto: CreateDonXinViecDto,
  ) {
    return this.applicationService.createApplication(
      createDonXinViecDto,
      user.id,
    );
  }

  // =========================================================
  // 2. API DÀNH CHO NHÀ TUYỂN DỤNG (EMPLOYER)
  // =========================================================

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Get('employer')
  async getCandidates(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return await this.applicationService.getCandidatesForEmployer(user.id);
  }

  @Get('employer/:maDon')
  async getApplicationDetail(@Param('maDon') maDon: string) {
    return await this.applicationService.getApplicationDetail(maDon);
  }

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Patch('employer/:maDon/status')
  async updateStatus(
    @Param('maDon') maDon: string,
    @Body('status') newStatus: string,
  ) {
    return await this.applicationService.updateApplicationStatus(
      maDon,
      newStatus,
    );
  }

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Post('employer/:maDon/send-email')
  async sendEmail(
    @Param('maDon') maDon: string,
    @Body() sendEmailDto: SendEmailDto,
  ) {
    return await this.applicationService.sendEmailToCandidate(
      maDon,
      sendEmailDto.subject,
      sendEmailDto.content,
    );
  }
}
