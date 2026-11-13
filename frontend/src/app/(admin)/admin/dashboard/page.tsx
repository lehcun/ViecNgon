"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle, Building2, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import MetricCardGrid from "@/components/admin/dashboard/MetricCardGrid";
import UserGrowthChartCard from "@/components/admin/dashboard/UserGrowthChartCard";
import ApplicationStatsCard from "@/components/admin/dashboard/ApplicationStatsCard";
import RecentTransactionsTable from "@/components/admin/dashboard/RecentTransactionsTable";
import RevenueBreakdownCard from "@/components/admin/dashboard/RevenueBreakdownCard";
import { useAdminMetrics } from "@/hooks/admin/useAdminDashboard";
import { Button } from "@/components/ui/Button";

export default function AdminDashboardPage() {
  const { data: metrics } = useAdminMetrics();

  const handleExportReport = () => {
    if (!metrics) {
      toast.error("Chưa có dữ liệu báo cáo để xuất.");
      return;
    }

    const rows = [
      ["Chỉ số", "Giá trị", "Ghi chú"],
      [
        "Tổng người dùng",
        String(metrics.totalUsers.count),
        `Tăng trưởng ${metrics.totalUsers.growthPercent}%`,
      ],
      [
        "Tin chờ kiểm duyệt",
        String(metrics.pendingJobs.count),
        metrics.pendingJobs.requiresImmediateReview
          ? "Cần duyệt ngay"
          : "Ổn định",
      ],
      [
        "Tổng hồ sơ ứng tuyển",
        String(metrics.totalApplications.count),
        `Tăng trưởng ${metrics.totalApplications.growthPercent}%`,
      ],
      [
        "Doanh thu nền tảng",
        metrics.platformRevenue.formattedAmount,
        `Tăng trưởng ${metrics.platformRevenue.growthPercent}%`,
      ],
    ];

    const csvContent =
      "\uFEFF" + rows.map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `viecngon-bao-cao-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Đã xuất báo cáo tổng quan (CSV)!");
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header Welcome Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-surface-card p-6 rounded-xl border border-border-default shadow-xs">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
            Bảng điều khiển quản trị
          </p>
          <h1 className="text-2xl font-bold text-text-primary">
            Xin chào, Quản trị viên hệ thống
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Theo dõi số liệu tăng trưởng người dùng, kiểm duyệt tin tuyển dụng
            và doanh thu nền tảng theo thời gian thực.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold shadow-xs transition-colors"
          >
            <CheckCircle size={16} />
            <span>
              Duyệt tin chờ duyệt
              {metrics?.pendingJobs?.count !== undefined
                ? ` (${metrics.pendingJobs.count})`
                : ""}
            </span>
          </Link>

          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-surface-card hover:bg-surface-muted border border-border-default text-text-primary text-sm font-semibold transition-colors"
          >
            <Building2 size={16} className="text-primary" />
            <span>Quản lý doanh nghiệp</span>
          </Link>

          <Button variant="secondary" size="md" onClick={handleExportReport}>
            <Download size={16} />
            Xuất báo cáo tháng
          </Button>
        </div>
      </div>

      {/* Hàng 1: 4 Thẻ chỉ số tổng quan */}
      <MetricCardGrid />

      {/* Hàng 2: Biểu đồ tăng trưởng & Thống kê ứng tuyển */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7">
          <UserGrowthChartCard />
        </div>
        <div className="lg:col-span-5">
          <ApplicationStatsCard />
        </div>
      </div>

      {/* Hàng 3: Cơ cấu doanh thu & Giao dịch gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <RevenueBreakdownCard />
        </div>
        <div className="lg:col-span-7">
          <RecentTransactionsTable />
        </div>
      </div>
    </div>
  );
}
