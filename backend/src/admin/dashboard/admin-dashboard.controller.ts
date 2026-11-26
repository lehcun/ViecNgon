import { Controller, Get, Query, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type express from 'express';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardReportService } from './admin-dashboard-report.service';
import { ExportDashboardReportDto } from './dto/export-dashboard-report.dto';
import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import type { AdminChartPeriod } from '@viecngon/types';

@Controller('admin/dashboard')
@AdminOnly()
export class AdminDashboardController {
  constructor(
    private readonly adminDashboardService: AdminDashboardService,
    private readonly reportService: AdminDashboardReportService,
  ) {}

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

  /**
   * 6. Xuất báo cáo Excel (.xlsx) đa sheet (Tổng hợp / Doanh thu / Tuyển dụng)
   * GET /admin/dashboard/export-report?reportType=summary&period=monthly&fromDate=&toDate=
   */
  @Throttle({ default: { limit: 15, ttl: 60_000 } })
  @Get('export-report')
  async exportReport(
    @Query() query: ExportDashboardReportDto,
    @Res() res: express.Response,
  ) {
    const { buffer, filename } =
      await this.reportService.generateExcelReport(query);

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.send(buffer);
  }
}
