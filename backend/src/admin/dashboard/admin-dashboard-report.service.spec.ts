import { BadRequestException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import type { PrismaService } from '../../prisma/prisma.service';
import type { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardReportService } from './admin-dashboard-report.service';

describe('AdminDashboardReportService (Excel .xlsx export)', () => {
  const createService = () => {
    const prisma = {
      donXinViec: { findMany: jest.fn().mockResolvedValue([]) },
      muaQuangCao: { findMany: jest.fn().mockResolvedValue([]) },
      thanhToan: { findMany: jest.fn().mockResolvedValue([]) },
    };

    const dashboardService = {
      getMetrics: jest.fn().mockResolvedValue({
        totalUsers: {
          count: 120,
          candidatesCount: 100,
          employersCount: 20,
          growthPercent: 12,
        },
        pendingJobs: { count: 4, requiresImmediateReview: true },
        totalApplications: { count: 55, growthPercent: 18 },
        platformRevenue: {
          totalAmount: 25_000_000,
          formattedAmount: '25,000,000 VNĐ',
          growthPercent: 24,
        },
      }),
      getUserGrowthChart: jest.fn().mockResolvedValue({
        period: 'monthly',
        subtitle: 'Jan – Dec 2026',
        currentPeriodTotal: 20,
        growthPercent: 15,
        comparisonLabel: 'vs last month',
        summary: { candidates: 100, employers: 20 },
        data: [
          { label: 'Jan', candidates: 10, employers: 2, total: 12 },
          { label: 'Feb', candidates: 15, employers: 3, total: 18 },
        ],
      }),
      getApplicationStats: jest.fn().mockResolvedValue({
        period: 'monthly',
        totalApplications: 55,
        changePercentage: 18,
        averageResponseRate: 80,
        interviewRate: 40,
        hiredRate: 15,
        breakdown: [
          {
            status: 'CHO_DUYET',
            label: 'Chờ duyệt',
            count: 11,
            percentage: 20,
            color: '#94A3B8',
          },
          {
            status: 'DUOC_NHAN',
            label: 'Trúng tuyển',
            count: 8,
            percentage: 14.5,
            color: '#10B981',
          },
        ],
      }),
    };

    const service = new AdminDashboardReportService(
      prisma as unknown as PrismaService,
      dashboardService as unknown as AdminDashboardService,
    );

    return { service, prisma, dashboardService };
  };

  it('xuất báo cáo tổng hợp (summary) gồm đủ 5 Sheet hợp lệ', async () => {
    const { service, prisma } = createService();
    prisma.muaQuangCao.findMany.mockResolvedValue([
      {
        maMua: 'm-1',
        tieuDe: 'Gói Diamond',
        giaTaiThoiDiemMua: 15_000_000,
        ngayMua: new Date('2026-11-10T08:00:00Z'),
        trangThai: 'DA_THANH_TOAN',
        goiQuangCao: { tieuDe: 'Gói Diamond' },
        nhaTuyenDung: { congTy: { tenCongTy: 'FPT Software', logoUrl: null } },
      },
    ]);
    prisma.thanhToan.findMany.mockResolvedValue([
      {
        maThanhToan: 'tt-1',
        maGiaoDichDoiTac: 'VN-20261110-01',
        soTienThanhToan: 15_000_000,
        ngayThanhToan: new Date('2026-11-10T08:05:00Z'),
        trangThaiTT: 'THANH_CONG',
        muaQuangCao: {
          tieuDe: 'Gói Diamond',
          goiQuangCao: { tieuDe: 'Gói Diamond' },
          nhaTuyenDung: {
            congTy: { tenCongTy: 'FPT Software', logoUrl: null },
          },
        },
      },
    ]);

    const { buffer, filename } = await service.generateExcelReport({
      reportType: 'summary',
      period: 'monthly',
    });

    expect(filename).toMatch(
      /^viecngon-bao-cao-summary-\d{4}-\d{2}-\d{2}\.xlsx$/,
    );
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer as unknown as ArrayBuffer);

    expect(wb.worksheets.map((ws) => ws.name)).toEqual([
      'Tổng quan KPI',
      'Tăng trưởng người dùng',
      'Phễu ứng tuyển',
      'Doanh thu theo gói',
      'Danh sách giao dịch',
    ]);
  });

  it('xuất báo cáo doanh thu (revenue) chỉ gồm 3 Sheet tài chính', async () => {
    const { service } = createService();
    const { buffer } = await service.generateExcelReport({
      reportType: 'revenue',
      period: 'quarterly',
    });

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer as unknown as ArrayBuffer);
    expect(wb.worksheets.map((ws) => ws.name)).toEqual([
      'Tổng quan KPI',
      'Doanh thu theo gói',
      'Danh sách giao dịch',
    ]);
  });

  it('xuất báo cáo tuyển dụng (recruitment) chỉ gồm 3 Sheet tuyển dụng', async () => {
    const { service } = createService();
    const { buffer } = await service.generateExcelReport({
      reportType: 'recruitment',
      period: 'yearly',
      fromDate: '2026-01-01',
      toDate: '2026-11-26',
    });

    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buffer as unknown as ArrayBuffer);
    expect(wb.worksheets.map((ws) => ws.name)).toEqual([
      'Tổng quan KPI',
      'Tăng trưởng người dùng',
      'Phễu ứng tuyển',
    ]);
  });

  it('từ chối nếu fromDate lớn hơn toDate', async () => {
    const { service } = createService();
    await expect(
      service.generateExcelReport({
        reportType: 'summary',
        fromDate: '2026-12-01',
        toDate: '2026-11-01',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
