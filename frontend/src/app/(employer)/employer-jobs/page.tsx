"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  Plus,
  Briefcase,
  Search,
  X,
  ListFilter,
  MapPin,
  Calendar,
  Eye,
  Users,
  Pencil,
  RotateCcw,
  EyeOff,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  Clock,
  BadgeCheck,
} from "lucide-react";
import {
  useEmployerJobs,
  useToggleJobVisibility,
  useDeleteEmployerJob,
} from "@/hooks/recruiter/useEmployerJobs";
import RepostJobModal from "@/components/employer/RepostJobModal";
import DeleteJobModal from "@/components/employer/DeleteJobModal";
import { formatDateVN } from "@/lib/formatters";
import type { EmployerJobListItem } from "@viecngon/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  EmptyState,
  ErrorState,
  MetricCardSkeleton,
  TableRowSkeleton,
} from "@/components/ui/StateViews";

const STATUS_TABS = [
  { key: "ALL", label: "Tất cả", dotColor: "bg-slate-400" },
  {
    key: "DA_DUYET",
    label: "Đang hiển thị / Đã duyệt",
    dotColor: "bg-success",
  },
  { key: "CHO_DUYET", label: "Chờ duyệt", dotColor: "bg-warning" },
  { key: "HET_HAN", label: "Hết hạn", dotColor: "bg-danger" },
  { key: "DA_AN", label: "Đã ẩn / Tạm dừng", dotColor: "bg-slate-400" },
  { key: "TU_CHUOI", label: "Bị từ chối", dotColor: "bg-danger" },
  { key: "NHAP", label: "Nháp", dotColor: "bg-slate-400" },
] as const;

function EmployerJobsSkeleton() {
  return (
    <div className="flex flex-col w-full gap-6 pb-12 p-6 md:p-8 max-w-7xl mx-auto">
      <div className="h-14 w-72 bg-surface-subtle rounded-xl animate-pulse" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </div>
      <div className="bg-surface-card rounded-xl border border-border-default p-6 space-y-3">
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
        <TableRowSkeleton />
      </div>
    </div>
  );
}

function JobManagementContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page")) || 1;
  const currentStatus = searchParams.get("status") || "ALL";
  const urlSearch = searchParams.get("search") || "";
  const currentSortBy = searchParams.get("sortBy") || "newest";

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const [repostModal, setRepostModal] = useState<{
    isOpen: boolean;
    jobId: string;
    jobTitle: string;
  }>({ isOpen: false, jobId: "", jobTitle: "" });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    jobId: string;
    jobTitle: string;
  }>({ isOpen: false, jobId: "", jobTitle: "" });

  const {
    data: jobsResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useEmployerJobs({
    page: currentPage,
    limit: 10,
    search: urlSearch,
    status: currentStatus,
    sortBy: currentSortBy,
  });

  const { mutate: toggleVisibility } = useToggleJobVisibility();
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteEmployerJob();

  const updateQueryParam = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (
        value === null ||
        value === "" ||
        (key === "status" && value === "ALL")
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTabChange = (status: string) => {
    updateQueryParam({ status, page: 1 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQueryParam({ search: searchInput.trim(), page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput("");
    updateQueryParam({ search: null, page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateQueryParam({ sortBy: e.target.value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateQueryParam({ page: newPage });
  };

  const counts = jobsResponse?.countsByStatus || {
    ALL: 0,
    DA_DUYET: 0,
    CHO_DUYET: 0,
    HET_HAN: 0,
    DA_AN: 0,
    TU_CHUOI: 0,
    NHAP: 0,
  };

  const totalPages = jobsResponse?.meta?.totalPages || 1;
  const jobList = jobsResponse?.data || [];

  return (
    <div className="flex flex-col w-full gap-6 pb-12 p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            Quản lý bài đăng tuyển dụng
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Theo dõi tình trạng kiểm duyệt, hạn nộp hồ sơ và hiệu suất tuyển
            dụng của các vị trí.
          </p>
        </div>

        <Link
          href="/post-job"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors w-fit"
        >
          <Plus size={18} />
          <span>Tạo tin tuyển dụng</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-card rounded-xl p-4 border border-border-default shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-text-muted font-semibold uppercase tracking-wider block">
              Tổng số tin
            </span>
            <span className="text-2xl font-bold text-text-main">
              {counts.ALL}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-light text-primary flex items-center justify-center">
            <Briefcase size={19} />
          </div>
        </div>

        <div className="bg-surface-card rounded-xl p-4 border border-border-default shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-success-text font-semibold uppercase tracking-wider block">
              Đang hiển thị
            </span>
            <span className="text-2xl font-bold text-success-text">
              {counts.DA_DUYET}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-success-light text-success-text flex items-center justify-center">
            <BadgeCheck size={19} />
          </div>
        </div>

        <div className="bg-surface-card rounded-xl p-4 border border-border-default shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-warning-text font-semibold uppercase tracking-wider block">
              Chờ duyệt
            </span>
            <span className="text-2xl font-bold text-warning-text">
              {counts.CHO_DUYET}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-warning-light text-warning-text flex items-center justify-center">
            <Clock size={19} />
          </div>
        </div>

        <div className="bg-surface-card rounded-xl p-4 border border-border-default shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-danger-text font-semibold uppercase tracking-wider block">
              Hết hạn
            </span>
            <span className="text-2xl font-bold text-danger-text">
              {counts.HET_HAN}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-danger-soft text-danger-text flex items-center justify-center">
            <RotateCcw size={19} />
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl border border-border-default shadow-xs p-4 space-y-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border-subtle scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isSelected = currentStatus === tab.key;
            const count = counts[tab.key as keyof typeof counts] ?? 0;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleTabChange(tab.key)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-surface-subtle hover:text-text-main"
                }`}
              >
                {!isSelected && (
                  <span className={`w-2 h-2 rounded-full ${tab.dotColor}`} />
                )}
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSelected
                      ? "bg-white/25 text-white"
                      : "bg-surface-subtle text-text-muted"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md"
          >
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tiêu đề tin, vị trí, thành phố..."
              className="w-full h-10 pl-10 pr-9 text-xs bg-surface-subtle border border-border-default rounded-lg outline-none focus:bg-surface-card focus:ring-2 focus:ring-primary/15 focus:border-primary transition-all text-text-main"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-subtle hover:text-text-main p-0.5 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2">
            <ListFilter size={15} className="text-text-subtle" />
            <select
              value={currentSortBy}
              onChange={handleSortChange}
              className="h-10 text-xs font-semibold text-text-main bg-surface-subtle border border-border-default rounded-lg px-3 outline-none focus:bg-surface-card focus:border-primary cursor-pointer"
            >
              <option value="newest">Mới đăng nhất</option>
              <option value="expiring_soon">Sắp hết hạn</option>
              <option value="most_viewed">Lượt xem nhiều nhất</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-card rounded-xl shadow-xs border border-border-default overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="p-6 space-y-3">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </div>
        ) : isError ? (
          <div className="p-6">
            <ErrorState
              title="Đã xảy ra lỗi khi tải danh sách tin"
              message={
                error?.message ||
                "Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau."
              }
              onRetry={() => void refetch()}
            />
          </div>
        ) : jobList.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<FileQuestion size={26} />}
              title="Không tìm thấy tin tuyển dụng nào"
              description={
                urlSearch || currentStatus !== "ALL"
                  ? "Không có tin nào phù hợp với bộ lọc hiện tại. Hãy thử xóa bộ lọc hoặc đổi từ khóa."
                  : "Doanh nghiệp của bạn chưa tạo bài đăng tuyển dụng nào."
              }
              actionLabel={
                urlSearch || currentStatus !== "ALL"
                  ? "Xóa bộ lọc"
                  : "Đăng tin tuyển dụng mới"
              }
              actionHref={
                urlSearch || currentStatus !== "ALL" ? undefined : "/post-job"
              }
              onAction={
                urlSearch || currentStatus !== "ALL"
                  ? () => router.push(pathname)
                  : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-220">
              <thead>
                <tr className="bg-surface-subtle/80 border-b border-border-default text-text-muted text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3.5 px-5">Vị trí tuyển dụng</th>
                  <th className="py-3.5 px-4">Thời gian &amp; Hạn nộp</th>
                  <th className="py-3.5 px-4 text-center">Hồ sơ ứng tuyển</th>
                  <th className="py-3.5 px-4 text-center">Trạng thái</th>
                  <th className="py-3.5 px-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle text-xs">
                {jobList.map((job: EmployerJobListItem) => {
                  const isApproved =
                    job.status === "DA_DUYET" || job.status === "Đang tuyển";
                  const isPending =
                    job.status === "CHO_DUYET" || job.status === "Chờ duyệt";
                  const isExpired = job.isExpired || job.status === "HET_HAN";
                  const isHidden =
                    job.status === "DA_AN" || job.status === "Đã ẩn";

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-surface-subtle/60 transition-colors group"
                    >
                      <td className="py-4 px-5 align-top">
                        <div className="flex flex-col gap-1.5 max-w-sm">
                          <Link
                            href={`/jobs/${job.slug}`}
                            target="_blank"
                            className="text-sm font-bold text-text-main hover:text-primary transition-colors line-clamp-2 leading-snug inline-flex items-center gap-1"
                          >
                            <span>{job.title}</span>
                            <ExternalLink
                              size={12}
                              className="opacity-0 group-hover:opacity-70 transition-opacity shrink-0"
                            />
                          </Link>

                          <div className="flex flex-wrap items-center gap-2 text-text-muted text-[11px]">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {job.branch?.city || job.city || "Toàn quốc"}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-success-text">
                              {job.salaryDisplay}
                            </span>
                            <span>•</span>
                            <span>{job.jobType}</span>
                          </div>

                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {job.skills.slice(0, 4).map((s) => (
                                <span
                                  key={s.id}
                                  className="bg-surface-subtle text-text-secondary text-[10px] font-medium px-2 py-0.5 rounded-full border border-border-subtle"
                                >
                                  {s.name}
                                </span>
                              ))}
                              {job.skills.length > 4 && (
                                <span className="text-[10px] text-text-muted font-medium px-1">
                                  +{job.skills.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top text-text-secondary">
                        <div className="flex flex-col gap-1 leading-snug">
                          <span className="text-[11px] text-text-muted">
                            Đăng: {formatDateVN(job.postedAt)}
                          </span>
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              isExpired ? "text-danger-text" : "text-text-main"
                            }`}
                          >
                            <Calendar size={13} />
                            Hạn:{" "}
                            {job.deadline
                              ? formatDateVN(job.deadline)
                              : "Không giới hạn"}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Link
                            href="/applications"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary-light hover:bg-primary/15 text-primary font-semibold rounded-lg transition-colors"
                            title="Xem danh sách ứng viên đã nộp"
                          >
                            <Users size={13} />
                            <span>{job.applicationsCount} CV</span>
                          </Link>
                          <span className="text-[11px] text-text-muted flex items-center gap-1">
                            <Eye size={12} /> {job.views} lượt xem
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top text-center">
                        <StatusBadge
                          type="job"
                          status={
                            isExpired
                              ? "HET_HAN"
                              : isApproved
                                ? "ACTIVE"
                                : isPending
                                  ? "CHO_DUYET"
                                  : isHidden
                                    ? "TAM_DUNG"
                                    : job.status
                          }
                        />
                      </td>

                      <td className="py-4 px-5 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {(isExpired || isHidden) && (
                            <button
                              type="button"
                              onClick={() =>
                                setRepostModal({
                                  isOpen: true,
                                  jobId: job.id,
                                  jobTitle: job.title,
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg bg-success hover:bg-success/90 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Gia hạn hoặc đăng lại tin này"
                            >
                              <RotateCcw size={13} />
                              <span>Đăng lại</span>
                            </button>
                          )}

                          <Link
                            href={`/employer-jobs/${job.id}/edit`}
                            className="p-1.5 text-text-muted hover:text-primary hover:bg-primary-light rounded-lg transition-colors"
                            title="Chỉnh sửa tin tuyển dụng"
                          >
                            <Pencil size={15} />
                          </Link>

                          <button
                            type="button"
                            onClick={() => toggleVisibility(job.id)}
                            className="p-1.5 text-text-muted hover:text-text-main hover:bg-surface-subtle rounded-lg transition-colors cursor-pointer"
                            title={
                              isHidden ? "Hiện lại tin" : "Tạm dừng hiển thị"
                            }
                          >
                            <EyeOff size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                jobId: job.id,
                                jobTitle: job.title,
                              })
                            }
                            className="p-1.5 text-text-subtle hover:text-danger-text hover:bg-danger-soft rounded-lg transition-colors cursor-pointer"
                            title="Xóa tin tuyển dụng"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && !isError && jobList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-surface-subtle/60 border-t border-border-subtle gap-4">
            <div className="text-xs text-text-muted">
              Trang <strong className="text-text-main">{currentPage}</strong> /{" "}
              {totalPages} • Tổng cộng{" "}
              <strong className="text-text-main">
                {jobsResponse?.meta?.total || 0}
              </strong>{" "}
              tin tuyển dụng
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-default bg-surface-card text-text-secondary hover:bg-surface-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1,
                )
                .map((p, idx, arr) => {
                  const showEllipsisBefore = idx > 0 && p - arr[idx - 1] > 1;
                  return (
                    <React.Fragment key={p}>
                      {showEllipsisBefore && (
                        <span className="px-1 text-text-subtle">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          currentPage === p
                            ? "bg-primary text-white"
                            : "bg-surface-card border border-border-default text-text-main hover:bg-surface-subtle"
                        }`}
                      >
                        {p}
                      </button>
                    </React.Fragment>
                  );
                })}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-border-default bg-surface-card text-text-secondary hover:bg-surface-subtle transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <RepostJobModal
        isOpen={repostModal.isOpen}
        jobId={repostModal.jobId}
        jobTitle={repostModal.jobTitle}
        onClose={() =>
          setRepostModal({ isOpen: false, jobId: "", jobTitle: "" })
        }
      />

      <DeleteJobModal
        isOpen={deleteModal.isOpen}
        jobId={deleteModal.jobId}
        jobTitle={deleteModal.jobTitle}
        isLoading={isDeleting}
        onClose={() =>
          setDeleteModal({ isOpen: false, jobId: "", jobTitle: "" })
        }
        onConfirm={() => {
          deleteJob(deleteModal.jobId, {
            onSuccess: () => {
              setDeleteModal({ isOpen: false, jobId: "", jobTitle: "" });
            },
          });
        }}
      />
    </div>
  );
}

export default function JobManagementPage() {
  return (
    <Suspense fallback={<EmployerJobsSkeleton />}>
      <JobManagementContent />
    </Suspense>
  );
}
