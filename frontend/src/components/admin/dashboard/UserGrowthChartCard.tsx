"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AdminChartPeriod } from "@viecngon/types";
import { useUserGrowthChart } from "@/hooks/admin/useAdminDashboard";
import { ErrorState } from "@/components/ui/StateViews";

const PERIOD_OPTIONS: { value: AdminChartPeriod; label: string }[] = [
  { value: "monthly", label: "Theo tháng" },
  { value: "quarterly", label: "Theo quý" },
  { value: "yearly", label: "Theo năm" },
];

export default function UserGrowthChartCard() {
  const [period, setPeriod] = useState<AdminChartPeriod>("monthly");
  const { data, isLoading, isError, refetch } = useUserGrowthChart(period);

  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs h-full flex flex-col justify-between gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Tăng trưởng & Đăng ký người dùng
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {data?.subtitle || "Biến động tài khoản Ứng viên & Nhà tuyển dụng"}
          </p>
        </div>

        {/* Bộ chọn kỳ */}
        <div className="inline-flex items-center bg-surface-muted p-1 rounded-lg border border-border-default shrink-0">
          {PERIOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPeriod(opt.value)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
                period === opt.value
                  ? "bg-surface-card text-primary shadow-xs"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="h-72 rounded-xl bg-surface-muted animate-pulse" />
      ) : isError || !data ? (
        <ErrorState
          title="Không thể tải biểu đồ tăng trưởng"
          message="Đã xảy ra lỗi khi lấy dữ liệu đăng ký người dùng."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-2">
            <div className="flex items-baseline gap-2.5">
              <span className="text-2xl font-bold text-text-primary tabular-nums">
                {data.currentPeriodTotal.toLocaleString("vi-VN")}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums ${
                  data.growthPercent >= 0
                    ? "bg-success-light text-success-text"
                    : "bg-danger-light text-danger-text"
                }`}
              >
                {data.growthPercent >= 0 ? (
                  <TrendingUp size={12} />
                ) : (
                  <TrendingDown size={12} />
                )}
                {data.growthPercent >= 0 ? "+" : ""}
                {data.growthPercent}% {data.comparisonLabel}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                Ứng viên ({data.summary.candidates.toLocaleString("vi-VN")})
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-success" />
                Nhà tuyển dụng ({data.summary.employers.toLocaleString("vi-VN")})
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.data}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="candidatesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.22} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="employersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16A34A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16A34A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748B", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "10px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="candidates"
                  name="Ứng viên"
                  stroke="#2563EB"
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill="url(#candidatesFill)"
                />
                <Area
                  type="monotone"
                  dataKey="employers"
                  name="Nhà tuyển dụng"
                  stroke="#16A34A"
                  strokeWidth={2.2}
                  fillOpacity={1}
                  fill="url(#employersFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
