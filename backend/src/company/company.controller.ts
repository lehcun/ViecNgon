import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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

  @Get(':slug')
  async getCompanyDetail(@Param('slug') slug: string) {
    if (!slug) {
      throw new NotFoundException('Đường dẫn không hợp lệ');
    }
    return await this.companyService.getCompanyDetailBySlug(slug);
  }
}
