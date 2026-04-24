import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployerModule } from './employer/employer.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [EmployerModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
