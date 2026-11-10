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
import { AlertCircle, RefreshCw } from "lucide-react";
import { AdminChartPeriod } from "@viecngon/types";
import { useUserGrowthChart } from "@/hooks/admin/useAdminDashboard";

const PERIOD_OPTIONS: { value: AdminChartPeriod; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

function formatGrowth(val: number) {
  if (val > 0) return `+${val}%`;
  return `${val}%`;
}

export default function UserGrowthChartCard() {
  const [period, setPeriod] = useState<AdminChartPeriod>("monthly");
  const { data, isLoading, isError, refetch } = useUserGrowthChart(period);

  // 1. Skeleton Loading State
  if (isLoading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs animate-pulse flex flex-col justify-between h-112">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-5 w-64 bg-slate-200 rounded" />
            <div className="h-8 w-28 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-3.5 w-80 bg-slate-100 rounded" />
          <div className="h-9 w-32 bg-slate-200 rounded-lg mt-4" />
        </div>
        <div className="h-56 w-full bg-slate-100/80 rounded-xl my-4" />
        <div className="flex justify-between">
          <div className="h-3.5 w-28 bg-slate-100 rounded" />
          <div className="h-3.5 w-44 bg-slate-100 rounded" />
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError || !data) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-2xs flex flex-col items-center justify-center h-112 text-center gap-3">
        <AlertCircle size={28} className="text-rose-500" />
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Không thể tải biểu đồ tăng trưởng người dùng
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Đã có lỗi xảy ra khi truy xuất dữ liệu từ máy chủ.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between h-full">
      {/* 1. Header & Period Toggle */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              User Growth & Registration Statistics
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{data.subtitle}</p>
          </div>

          {/* Segmented Pill Toggle */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/70 self-start">
            {PERIOD_OPTIONS.map((opt) => {
              const active = period === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPeriod(opt.value)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-white text-blue-600 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Highlight Numbers & Legend */}
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {data.currentPeriodTotal.toLocaleString("en-US")}
              </span>
              <span
                className={`text-xs font-bold ${
                  data.growthPercent >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {formatGrowth(data.growthPercent)}{" "}
                <span className="font-normal text-slate-400">
                  {data.comparisonLabel}
                </span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              total platform registrations
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-5 text-xs font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span>Candidates</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Employers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recharts AreaChart */}
      <div className="w-full flex-1 min-h-[260px] my-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.data}
            margin={{ top: 10, right: 12, left: -18, bottom: 0 }}
          >
            <defs>
              <linearGradient id="candidateGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.16} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="employerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#F1F5F9"
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#94A3B8" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderRadius: "12px",
                border: "1px solid #1E293B",
                color: "#F8FAFC",
                fontSize: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.25)",
              }}
              itemStyle={{ color: "#F8FAFC", fontWeight: 600 }}
              labelStyle={{ color: "#94A3B8", marginBottom: "4px" }}
            />

            <Area
              type="monotone"
              dataKey="candidates"
              name="Candidates"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#candidateGrad)"
              dot={{ r: 3.5, fill: "#FFFFFF", stroke: "#2563EB", strokeWidth: 2 }}
              activeDot={{ r: 5, fill: "#2563EB", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="employers"
              name="Employers"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#employerGrad)"
              dot={{ r: 3, fill: "#FFFFFF", stroke: "#10B981", strokeWidth: 2 }}
              activeDot={{ r: 4.5, fill: "#10B981", stroke: "#FFFFFF", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 4. Footer */}
      <div className="mt-auto pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>New registrations</span>
        <div className="flex items-center gap-2 font-medium text-slate-600">
          <span>
            Candidates{" "}
            <strong className="text-slate-900">
              {data.summary.candidates.toLocaleString("en-US")}
            </strong>
          </span>
          <span className="text-slate-300">/</span>
          <span>
            Employers{" "}
            <strong className="text-slate-900">
              {data.summary.employers.toLocaleString("en-US")}
            </strong>
          </span>
        </div>
      </div>
    </div>
  );
}

