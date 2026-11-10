"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import {
  AdminDashboardMetricsResponse,
  UserGrowthChartResponse,
  AdminApplicationStatsResponse,
  AdminRecentTransactionItem,
  AdminRevenueBreakdownResponse,
  AdminChartPeriod,
} from "@viecngon/types";
import { adminDashboardKeys } from "@/queries/queryKeys";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Hàm gọi API chung cho phân hệ Admin (kèm HttpOnly Cookie xác thực)
 */
async function fetchAdminApi<T>(endpoint: string, errorMessage: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // BẮT BUỘC: Gửi cookie access_token để vượt qua @AdminOnly()
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || errorMessage);
  }

  return response.json();
}

/**
 * 1. Hook lấy 4 chỉ số tổng quan trên Header Dashboard
 * GET /admin/dashboard/metrics
 */
export function useAdminMetrics() {
  return useQuery<AdminDashboardMetricsResponse>({
    queryKey: adminDashboardKeys.metrics(),
    queryFn: () =>
      fetchAdminApi<AdminDashboardMetricsResponse>(
        "/admin/dashboard/metrics",
        "Không thể tải các chỉ số tổng quan quản trị.",
      ),
    staleTime: 60 * 1000, // Cache 1 phút
    refetchOnWindowFocus: true,
  });
}

/**
 * 2. Hook lấy dữ liệu biểu đồ tăng trưởng người dùng (Candidates & Employers)
 * GET /admin/dashboard/charts?period=monthly|quarterly|yearly
 */
export function useUserGrowthChart(period: AdminChartPeriod = "monthly") {
  return useQuery<UserGrowthChartResponse>({
    queryKey: adminDashboardKeys.userGrowth(period),
    queryFn: () =>
      fetchAdminApi<UserGrowthChartResponse>(
        `/admin/dashboard/charts?period=${period}`,
        "Không thể tải biểu đồ tăng trưởng người dùng.",
      ),
    placeholderData: keepPreviousData, // Giữ biểu đồ mượt mà khi switch giữa Monthly / Quarterly / Yearly
    staleTime: 60 * 1000,
  });
}

/**
 * 3. Hook lấy thống kê & phễu trạng thái Đơn ứng tuyển
 * GET /admin/dashboard/application-stats?period=monthly|quarterly|yearly
 */
export function useAdminApplicationStats(period: AdminChartPeriod = "monthly") {
  return useQuery<AdminApplicationStatsResponse>({
    queryKey: adminDashboardKeys.applicationStats(period),
    queryFn: () =>
      fetchAdminApi<AdminApplicationStatsResponse>(
        `/admin/dashboard/application-stats?period=${period}`,
        "Không thể tải thống kê đơn ứng tuyển.",
      ),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });
}

/**
 * 4. Hook lấy danh sách giao dịch thanh toán gói dịch vụ gần đây
 * GET /admin/dashboard/recent-transactions
 */
export function useAdminRecentTransactions() {
  return useQuery<AdminRecentTransactionItem[]>({
    queryKey: adminDashboardKeys.recentTransactions(),
    queryFn: () =>
      fetchAdminApi<AdminRecentTransactionItem[]>(
        "/admin/dashboard/recent-transactions",
        "Không thể tải danh sách giao dịch gần đây.",
      ),
    staleTime: 60 * 1000,
  });
}

/**
 * 5. Hook lấy cơ cấu doanh thu theo từng gói dịch vụ (Donut Chart)
 * GET /admin/dashboard/revenue-breakdown
 */
export function useAdminRevenueBreakdown() {
  return useQuery<AdminRevenueBreakdownResponse>({
    queryKey: adminDashboardKeys.revenueBreakdown(),
    queryFn: () =>
      fetchAdminApi<AdminRevenueBreakdownResponse>(
        "/admin/dashboard/revenue-breakdown",
        "Không thể tải cơ cấu doanh thu theo gói.",
      ),
    staleTime: 60 * 1000,
  });
}

