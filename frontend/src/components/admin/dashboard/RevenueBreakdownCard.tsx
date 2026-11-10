"use client";

import React from "react";
import Link from "next/link";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { AlertCircle, RefreshCw, ArrowRight, PieChart as PieChartIcon } from "lucide-react";
import { useAdminRevenueBreakdown } from "@/hooks/admin/useAdminDashboard";

export default function RevenueBreakdownCard() {
  const { data, isLoading, isError, refetch } = useAdminRevenueBreakdown();

  // 1. Skeleton Loading State
  if (isLoading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs animate-pulse space-y-5">
        <div className="h-5 w-60 bg-slate-200 rounded" />
        <div className="h-3.5 w-44 bg-slate-100 rounded" />
        <div className="flex items-center gap-6 py-4">
          <div className="w-36 h-36 rounded-full bg-slate-100 shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-10 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError || !data) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-2xs flex flex-col items-center justify-center min-h-72 text-center gap-3">
        <AlertCircle size={26} className="text-rose-500" />
        <p className="text-sm font-semibold text-slate-800">
          Không thể tải cơ cấu doanh thu theo gói
        </p>
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

  const packages = data.packages || [];

  return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between h-full">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Header */}
              <h2 className="text-base font-bold text-slate-900">
                Revenue Breakdown by Service Packages
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">{data.periodLabel}</p>

              {/* Body: Donut Chart + Legend List */}
              {packages.length === 0 ? (
                <div className="py-12 my-4 text-center border border-dashed border-slate-200 rounded-xl">
                  <PieChartIcon size={28} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-medium text-slate-500">
                    Chưa có dữ liệu doanh thu gói dịch vụ.
                  </p>
                </div>
              ) : (
                <div className="my-5 flex flex-col sm:flex-row items-center gap-6">
                  {/* Donut Chart with Center Text */}
                  <div className="relative w-40 h-40 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={packages}
                          dataKey="amount"
                          nameKey="packageName"
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={74}
                          paddingAngle={3}
                          strokeWidth={0}
                        >
                          {packages.map((pkg, idx) => (
                            <Cell key={`cell-${idx}`} fill={pkg.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#0F172A",
                            borderRadius: "10px",
                            border: "1px solid #1E293B",
                            color: "#F8FAFC",
                            fontSize: "12px",
                          }}
                          formatter={(value: any) => [
                            `${Number(value).toLocaleString("en-US")} VNĐ`,
                            "Doanh thu",
                          ]}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Center Label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                      <span className="text-xl font-extrabold text-slate-900 tracking-tight leading-none">
                        {data.shortTotalRevenue}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium mt-1">
                        VNĐ total revenue
                      </span>
                    </div>
                  </div>

                  {/* Package Breakdown List */}
                  <div className="flex-1 w-full space-y-3.5">
                    {packages.map((pkg) => (
                      <div key={pkg.packageName} className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: pkg.color }}
                            />
                            <span className="font-bold text-slate-800">
                              {pkg.packageName}
                            </span>
                          </div>
                          <span className="font-extrabold text-slate-900">
                            {pkg.percentage}%
                          </span>
                        </div>
                        <div className="pl-4.5 text-[11px] text-slate-400">
                          {pkg.formattedAmount}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
            <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <div>
                <span
                  className={`font-bold ${data.growthPercent >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                >
                  {data.growthPercent > 0
                    ? `+${data.growthPercent}%`
                    : `${data.growthPercent}%`}
                </span>{" "}
                <span className="text-slate-400">vs last month</span>
              </div>
              <Link
                href="/admin/packages"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <span>View revenue report</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
          );
}

