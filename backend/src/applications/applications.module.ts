import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { GoogleCalendarService } from 'src/calender/google-calendar.service';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService, GoogleCalendarService],
})
export class ApplicationsModule {}
