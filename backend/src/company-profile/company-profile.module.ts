import { Module } from '@nestjs/common';
import { CompanyProfileController } from './company-profile.controller';
import { CompanyProfileService } from './company-profile.service';

/**
 * Module Quản lý hồ sơ doanh nghiệp
 * PrismaService được cung cấp tự động bởi PrismaModule (@Global)
 */
@Module({
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}

