import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import type {
  AdminJobActionResponse,
  AdminJobDetailResponse,
  AdminJobsListResponse,
  DeleteAdminJobResponse,
} from '@viecngon/types';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import { AdminJobsService } from './admin-jobs.service';
import { DeleteAdminJobDto } from './dto/delete-admin-job.dto';
import { ModerateAdminJobDto } from './dto/moderate-admin-job.dto';
import { QueryAdminJobsDto } from './dto/query-admin-jobs.dto';

@Controller('admin/jobs')
@AdminOnly()
export class AdminJobsController {
  constructor(private readonly adminJobsService: AdminJobsService) {}

  @Get()
  findAll(@Query() query: QueryAdminJobsDto): Promise<AdminJobsListResponse> {
    return this.adminJobsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AdminJobDetailResponse> {
    return this.adminJobsService.findOne(id);
  }

  @Patch(':id/moderate')
  moderate(
    @Param('id') id: string,
    @Body() dto: ModerateAdminJobDto,
  ): Promise<AdminJobActionResponse> {
    return this.adminJobsService.moderate(id, dto);
  }

  @Delete(':id')
  softDelete(
    @Param('id') id: string,
    @Body() dto: DeleteAdminJobDto,
  ): Promise<DeleteAdminJobResponse> {
    return this.adminJobsService.softDelete(id, dto);
  }
}
