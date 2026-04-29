import { Controller, Get, UseGuards } from '@nestjs/common';
import * as jwtAuthGuard from 'src/auth/jwt-auth.guard';
import { CandidateService } from './candidate.service';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    const maTaiKhoan = user.maTaiKhoan;
    return await this.candidateService.getMyProfile(maTaiKhoan);
  }
}
