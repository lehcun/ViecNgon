import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as jwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { CandidateService } from './candidate.service';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return await this.candidateService.getProfile(user.id);
  }

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() updateData: UpdateCandidateDto,
  ) {
    return this.candidateService.updateProfile(user.id, updateData);
  }

  @Post('cv/upload-generated')
  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file')) // Nhận file từ field tên là "file"
  async uploadGeneratedCv(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @UploadedFile() file: any,
  ) {
    // Lấy ID ứng viên từ Token (Giả sử bạn gán ID vào req.user.id lúc login)
    const maTaiKhoan = user.id;

    return await this.candidateService.uploadGeneratedCv(maTaiKhoan, file);
  }
}
