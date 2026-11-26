import { BadRequestException, Injectable } from '@nestjs/common';
import type {
  AdminApplicationStatsResponse,
  AdminChartPeriod,
  AdminRecentTransactionItem,
  AdminReportType,
  ApplicationStatusBreakdown,
} from '@viecngon/types';
import { PrismaService } from '../../prisma/prisma.service';
import { AdminDashboardService } from './admin-dashboard.service';
import {
  buildAdminDashboardWorkbookBuffer,
  type ReportRevenuePackageRow,
} from './admin-dashboard-excel.builder';
import type { ExportDashboardReportDto } from './dto/export-dashboard-report.dto';

interface ParsedDateRange {
  start?: Date;
  end?: Date;
  label: string;
}

const MAX_EXPORT_TRANSACTIONS = 2000;

@Injectable()
export class AdminDashboardReportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dashboardService: AdminDashboardService,
  ) {}

  private parseDateRange(fromDate?: string, toDate?: string): ParsedDateRange {
    let start: Date | undefined;
    let end: Date | undefined;

    if (fromDate) {
      const parsed = new Date(`${fromDate}T00:00:00.000Z`);
      if (Number.isNaN(parsed.getTime())) {
        throw new BadRequestException('Ngày bắt đầu không hợp lệ.');
      }
      start = parsed;
    }

    if (toDate) {
      const parsed = new Date(`${toDate}T23:59:59.999Z`);
      if (Number.isNaN(parsed.getTime())) {
        throw new BadRequestException('Ngày kết thúc không hợp lệ.');
      }
      end = parsed;
    }

    if (start && end && start.getTime() > end.getTime()) {
      throw new BadRequestException(
        'Ngày bắt đầu không được lớn hơn ngày kết thúc.',
      );
    }

    if (fromDate && toDate) {
      return { start, end, label: `${fromDate} → ${toDate}` };
    }
    if (fromDate) {
      return { start, end, label: `Từ ${fromDate}` };
    }
    if (toDate) {
      return { start, end, label: `Đến ${toDate}` };
    }
    return { label: 'Toàn bộ thời gian' };
  }

  private normalizePaymentStatus(
    rawStatus: string | null | undefined,
  ): 'PAID' | 'PENDING' | 'FAILED' {
    const upper = (rawStatus || '').toUpperCase();
    if (upper.includes('CHO') || upper.includes('PENDING')) return 'PENDING';
    if (
      upper.includes('LOI') ||
      upper.includes('HUY') ||
      upper.includes('FAIL')
    ) {
      return 'FAILED';
    }
    return 'PAID';
  }

  private async getFilteredApplicationStats(
    period: AdminChartPeriod,
    range: ParsedDateRange,
  ): Promise<AdminApplicationStatsResponse> {
    if (!range.start && !range.end) {
      return this.dashboardService.getApplicationStats(period);
    }

    const apps = await this.prisma.donXinViec.findMany({
      where: {
        ngayNop: {
          ...(range.start ? { gte: range.start } : {}),
          ...(range.end ? { lte: range.end } : {}),
        },
      },
      select: { trangThai: true },
    });

    const total = apps.length;
    let pending = 0;
    let reviewed = 0;
    let interview = 0;
    let hired = 0;
    let rejected = 0;

    for (const app of apps) {
      const s = (app.trangThai || '').toUpperCase();
      if (s === 'DA_XEM') reviewed++;
      else if (s === 'PHONG_VAN') interview++;
      else if (s === 'DUOC_NHAN' || s === 'TRUNG_TUYEN') hired++;
      else if (s === 'BI_LOAI' || s === 'TU_CHOI' || s === 'KHONG_PHU_HOP') {
        rejected++;
      } else {
        pending++;
      }
    }

    const pct = (n: number) =>
      total > 0 ? Math.round((n / total) * 1000) / 10 : 0;

    const breakdown: ApplicationStatusBreakdown[] = [
      {
        status: 'CHO_DUYET',
        label: 'Chờ duyệt',
        count: pending,
        percentage: pct(pending),
        color: '#94A3B8',
      },
      {
        status: 'DA_XEM',
        label: 'Đã xem',
        count: reviewed,
        percentage: pct(reviewed),
        color: '#60A5FA',
      },
      {
        status: 'PHONG_VAN',
        label: 'Phỏng vấn',
        count: interview,
        percentage: pct(interview),
        color: '#2563EB',
      },
      {
        status: 'DUOC_NHAN',
        label: 'Trúng tuyển',
        count: hired,
        percentage: pct(hired),
        color: '#10B981',
      },
      {
        status: 'BI_LOAI',
        label: 'Từ chối',
        count: rejected,
        percentage: pct(rejected),
        color: '#EF4444',
      },
    ];

    const responded = reviewed + interview + hired + rejected;
    return {
      period,
      totalApplications: total,
      changePercentage: 0,
      averageResponseRate: pct(responded),
      interviewRate: pct(interview + hired),
      hiredRate: pct(hired),
      breakdown,
    };
  }

  private async getRevenueAndTransactions(range: ParsedDateRange): Promise<{
    packages: ReportRevenuePackageRow[];
    totalRevenue: number;
    transactions: AdminRecentTransactionItem[];
  }> {
    const hasDateFilter = Boolean(range.start || range.end);

    const [campaigns, payments] = await Promise.all([
      this.prisma.muaQuangCao.findMany({
        where: hasDateFilter
          ? {
              ngayMua: {
                ...(range.start ? { gte: range.start } : {}),
                ...(range.end ? { lte: range.end } : {}),
              },
            }
          : undefined,
        orderBy: { ngayMua: 'desc' },
        take: MAX_EXPORT_TRANSACTIONS,
        include: {
          goiQuangCao: true,
          nhaTuyenDung: { include: { congTy: true } },
        },
      }),
      this.prisma.thanhToan.findMany({
        where: hasDateFilter
          ? {
              ngayThanhToan: {
                ...(range.start ? { gte: range.start } : {}),
                ...(range.end ? { lte: range.end } : {}),
              },
            }
          : undefined,
        orderBy: { ngayThanhToan: 'desc' },
        take: MAX_EXPORT_TRANSACTIONS,
        include: {
          muaQuangCao: {
            include: {
              goiQuangCao: true,
              nhaTuyenDung: { include: { congTy: true } },
            },
          },
        },
      }),
    ]);

    const pkgMap = new Map<string, { orderCount: number; amount: number }>();
    let totalRevenue = 0;

    for (const c of campaigns) {
      const name = c.goiQuangCao?.tieuDe || c.tieuDe || 'Gói Tiêu Chuẩn';
      const price = Number(c.giaTaiThoiDiemMua || 0);
      totalRevenue += price;
      const prev = pkgMap.get(name) ?? { orderCount: 0, amount: 0 };
      pkgMap.set(name, {
        orderCount: prev.orderCount + 1,
        amount: prev.amount + price,
      });
    }

    const packages: ReportRevenuePackageRow[] = Array.from(
      pkgMap.entries(),
    ).map(([packageName, info]) => ({
      packageName,
      orderCount: info.orderCount,
      amount: info.amount,
      percentage:
        totalRevenue > 0
          ? Math.round((info.amount / totalRevenue) * 1000) / 10
          : 0,
    }));

    const transactions: AdminRecentTransactionItem[] =
      payments.length > 0
        ? payments.map((p, idx) => {
            const amount = Number(p.soTienThanhToan || 0);
            return {
              id: p.maThanhToan,
              transactionCode: p.maGiaoDichDoiTac || `#VN-${10284 - idx}`,
              companyName:
                p.muaQuangCao?.nhaTuyenDung?.congTy?.tenCongTy ||
                'Doanh nghiệp IT',
              companyLogo: p.muaQuangCao?.nhaTuyenDung?.congTy?.logoUrl || null,
              packageName:
                p.muaQuangCao?.goiQuangCao?.tieuDe ||
                p.muaQuangCao?.tieuDe ||
                'Gói Dịch Vụ',
              amount,
              formattedAmount: `${amount.toLocaleString('en-US')} VNĐ`,
              paidAt: p.ngayThanhToan,
              status: this.normalizePaymentStatus(p.trangThaiTT),
            };
          })
        : campaigns.map((c, idx) => {
            const amount = Number(c.giaTaiThoiDiemMua || 0);
            return {
              id: c.maMua,
              transactionCode: `#VN-${10284 - idx}`,
              companyName:
                c.nhaTuyenDung?.congTy?.tenCongTy || 'Doanh nghiệp IT',
              companyLogo: c.nhaTuyenDung?.congTy?.logoUrl || null,
              packageName:
                c.goiQuangCao?.tieuDe || c.tieuDe || 'Gói Tuyển Dụng',
              amount,
              formattedAmount: `${amount.toLocaleString('en-US')} VNĐ`,
              paidAt: c.ngayMua,
              status: this.normalizePaymentStatus(c.trangThai),
            };
          });

    return { packages, totalRevenue, transactions };
  }

  async generateExcelReport(
    dto: ExportDashboardReportDto,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const reportType: AdminReportType = dto.reportType ?? 'summary';
    const period: AdminChartPeriod = dto.period ?? 'monthly';
    const range = this.parseDateRange(dto.fromDate, dto.toDate);
    const exportedAt = new Date();

    const [metrics, userGrowth, applicationStats, revenueData] =
      await Promise.all([
        this.dashboardService.getMetrics(),
        this.dashboardService.getUserGrowthChart(period),
        this.getFilteredApplicationStats(period, range),
        this.getRevenueAndTransactions(range),
      ]);

    const adjustedMetrics =
      range.start || range.end
        ? {
            ...metrics,
            totalApplications: {
              ...metrics.totalApplications,
              count: applicationStats.totalApplications,
            },
            platformRevenue: {
              ...metrics.platformRevenue,
              totalAmount: revenueData.totalRevenue,
              formattedAmount: `${revenueData.totalRevenue.toLocaleString('en-US')} VNĐ`,
            },
          }
        : metrics;

    const buffer = await buildAdminDashboardWorkbookBuffer({
      reportType,
      period,
      dateRangeLabel: range.label,
      exportedAt,
      metrics: adjustedMetrics,
      userGrowth,
      applicationStats,
      revenuePackages: revenueData.packages,
      totalRevenue: revenueData.totalRevenue,
      transactions: revenueData.transactions,
    });

    const dateStamp = exportedAt.toISOString().slice(0, 10);
    const filename = `viecngon-bao-cao-${reportType}-${dateStamp}.xlsx`;
    return { buffer, filename };
  }
}
