import {
  Controller,
  Get,
  Patch,
  Put,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JobService } from './job.service';
import { GetEmployerJobsQueryDto } from './dto/get-employer-jobs-query.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { RepostJobDto } from './dto/repost-job.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('employer/jobs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('NHATUYENDUNG')
export class EmployerJobController {
  constructor(private readonly jobService: JobService) {}

  /**
   * GET /employer/jobs
   * Lấy danh sách tin tuyển dụng của công ty với tìm kiếm, lọc theo status và phân trang
   */
  @Get()
  async getEmployerJobs(
    @CurrentUser('userId') userId: string,
    @Query() query: GetEmployerJobsQueryDto,
  ) {
    return this.jobService.getEmployerJobs(userId, query);
  }

  /**
   * GET /employer/jobs/:id
   * Lấy chi tiết một tin tuyển dụng để hiển thị hoặc pre-fill vào form chỉnh sửa
   */
  @Get(':id')
  async getEmployerJobById(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.jobService.getEmployerJobById(userId, id);
  }

  /**
   * PATCH /employer/jobs/:id
   * Chỉnh sửa thông tin tin tuyển dụng
   */
  @Patch(':id')
  async updateEmployerJob(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobService.updateEmployerJob(userId, id, dto);
  }

  /**
   * PUT /employer/jobs/:id
   * Hỗ trợ cập nhật đầy đủ (chuẩn RESTful)
   */
  @Put(':id')
  async updateEmployerJobPut(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobService.updateEmployerJob(userId, id, dto);
  }

  /**
   * POST /employer/jobs/:id/repost
   * Đăng lại / Gia hạn tin tuyển dụng đã hết hạn hoặc tạm ẩn
   */
  @Post(':id/repost')
  @HttpCode(HttpStatus.OK)
  async repostEmployerJob(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: RepostJobDto,
  ) {
    return this.jobService.repostEmployerJob(userId, id, dto);
  }

  /**
   * PATCH /employer/jobs/:id/toggle-visibility
   * Tạm ẩn hoặc hiển thị lại tin tuyển dụng
   */
  @Patch(':id/toggle-visibility')
  async toggleVisibility(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.jobService.toggleJobVisibility(userId, id);
  }

  /**
   * DELETE /employer/jobs/:id
   * Xóa tin tuyển dụng có kiểm tra quyền sở hữu
   */
  @Delete(':id')
  async deleteEmployerJob(
    @CurrentUser('userId') userId: string,
    @Param('id') id: string,
  ) {
    return this.jobService.removeEmployerJob(userId, id);
  }
}

