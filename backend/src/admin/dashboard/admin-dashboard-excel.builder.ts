import * as ExcelJS from 'exceljs';
import type {
  AdminApplicationStatsResponse,
  AdminChartPeriod,
  AdminDashboardMetricsResponse,
  AdminRecentTransactionItem,
  AdminReportType,
  UserGrowthChartResponse,
} from '@viecngon/types';

export interface ReportRevenuePackageRow {
  packageName: string;
  orderCount: number;
  amount: number;
  percentage: number;
}

export interface AdminDashboardReportPayload {
  reportType: AdminReportType;
  period: AdminChartPeriod;
  dateRangeLabel: string;
  exportedAt: Date;
  metrics: AdminDashboardMetricsResponse;
  userGrowth: UserGrowthChartResponse;
  applicationStats: AdminApplicationStatsResponse;
  revenuePackages: ReportRevenuePackageRow[];
  totalRevenue: number;
  transactions: AdminRecentTransactionItem[];
}

const REPORT_TYPE_LABELS: Record<AdminReportType, string> = {
  summary: 'Báo cáo tổng hợp',
  revenue: 'Báo cáo doanh thu',
  recruitment: 'Báo cáo tuyển dụng',
};

const PERIOD_LABELS: Record<AdminChartPeriod, string> = {
  monthly: 'Theo Tháng',
  quarterly: 'Theo Quý',
  yearly: 'Theo Năm',
};

const HEADER_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FF1E3A8A' },
};

const TOTAL_FILL: ExcelJS.Fill = {
  type: 'pattern',
  pattern: 'solid',
  fgColor: { argb: 'FFF1F5F9' },
};

const THIN_BORDER: Partial<ExcelJS.Borders> = {
  top: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  left: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  bottom: { style: 'thin', color: { argb: 'FFCBD5E1' } },
  right: { style: 'thin', color: { argb: 'FFCBD5E1' } },
};

function safeCell(value: string | null | undefined): string {
  const text = (value ?? '').trim();
  if (/^[=+\-@]/.test(text)) {
    return `'${text}`;
  }
  return text;
}

function formatDateTimeVi(dateInput: string | Date): string {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function styleHeaderRow(row: ExcelJS.Row): void {
  row.height = 24;
  row.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
    cell.fill = HEADER_FILL;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = THIN_BORDER;
  });
}

function styleDataRow(row: ExcelJS.Row, isTotal = false): void {
  row.height = 22;
  row.eachCell((cell) => {
    cell.font = { bold: isTotal, color: { argb: 'FF0F172A' }, size: 10.5 };
    if (isTotal) {
      cell.fill = TOTAL_FILL;
    }
    cell.border = THIN_BORDER;
    cell.alignment = { vertical: 'middle' };
  });
}

function addSheetBanner(
  sheet: ExcelJS.Worksheet,
  title: string,
  subtitle: string,
  colCount: number,
): void {
  sheet.mergeCells(1, 1, 1, colCount);
  const titleCell = sheet.getCell(1, 1);
  titleCell.value = title;
  titleCell.font = { bold: true, size: 14, color: { argb: 'FF0F172A' } };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };
  sheet.getRow(1).height = 28;

  sheet.mergeCells(2, 1, 2, colCount);
  const subCell = sheet.getCell(2, 1);
  subCell.value = subtitle;
  subCell.font = { italic: true, size: 10, color: { argb: 'FF475569' } };
  sheet.getRow(2).height = 20;

  sheet.addRow([]);
}

function buildKpiSheet(
  wb: ExcelJS.Workbook,
  data: AdminDashboardReportPayload,
): void {
  const sheet = wb.addWorksheet('Tổng quan KPI');
  const subtitle = `${REPORT_TYPE_LABELS[data.reportType]} · Kỳ: ${PERIOD_LABELS[data.period]} · Phạm vi: ${data.dateRangeLabel} · Xuất lúc: ${formatDateTimeVi(data.exportedAt)}`;
  addSheetBanner(sheet, 'VIECNGON — BÁO CÁO TỔNG QUAN KPI', subtitle, 3);

  const header = sheet.addRow([
    'Chỉ số KPI',
    'Giá trị',
    'Chi tiết / Tăng trưởng',
  ]);
  styleHeaderRow(header);

  const rows: Array<[string, number | string, string]> = [
    [
      'Tổng số người dùng',
      data.metrics.totalUsers.count,
      `Tăng trưởng ${data.metrics.totalUsers.growthPercent}%`,
    ],
    [
      '  • Ứng viên',
      data.metrics.totalUsers.candidatesCount,
      'Tài khoản UNGVIEN',
    ],
    [
      '  • Nhà tuyển dụng',
      data.metrics.totalUsers.employersCount,
      'Tài khoản NHATUYENDUNG',
    ],
    [
      'Tin tuyển dụng chờ duyệt',
      data.metrics.pendingJobs.count,
      data.metrics.pendingJobs.requiresImmediateReview
        ? 'Cần kiểm duyệt ngay'
        : 'Ổn định',
    ],
    [
      'Tổng hồ sơ ứng tuyển',
      data.metrics.totalApplications.count,
      `Tăng trưởng ${data.metrics.totalApplications.growthPercent}%`,
    ],
    [
      'Tổng doanh thu nền tảng (VNĐ)',
      data.metrics.platformRevenue.totalAmount,
      `Tăng trưởng ${data.metrics.platformRevenue.growthPercent}%`,
    ],
  ];

  rows.forEach((vals, idx) => {
    const row = sheet.addRow(vals);
    styleDataRow(row);
    if (idx === 5) {
      row.getCell(2).numFmt = '#,##0 "VNĐ"';
    } else {
      row.getCell(2).numFmt = '#,##0';
    }
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
  });

  sheet.columns = [{ width: 34 }, { width: 24 }, { width: 36 }];
  sheet.views = [{ state: 'frozen', ySplit: 4 }];
}

function buildUserGrowthSheet(
  wb: ExcelJS.Workbook,
  data: AdminDashboardReportPayload,
): void {
  const sheet = wb.addWorksheet('Tăng trưởng người dùng');
  addSheetBanner(
    sheet,
    'VIECNGON — TĂNG TRƯỞNG NGƯỜI DÙNG',
    `Kỳ thống kê: ${PERIOD_LABELS[data.period]} · ${data.userGrowth.subtitle}`,
    4,
  );

  const header = sheet.addRow([
    'Mốc thời gian',
    'Ứng viên mới',
    'Nhà tuyển dụng mới',
    'Tổng cộng',
  ]);
  styleHeaderRow(header);

  let sumCandidates = 0;
  let sumEmployers = 0;
  for (const pt of data.userGrowth.data) {
    sumCandidates += pt.candidates;
    sumEmployers += pt.employers;
    const row = sheet.addRow([pt.label, pt.candidates, pt.employers, pt.total]);
    styleDataRow(row);
    [2, 3, 4].forEach((c) => {
      row.getCell(c).numFmt = '#,##0';
      row.getCell(c).alignment = { vertical: 'middle', horizontal: 'right' };
    });
  }

  const totalRow = sheet.addRow([
    'Tổng cộng',
    sumCandidates,
    sumEmployers,
    sumCandidates + sumEmployers,
  ]);
  styleDataRow(totalRow, true);
  [2, 3, 4].forEach((c) => {
    totalRow.getCell(c).numFmt = '#,##0';
    totalRow.getCell(c).alignment = { vertical: 'middle', horizontal: 'right' };
  });

  sheet.columns = [{ width: 20 }, { width: 20 }, { width: 22 }, { width: 18 }];
  sheet.views = [{ state: 'frozen', ySplit: 4 }];
}

function buildApplicationFunnelSheet(
  wb: ExcelJS.Workbook,
  data: AdminDashboardReportPayload,
): void {
  const sheet = wb.addWorksheet('Phễu ứng tuyển');
  addSheetBanner(
    sheet,
    'VIECNGON — THỐNG KÊ & PHỄU ỨNG TUYỂN',
    `Phạm vi: ${data.dateRangeLabel} · Tổng hồ sơ: ${data.applicationStats.totalApplications.toLocaleString('vi-VN')}`,
    3,
  );

  const summaryHeader = sheet.addRow([
    'Chỉ số hiệu quả tuyển dụng',
    'Giá trị',
    'Ghi chú',
  ]);
  styleHeaderRow(summaryHeader);
  const summaryRows: Array<[string, number, string]> = [
    [
      'Tỷ lệ phản hồi hồ sơ',
      data.applicationStats.averageResponseRate / 100,
      'Hồ sơ đã được NTD xử lý',
    ],
    [
      'Tỷ lệ mời phỏng vấn',
      data.applicationStats.interviewRate / 100,
      'Phỏng vấn + Trúng tuyển / Tổng hồ sơ',
    ],
    [
      'Tỷ lệ trúng tuyển',
      data.applicationStats.hiredRate / 100,
      'Trúng tuyển / Tổng hồ sơ',
    ],
  ];
  for (const r of summaryRows) {
    const row = sheet.addRow(r);
    styleDataRow(row);
    row.getCell(2).numFmt = '0.0%';
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
  }

  sheet.addRow([]);
  const funnelHeader = sheet.addRow([
    'Trạng thái hồ sơ',
    'Số lượng',
    'Tỷ trọng (%)',
  ]);
  styleHeaderRow(funnelHeader);

  let totalCount = 0;
  for (const item of data.applicationStats.breakdown) {
    totalCount += item.count;
    const row = sheet.addRow([item.label, item.count, item.percentage / 100]);
    styleDataRow(row);
    row.getCell(2).numFmt = '#,##0';
    row.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
    row.getCell(3).numFmt = '0.0%';
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' };
  }

  const totalRow = sheet.addRow([
    'Tổng cộng',
    totalCount,
    totalCount > 0 ? 1 : 0,
  ]);
  styleDataRow(totalRow, true);
  totalRow.getCell(2).numFmt = '#,##0';
  totalRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
  totalRow.getCell(3).numFmt = '0.0%';
  totalRow.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' };

  sheet.columns = [{ width: 32 }, { width: 18 }, { width: 34 }];
}

function buildRevenueBreakdownSheet(
  wb: ExcelJS.Workbook,
  data: AdminDashboardReportPayload,
): void {
  const sheet = wb.addWorksheet('Doanh thu theo gói');
  addSheetBanner(
    sheet,
    'VIECNGON — CƠ CẤU DOANH THU THEO GÓI DỊCH VỤ',
    `Phạm vi: ${data.dateRangeLabel}`,
    4,
  );

  const header = sheet.addRow([
    'Gói dịch vụ',
    'Số lượt mua',
    'Doanh thu (VNĐ)',
    'Tỷ trọng (%)',
  ]);
  styleHeaderRow(header);

  if (data.revenuePackages.length === 0) {
    const emptyRow = sheet.addRow([
      'Không có doanh thu gói dịch vụ trong khoảng thời gian đã chọn',
      0,
      0,
      0,
    ]);
    styleDataRow(emptyRow);
  } else {
    let totalOrders = 0;
    for (const pkg of data.revenuePackages) {
      totalOrders += pkg.orderCount;
      const row = sheet.addRow([
        safeCell(pkg.packageName),
        pkg.orderCount,
        pkg.amount,
        pkg.percentage / 100,
      ]);
      styleDataRow(row);
      row.getCell(2).numFmt = '#,##0';
      row.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
      row.getCell(3).numFmt = '#,##0 "VNĐ"';
      row.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' };
      row.getCell(4).numFmt = '0.0%';
      row.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' };
    }

    const totalRow = sheet.addRow([
      'Tổng cộng',
      totalOrders,
      data.totalRevenue,
      data.totalRevenue > 0 ? 1 : 0,
    ]);
    styleDataRow(totalRow, true);
    totalRow.getCell(2).numFmt = '#,##0';
    totalRow.getCell(2).alignment = { vertical: 'middle', horizontal: 'right' };
    totalRow.getCell(3).numFmt = '#,##0 "VNĐ"';
    totalRow.getCell(3).alignment = { vertical: 'middle', horizontal: 'right' };
    totalRow.getCell(4).numFmt = '0.0%';
    totalRow.getCell(4).alignment = { vertical: 'middle', horizontal: 'right' };
  }

  sheet.columns = [{ width: 32 }, { width: 16 }, { width: 24 }, { width: 16 }];
  sheet.views = [{ state: 'frozen', ySplit: 4 }];
}

function buildTransactionsSheet(
  wb: ExcelJS.Workbook,
  data: AdminDashboardReportPayload,
): void {
  const sheet = wb.addWorksheet('Danh sách giao dịch');
  addSheetBanner(
    sheet,
    'VIECNGON — DANH SÁCH GIAO DỊCH THANH TOÁN',
    `Phạm vi: ${data.dateRangeLabel} · Tổng giao dịch: ${data.transactions.length}`,
    7,
  );

  const header = sheet.addRow([
    'STT',
    'Mã giao dịch',
    'Tên công ty',
    'Gói dịch vụ',
    'Số tiền (VNĐ)',
    'Ngày thanh toán',
    'Trạng thái',
  ]);
  styleHeaderRow(header);

  if (data.transactions.length === 0) {
    sheet.mergeCells(5, 1, 5, 7);
    const emptyCell = sheet.getCell(5, 1);
    emptyCell.value = 'Không có giao dịch nào trong khoảng thời gian đã chọn.';
    emptyCell.font = { italic: true, color: { argb: 'FF64748B' } };
    emptyCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(5).height = 24;
  } else {
    let totalAmount = 0;
    data.transactions.forEach((tx, idx) => {
      totalAmount += tx.amount;
      const row = sheet.addRow([
        idx + 1,
        safeCell(tx.transactionCode),
        safeCell(tx.companyName),
        safeCell(tx.packageName),
        tx.amount,
        formatDateTimeVi(tx.paidAt),
        tx.status,
      ]);
      styleDataRow(row);
      row.getCell(1).alignment = { vertical: 'middle', horizontal: 'center' };
      row.getCell(5).numFmt = '#,##0 "VNĐ"';
      row.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
      const statusCell = row.getCell(7);
      statusCell.alignment = { vertical: 'middle', horizontal: 'center' };
      if (tx.status === 'PAID') {
        statusCell.font = { bold: true, color: { argb: 'FF15803D' } };
      } else if (tx.status === 'PENDING') {
        statusCell.font = { bold: true, color: { argb: 'FFB45309' } };
      } else {
        statusCell.font = { bold: true, color: { argb: 'FFB91C1C' } };
      }
    });

    const totalRow = sheet.addRow([
      '',
      '',
      '',
      'Tổng cộng',
      totalAmount,
      '',
      '',
    ]);
    styleDataRow(totalRow, true);
    totalRow.getCell(5).numFmt = '#,##0 "VNĐ"';
    totalRow.getCell(5).alignment = { vertical: 'middle', horizontal: 'right' };
  }

  sheet.columns = [
    { width: 8 },
    { width: 22 },
    { width: 32 },
    { width: 24 },
    { width: 22 },
    { width: 20 },
    { width: 14 },
  ];
  sheet.views = [{ state: 'frozen', ySplit: 4 }];
}

export async function buildAdminDashboardWorkbookBuffer(
  payload: AdminDashboardReportPayload,
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'ViecNgon Admin Portal';
  workbook.created = payload.exportedAt;

  // Sheet 1 luôn có trong mọi loại báo cáo
  buildKpiSheet(workbook, payload);

  if (
    payload.reportType === 'summary' ||
    payload.reportType === 'recruitment'
  ) {
    buildUserGrowthSheet(workbook, payload);
    buildApplicationFunnelSheet(workbook, payload);
  }

  if (payload.reportType === 'summary' || payload.reportType === 'revenue') {
    buildRevenueBreakdownSheet(workbook, payload);
    buildTransactionsSheet(workbook, payload);
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
