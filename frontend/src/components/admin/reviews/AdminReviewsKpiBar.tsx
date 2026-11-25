"use client";

import React from "react";
import {
  Clock,
  Flag,
  CheckCircle2,
  TrendingUp,
  MessageSquareQuote,
} from "lucide-react";
import type {
  AdminReviewGrowthBucket,
  AdminReviewKpiPeriod,
} from "@viecngon/types";
import { cn } from "@/lib/utils";

interface AdminReviewsKpiBarProps {
  counts: {
    total: number;
    pending: number;
    reported: number;
    approved: number;
  };
  growth: Record<AdminReviewKpiPeriod, AdminReviewGrowthBucket>;
  period: AdminReviewKpiPeriod;
  onPeriodChange: (period: AdminReviewKpiPeriod) => void;
}

export default function AdminReviewsKpiBar({
  counts,
  growth,
  period,
  onPeriodChange,
}: AdminReviewsKpiBarProps) {
  const activeGrowth = growth[period];
  const periodLabel =
    period === "today"
      ? "hôm nay"
      : period === "week"
        ? "tuần này"
        : "tháng này";

  const cards = [
    {
      label: "Tổng đánh giá",
      value: counts.total,
      delta: activeGrowth.total,
      border: "border-border-default",
      titleClass: "text-text-muted",
      valueClass: "text-text-primary",
      deltaClass: "bg-primary-light text-primary border-primary-subtle",
      icon: <MessageSquareQuote size={14} className="text-primary" />,
    },
    {
      label: "Chờ duyệt",
      value: counts.pending,
      delta: activeGrowth.pending,
      border: "border-warning-border",
      titleClass: "text-warning-text",
      valueClass: "text-warning-text",
      deltaClass: "bg-warning-soft text-warning-text border-warning-border",
      icon: <Clock size={14} />,
    },
    {
      label: "Bị công ty báo cáo",
      value: counts.reported,
      delta: activeGrowth.reported,
      border: "border-danger-border",
      titleClass: "text-danger-text",
      valueClass: "text-danger-text",
      deltaClass: "bg-danger-soft text-danger-text border-danger-border",
      icon: <Flag size={14} />,
    },
    {
      label: "Đang hiển thị",
      value: counts.approved,
      delta: activeGrowth.approved,
      border: "border-success-border",
      titleClass: "text-success-text",
      valueClass: "text-success-text",
      deltaClass: "bg-success-soft text-success-text border-success-border",
      icon: <CheckCircle2 size={14} />,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Thanh chuyển đổi kỳ so sánh tăng trưởng */}
      <div className="flex items-center justify-end">
        <div
          className="inline-flex items-center p-1 rounded-lg bg-surface-card border border-border-default shadow-2xs"
          role="tablist"
          aria-label="Chọn kỳ thống kê tăng trưởng"
        >
          {(
            [
              { key: "today", label: "Hôm nay" },
              { key: "week", label: "Tuần này" },
              { key: "month", label: "Tháng này" },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              aria-selected={period === item.key}
              onClick={() => onPeriodChange(item.key)}
              className={cn(
                "px-3 py-1 rounded-md text-xs font-semibold transition-colors",
                period === item.key
                  ? "bg-primary text-white shadow-2xs"
                  : "text-text-secondary hover:text-text-primary",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={cn(
              "bg-surface-card border rounded-xl p-4 shadow-2xs flex flex-col justify-between gap-2.5",
              card.border,
            )}
          >
            <p
              className={cn(
                "text-xs font-semibold flex items-center gap-1.5",
                card.titleClass,
              )}
            >
              {card.icon}
              <span>{card.label}</span>
            </p>

            <div className="flex items-end justify-between gap-2">
              <p
                className={cn(
                  "text-2xl font-bold tabular-nums leading-none",
                  card.valueClass,
                )}
              >
                {card.value}
              </p>
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border tabular-nums",
                  card.deltaClass,
                )}
              >
                <TrendingUp size={11} />+{card.delta} {periodLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
