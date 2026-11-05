import {
  Body,
  Controller,
  Get,
  Patch,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import type {
  CompanyProfileResponse,
  UpdateCompanyProfileResponse,
} from '@viecngon/types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CompanyProfileService } from './company-profile.service';
import { UpdateCompanyProfileDto } from './dto/update-company-profile.dto';

/**
 * Controller Quản lý hồ sơ doanh nghiệp (Employer/Company Profile Management)
 * Phân quyền dành riêng cho tài khoản Nhà tuyển dụng (NHATUYENDUNG).
 */
@Controller('employer/profile')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('NHATUYENDUNG')
export class CompanyProfileController {
  constructor(
    private readonly companyProfileService: CompanyProfileService,
  ) {}

  /**
   * [GET] /employer/profile
   * Lấy thông tin hồ sơ doanh nghiệp + HR + Chi nhánh + Điểm hoàn thiện
   */
  @Get()
  async getProfile(
    @CurrentUser('userId') userId: string,
  ): Promise<CompanyProfileResponse> {
    return this.companyProfileService.getCompanyProfile(userId);
  }

  /**
   * [PATCH] /employer/profile
   * Cập nhật từng phần (Partial Update) thông tin công ty và HR
   */
  @Patch()
  async updateProfilePatch(
    @CurrentUser('userId') userId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    dto: UpdateCompanyProfileDto,
  ): Promise<UpdateCompanyProfileResponse> {
    return this.companyProfileService.updateCompanyProfile(userId, dto);
  }

  /**
   * [PUT] /employer/profile
   * Cập nhật đồng bộ thông tin hồ sơ doanh nghiệp
   */
  @Put()
  async updateProfilePut(
    @CurrentUser('userId') userId: string,
    @Body(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    )
    dto: UpdateCompanyProfileDto,
  ): Promise<UpdateCompanyProfileResponse> {
    return this.companyProfileService.updateCompanyProfile(userId, dto);
  }
}

