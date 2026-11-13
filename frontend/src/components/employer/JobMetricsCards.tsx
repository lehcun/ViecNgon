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
import { MetricCardSkeleton } from "@/components/ui/StateViews";
import { StatusBadge } from "@/components/ui/StatusBadge";

interface JobMetricsCardsProps {
  metrics?: RecruiterJobMetricsResponse;
  isLoading?: boolean;
}

export default function JobMetricsCards({
  metrics,
  isLoading,
}: JobMetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

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
      <div className="bg-surface-card rounded-xl p-5 shadow-xs border border-border-default flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
            Tổng số tin đăng
          </span>
          <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary">
            <Briefcase size={18} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-text-main tracking-tight">
              {totalJobsCount}
            </span>
            <span className="text-xs text-text-muted font-medium">tin</span>
          </div>
          {jobsChangeThisMonth > 0 && (
            <div className="flex items-center gap-1 text-primary text-xs font-semibold bg-primary-light px-2 py-1 rounded-md">
              <ArrowUp size={13} />
              <span>+{jobsChangeThisMonth} tháng này</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface-card rounded-xl p-5 shadow-xs border border-border-default flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
            Đang hiển thị
          </span>
          <div className="w-9 h-9 rounded-lg bg-success-light flex items-center justify-center text-success-text">
            <BadgeCheck size={18} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-text-main tracking-tight">
              {activeJobsCount}
            </span>
            <span className="text-xs text-text-muted font-medium">vị trí</span>
          </div>
          <StatusBadge type="custom" tone="success" label="Đang hoạt động" />
        </div>
      </div>

      <div className="bg-surface-card rounded-xl p-5 shadow-xs border border-border-default flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
            Chờ kiểm duyệt
          </span>
          <div className="w-9 h-9 rounded-lg bg-warning-light flex items-center justify-center text-warning-text">
            <Hourglass size={18} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-text-main tracking-tight">
              {pendingJobsCount}
            </span>
            <span className="text-xs text-text-muted font-medium">tin</span>
          </div>
          <div className="flex items-center gap-1 text-text-muted text-xs font-medium">
            <Clock size={13} />
            <span>{avgReviewTime}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl p-5 shadow-xs border border-border-default flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
            Tổng hồ sơ ứng tuyển
          </span>
          <div className="w-9 h-9 rounded-lg bg-info-light flex items-center justify-center text-info-text">
            <Users size={18} />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-text-main tracking-tight">
              {totalAppsCount}
            </span>
            <span className="text-xs text-text-muted font-medium">CV</span>
          </div>
          {appsPercentChange !== 0 && (
            <div
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md ${
                appsPercentChange > 0
                  ? "text-success-text bg-success-light"
                  : "text-danger-text bg-danger-soft"
              }`}
            >
              {appsPercentChange > 0 ? (
                <TrendingUp size={13} />
              ) : (
                <TrendingDown size={13} />
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
