import { Injectable, Logger } from '@nestjs/common';
import { Auth, google } from 'googleapis';

export interface CalendarEventResult {
  hangoutLink: string | null;
  calendarSynced: boolean;
  warning?: string;
}

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private oauth2Client: Auth.OAuth2Client;
  private readonly isConfigured: boolean;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    this.isConfigured = Boolean(clientId && clientSecret && refreshToken);

    // @ts-expect-error: Bỏ qua lỗi xung đột type của google-auth-library trong Monorepo
    this.oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
    if (refreshToken) {
      this.oauth2Client.setCredentials({
        refresh_token: refreshToken,
      });
    }
  }

  async createInterviewEvent(
    summary: string,
    description: string,
    startTime: string, // ISO String từ Frontend
    candidateEmail: string,
    hrEmail: string,
    createMeetLink: boolean,
  ): Promise<CalendarEventResult> {
    if (!this.isConfigured) {
      this.logger.warn(
        'Google Calendar chưa được cấu hình đủ biến môi trường; bỏ qua bước tạo sự kiện Calendar/Meet.',
      );
      return {
        hangoutLink: null,
        calendarSynced: false,
        warning:
          'Lịch phỏng vấn đã được lưu nhưng hệ thống chưa kết nối Google Calendar. Vui lòng gửi link họp trực tiếp cho ứng viên.',
      };
    }

    // @ts-expect-error: Bỏ qua lỗi xung đột type
    const calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });

    // Mặc định phỏng vấn kéo dài 1 tiếng
    const endTime = new Date(
      new Date(startTime).getTime() + 60 * 60 * 1000,
    ).toISOString();

    const event: Record<string, unknown> = {
      summary,
      description,
      start: { dateTime: startTime, timeZone: 'Asia/Ho_Chi_Minh' },
      end: { dateTime: endTime, timeZone: 'Asia/Ho_Chi_Minh' },
      attendees: [{ email: candidateEmail }, { email: hrEmail }], // Mời cả HR và Ứng viên
    };

    // Yêu cầu Google tự động sinh link Google Meet
    if (createMeetLink) {
      event.conferenceData = {
        createRequest: {
          requestId: `interview-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }

    try {
      const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: createMeetLink ? 1 : 0,
        sendUpdates: 'all', // Tự động gửi email thông báo từ Google đến Ứng viên
      });

      return {
        hangoutLink: res.data.hangoutLink || null,
        calendarSynced: true,
      };
    } catch (error: unknown) {
      // Chỉ ghi log mã lỗi ngắn gọn, tuyệt đối không in raw GaxiosError (tránh lộ refresh_token)
      const safeErrorCode = this.extractSafeErrorCode(error);
      this.logger.warn(
        `Không thể đồng bộ Google Calendar (${safeErrorCode}); tiếp tục lưu lịch phỏng vấn không kèm link Meet.`,
      );

      const isInvalidGrant = safeErrorCode.includes('invalid_grant');
      return {
        hangoutLink: null,
        calendarSynced: false,
        warning: isInvalidGrant
          ? 'Lịch phỏng vấn đã được lưu, nhưng phiên kết nối Google Calendar đã hết hạn (invalid_grant) nên chưa tạo được link Google Meet tự động.'
          : 'Lịch phỏng vấn đã được lưu, nhưng tạm thời không thể đồng bộ Google Calendar để tạo link Google Meet.',
      };
    }
  }

  private extractSafeErrorCode(error: unknown): string {
    if (error && typeof error === 'object') {
      const errObj = error as {
        response?: { data?: { error?: unknown } };
        message?: unknown;
      };
      const apiErr = errObj.response?.data?.error;
      if (typeof apiErr === 'string' && apiErr.trim()) {
        return apiErr.trim();
      }
      if (typeof errObj.message === 'string' && errObj.message.trim()) {
        return errObj.message.slice(0, 120);
      }
    }
    return 'unknown_error';
  }
}
