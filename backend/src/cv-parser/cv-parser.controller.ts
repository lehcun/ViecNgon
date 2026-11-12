import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CvParserService, type UploadedPdfFile } from './cv-parser.service';

const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

@Controller('candidate/cv')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CvParserController {
  constructor(private readonly cvParserService: CvParserService) { }

  @Post('parse')
  @Roles('UNGVIEN')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_CV_SIZE_BYTES },
      fileFilter: (_req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(
            new BadRequestException('Chỉ chấp nhận định dạng file PDF.'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async parseCv(@UploadedFile() file: UploadedPdfFile) {
    if (!file) {
      throw new BadRequestException('Vui lòng tải lên file CV (PDF).');
    }

    return await this.cvParserService.parseCvPdf(file);
  }
}

