import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ReviewsController } from './reviews.controller';
import { CompanyReviewsService } from './company-reviews.service';
import { CandidateReviewsService } from './candidate-reviews.service';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ReviewsController],
  providers: [CompanyReviewsService, CandidateReviewsService],
  exports: [CompanyReviewsService, CandidateReviewsService],
})
export class ReviewsModule {}
