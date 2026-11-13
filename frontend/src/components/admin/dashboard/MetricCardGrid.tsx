"use client";

import React from "react";
import {
  Users,
  Clock,
  FileCheck2,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { useAdminMetrics } from "@/hooks/admin/useAdminDashboard";
import { ErrorState, MetricCardSkeleton } from "@/components/ui/StateViews";

export default function MetricCardGrid() {
  const { data: metrics, isLoading, isError, refetch } = useAdminMetrics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <div className="bg-surface-card rounded-xl border border-border-default p-6">
        <ErrorState
          title="Không thể tải các chỉ số tổng quan"
          message="Vui lòng kiểm tra lại kết nối máy chủ quản trị."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const cards = [
    {
      title: "Tổng người dùng",
      value: metrics.totalUsers.count.toLocaleString("vi-VN"),
      growth: metrics.totalUsers.growthPercent,
      subtitle: `${metrics.totalUsers.candidatesCount.toLocaleString("vi-VN")} ứng viên · ${metrics.totalUsers.employersCount.toLocaleString("vi-VN")} nhà tuyển dụng`,
      icon: Users,
      iconBg: "bg-primary-light text-primary",
    },
    {
      title: "Tin chờ kiểm duyệt",
      value: metrics.pendingJobs.count.toLocaleString("vi-VN"),
      urgent: metrics.pendingJobs.requiresImmediateReview,
      subtitle: metrics.pendingJobs.requiresImmediateReview
        ? "Cần ưu tiên kiểm duyệt ngay"
        : "Khối lượng kiểm duyệt ổn định",
      icon: Clock,
      iconBg: "bg-warning-light text-warning",
    },
    {
      title: "Tổng hồ sơ ứng tuyển",
      value: metrics.totalApplications.count.toLocaleString("vi-VN"),
      growth: metrics.totalApplications.growthPercent,
      subtitle: "Lượt nộp hồ sơ tích lũy toàn sàn",
      icon: FileCheck2,
      iconBg: "bg-success-light text-success",
    },
    {
      title: "Doanh thu nền tảng",
      value: metrics.platformRevenue.formattedAmount,
      growth: metrics.platformRevenue.growthPercent,
      subtitle: "Tổng doanh thu gói dịch vụ tuyển dụng",
      icon: Wallet,
      iconBg: "bg-ai-light text-ai",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const hasGrowth = typeof card.growth === "number";
        const isPositive = (card.growth ?? 0) >= 0;

        return (
          <div
            key={card.title}
            className="bg-surface-card rounded-xl border border-border-default p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-text-primary mt-1.5 tabular-nums truncate">
                  {card.value}
                </p>
              </div>
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${card.iconBg}`}
              >
                <Icon size={20} />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-border-default text-xs">
              <span className="text-text-muted truncate">{card.subtitle}</span>

              {hasGrowth ? (
                <span
                  className={`inline-flex items-center gap-0.5 font-semibold px-2 py-0.5 rounded-full shrink-0 tabular-nums ${
                    isPositive
                      ? "bg-success-light text-success-text"
                      : "bg-danger-light text-danger-text"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {isPositive ? "+" : ""}
                  {card.growth}%
                </span>
              ) : card.urgent ? (
                <span className="inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full bg-warning-light text-warning-text shrink-0">
                  <AlertCircle size={12} /> Khẩn
                </span>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
