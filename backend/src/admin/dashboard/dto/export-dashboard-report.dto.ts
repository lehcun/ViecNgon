import { IsIn, IsOptional, Matches } from 'class-validator';
import type { AdminChartPeriod, AdminReportType } from '@viecngon/types';

export class ExportDashboardReportDto {
  @IsOptional()
  @IsIn(['summary', 'revenue', 'recruitment'], {
    message: 'Loại báo cáo phải là summary, revenue hoặc recruitment.',
  })
  reportType?: AdminReportType;

  @IsOptional()
  @IsIn(['monthly', 'quarterly', 'yearly'], {
    message: 'Kỳ thống kê phải là monthly, quarterly hoặc yearly.',
  })
  period?: AdminChartPeriod;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Ngày bắt đầu phải có định dạng YYYY-MM-DD.',
  })
  fromDate?: string;

  @IsOptional()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Ngày kết thúc phải có định dạng YYYY-MM-DD.',
  })
  toDate?: string;
}
