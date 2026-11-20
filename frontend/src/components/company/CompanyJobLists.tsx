"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Crown,
  Flame,
  Heart,
} from "lucide-react";
import toast from "react-hot-toast";
import type {
  CompanyDetailResponse,
  JobPromotionBadge,
} from "@viecngon/types";
import { EmptyState, JobCardSkeleton } from "@/components/ui/StateViews";
import { cn } from "@/lib/utils";

interface RibbonConfig {
  label: string;
  bgClass: string;
  foldClass: string;
  icon?: React.ReactNode;
}

function resolveBadgeConfig(
  badge?: JobPromotionBadge | null,
  priorityLevel = 0,
): RibbonConfig {
  const resolved: JobPromotionBadge | null =
    badge ??
    (priorityLevel >= 4
      ? "DIAMOND"
      : priorityLevel === 3
        ? "SUPER_HOT"
        : priorityLevel === 2
          ? "HOT"
          : null);

  if (resolved === "DIAMOND") {
    return {
      label: "KIM CƯƠNG",
      bgClass: "bg-ai text-white",
      foldClass: "border-t-indigo-900",
      icon: <Crown size={11} className="shrink-0" />,
    };
  }
  if (resolved === "SUPER_HOT") {
    return {
      label: "SUPER HOT",
      bgClass: "bg-danger text-white",
      foldClass: "border-t-danger-hover",
      icon: <Flame size={11} className="fill-warning-light shrink-0" />,
    };
  }
  if (resolved === "HOT") {
    return {
      label: "HOT",
      bgClass: "bg-vip text-white",
      foldClass: "border-t-orange-800",
      icon: <Flame size={11} className="shrink-0" />,
    };
  }
  return {
    label: "MỚI ĐĂNG",
    bgClass: "bg-primary text-white",
    foldClass: "border-t-primary-active",
  };
}

export default function CompanyJobLists({
  totalJobs,
  jobs,
}: {
  totalJobs?: number;
  jobs?: CompanyDetailResponse["activeJobs"];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<string>>(() => new Set());

  if (totalJobs === undefined || jobs === undefined) {
    return (
      <div className="space-y-4">
        <JobCardSkeleton />
        <JobCardSkeleton />
      </div>
    );
  }

  if (totalJobs === 0 || jobs.length === 0) {
    return (
      <EmptyState
        icon={<Briefcase size={22} />}
        title="Chưa có vị trí đang tuyển"
        description="Hiện tại doanh nghiệp này chưa có tin tuyển dụng mở."
        actionLabel="Xem việc làm khác"
        actionHref="/jobs"
      />
    );
  }

  const safeIndex = currentIndex >= jobs.length ? 0 : currentIndex;
  const activeJob = jobs[safeIndex];
  const ribbon = resolveBadgeConfig(
    activeJob.promotionBadge,
    activeJob.priorityLevel ?? 0,
  );
  const isWarmCard =
    activeJob.promotionBadge === "SUPER_HOT" ||
    activeJob.promotionBadge === "DIAMOND" ||
    activeJob.promotionBadge === "HOT" ||
    (activeJob.priorityLevel ?? 0) >= 2;
  const isSaved = savedIds.has(activeJob.id);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + jobs.length) % jobs.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % jobs.length);
  };

  const handleToggleSave = (jobId: string) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
        toast("Đã bỏ lưu việc làm");
      } else {
        next.add(jobId);
        toast.success("Đã lưu việc làm!");
      }
      return next;
    });
  };

  return (
    <div className="rounded-xl bg-linear-to-br from-primary-dark via-[#13294b] to-primary-active p-5 text-white shadow-md">
      {/* Header + Nút điều hướng carousel */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-base sm:text-lg font-bold text-white tabular-nums">
          {totalJobs} việc làm đang tuyển dụng
        </h2>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            disabled={jobs.length <= 1}
            aria-label="Việc làm trước"
            className="w-8 h-8 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={jobs.length <= 1}
            aria-label="Việc làm tiếp theo"
            className="w-8 h-8 rounded-full border border-white/25 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Thẻ Job nổi bật bên trong */}
      <div
        className={cn(
          "relative rounded-xl p-4 border shadow-sm text-text-primary transition-colors",
          isWarmCard
            ? "bg-[#FFF5EE] border-vip-border"
            : "bg-surface-card border-border-default",
        )}
      >
        {/* Ribbon góc trên bên phải */}
        <div className="absolute -top-2.5 -right-1.5 z-10 select-none">
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-l-md rounded-tr-md text-[11px] font-bold tracking-wide uppercase shadow-xs",
              ribbon.bgClass,
            )}
          >
            {ribbon.icon}
            <span>{ribbon.label}</span>
          </div>
          <span
            aria-hidden="true"
            className={cn(
              "block ml-auto w-0 h-0 border-t-[6px] border-r-[6px] border-r-transparent",
              ribbon.foldClass,
            )}
          />
        </div>

        <p className="text-xs text-text-muted pr-24 mb-1.5">
          {activeJob.location || "Việt Nam"}
        </p>

        <div className="flex items-start justify-between gap-2.5">
          <Link
            href={`/jobs/${activeJob.slug}`}
            className="text-base font-bold text-text-primary hover:text-primary transition-colors line-clamp-2 leading-snug flex-1"
          >
            {activeJob.title}
          </Link>
          <button
            type="button"
            onClick={() => handleToggleSave(activeJob.id)}
            aria-label={isSaved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
            className={cn(
              "p-1 rounded-full transition-colors shrink-0",
              isSaved
                ? "text-danger"
                : "text-text-placeholder hover:text-danger",
            )}
          >
            <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="mt-2.5 flex items-center gap-1.5 text-xs text-text-secondary">
          <Briefcase size={13} className="text-text-placeholder shrink-0" />
          <span className="font-medium underline decoration-border-strong underline-offset-2">
            {activeJob.level || activeJob.workModel || "Toàn thời gian"}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm font-bold text-success-text tabular-nums">
          <CircleDollarSign size={15} className="text-success shrink-0" />
          <span>{activeJob.salaryDisplay || "Thỏa thuận"}</span>
        </div>

        {activeJob.skills && activeJob.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activeJob.skills.slice(0, 2).map((skill) => (
              <span
                key={skill}
                className="text-xs font-medium bg-surface-card text-text-secondary border border-border-default px-2.5 py-0.5 rounded-full"
              >
                {skill}
              </span>
            ))}
            {activeJob.skills.length > 2 && (
              <span className="text-xs font-medium bg-surface-card text-text-muted border border-border-default px-2 py-0.5 rounded-full">
                +{activeJob.skills.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Chỉ báo vị trí carousel khi có > 1 việc làm */}
      {jobs.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-3">
          {jobs.map((job, idx) => (
            <button
              key={job.id}
              type="button"
              aria-label={`Xem việc làm ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                idx === safeIndex ? "w-5 bg-white" : "w-1.5 bg-white/35",
              )}
            />
          ))}
        </div>
      )}

      {/* Nút Xem tất cả việc làm */}
      <Link
        href="/jobs"
        className="mt-4 w-full h-10 text-sm text-white font-semibold bg-primary hover:bg-primary-hover rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
      >
        <span>Xem tất cả việc làm</span>
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
