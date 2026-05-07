import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import * as jwtAuthGuard from 'src/auth/guards/jwt-auth.guard';
import { ApplicationService } from './application.service';
import { CreateDonXinViecDto } from './dto/create-don-xin-viec.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('application')
export class ApplicationController {
  constructor(private readonly donXinViecService: ApplicationService) {}

  @UseGuards(jwtAuthGuard.JwtAuthGuard)
  @Post()
  async applyForJob(
    @CurrentUser() user: { id: string },
    @Body() createDonXinViecDto: CreateDonXinViecDto,
  ) {
    return this.donXinViecService.createApplication(
      createDonXinViecDto,
      user.id,
    );
  }
}
