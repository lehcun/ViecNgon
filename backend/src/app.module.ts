import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    CandidateModule,
    PrismaModule,
    AuthModule,
    RecruiterModule,
    CompanyModule,
    JobModule,
    SkillModule,
    CloudinaryModule,
    ApplicationsModule,
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        secure: false, // true cho port 465, false cho các port khác
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
