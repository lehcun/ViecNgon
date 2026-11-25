import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CompanyReviewsService } from './company-reviews.service';
import { CandidateReviewsService } from './candidate-reviews.service';
import { CreateCompanyReviewDto } from './dto/create-company-review.dto';
import { ReportCompanyReviewDto } from './dto/report-company-review.dto';
import { CreateCandidateEvaluationDto } from './dto/create-candidate-evaluation.dto';

interface AuthenticatedUser {
  id: string;
}

@Controller('reviews')
export class ReviewsController {
  constructor(
    private readonly companyReviewsService: CompanyReviewsService,
    private readonly candidateReviewsService: CandidateReviewsService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('company/:companyId')
  async getCompanyReviews(
    @Param('companyId') companyId: string,
    @Req() req: Request,
  ) {
    const currentUserId = this.extractUserIdFromCookie(req);
    return this.companyReviewsService.getCompanyReviews(
      companyId,
      currentUserId,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('UNGVIEN')
  @Post('company/:companyId')
  async createCompanyReview(
    @Param('companyId') companyId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCompanyReviewDto,
  ) {
    return this.companyReviewsService.createCompanyReview(
      companyId,
      user.id,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NHATUYENDUNG')
  @Post('company/:reviewId/report')
  async reportCompanyReview(
    @Param('reviewId') reviewId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReportCompanyReviewDto,
  ) {
    return this.companyReviewsService.reportCompanyReview(
      reviewId,
      user.id,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NHATUYENDUNG')
  @Get('applications/:maDon')
  async getApplicationEvaluations(
    @Param('maDon') maDon: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.candidateReviewsService.getApplicationEvaluations(
      maDon,
      user.id,
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NHATUYENDUNG')
  @Post('applications/:maDon')
  async createApplicationEvaluation(
    @Param('maDon') maDon: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCandidateEvaluationDto,
  ) {
    return this.candidateReviewsService.createApplicationEvaluation(
      maDon,
      user.id,
      dto,
    );
  }

  private extractUserIdFromCookie(req: Request): string | undefined {
    const cookies = req?.cookies as Record<string, unknown> | undefined;
    const token = cookies?.['access_token'];
    if (typeof token !== 'string' || !token) return undefined;
    try {
      const payload = this.jwtService.verify<{ sub?: string; id?: string }>(
        token,
      );
      return payload?.sub ?? payload?.id;
    } catch {
      return undefined;
    }
  }
}
