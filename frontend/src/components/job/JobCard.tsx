"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Clock,
  Briefcase,
  CircleDollarSign,
  Flame,
  Crown,
} from "lucide-react";
import { JobDetailResponse, JobPromotionBadge } from "@viecngon/types";
import { formatRelativeTimeVN } from "@/lib/formatters";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: JobDetailResponse;
  isSelected?: boolean;
  onSelect?: () => void;
}

interface RibbonVisualConfig {
  label: string;
  bgClass: string;
  foldClass: string;
  icon?: React.ReactNode;
}

function getRibbonConfig(
  badge?: JobPromotionBadge | null,
  priorityLevel = 0,
): RibbonVisualConfig | null {
  const resolvedBadge: JobPromotionBadge | null =
    badge ??
    (priorityLevel >= 4
      ? "DIAMOND"
      : priorityLevel === 3
        ? "SUPER_HOT"
        : priorityLevel === 2
          ? "HOT"
          : null);

  if (resolvedBadge === "DIAMOND") {
    return {
      label: "KIM CƯƠNG",
      bgClass: "bg-ai text-white",
      foldClass: "border-t-indigo-900",
      icon: <Crown size={11} className="shrink-0" />,
    };
  }

  if (resolvedBadge === "SUPER_HOT") {
    return {
      label: "SUPER HOT",
      bgClass: "bg-danger text-white",
      foldClass: "border-t-danger-hover",
      icon: <Flame size={11} className="fill-warning-light shrink-0" />,
    };
  }

  if (resolvedBadge === "HOT") {
    return {
      label: "HOT",
      bgClass: "bg-vip text-white",
      foldClass: "border-t-orange-800",
    };
  }

  if (resolvedBadge === "HEADHUNT") {
    return {
      label: "HEADHUNT",
      bgClass: "bg-ai text-white",
      foldClass: "border-t-indigo-900",
    };
  }

  return null;
}

export default function JobCard({
  job,
  isSelected = false,
  onSelect,
}: JobCardProps) {
  const router = useRouter();
  const company = job.company;

  const priorityLevel = job.priorityLevel ?? 0;
  const ribbon = getRibbonConfig(job.promotionBadge, priorityLevel);
  const isWarmTier =
    job.promotionBadge === "SUPER_HOT" ||
    job.promotionBadge === "DIAMOND" ||
    priorityLevel >= 3;

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("a, button")) {
      return;
    }

    if (onSelect) {
      onSelect();
    }

    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      router.push(`/jobs/${job.slug}`);
    }
  };

  return (
    <article
      onClick={handleCardClick}
      className={cn(
        "group relative rounded-xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between",
        isWarmTier
          ? "bg-[#FFF5EE] hover:bg-[#FFEDE0]"
          : "bg-surface-card hover:bg-surface-card",
        isSelected
          ? "border-primary ring-1 ring-primary/25 shadow-md"
          : isWarmTier
            ? "border-vip-border hover:border-primary/60 hover:shadow-md"
            : "border-border-default hover:border-primary/50 hover:shadow-md",
      )}
    >
      {/* Thanh dọc nổi bên trái khi được chọn trên màn hình Master-Detail */}
      {isSelected && (
        <>
          <span
            aria-hidden="true"
            className="hidden lg:block absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-l-xl"
          />
          {/* Mũi tên tam giác chỉ sang pane chi tiết bên phải */}
          <span
            aria-hidden="true"
            className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[10px] border-y-transparent border-l-[10px] border-l-primary z-20"
          />
        </>
      )}

      {/* Ribbon Badge góc trên bên phải (SUPER HOT / KIM CƯƠNG / HOT) */}
      {ribbon && (
        <div className="absolute top-3 -right-1.5 z-10 select-none">
          <div
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-l-md rounded-tr-md text-[11px] font-bold tracking-wide uppercase shadow-xs",
              ribbon.bgClass,
            )}
          >
            {ribbon.icon}
            <span>{ribbon.label}</span>
          </div>
          {/* Nếp gấp nhỏ dưới mép phải của Ribbon */}
          <span
            aria-hidden="true"
            className={cn(
              "block ml-auto w-0 h-0 border-t-[6px] border-r-[6px] border-r-transparent",
              ribbon.foldClass,
            )}
          />
        </div>
      )}

      <div>
        {/* Thời gian đăng */}
        <div
          className={cn(
            "flex items-center gap-1.5 text-xs text-text-muted mb-2",
            ribbon && "pr-28",
          )}
        >
          <Clock size={12} className="text-text-placeholder shrink-0" />
          <span>Đăng {formatRelativeTimeVN(job.postedAt)}</span>
        </div>

        {/* Tiêu đề công việc */}
        <Link
          href={`/jobs/${job.slug}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "text-base font-bold transition-colors line-clamp-2 leading-snug block",
            ribbon && "pr-24",
            job.promotionBadge === "SUPER_HOT"
              ? "text-danger-text hover:text-primary"
              : "text-text-primary hover:text-primary",
          )}
        >
          {job.title}
        </Link>

        {/* Logo + Tên công ty */}
        <div className="flex items-center gap-2.5 mt-3">
          <CompanyLogo src={company?.logo} name={company?.name} size="sm" />
          <p className="text-sm font-medium text-text-secondary truncate">
            {company?.name || "Doanh nghiệp công nghệ"}
          </p>
        </div>

        {/* Mức lương */}
        <div className="mt-3 flex items-center gap-1.5 text-sm font-bold text-success-text tabular-nums">
          <CircleDollarSign size={16} className="text-success shrink-0" />
          <span>{job.salaryDisplay || "Thỏa thuận"}</span>
        </div>

        {/* Đường ngăn nét đứt + Metadata (Cấp bậc, Hình thức, Thành phố) */}
        <div className="mt-3.5 pt-3 border-t border-dashed border-border-default space-y-1.5 text-xs text-text-secondary">
          {job.level && (
            <div className="flex items-center gap-2">
              <Briefcase size={13} className="text-text-placeholder shrink-0" />
              <span className="font-medium underline decoration-border-strong underline-offset-2">
                {job.level}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            {job.workModel && (
              <span className="inline-flex items-center gap-1 font-medium text-text-secondary">
                <span>{job.workModel}</span>
              </span>
            )}
            {job.workModel && job.location && (
              <span className="text-text-placeholder">•</span>
            )}
            {job.location && (
              <span className="inline-flex items-center gap-1 text-text-secondary">
                <MapPin size={12} className="text-text-placeholder shrink-0" />
                <span>{job.location}</span>
              </span>
            )}
          </div>
        </div>

        {/* Danh sách kỹ năng (tối đa 4 + N) */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {job.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-card text-text-secondary border border-border-default"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-surface-muted text-text-muted border border-border-default">
                +{job.skills.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Điểm nổi bật phúc lợi cho card SUPER HOT / KIM CƯƠNG (như ảnh 3) */}
      {isWarmTier && job.highlights && job.highlights.length > 0 && (
        <ul className="mt-3.5 pt-3 border-t border-dashed border-vip-border space-y-1 text-xs text-text-primary">
          {job.highlights.slice(0, 3).map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-danger shrink-0" />
              <span className="line-clamp-1">{item}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
