"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Mail,
  Briefcase,
  Calendar,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { ApplicationItem } from "@viecngon/types";
import { useUpdateApplicationStatus } from "@/hooks/recruiter/useUpdateApplicationStatus";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge, getAiScoreTone } from "@/components/ui/StatusBadge";
import { formatDateVN } from "@/lib/formatters";

interface CandidateApplicationCardProps {
  application: ApplicationItem;
}

export default function CandidateApplicationCard({
  application,
}: CandidateApplicationCardProps) {
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    updateStatus({ maDon: application.applicationId, status: newStatus });
  };

  return (
    <div className="bg-surface-card border border-border-default rounded-xl p-5 shadow-xs hover:shadow-md hover:border-border-strong transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Thông tin ứng viên */}
      <div className="flex items-start gap-4 min-w-0">
        <CompanyLogo
          src={application.avatarUrl}
          name={application.candidateName}
          size="md"
          shape="circle"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <Link
              href={`/applications/${application.applicationId}`}
              className="text-base font-bold text-text-primary hover:text-primary transition-colors truncate"
            >
              {application.candidateName}
            </Link>
            <StatusBadge status={application.status} type="application" />
            {typeof application.aiMatchScore === "number" && (
              <StatusBadge
                type="custom"
                tone={getAiScoreTone(application.aiMatchScore)}
                label={`AI ${application.aiMatchScore}%`}
                icon={<Sparkles size={12} />}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-1.5 text-sm text-text-secondary">
            <span className="inline-flex items-center gap-1.5 font-medium text-text-primary">
              <Briefcase size={14} className="text-primary shrink-0" />
              <span className="truncate">{application.jobTitle}</span>
            </span>

            {application.contactEmail && (
              <span className="inline-flex items-center gap-1.5 text-text-muted">
                <Mail size={14} className="shrink-0" />
                <span className="truncate">{application.contactEmail}</span>
              </span>
            )}

            <span className="inline-flex items-center gap-1.5 text-text-muted">
              <Calendar size={14} className="shrink-0" />
              <span>Nộp ngày {formatDateVN(application.appliedAt)}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Thao tác */}
      <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-border-default">
        {application.cvUrl && (
          <a
            href={application.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-text-primary bg-surface-muted hover:bg-surface-subtle border border-border-default rounded-lg transition-colors"
          >
            <FileText size={14} className="text-primary" />
            Xem CV PDF
          </a>
        )}

        <div className="relative">
          <select
            value={application.status}
            onChange={handleStatusChange}
            disabled={isPending}
            aria-label={`Cập nhật trạng thái hồ sơ của ${application.candidateName}`}
            className="h-9 px-3 pr-7 text-xs font-semibold text-text-primary bg-surface-card border border-border-default rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-colors disabled:opacity-60 cursor-pointer"
          >
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DANG_XEM_XET">Đang xem xét</option>
            <option value="PHONG_VAN">Mời phỏng vấn</option>
            <option value="DUOC_NHAN">Được nhận</option>
            <option value="BI_LOAI">Chưa phù hợp</option>
          </select>
          {isPending && (
            <Loader2
              size={14}
              className="animate-spin text-primary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          )}
        </div>

        <Link
          href={`/applications/${application.applicationId}`}
          className="inline-flex items-center gap-1 h-9 px-3.5 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors"
        >
          <span>Chi tiết</span>
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
