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
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createJobDto: CreateJobDto) {
    return this.jobService.create(createJobDto);
  }

  @Get()
  findAll() {
    return this.jobService.findAll();
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

  @Get(':slug')
  async getJobDetail(@Param('slug') slug: string) {
    return this.jobService.getJobBySlug(slug);
  }
}
