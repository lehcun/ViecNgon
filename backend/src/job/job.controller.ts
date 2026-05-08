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
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { GetJobsFilterDto } from './dto/get-jobs-filter.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.jobService.findOne(id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<CreateJobDto>) {
    return this.jobService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jobService.remove(id);
  }

  @Get()
  async getJobs(@Query() filterDto: GetJobsFilterDto) {
    // @Query() tự động lấy các tham số trên thanh URL nhét vào object filterDto
    return this.jobService.getJobs(filterDto);
  }

  @Get(':slug')
  async getJobDetail(@Param('slug') slug: string) {
    return this.jobService.getJobBySlug(slug);
  }
}
