import Link from "next/link";
import { Briefcase, ChevronRight, Home, MapPin } from "lucide-react";
import { CompanyDetailResponse } from "@viecngon/types";
import { formatRelativeTimeVN } from "@/lib/formatters";
import { EmptyState, JobCardSkeleton } from "@/components/ui/StateViews";

export default function CompanyJobLists({
  totalJobs,
  jobs,
}: {
  totalJobs?: number;
  jobs?: CompanyDetailResponse["activeJobs"];
}) {
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

  return (
    <div className="sticky top-20 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">
          <span className="tabular-nums">{totalJobs}</span> việc làm đang tuyển
        </h2>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.slug}`}
            className="block bg-surface-card border border-border-default rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs text-text-muted">
                Đăng {formatRelativeTimeVN(job.postedAt)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-light text-primary border border-primary-subtle">
                Đang tuyển
              </span>
            </div>

            <h3 className="text-base font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
              {job.title}
            </h3>

            <p className="mt-2 text-sm font-bold text-success-text tabular-nums">
              {job.salaryDisplay || "Thỏa thuận"}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-text-secondary">
              {job.workModel && (
                <span className="inline-flex items-center gap-1">
                  <Home size={13} className="text-text-placeholder" />
                  <span>{job.workModel}</span>
                </span>
              )}
              {job.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin size={13} className="text-text-placeholder" />
                  <span>{job.location}</span>
                </span>
              )}
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {job.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium bg-surface-muted text-text-secondary border border-border-default px-2 py-0.5 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </Link>
        ))}
      </div>

      <Link
        href="/jobs"
        className="w-full h-10 text-sm text-primary font-semibold hover:bg-primary-light rounded-lg transition-colors flex items-center justify-center gap-1 border border-primary-subtle"
      >
        <span>Xem tất cả việc làm</span>
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}
