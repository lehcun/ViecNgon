import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { EmployerApplicationsController } from './employer-applications.controller';
import { ApplicationsService } from './applications.service';
import { GoogleCalendarService } from 'src/calender/google-calendar.service';
import { AiMatchModule } from 'src/ai/ai-match.module';

@Module({
  imports: [AiMatchModule],
  controllers: [ApplicationsController, EmployerApplicationsController],
  providers: [ApplicationsService, GoogleCalendarService],
})
export class ApplicationsModule {}
