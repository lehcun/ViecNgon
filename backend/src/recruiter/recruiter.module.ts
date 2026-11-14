import { Module } from '@nestjs/common';
import { RecruiterController } from './recruiter.controller';
import { RecruiterService } from './recruiter.service';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [CloudinaryModule],
  controllers: [RecruiterController],
  providers: [RecruiterService],
})
export class RecruiterModule {}
