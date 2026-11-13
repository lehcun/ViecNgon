"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  MapPin,
  Briefcase,
  Award,
  Clock,
  Send,
  CheckCircle2,
  Globe,
  Users,
} from "lucide-react";
import { JobDetailResponse } from "@viecngon/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { EmptyState } from "@/components/ui/StateViews";

interface JobDetailPreviewPaneProps {
  job: JobDetailResponse | null;
}

export default function JobDetailPreviewPane({ job }: JobDetailPreviewPaneProps) {
  if (!job) {
    return (
      <EmptyState
        icon={<Briefcase size={24} />}
        title="Chọn một việc làm để xem nhanh"
        description="Nhấp vào bất kỳ thẻ việc làm nào ở cột bên trái để xem mô tả, yêu cầu và phúc lợi chi tiết."
      />
    );
  }

  const company = job.company;

  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs max-h-[calc(100vh-6.5rem)] overflow-y-auto">
      {/* 1. Header */}
      <div className="flex items-start gap-4 pb-5 border-b border-border-default">
        <CompanyLogo src={company?.logo} name={company?.name} size="lg" />

        <div className="flex-1 min-w-0">
          <Link
            href={`/jobs/${job.slug}`}
            className="text-lg sm:text-xl font-bold text-text-primary leading-snug hover:text-primary transition-colors block"
          >
            {job.title}
          </Link>
          <Link
            href={company?.slug ? `/company/${company.slug}` : "#"}
            className="text-sm font-medium text-text-muted hover:text-primary mt-1 inline-block truncate"
          >
            {company?.name}
          </Link>

          <div className="mt-2 text-base font-bold text-success-text tabular-nums">
            {job.salaryDisplay || "Thỏa thuận"}
          </div>
        </div>
      </div>

      {/* 2. Hành động chính */}
      <div className="flex items-center gap-3 py-4 border-b border-border-default">
        {job.isApplied ? (
          <div className="flex-1 h-10 inline-flex items-center justify-center gap-2 px-4 bg-success-light text-success-text text-sm font-semibold rounded-lg border border-success-border">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>
              Đã ứng tuyển{" "}
              {job.applicationStatus ? `(${job.applicationStatus})` : ""}
            </span>
          </div>
        ) : (
          <Link
            href={`/job-it/${job.slug}/job_applications`}
            className="flex-1 h-10 inline-flex items-center justify-center gap-2 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Send size={16} />
            <span>Ứng tuyển ngay</span>
          </Link>
        )}

        <Link
          href={`/jobs/${job.slug}`}
          target="_blank"
          className="h-10 w-10 inline-flex items-center justify-center border border-border-default hover:border-primary hover:text-primary rounded-lg text-text-secondary transition-colors"
          title="Mở trong tab mới"
        >
          <ExternalLink size={17} />
        </Link>
      </div>

      {/* 3. Thông số nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-border-default text-xs">
        <div className="flex items-center gap-2 text-text-secondary">
          <MapPin size={15} className="text-text-placeholder shrink-0" />
          <span className="truncate">{job.location || "Toàn quốc"}</span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Briefcase size={15} className="text-text-placeholder shrink-0" />
          <span className="truncate">{job.workModel || "Linh hoạt"}</span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Award size={15} className="text-text-placeholder shrink-0" />
          <span className="truncate">{job.level || "Tất cả cấp bậc"}</span>
        </div>
        <div className="flex items-center gap-2 text-text-secondary">
          <Clock size={15} className="text-text-placeholder shrink-0" />
          <span className="truncate">
            {job.experience ? `${job.experience} năm KN` : "Không yêu cầu KN"}
          </span>
        </div>
      </div>

      {/* 4. Kỹ năng chuyên môn */}
      {job.skills && job.skills.length > 0 && (
        <div className="py-4 border-b border-border-default">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2.5">
            Kỹ năng chuyên môn
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 text-xs font-medium rounded-md bg-primary-light text-primary border border-primary-subtle"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. Mô tả công việc */}
      <div className="py-4 border-b border-border-default">
        <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">
          Mô tả công việc
        </h3>
        {job.description ? (
          <div
            className="text-sm text-text-secondary prose prose-sm prose-slate max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        ) : (
          <p className="text-sm text-text-muted italic">Chưa có mô tả chi tiết.</p>
        )}
      </div>

      {/* 6. Yêu cầu ứng viên */}
      {job.requirements && (
        <div className="py-4 border-b border-border-default">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">
            Yêu cầu ứng viên
          </h3>
          <div
            className="text-sm text-text-secondary prose prose-sm prose-slate max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.requirements }}
          />
        </div>
      )}

      {/* 7. Quyền lợi & Phúc lợi */}
      {job.benefits && (
        <div className="py-4 border-b border-border-default">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">
            Quyền lợi &amp; Phúc lợi
          </h3>
          <div
            className="text-sm text-text-secondary prose prose-sm prose-slate max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.benefits }}
          />
        </div>
      )}

      {/* 8. Về công ty */}
      {company && (
        <div className="pt-4">
          <h3 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-2">
            Về công ty
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed mb-3">
            {company.industry || company.companyModel || "Doanh nghiệp công nghệ"}
          </p>

          <div className="space-y-1.5 text-xs text-text-muted">
            {company.size && (
              <p className="flex items-center gap-2">
                <Users size={14} className="text-text-placeholder" />
                <span>Quy mô: {company.size}</span>
              </p>
            )}
            {company.website && (
              <p className="flex items-center gap-2">
                <Globe size={14} className="text-text-placeholder" />
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
