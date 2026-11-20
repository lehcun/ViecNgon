import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { CompanyProfileController } from './company-profile.controller';
import { CompanyProfileService } from './company-profile.service';

/**
 * Module Quản lý hồ sơ doanh nghiệp
 * PrismaService được cung cấp tự động bởi PrismaModule (@Global)
 */
@Module({
  imports: [CloudinaryModule],
  controllers: [CompanyProfileController],
  providers: [CompanyProfileService],
  exports: [CompanyProfileService],
})
export class CompanyProfileModule {}

