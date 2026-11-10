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
import { AlertCircle, RefreshCw, ArrowRight } from "lucide-react";
import { useAdminApplicationStats } from "@/hooks/admin/useAdminDashboard";

export default function ApplicationStatsCard() {
  const { data, isLoading, isError, refetch } =
    useAdminApplicationStats("monthly");

  // 1. Skeleton Loading State
  if (isLoading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs animate-pulse flex flex-col justify-between h-112">
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-5 w-48 bg-slate-200 rounded" />
            <div className="h-6 w-12 bg-slate-100 rounded-md" />
          </div>
          <div className="h-3.5 w-64 bg-slate-100 rounded" />
        </div>
        <div className="space-y-3 my-4">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-9 w-full bg-slate-100 rounded-lg" />
          ))}
        </div>
        <div className="flex justify-between">
          <div className="h-3.5 w-32 bg-slate-100 rounded" />
          <div className="h-3.5 w-20 bg-slate-100 rounded" />
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
            Không thể tải thống kê đơn ứng tuyển
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Vui lòng thử lại sau ít phút.
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
            {/* 1. Header & Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Application Funnel & Analytics
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Candidate application status breakdown & conversion rates.
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold shrink-0">
                    {data.totalApplications.toLocaleString("en-US")}
                  </span>
                </div>

                {/* 2. KPI Summary Pills */}
                <div className="grid grid-cols-3 gap-2.5 mt-4">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[11px] text-slate-400 font-medium">
                      Response Rate
                    </div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5">
                      {data.averageResponseRate}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100/80">
                    <div className="text-[11px] text-amber-700/80 font-medium">
                      Interview Rate
                    </div>
                    <div className="text-base font-extrabold text-amber-600 mt-0.5">
                      {data.interviewRate}%
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100/80">
                    <div className="text-[11px] text-emerald-700/80 font-medium">
                      Hired Rate
                    </div>
                    <div className="text-base font-extrabold text-emerald-600 mt-0.5">
                      {data.hiredRate}%
                    </div>
                  </div>
                </div>

                {/* 3. Recharts BarChart + Funnel Progress */}
                <div className="h-32 w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.breakdown}
                      margin={{ top: 6, right: 4, left: -24, bottom: 0 }}
                      barSize={26}
                    >
                      <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#64748B" }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 10, fill: "#94A3B8" }}
                      />
                      <Tooltip
                        cursor={{ fill: "#F8FAFC" }}
                        contentStyle={{
                          backgroundColor: "#0F172A",
                          borderRadius: "10px",
                          border: "1px solid #1E293B",
                          color: "#F8FAFC",
                          fontSize: "12px",
                        }}
                        formatter={(value: any) => [`${value} đơn`, "Số lượng"]}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {data.breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* 4. Detailed Status Breakdown List */}
                <div className="mt-3 space-y-2.5">
                  {data.breakdown.map((item) => (
                    <div key={item.status} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-semibold text-slate-700">
                            {item.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">
                            {item.count.toLocaleString("en-US")} đơn
                          </span>
                          <span className="font-bold text-slate-800 w-11 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(item.percentage, item.count > 0 ? 4 : 0)}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Footer */}
              <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Showing {data.totalApplications.toLocaleString("en-US")} total applications
                </span>
                <Link
                  href="/admin/jobs"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>View all</span>
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
            );
}

