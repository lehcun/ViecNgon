/**
 * =====================================================================
 * ADMIN DASHBOARD TYPES
 * ---------------------------------------------------------------------
 * Khai báo Types / Interfaces dùng chung giữa Backend (NestJS) và Frontend (Next.js)
 * cho phân hệ Quản trị viên (Admin Portal - /admin/dashboard).
 *
 * ⚠️ QUY TẮC MONOREPO:
 * File này CHỈ CHỨA `type` và `interface`.
 * KHÔNG export `const`, `enum` hay runtime object.
 * =====================================================================
 */

export type AdminChartPeriod = "monthly" | "quarterly" | "yearly";

// ---------------------------------------------------------------------
// 1. OVERVIEW METRICS (4 THẺ CHỈ SỐ HÀNG 1)
// ---------------------------------------------------------------------

export interface AdminDashboardMetricsResponse {
  totalUsers: {
    count: number;
    candidatesCount: number;
    employersCount: number;
    growthPercent: number;
  };
  pendingJobs: {
    count: number;
    requiresImmediateReview: boolean;
  };
  totalApplications: {
    count: number;
    growthPercent: number;
  };
  platformRevenue: {
    totalAmount: number;
    formattedAmount: string;
    growthPercent: number;
  };
}

// ---------------------------------------------------------------------
// 2. USER GROWTH & REGISTRATION CHART (CỘT TRÁI HÀNG 2)
// ---------------------------------------------------------------------

export interface UserGrowthDataPoint {
  label: string;
  candidates: number;
  employers: number;
  total: number;
}

export interface UserGrowthChartResponse {
  period: AdminChartPeriod;
  subtitle: string;
  currentPeriodTotal: number;
  growthPercent: number;
  comparisonLabel: string;
  summary: {
    candidates: number;
    employers: number;
  };
  data: UserGrowthDataPoint[];
}

// ---------------------------------------------------------------------
// 3. APPLICATION ANALYTICS & FUNNEL CHART (CỘT PHẢI HÀNG 2)
// ---------------------------------------------------------------------

export interface ApplicationStatusBreakdown {
  status: string; // 'CHO_DUYET' | 'DA_XEM' | 'PHONG_VAN' | 'TRUNG_TUYEN' | 'KHONG_PHU_HOP'
  label: string;  // 'Chờ duyệt' | 'Đã xem' | 'Phỏng vấn' | 'Trúng tuyển' | 'Từ chối'
  count: number;
  percentage: number;
  color: string;
}

export interface AdminApplicationStatsResponse {
  period: AdminChartPeriod;
  totalApplications: number;
  changePercentage: number;
  averageResponseRate: number;
  interviewRate: number;
  hiredRate: number;
  breakdown: ApplicationStatusBreakdown[];
}

// ---------------------------------------------------------------------
// 4. RECENT TRANSACTIONS & REVENUE BREAKDOWN (HÀNG 3)
// ---------------------------------------------------------------------

export interface AdminRecentTransactionItem {
  id: string;
  transactionCode: string;
  companyName: string;
  companyLogo: string | null;
  packageName: string;
  amount: number;
  formattedAmount: string;
  paidAt: string | Date;
  status: "PAID" | "PENDING" | "FAILED";
}

export interface AdminRevenuePackageItem {
  packageName: string;
  amount: number;
  formattedAmount: string;
  percentage: number;
  color: string;
}

export interface AdminRevenueBreakdownResponse {
  totalRevenue: number;
  formattedTotalRevenue: string;
  shortTotalRevenue: string;
  growthPercent: number;
  periodLabel: string;
  packages: AdminRevenuePackageItem[];
}

