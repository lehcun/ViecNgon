"use client";

import React from "react";
import {
  Briefcase,
  ArrowUp,
  BadgeCheck,
  Hourglass,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { RecruiterJobMetricsResponse } from "@viecngon/types";

interface JobMetricsCardsProps {
  metrics?: RecruiterJobMetricsResponse;
  isLoading?: boolean;
}

export default function JobMetricsCards({
  metrics,
  isLoading,
}: JobMetricsCardsProps) {
  // Trạng thái Loading: Hiển thị Skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm h-30 flex flex-col justify-between"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 w-24 bg-slate-200 animate-pulse rounded"></div>
              <div className="h-10 w-10 bg-slate-100 animate-pulse rounded-lg"></div>
            </div>
            <div className="h-8 w-16 bg-slate-200 animate-pulse rounded mt-4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Bóc tách dữ liệu an toàn (Fallback data)
  const totalJobsCount = metrics?.totalJobs?.count || 0;
  const jobsChangeThisMonth = metrics?.totalJobs?.changeThisMonth || 0;
  const activeJobsCount = metrics?.activeJobs?.count || 0;
  const pendingJobsCount = metrics?.pendingJobs?.count || 0;
  const avgReviewTime =
    metrics?.pendingJobs?.avgReviewTimeText || "~2h xét duyệt";
  const totalAppsCount = metrics?.totalApplications?.count || 0;
  const appsPercentChange =
    metrics?.totalApplications?.percentChangeThisWeek || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Card Tổng số tin đăng (totalJobs) */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-blue-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-semibold">
            Tổng số tin đăng
          </span>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
            <Briefcase size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {totalJobsCount}
            </span>
            <span className="text-sm text-slate-500 font-medium">tin</span>
          </div>
          {jobsChangeThisMonth > 0 && (
            <div className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-md">
              <ArrowUp size={14} />
              <span>+{jobsChangeThisMonth} tháng này</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Card Đang hiển thị (activeJobs) */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-emerald-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-semibold">
            Đang hiển thị
          </span>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
            <BadgeCheck size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {activeJobsCount}
            </span>
            <span className="text-sm text-slate-500 font-medium">vị trí</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full text-emerald-700 text-[11px] font-bold border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Đang hoạt động</span>
          </div>
        </div>
      </div>

      {/* 3. Card Chờ kiểm duyệt (pendingJobs) */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-orange-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-semibold">
            Chờ kiểm duyệt
          </span>
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 transition-transform group-hover:scale-110">
            <Hourglass size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {pendingJobsCount}
            </span>
            <span className="text-sm text-slate-500 font-medium">tin</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
            <Clock size={14} />
            <span>{avgReviewTime}</span>
          </div>
        </div>
      </div>

      {/* 4. Card Tổng hồ sơ (totalApplications) */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-purple-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500 font-semibold">
            Tổng hồ sơ ứng tuyển
          </span>
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110">
            <Users size={20} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {totalAppsCount}
            </span>
            <span className="text-sm text-slate-500 font-medium">CV</span>
          </div>
          {appsPercentChange !== 0 && (
            <div
              className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${appsPercentChange > 0
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-rose-600 bg-rose-50"
                }`}
            >
              {appsPercentChange > 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>
                {appsPercentChange > 0 ? "+" : ""}
                {appsPercentChange}% tuần này
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
