"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Clock, Briefcase, ChevronRight } from "lucide-react";
import { JobDetailResponse } from "@viecngon/types";
import { formatRelativeTimeVN } from "@/lib/formatters";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { cn } from "@/lib/utils";

interface JobCardProps {
  job: JobDetailResponse;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function JobCard({
  job,
  isSelected = false,
  onSelect,
}: JobCardProps) {
  const router = useRouter();
  const company = job.company;

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
        "group relative bg-surface-card rounded-xl border p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between h-full",
        isSelected
          ? "border-primary ring-2 ring-primary/15 bg-primary-light/30 shadow-md"
          : "border-border-default hover:border-primary/50 hover:shadow-md",
      )}
    >
      <div className="flex items-start gap-4">
        {/* 1. Logo Công ty */}
        <CompanyLogo src={company?.logo} name={company?.name} size="md" />

        {/* Nội dung chính */}
        <div className="flex-1 min-w-0">
          {/* 2. Tiêu đề công việc */}
          <Link
            href={`/jobs/${job.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-base font-semibold text-text-primary hover:text-primary transition-colors line-clamp-2 leading-snug block"
          >
            {job.title}
          </Link>

          {/* 3. Tên công ty */}
          <p className="text-sm font-medium text-text-muted mt-1 truncate">
            {company?.name || "Doanh nghiệp công nghệ"}
          </p>

          {/* 4. Mức lương highlight (Màu Success chuẩn Design System) */}
          <div className="mt-2 text-sm font-bold text-success-text tabular-nums">
            {job.salaryDisplay || "Thỏa thuận"}
          </div>

          {/* 5. Metadata: Thành phố, Hình thức, Cấp bậc */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3 text-xs font-medium">
            {job.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-surface-muted text-text-secondary">
                <MapPin size={12} className="text-text-placeholder shrink-0" />
                <span>{job.location}</span>
              </span>
            )}

            {job.workModel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-primary-light text-primary">
                <Briefcase size={12} className="shrink-0" />
                <span>{job.workModel}</span>
              </span>
            )}

            {job.level && (
              <span className="px-2.5 py-0.5 rounded-md bg-warning-light text-warning-text">
                {job.level}
              </span>
            )}
          </div>

          {/* 6. Danh sách Kỹ năng Tags (Tối đa 4 tag +N) */}
          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 rounded-md text-xs font-medium bg-surface-muted text-text-secondary border border-border-default"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="px-1.5 py-0.5 rounded-md text-xs font-medium text-text-muted">
                  +{job.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chân card: Thời gian đăng + Xem chi tiết */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-default text-xs text-text-muted">
        <span className="inline-flex items-center gap-1">
          <Clock size={12} className="text-text-placeholder" />
          <span>Đăng {formatRelativeTimeVN(job.postedAt)}</span>
        </span>

        <Link
          href={`/jobs/${job.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5"
        >
          <span>Xem chi tiết</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </article>
  );
}
