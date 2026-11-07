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
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller(['jobs', 'job'])
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly jwtService: JwtService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto, @Req() req: Request) {
    if (!createJobDto.maTaiKhoan) {
      const cookieUserId = this.extractUserIdFromCookie(req);
      if (cookieUserId) {
        createJobDto.maTaiKhoan = cookieUserId;
      }
    }
    return this.jobService.create(createJobDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateJobDto>) {
    return this.jobService.update(id, updateData);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeJob(@Param('id') id: string) {
    return await this.jobService.remove(id);
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
  async getJobDetailBySlug(
    @Param('slug') slug: string,
    @Req() req: Request,
  ) {
    const userId = this.extractUserIdFromCookie(req);
    return this.jobService.getJobDetail(slug, userId);
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
  async getJobDetail(
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const userId = this.extractUserIdFromCookie(req);
    return this.jobService.getJobDetail(id, userId);
  }

  /**
   * Helper: Trích xuất userId nếu request có kèm Cookie auth
   */
  private extractUserIdFromCookie(req: Request): string | undefined {
    const token = req?.cookies?.['access_token'];
    if (!token) return undefined;
    try {
      const payload = this.jwtService.verify(token);
      return payload?.sub || payload?.id;
    } catch {
      return undefined;
    }
  }
}
