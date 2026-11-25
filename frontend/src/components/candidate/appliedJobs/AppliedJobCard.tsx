"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  CircleDollarSign,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardCheck,
  Star,
} from "lucide-react";
import { AppliedJobItem } from "@viecngon/types";
import ApplicationTracker from "./ApplicationTracker";
import InterviewDetails from "./InterviewDetails";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateVN } from "@/lib/formatters";
import { CANDIDATE_CRITERIA_META, EVAL_RESULT_META } from "@/data/reviews.mock";
import { cn } from "@/lib/utils";

interface JobCardProps {
  item: AppliedJobItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function AppliedJobCard({
  item,
  isExpanded,
  onToggle,
}: JobCardProps) {
  const isExpired =
    item.job.status === "EXPIRED" || item.job.status === "Hết hạn";

  return (
    <article className="border border-border-default rounded-xl overflow-hidden shadow-xs bg-surface-card hover:border-primary/40 transition-colors">
      <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <CompanyLogo
            src={item.job.company?.logo}
            name={item.job.company?.name || "Công ty"}
            size="md"
          />

          <div className="flex-1 min-w-0">
            <Link href={`/jobs/${item.job.slug}`}>
              <h2 className="text-base font-bold text-text-main leading-snug hover:text-primary transition-colors line-clamp-1">
                {item.job.title}
              </h2>
            </Link>
            <p className="text-sm text-text-muted font-medium mt-0.5 truncate">
              {item.job.company?.name}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs md:text-sm text-text-secondary mt-2">
              <span className="inline-flex items-center gap-1">
                <MapPin size={14} className="text-text-subtle" />
                {item.job.location || "Toàn quốc"} • {item.job.workModel}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-success-text">
                <CircleDollarSign size={14} />
                {item.job.salaryDisplay}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-border-subtle shrink-0">
          <span className="text-xs text-text-muted">
            Đã ứng tuyển:{" "}
            <strong className="text-text-main font-semibold">
              {formatDateVN(item.appliedDate)}
            </strong>
          </span>
          <StatusBadge
            type="job"
            status={isExpired ? "HET_HAN" : "ACTIVE"}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onToggle}
        className="w-full px-5 py-3 border-t border-border-subtle flex items-center justify-between text-left hover:bg-surface-subtle/60 transition-colors focus:outline-none cursor-pointer"
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <CheckCircle2 size={16} className="text-primary shrink-0" />
          <StatusBadge
            type="application"
            status={item.applicationStatus}
          />
          {item.sharedEvaluations && item.sharedEvaluations.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-info-soft text-info-text border border-info-border">
              <ClipboardCheck size={12} />
              Có nhận xét từ NTD ({item.sharedEvaluations.length})
            </span>
          )}
        </div>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
          {isExpanded ? "Thu gọn" : "Xem tiến trình"}
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {isExpanded && (
        <div className="p-5 bg-surface-subtle/50 border-t border-border-subtle">
          <ApplicationTracker
            status={item.applicationStatus}
            appliedDate={item.appliedDate}
          />

          {item.applicationStatus === "PHONG_VAN" && (
            <InterviewDetails companyName={item.job.company?.name} />
          )}

          {item.sharedEvaluations && item.sharedEvaluations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border-default space-y-3">
              <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                <ClipboardCheck size={16} className="text-primary" />
                Nhận xét phỏng vấn từ {item.job.company?.name || "Nhà tuyển dụng"}
              </h3>
              {item.sharedEvaluations.map((ev) => {
                const resultMeta = EVAL_RESULT_META[ev.ketQuaDanhGia];
                return (
                  <div
                    key={ev.id}
                    className="rounded-xl bg-surface-card border border-border-default p-4 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-600 tabular-nums">
                          <Star size={13} fill="currentColor" />
                          {ev.rating.toFixed(1)}/5
                        </span>
                        {resultMeta && (
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full font-semibold",
                              resultMeta.badgeClass,
                            )}
                          >
                            {resultMeta.label}
                          </span>
                        )}
                      </div>
                      <span className="text-text-muted">
                        {formatDateVN(ev.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-text-primary">
                      {ev.tieuDe}
                    </p>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      {ev.noiDung}
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1 text-xs text-text-muted">
                      {CANDIDATE_CRITERIA_META.map((crit) => (
                        <span
                          key={crit.key}
                          className="px-2 py-0.5 rounded bg-surface-page border border-border-default tabular-nums"
                        >
                          {crit.label}:{" "}
                          <strong className="text-text-primary">
                            {ev[crit.key]}/5
                          </strong>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
