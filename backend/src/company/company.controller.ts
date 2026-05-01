import { Controller, Get } from '@nestjs/common';
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
}
