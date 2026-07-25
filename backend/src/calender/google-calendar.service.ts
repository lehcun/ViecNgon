import { Injectable } from '@nestjs/common';
import { Auth, google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private oauth2Client: Auth.OAuth2Client;

  constructor() {
    // @ts-expect-error: Bỏ qua lỗi xung đột type của google-auth-library trong Monorepo
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );
    this.oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });
  }

  async createInterviewEvent(
    summary: string,
    description: string,
    startTime: string, // ISO String từ Frontend
    candidateEmail: string,
    hrEmail: string,
    createMeetLink: boolean,
  ) {
    // 2. Thêm dòng này để bỏ qua lỗi type mismatch khi truyền vào parameter
    // @ts-expect-error: Bỏ qua lỗi xung đột type
    const calendar = google.calendar({
      version: 'v3',
      auth: this.oauth2Client,
    });

    // Mặc định phỏng vấn kéo dài 1 tiếng
    const endTime = new Date(
      new Date(startTime).getTime() + 60 * 60 * 1000,
    ).toISOString();

    const event: any = {
      summary: summary,
      description: description,
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

    // Gửi request tạo sự kiện
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
      conferenceDataVersion: createMeetLink ? 1 : 0,
      sendUpdates: 'all', // Tự động gửi email thông báo từ Google đến Ứng viên
    });

    return res.data; // Trả về thông tin sự kiện chứa link Meet (hangoutLink)
  }
}
