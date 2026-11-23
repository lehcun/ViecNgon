import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdminSkillsController } from './admin-skills.controller';
import { AdminSkillsService } from './admin-skills.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdminSkillsController],
  providers: [AdminSkillsService],
  exports: [AdminSkillsService],
})
export class AdminSkillsModule {}
