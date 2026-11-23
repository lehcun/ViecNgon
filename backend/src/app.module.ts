import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CandidateModule } from './candidate/candidate.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { CompanyModule } from './company/company.module';
import { JobModule } from './job/job.module';
import { SkillModule } from './skill/skill.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ApplicationsModule } from './applications/applications.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { NotificationModule } from './notification/notification.module';
import { CampaignModule } from './campaign/campaign.module';
import { CompanyProfileModule } from './company-profile/company-profile.module';
import { AdminDashboardModule } from './admin/dashboard/admin-dashboard.module';
import { AdminUsersModule } from './admin/users/admin-users.module';
import { AdminJobsModule } from './admin/jobs/admin-jobs.module';
import { AdminPackagesModule } from './admin/packages/admin-packages.module';
import { AiModule } from './ai/ai.module';
import { AiMatchModule } from './ai/ai-match.module';
import { CvParserModule } from './cv-parser/cv-parser.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 120,
      },
    ]),
    CandidateModule,
    PrismaModule,
    AuthModule,
    RecruiterModule,
    CompanyModule,
    JobModule,
    SkillModule,
    CloudinaryModule,
    ApplicationsModule,
    CompanyProfileModule,
    AdminDashboardModule,
    AdminUsersModule,
    AdminJobsModule,
    AdminPackagesModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        ...(process.env.MAIL_PORT
          ? { port: Number(process.env.MAIL_PORT) }
          : {}),
        secure: process.env.MAIL_SECURE === 'true', // true cho port 465, false cho các port khác
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: process.env.MAIL_FROM,
      },
    }),
    NotificationModule,
    CampaignModule,
    AiModule,
    AiMatchModule,
    CvParserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
