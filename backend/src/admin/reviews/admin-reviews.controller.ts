import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AdminReviewsService } from './admin-reviews.service';
import { QueryAdminReviewsDto } from './dto/query-admin-reviews.dto';
import { ModerateReviewDto } from './dto/moderate-review.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/reviews')
export class AdminReviewsController {
  constructor(private readonly adminReviewsService: AdminReviewsService) {}

  @Get()
  async listReviews(@Query() query: QueryAdminReviewsDto) {
    return this.adminReviewsService.getAdminReviews(query);
  }

  @Patch(':id/approve')
  async approveReview(@Param('id') id: string) {
    return this.adminReviewsService.approveReview(id);
  }

  @Patch(':id/moderate')
  async moderateReview(
    @Param('id') id: string,
    @Body() dto: ModerateReviewDto,
  ) {
    return this.adminReviewsService.moderateReview(id, dto);
  }
}
