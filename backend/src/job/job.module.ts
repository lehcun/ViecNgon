import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { EmployerJobController } from './employer-job.controller';
import { JobService } from './job.service';

@Module({
  controllers: [JobController, EmployerJobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
