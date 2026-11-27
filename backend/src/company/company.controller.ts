import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  constructor(
    private readonly prisma: PrismaService,
    private companyService: CompanyService,
  ) {}

  @Get('top')
  async getTopEmployers() {
    return await this.companyService.getCompaniesWithJobCount();
  }

  @Get('featured-banners')
  async getFeaturedBanners() {
    return await this.companyService.getFeaturedBannerEmployers();
  }

  @Get('employer-landing')
  async getEmployerLandingData() {
    return await this.companyService.getEmployerLandingData();
  }

  @Get(':id/follow-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('UNGVIEN')
  async getFollowStatus(
    @Param('id') companyId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return await this.companyService.getFollowStatus(companyId, userId);
  }

  @Post(':id/follow')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('UNGVIEN')
  async toggleFollow(
    @Param('id') companyId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return await this.companyService.toggleFollow(companyId, userId);
  }

  @Get(':slug')
  async getCompanyDetail(@Param('slug') slug: string) {
    if (!slug) {
      throw new NotFoundException('Đường dẫn không hợp lệ');
    }
    return await this.companyService.getCompanyDetailBySlug(slug);
  }
}
