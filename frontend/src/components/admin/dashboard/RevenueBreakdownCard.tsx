"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { TrendingUp, TrendingDown, ArrowRight, Wallet } from "lucide-react";
import { useAdminRevenueBreakdown } from "@/hooks/admin/useAdminDashboard";
import { EmptyState, ErrorState } from "@/components/ui/StateViews";

export default function RevenueBreakdownCard() {
  const {
    data: revenue,
    isLoading,
    isError,
    refetch,
  } = useAdminRevenueBreakdown();

  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs h-full flex flex-col justify-between gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Cơ cấu doanh thu gói dịch vụ
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            {revenue?.periodLabel || "Phân bổ theo từng gói quảng cáo"}
          </p>
        </div>

        <Link
          href="/admin/packages"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
        >
          <span>Quản lý gói</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 rounded-xl bg-surface-muted" />
          <div className="space-y-2">
            <div className="h-4 bg-surface-subtle rounded w-full" />
            <div className="h-4 bg-surface-muted rounded w-5/6" />
          </div>
        </div>
      ) : isError || !revenue ? (
        <ErrorState
          title="Không thể tải cơ cấu doanh thu"
          message="Đã xảy ra lỗi khi lấy báo cáo doanh thu."
          onRetry={() => refetch()}
        />
      ) : revenue.packages.length === 0 ? (
        <EmptyState
          icon={<Wallet size={24} />}
          title="Chưa có dữ liệu doanh thu"
          description="Chưa ghi nhận giao dịch mua gói quảng cáo nào trong kỳ."
        />
      ) : (
        <>
          <div className="relative h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenue.packages}
                  dataKey="amount"
                  nameKey="packageName"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {revenue.packages.map((entry, idx) => (
                    <Cell
                      key={entry.packageName || idx}
                      fill={entry.color || "#2563EB"}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number"
                      ? `${value.toLocaleString("vi-VN")} ₫`
                      : String(value ?? "")
                  }
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Tổng doanh thu ở tâm */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[11px] font-medium text-text-muted">
                Tổng doanh thu
              </span>
              <span className="text-lg font-bold text-text-primary tabular-nums">
                {revenue.shortTotalRevenue}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-border-default">
            {revenue.packages.map((pkg) => (
              <div
                key={pkg.packageName}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: pkg.color || "#2563EB" }}
                  />
                  <span className="font-medium text-text-secondary truncate">
                    {pkg.packageName}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 tabular-nums">
                  <span className="font-semibold text-text-primary">
                    {pkg.formattedAmount}
                  </span>
                  <span className="text-text-muted">({pkg.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-border-default flex items-center justify-between text-xs">
            <span className="text-text-muted">So với kỳ trước</span>
            <span
              className={`inline-flex items-center gap-1 font-semibold tabular-nums ${
                revenue.growthPercent >= 0
                  ? "text-success-text"
                  : "text-danger-text"
              }`}
            >
              {revenue.growthPercent >= 0 ? (
                <TrendingUp size={13} />
              ) : (
                <TrendingDown size={13} />
              )}
              {revenue.growthPercent >= 0 ? "+" : ""}
              {revenue.growthPercent}%
            </span>
          </div>
        </>
      )}
    </div>
  );
}
