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
  UseGuards,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller(['jobs', 'job'])
export class JobController {
  constructor(private readonly jobService: JobService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto) {
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
     * Public API: Lấy chi tiết công việc theo Slug
     */
    @Get(':slug')
    async getJobDetail(@Param('slug') slug: string) {
      return this.jobService.getJobBySlug(slug);
    }
  }
