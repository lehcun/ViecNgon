import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  // API 1: GET /campaigns/packages -> Public (Ai cũng xem được bảng giá)
  @Get('packages')
  async getPackages() {
    return await this.campaignService.getPackages();
  }

  // API 2: GET /campaigns/my-campaigns -> Lấy danh sách gói HR đã mua
  @UseGuards(JwtAuthGuard)
  @Get('my-campaigns')
  async getMyCampaigns(@CurrentUser() user: { id: string }) {
    return await this.campaignService.getMyCampaigns(user.id);
  }

  // API 3: POST /campaigns/purchase -> Thanh toán giả lập
  @UseGuards(JwtAuthGuard)
  @Post('purchase')
  async purchasePackage(
    @CurrentUser() user: { id: string },
    @Body('maGoi') maGoi: string,
  ) {
    return await this.campaignService.purchasePackage(user.id, maGoi);
  }
}
