"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  CircleDollarSign,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AppliedJobItem } from "@viecngon/types";
import ApplicationTracker from "./ApplicationTracker";
import InterviewDetails from "./InterviewDetails";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatDateVN } from "@/lib/formatters";

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
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={16} className="text-primary shrink-0" />
          <StatusBadge
            type="application"
            status={item.applicationStatus}
          />
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
        </div>
      )}
    </article>
  );
}
