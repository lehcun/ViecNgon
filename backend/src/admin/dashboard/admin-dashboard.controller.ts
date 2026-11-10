import { Controller, Get, Query } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import type { AdminChartPeriod } from '@viecngon/types';

@Controller('admin/dashboard')
@AdminOnly()
export class AdminDashboardController {
  constructor(private readonly adminDashboardService: AdminDashboardService) {}

  /**
   * 1. Lấy 4 thẻ chỉ số tổng quan (Tổng user, Job chờ duyệt, Tổng đơn ứng tuyển, Doanh thu)
   * GET /admin/dashboard/metrics
   */
  @Get('metrics')
  async getMetrics() {
    return this.adminDashboardService.getMetrics();
  }

  /**
   * 2. Lấy dữ liệu biểu đồ tăng trưởng người dùng (Ứng viên & Nhà tuyển dụng)
   * GET /admin/dashboard/charts?period=monthly|quarterly|yearly
   */
  @Get('charts')
  async getUserGrowthChart(@Query('period') period?: string) {
    const validPeriods: AdminChartPeriod[] = ['monthly', 'quarterly', 'yearly'];
    const normalizedPeriod: AdminChartPeriod = validPeriods.includes(
      period as AdminChartPeriod,
    )
      ? (period as AdminChartPeriod)
      : 'monthly';

    return this.adminDashboardService.getUserGrowthChart(normalizedPeriod);
  }

  /**
   * 3. Lấy dữ liệu thống kê & phễu trạng thái Đơn ứng tuyển (Application Analytics)
   * GET /admin/dashboard/application-stats?period=monthly|quarterly|yearly
   */
  @Get('application-stats')
  async getApplicationStats(@Query('period') period?: string) {
    const validPeriods: AdminChartPeriod[] = ['monthly', 'quarterly', 'yearly'];
    const normalizedPeriod: AdminChartPeriod = validPeriods.includes(
      period as AdminChartPeriod,
    )
      ? (period as AdminChartPeriod)
      : 'monthly';

    return this.adminDashboardService.getApplicationStats(normalizedPeriod);
  }

  /**
   * 4. Lấy danh sách các giao dịch thanh toán gói dịch vụ gần nhất
   * GET /admin/dashboard/recent-transactions
   */
  @Get('recent-transactions')
  async getRecentTransactions() {
    return this.adminDashboardService.getRecentTransactions();
  }

  /**
   * 5. Lấy cơ cấu doanh thu theo từng gói dịch vụ
   * GET /admin/dashboard/revenue-breakdown
   */
  @Get('revenue-breakdown')
  async getRevenueBreakdown() {
    return this.adminDashboardService.getRevenueBreakdown();
  }
}

