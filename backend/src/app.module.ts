import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CandidateModule } from './candidate/candidate.module';
import { RecruiterModule } from './recruiter/recruiter.module';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    CandidateModule,
    PrismaModule,
    AuthModule,
    RecruiterModule,
    CompanyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
