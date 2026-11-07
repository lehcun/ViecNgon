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

@Controller('candidate/notifications')
@UseGuards(jwtAuthGuard.JwtAuthGuard)
export class CandidateNotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  // 1. Lấy danh sách thông báo của user (phân trang & filter ALL | UNREAD | READ)
  @Get()
  async getNotifications(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Query() query: GetNotificationsDto,
  ) {
    return this.notificationService.getNotifications(user.id, query);
  }

  // 2. Lấy số lượng thông báo chưa đọc để hiển thị badge
  @Get('unread-count')
  async getUnreadCount(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return this.notificationService.getUnreadCount(user.id);
  }

  // 3. Đánh dấu tất cả thông báo của user là đã đọc
  @Patch('read-all')
  async markAllAsRead(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return this.notificationService.markAllAsRead(user.id);
  }

  // 4. Đánh dấu 1 thông báo là đã đọc
  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: jwtAuthGuard.AuthUser,
  ) {
    return this.notificationService.markAsRead(id, user.id);
  }
}