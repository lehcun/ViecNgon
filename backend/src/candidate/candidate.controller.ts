import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import * as jwtAuthGuard from 'src/auth/jwt-auth.guard';
import { CandidateService } from './candidate.service';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Controller('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return this.candidateService.getProfile(user.id);
  }

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() updateData: UpdateCandidateDto,
  ) {
    return this.candidateService.updateProfile(user.id, updateData);
  }
}
