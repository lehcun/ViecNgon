import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { CandidateNotificationController } from './candidate-notification.controller';
import { NotificationService } from './notification.service';

@Module({
  controllers: [NotificationController, CandidateNotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
