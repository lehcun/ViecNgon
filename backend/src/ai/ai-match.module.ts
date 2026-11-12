import { Module } from '@nestjs/common';
import { AiModule } from './ai.module';
import { AiMatchService } from './ai-match.service';

@Module({
  imports: [AiModule],
  providers: [AiMatchService],
  exports: [AiMatchService],
})
export class AiMatchModule {}

