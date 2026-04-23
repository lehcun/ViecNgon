import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployerModule } from './employer/employer.module';

@Module({
  imports: [EmployerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
