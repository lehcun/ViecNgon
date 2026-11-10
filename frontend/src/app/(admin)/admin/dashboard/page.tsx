"use client";

import React from "react";
import Link from "next/link";
import { Zap, ShieldCheck, Download, Calendar } from "lucide-react";
import toast from "react-hot-toast";
import { useAdminMetrics } from "@/hooks/admin/useAdminDashboard";
import MetricCardGrid from "@/components/admin/dashboard/MetricCardGrid";
import UserGrowthChartCard from "@/components/admin/dashboard/UserGrowthChartCard";
import ApplicationStatsCard from "@/components/admin/dashboard/ApplicationStatsCard";
import RecentTransactionsTable from "@/components/admin/dashboard/RecentTransactionsTable";
import RevenueBreakdownCard from "@/components/admin/dashboard/RevenueBreakdownCard";

export default function AdminDashboardPage() {
  const { data: metrics } = useAdminMetrics();
  const pendingJobsCount = metrics?.pendingJobs.count ?? 0;

  const handleExportReport = () => {
    toast.success("Đang chuẩn bị báo cáo thống kê tháng...");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Date Range */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Overview
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, System Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening across your recruitment platform
            today.
          </p>
        </div>

        {/* Date Range Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 shadow-2xs self-start md:self-auto">
          <Calendar size={15} className="text-slate-400" />
          <span>Nov 1 – Nov 30, 2026</span>
        </div>
      </div>

      {/* 2. Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all"
        >
          <Zap size={14} className="fill-white" />
          <span>Approve Pending Jobs ({pendingJobsCount})</span>
        </Link>

        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-all"
        >
          <ShieldCheck size={14} className="text-slate-500" />
          <span>Verify Companies</span>
        </Link>

        <button
          type="button"
          onClick={handleExportReport}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
        >
          <Download size={14} className="text-slate-500" />
          <span>Export Monthly Report</span>
        </button>
      </div>

      {/* 3. Hàng 1: 4 Thẻ Chỉ Số Tổng Quan (MetricCardGrid) */}
      <MetricCardGrid />

      {/* 4. Hàng 2: Biểu đồ Tăng trưởng Người dùng (60%) & Thống kê Đơn ứng tuyển (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col h-full">
          <UserGrowthChartCard />
        </div>
        <div className="lg:col-span-5 flex flex-col h-full">
          <ApplicationStatsCard />
        </div>
      </div>

      {/* 5. Hàng 3: Giao dịch gần đây (60%) & Cơ cấu Doanh thu Gói dịch vụ (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 flex flex-col h-full">
          <RecentTransactionsTable />
        </div>
        <div className="lg:col-span-5 flex flex-col h-full">
          <RevenueBreakdownCard />
        </div>
      </div>
    </div>
  );
}
