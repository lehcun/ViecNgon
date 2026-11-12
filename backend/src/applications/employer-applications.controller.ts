import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, type AuthUser } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AiMatchService } from 'src/ai/ai-match.service';

@Controller('employer/applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EmployerApplicationsController {
  constructor(private readonly aiMatchService: AiMatchService) {}

  @Get(':id/ai-analysis')
  @Roles('NHATUYENDUNG')
  async getAiAnalysis(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return await this.aiMatchService.analyzeApplicationForEmployer(user.id, id);
  }
}

