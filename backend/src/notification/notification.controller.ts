import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import * as jwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { NotificationService } from './notification.service';
import { GetNotificationsDto } from './dto/get-notifications.dto';

@Controller('notifications')
@UseGuards(jwtAuthGuard.JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Get()
  async getNotifications(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Query() query: GetNotificationsDto,
  ) {
    return this.notificationService.getNotifications(user.id, query);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return this.notificationService.getUnreadCount(user.id);
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return this.notificationService.markAllAsRead(user.id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: jwtAuthGuard.AuthUser,
  ) {
    return this.notificationService.markAsRead(id, user.id);
  }
}
