import { Module } from '@nestjs/common';
import { AiModule } from 'src/ai/ai.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { CvParserController } from './cv-parser.controller';
import { CvParserService } from './cv-parser.service';

@Module({
  imports: [AiModule, CloudinaryModule],
  controllers: [CvParserController],
  providers: [CvParserService],
  exports: [CvParserService],
})
export class CvParserModule {}

