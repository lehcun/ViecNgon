import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { RecruiterService } from './recruiter.service';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import * as jwtAuthGuard from 'src/auth/guards/jwt-auth.guard';

@Controller('recruiter')
@UseGuards(jwtAuthGuard.JwtAuthGuard, RolesGuard)
export class RecruiterController {
  constructor(private readonly recruiterService: RecruiterService) {}

  @Get('profile')
  @Roles('NHATUYENDUNG') // Chỉ HR mới gọi được
  async getProfile(@CurrentUser() user: jwtAuthGuard.AuthUser) {
    return this.recruiterService.getProfile(user.id);
  }

  @Patch('profile')
  @Roles('NHATUYENDUNG')
  async updateProfile(
    @CurrentUser() user: jwtAuthGuard.AuthUser,
    @Body() updateDto: UpdateRecruiterDto,
  ) {
    return this.recruiterService.updateProfile(user.id, updateDto);
  }
}
