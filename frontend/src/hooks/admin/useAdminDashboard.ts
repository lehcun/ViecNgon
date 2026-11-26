"use client";

import {
  useQuery,
  useMutation,
  keepPreviousData,
} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  AdminDashboardMetricsResponse,
  UserGrowthChartResponse,
  AdminApplicationStatsResponse,
  AdminRecentTransactionItem,
  AdminRevenueBreakdownResponse,
  AdminChartPeriod,
  AdminExportReportParams,
} from "@viecngon/types";
import { adminDashboardKeys } from "@/queries/queryKeys";
import { API_BASE_URL } from "@/lib/env";

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

function extractFilenameFromDisposition(
  header: string | null,
  fallback: string,
): string {
  if (!header) return fallback;
  const match = header.match(/filename="?([^"]+)"?/i);
  return match?.[1] || fallback;
}

/**
 * 6. Mutation xuất báo cáo Excel (.xlsx) đa sheet
 * GET /admin/dashboard/export-report
 */
export function useExportAdminReport() {
  return useMutation<string, Error, AdminExportReportParams>({
    mutationFn: async (params) => {
      const search = new URLSearchParams({
        reportType: params.reportType,
        period: params.period,
      });
      if (params.fromDate) search.set("fromDate", params.fromDate);
      if (params.toDate) search.set("toDate", params.toDate);

      const response = await fetch(
        `${API_BASE_URL}/admin/dashboard/export-report?${search.toString()}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const rawMsg = errorData?.message;
        const message = Array.isArray(rawMsg)
          ? rawMsg[0]
          : typeof rawMsg === "string"
            ? rawMsg
            : "Không thể xuất báo cáo Excel.";
        throw new Error(message);
      }

      const blob = await response.blob();
      const dateStamp = new Date().toISOString().slice(0, 10);
      const fallbackName = `viecngon-bao-cao-${params.reportType}-${dateStamp}.xlsx`;
      const filename = extractFilenameFromDisposition(
        response.headers.get("Content-Disposition"),
        fallbackName,
      );

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      return filename;
    },
    onSuccess: (filename) => {
      toast.success(`Đã xuất báo cáo thành công (${filename})!`);
    },
    onError: (err) => {
      toast.error(err.message || "Không thể xuất báo cáo Excel.");
    },
  });
}

