"use client";

import React from "react";
import Link from "next/link";
import { useRecruiterProfile } from "@/hooks/recruiter/useRecruiterProfile";
import { DashboardJobItem, RecruiterJobMetricsResponse } from "@viecngon/types";
import {
  Plus,
  Briefcase,
  Users,
  TrendingUp,
  ArrowUp,
  Clock,
  Hourglass,
  BadgeCheck,
} from "lucide-react";
import { useJobMetrics } from "@/hooks/recruiter/useJobMetrics";
import { formatRelativeTimeVN } from "@/lib/formatters";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  EmptyState,
  ErrorState,
  MetricCardSkeleton,
} from "@/components/ui/StateViews";

const EmployerMainContent = () => {
  const { recruiterProfile: recruiter, isLoading: isLoadingProfile } =
    useRecruiterProfile();

  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    isError,
    refetch,
  } = useJobMetrics();

  if (isError) {
    return (
      <ErrorState
        message="Không thể tải dữ liệu bảng điều khiển tuyển dụng. Vui lòng thử lại."
        onRetry={() => void refetch()}
      />
    );
  }

  if (isLoadingProfile || isLoadingMetrics) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-28 bg-surface-card border border-border-default rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 h-80 bg-surface-card border border-border-default rounded-xl animate-pulse" />
          <div className="h-80 bg-surface-card border border-border-default rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const companyName = recruiter?.company?.name || "Quý doanh nghiệp";
  const totalJobs =
    metrics?.totalJobs?.count ?? recruiter?.statistics?.totalJobs ?? 0;
  const jobsThisMonth =
    (metrics as RecruiterJobMetricsResponse | undefined)?.totalJobs
      ?.changeThisMonth ?? 0;
  const activeJobs = metrics?.activeJobs?.count ?? 0;
  const pendingJobs = metrics?.pendingJobs?.count ?? 0;
  const totalApplications =
    metrics?.totalApplications?.count ??
    recruiter?.statistics?.totalApplications ??
    0;
  const appsPercent = metrics?.totalApplications?.percentChangeThisWeek ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-primary-dark rounded-2xl p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-1.5">
            Xin chào, {companyName}
          </h1>
          <p className="text-sm text-slate-300">
            Hệ thống quản trị tuyển dụng ViecNgon. Hiện doanh nghiệp đang quản
            lý{" "}
            <span className="font-bold text-white">
              {totalJobs} tin tuyển dụng
            </span>{" "}
            và{" "}
            <span className="font-bold text-white">
              {totalApplications} hồ sơ ứng tuyển
            </span>
            .
          </p>
        </div>
        <Link
          href="/post-job"
          className="shrink-0 inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          <Plus size={18} /> Tạo tin tuyển dụng mới
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card rounded-xl p-5 shadow-xs border border-border-default flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
              Tổng số tin đăng
            </span>
            <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-primary">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-text-main tracking-tight">
                {totalJobs}
              </span>
              <span className="text-xs text-text-muted font-medium">tin</span>
            </div>
            {jobsThisMonth > 0 && (
              <div className="flex items-center gap-1 text-success-text text-xs font-semibold">
                <TrendingUp size={13} />
                <span>+{jobsThisMonth} tháng này</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-surface-card rounded-xl p-5 shadow-xs border border-border-default flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
              Đang hiển thị
            </span>
            <div className="w-9 h-9 rounded-lg bg-success-light flex items-center justify-center text-success-text">
              <BadgeCheck size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-text-main tracking-tight">
                {activeJobs}
              </span>
              <span className="text-xs text-text-muted font-medium">
                vị trí
              </span>
            </div>
            <StatusBadge type="custom" tone="success" label="Hoạt động" />
          </div>
        </div>

        <div className="bg-surface-card rounded-xl p-5 shadow-xs border border-border-default flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
              Chờ kiểm duyệt
            </span>
            <div className="w-9 h-9 rounded-lg bg-warning-light flex items-center justify-center text-warning-text">
              <Hourglass size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-text-main tracking-tight">
                {pendingJobs}
              </span>
              <span className="text-xs text-text-muted font-medium">tin</span>
            </div>
            <div className="flex items-center gap-1 text-text-muted text-xs font-medium">
              <Clock size={13} />
              <span>
                {metrics?.pendingJobs?.avgReviewTimeText || "~2h xét duyệt"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl p-5 shadow-xs border border-border-default flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider">
              Tổng hồ sơ ứng tuyển
            </span>
            <div className="w-9 h-9 rounded-lg bg-info-light flex items-center justify-center text-info-text">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold text-text-main tracking-tight">
                {totalApplications}
              </span>
              <span className="text-xs text-text-muted font-medium">CV</span>
            </div>
            {appsPercent > 0 && (
              <div className="flex items-center gap-1 text-success-text text-xs font-semibold">
                <ArrowUp size={13} />
                <span>+{appsPercent}% tuần này</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-surface-card rounded-xl border border-border-default shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-base font-bold text-text-main">
              Tin tuyển dụng gần đây
            </h2>
            <Link
              href="/employer-jobs"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="divide-y divide-border-subtle flex-1">
            {!recruiter?.jobs?.list || recruiter.jobs.list.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={<Briefcase size={22} />}
                  title="Chưa có tin tuyển dụng nào"
                  description="Tạo tin tuyển dụng đầu tiên để tiếp cận hàng nghìn ứng viên IT."
                  actionLabel="Đăng tin ngay"
                  actionHref="/post-job"
                />
              </div>
            ) : (
              recruiter.jobs.list.slice(0, 4).map((job: DashboardJobItem) => {
                const isActive =
                  job.status === "Đang nhận hồ sơ" ||
                  job.status === "Active" ||
                  job.status === "DA_DUYET";

                return (
                  <div
                    key={job.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-subtle/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <Link
                        href="/employer-jobs"
                        className="font-bold text-text-main hover:text-primary text-sm truncate block"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-text-muted mt-0.5">
                        Trạng thái: {job.status}
                      </p>
                    </div>

                    <div className="sm:w-32 sm:text-center">
                      <span className="text-xs font-semibold text-primary bg-primary-light px-3 py-1 rounded-full">
                        {job.applicationsCount || 0} ứng viên
                      </span>
                    </div>

                    <div className="sm:w-32 sm:text-right">
                      <StatusBadge
                        type="job"
                        status={isActive ? "ACTIVE" : "HET_HAN"}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="xl:col-span-1 bg-surface-card rounded-xl border border-border-default shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-border-subtle flex items-center justify-between">
            <h2 className="text-base font-bold text-text-main">
              Ứng viên mới nhất
            </h2>
            <Link
              href="/applications"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="divide-y divide-border-subtle flex-1">
            {!recruiter?.recentApplicants ||
            recruiter.recentApplicants.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={<Users size={22} />}
                  title="Chưa có ứng viên mới"
                  description="Hồ sơ ứng viên nộp vào các tin tuyển dụng sẽ hiển thị tại đây."
                />
              </div>
            ) : (
              recruiter.recentApplicants.slice(0, 4).map((applicant) => (
                <Link
                  key={applicant.applicationId}
                  href={`/applications/${applicant.applicationId}`}
                  className="p-4 flex items-start gap-3 hover:bg-surface-subtle/60 transition-colors"
                >
                  {applicant.avatarUrl ? (
                    <img
                      src={applicant.avatarUrl}
                      alt={applicant.candidateName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-border-default"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                      {applicant.candidateName.charAt(0)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-text-main text-sm truncate">
                      {applicant.candidateName}
                    </h4>
                    <p className="text-xs text-text-secondary truncate mt-0.5">
                      {applicant.jobTitle}
                    </p>
                    <p className="text-[11px] text-text-muted mt-1">
                      {formatRelativeTimeVN(applicant.appliedAt)}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerMainContent;
