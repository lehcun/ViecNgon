import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JwtAuthGuard, type AuthUser } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AiMatchService } from 'src/ai/ai-match.service';

@Controller(['jobs', 'job'])
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly jwtService: JwtService,
    private readonly aiMatchService: AiMatchService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NHATUYENDUNG')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto, @CurrentUser() user: AuthUser) {
    // Luôn lấy maTaiKhoan từ JWT cookie đã xác thực, chống giả mạo ID người đăng
    createJobDto.maTaiKhoan = user.id;
    return this.jobService.create(createJobDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NHATUYENDUNG', 'ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateJobDto>,
    @CurrentUser() user: AuthUser,
  ) {
    if (user.role === 'ADMIN') {
      return this.jobService.update(id, updateData);
    }
    return this.jobService.updateEmployerJob(user.id, id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('NHATUYENDUNG', 'ADMIN')
  async removeJob(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    if (user.role === 'ADMIN') {
      return await this.jobService.remove(id);
    }
    return await this.jobService.removeEmployerJob(user.id, id);
  }

  /**
   * Public API: Tìm kiếm và bộ lọc chi tiết việc làm
   * Endpoint: GET /jobs và GET /job
   */
  @Get()
  async getJobs(@Query() query: SearchJobsDto) {
    return this.jobService.getJobs(query);
  }

  /**
   * Candidate API: Gợi ý danh sách việc làm phù hợp cho Ứng viên đang đăng nhập
   * Endpoint: GET /jobs/recommended?limit=12
   */
  @Get('recommended')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('UNGVIEN')
  async getRecommendedJobs(
    @CurrentUser('userId') userId: string,
    @Query('limit') limit?: string,
  ) {
    return this.jobService.getRecommendedJobs(
      userId,
      limit ? Number(limit) : 12,
    );
  }

  /**
   * Public API 2: Lấy danh sách 4-5 công việc tương tự theo slug
   */
  @Get('by-slug/:slug/related')
  async getRelatedJobsBySlug(@Param('slug') slug: string) {
    return this.jobService.getRelatedJobs(slug);
  }

  /**
   * Public API 1 (by-slug): Lấy chi tiết công việc theo Slug
   */
  @Get('by-slug/:slug')
  async getJobDetailBySlug(@Param('slug') slug: string, @Req() req: Request) {
    const userId = this.extractUserIdFromCookie(req);
    return this.jobService.getJobDetail(slug, userId);
  }

  @Post(':id/match-preview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('UNGVIEN')
  async previewMatch(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return await this.aiMatchService.previewJobMatchForCandidate(user.id, id);
  }

  /**
   * Public API 2: Lấy danh sách 4-5 công việc tương tự theo ID hoặc slug
   */
  @Get(':id/related')
  async getRelatedJobs(@Param('id') id: string) {
    return this.jobService.getRelatedJobs(id);
  }

  /**
   * Public API 1: Lấy chi tiết công việc theo ID hoặc Slug
   * Endpoint: GET /jobs/:id hoặc GET /job/:slug
   */
  @Get(':id')
  async getJobDetail(@Param('id') id: string, @Req() req: Request) {
    const userId = this.extractUserIdFromCookie(req);
    return this.jobService.getJobDetail(id, userId);
  }

  /**
   * Helper: Trích xuất userId nếu request có kèm Cookie auth
   */
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
