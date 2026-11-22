"use client";

import React from "react";
import { ShieldCheck, UserCheck, UserX, Users } from "lucide-react";
import type { AdminUserSummaryStats } from "@viecngon/types";

interface AdminUserStatsBarProps {
  summary?: AdminUserSummaryStats;
  isLoading: boolean;
}

export default function AdminUserStatsBar({
  summary,
  isLoading,
}: AdminUserStatsBarProps) {
  if (isLoading && !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="bg-surface-card border border-border-default rounded-xl p-5 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-4 w-28 bg-surface-subtle rounded" />
              <div className="h-9 w-9 bg-surface-muted rounded-lg" />
            </div>
            <div className="h-8 w-20 bg-surface-subtle rounded mb-2" />
            <div className="h-3.5 w-36 bg-surface-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      label: "Tổng tài khoản",
      value: summary?.total ?? 0,
      subtext: `${summary?.candidates ?? 0} Ứng viên · ${summary?.recruiters ?? 0} NTD`,
      icon: Users,
      iconWrap: "bg-primary-light text-primary",
    },
    {
      label: "Đang hoạt động",
      value: summary?.active ?? 0,
      subtext: "Tài khoản đủ quyền truy cập hệ thống",
      icon: UserCheck,
      iconWrap: "bg-success-light text-success-text",
    },
    {
      label: "Bị khóa / Chưa kích hoạt",
      value: (summary?.locked ?? 0) + (summary?.unactivated ?? 0),
      subtext: `${summary?.locked ?? 0} bị khóa · ${summary?.unactivated ?? 0} chưa kích hoạt`,
      icon: UserX,
      iconWrap: "bg-danger-light text-danger-text",
    },
    {
      label: "Quản trị viên",
      value: summary?.admins ?? 0,
      subtext: "Tài khoản có toàn quyền hệ thống",
      icon: ShieldCheck,
      iconWrap: "bg-ai-light text-ai",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="bg-surface-card border border-border-default rounded-xl p-5 shadow-xs hover:border-border-strong transition-colors"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-sm font-medium text-text-muted">
                {card.label}
              </span>
              <span
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${card.iconWrap}`}
              >
                <Icon size={18} />
              </span>
            </div>
            <p className="text-2xl font-bold text-text-primary tabular-nums">
              {card.value.toLocaleString("vi-VN")}
            </p>
            <p className="text-xs text-text-muted mt-1.5">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
