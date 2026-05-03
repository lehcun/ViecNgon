import { Controller, Get, Param } from '@nestjs/common';
import { JobService } from './job.service';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get(':slug')
  async getJobDetail(@Param('slug') slug: string) {
    return this.jobService.getJobBySlug(slug);
  }
}
