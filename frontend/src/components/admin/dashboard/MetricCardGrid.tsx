"use client";

import React from "react";
import { Users, Clock, FileText, DollarSign, AlertCircle, RefreshCw } from "lucide-react";
import { useAdminMetrics } from "@/hooks/admin/useAdminDashboard";

function formatGrowth(val: number) {
  if (val > 0) return `+${val}%`;
  return `${val}%`;
}

export default function MetricCardGrid() {
  const { data, isLoading, isError, refetch } = useAdminMetrics();

  // 1. Skeleton Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-32 bg-slate-200 rounded" />
              <div className="w-9 h-9 rounded-xl bg-slate-100" />
            </div>
            <div className="h-8 w-28 bg-slate-200 rounded-lg" />
            <div className="h-3 w-24 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State
  if (isError || !data) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
        <div className="flex items-center gap-3 text-rose-600">
          <AlertCircle size={20} className="shrink-0" />
          <div>
            <h3 className="text-sm font-semibold">
              Không thể tải các chỉ số thống kê tổng quan
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Vui lòng kiểm tra kết nối máy chủ hoặc thử tải lại.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }

  const { totalUsers, pendingJobs, totalApplications, platformRevenue } = data;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {/* Thẻ 1: Total Platform Users */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300/80 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Total Platform Users
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {totalUsers.count.toLocaleString("en-US")}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`font-bold ${
              totalUsers.growthPercent >= 0
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {formatGrowth(totalUsers.growthPercent)}
          </span>
          <span className="text-slate-400">this month</span>
        </div>
      </div>

      {/* Thẻ 2: Jobs Pending Moderation */}
      <div
        className={`bg-white rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all ${pendingJobs.requiresImmediateReview
          ? "border-2 border-amber-300/90"
          : "border border-slate-200/80"
          }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Jobs Pending Moderation
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={18} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {pendingJobs.count.toLocaleString("en-US")}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          {pendingJobs.requiresImmediateReview ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-semibold text-amber-600">
                Requires immediate review
              </span>
            </>
          ) : (
            <span className="text-emerald-600 font-medium">
              All jobs reviewed
            </span>
          )}
        </div>
      </div>

      {/* Thẻ 3: Total Job Applications */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300/80 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Total Job Applications
          </span>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <FileText size={18} />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
          {totalApplications.count.toLocaleString("en-US")}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`font-bold ${
              totalApplications.growthPercent >= 0
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {formatGrowth(totalApplications.growthPercent)}
          </span>
          <span className="text-slate-400">growth</span>
        </div>
      </div>

      {/* Thẻ 4: Platform Revenue */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300/80 transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-500">
            Platform Revenue
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign size={18} />
          </div>
        </div>
        <div className="text-2xl xl:text-[26px] font-extrabold text-slate-900 tracking-tight truncate">
          {platformRevenue.formattedAmount}
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={`font-bold ${
              platformRevenue.growthPercent >= 0
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {formatGrowth(platformRevenue.growthPercent)}
          </span>
          <span className="text-slate-400">vs last month</span>
        </div>
      </div>
    </div>
  );
}

