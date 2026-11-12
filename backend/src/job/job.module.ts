import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { EmployerJobController } from './employer-job.controller';
import { JobService } from './job.service';
import { AiMatchModule } from 'src/ai/ai-match.module';

@Module({
  imports: [AiMatchModule],
  controllers: [JobController, EmployerJobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
