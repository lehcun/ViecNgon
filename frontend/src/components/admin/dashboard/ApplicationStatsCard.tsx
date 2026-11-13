"use client";

import React from "react";
import Link from "next/link";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { ArrowRight } from "lucide-react";
import { useAdminApplicationStats } from "@/hooks/admin/useAdminDashboard";
import { ErrorState } from "@/components/ui/StateViews";

export default function ApplicationStatsCard() {
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
  } = useAdminApplicationStats("monthly");

  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs h-full flex flex-col justify-between gap-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Thống kê & Phễu ứng tuyển
          </h2>
          <p className="text-xs text-text-muted mt-0.5">
            Phân bổ trạng thái hồ sơ trong tháng
          </p>
        </div>

        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
        >
          <span>Xem tất cả</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4 animate-pulse">
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 rounded-lg bg-surface-muted" />
            <div className="h-14 rounded-lg bg-surface-muted" />
            <div className="h-14 rounded-lg bg-surface-muted" />
          </div>
          <div className="h-44 rounded-xl bg-surface-muted" />
        </div>
      ) : isError || !stats ? (
        <ErrorState
          title="Không thể tải thống kê ứng tuyển"
          message="Đã xảy ra lỗi khi tải dữ liệu phễu tuyển dụng."
          onRetry={() => refetch()}
        />
      ) : (
        <>
          {/* 3 Tỷ lệ chuyển đổi nhanh */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-lg bg-surface-muted border border-border-default">
              <p className="text-[11px] font-medium text-text-muted">
                Tỷ lệ phản hồi
              </p>
              <p className="text-base font-bold text-text-primary mt-0.5 tabular-nums">
                {stats.averageResponseRate}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-muted border border-border-default">
              <p className="text-[11px] font-medium text-text-muted">
                Tỷ lệ phỏng vấn
              </p>
              <p className="text-base font-bold text-primary mt-0.5 tabular-nums">
                {stats.interviewRate}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-surface-muted border border-border-default">
              <p className="text-[11px] font-medium text-text-muted">
                Tỷ lệ trúng tuyển
              </p>
              <p className="text-base font-bold text-success mt-0.5 tabular-nums">
                {stats.hiredRate}%
              </p>
            </div>
          </div>

          {/* Mini BarChart */}
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.breakdown}
                margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
              >
                <XAxis
                  dataKey="label"
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#64748B", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "8px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="count" name="Số hồ sơ" radius={[6, 6, 0, 0]}>
                  {stats.breakdown.map((entry, idx) => (
                    <Cell
                      key={entry.status || idx}
                      fill={entry.color || "#2563EB"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Danh sách phân bổ */}
          <div className="space-y-2.5 pt-2 border-t border-border-default">
            {stats.breakdown.map((item) => (
              <div key={item.status} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-text-secondary flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: item.color || "#2563EB" }}
                    />
                    {item.label}
                  </span>
                  <span className="font-semibold text-text-primary tabular-nums">
                    {item.count.toLocaleString("vi-VN")} ({item.percentage}%)
                  </span>
                </div>
                <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.min(100, Math.max(0, item.percentage))}%`,
                      backgroundColor: item.color || "#2563EB",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
