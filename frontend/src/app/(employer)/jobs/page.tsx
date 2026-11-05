"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  FileQuestion,
  Loader2,
  Clock,
  Sparkles,
  BadgeCheck,
  CheckCircle,
} from "lucide-react";
import {
  useEmployerJobs,
  useToggleJobVisibility,
  useDeleteEmployerJob,
} from "@/hooks/recruiter/useEmployerJobs";
import { useJobMetrics } from "@/hooks/recruiter/useJobMetrics";
import RepostJobModal from "@/components/employer/RepostJobModal";
import DeleteJobModal from "@/components/employer/DeleteJobModal";
import { formatDateToDDMMYYYY } from "@/utils/date";
import type { EmployerJobListItem } from "@viecngon/types";

// Danh sách Tabs trạng thái chuẩn UI
const STATUS_TABS = [
  { key: "ALL", label: "Tất cả", dotColor: "bg-slate-400" },
  { key: "DA_DUYET", label: "Đang hiển thị / Đã duyệt", dotColor: "bg-emerald-500" },
  { key: "CHO_DUYET", label: "Chờ duyệt", dotColor: "bg-amber-500" },
  { key: "HET_HAN", label: "Hết hạn", dotColor: "bg-rose-500" },
  { key: "DA_AN", label: "Đã ẩn / Tạm dừng", dotColor: "bg-slate-400" },
  { key: "TU_CHUOI", label: "Bị từ chối", dotColor: "bg-red-600" },
  { key: "NHAP", label: "Nháp", dotColor: "bg-zinc-400" },
] as const;

export default function JobManagementPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // URL-driven query states
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentStatus = searchParams.get("status") || "ALL";
  const urlSearch = searchParams.get("search") || "";
  const currentSortBy = searchParams.get("sortBy") || "newest";

  // Local state for search input
  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  // Modals state
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

  // API Hooks
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

  const { data: metrics } = useJobMetrics();
  const { mutate: toggleVisibility, isPending: isToggling } =
    useToggleJobVisibility();
  const { mutate: deleteJob, isPending: isDeleting } = useDeleteEmployerJob();

  // Navigation / Query string helpers
  const updateQueryParam = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || (key === "status" && value === "ALL")) {
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
      {/* =========================================
          1. HEADER & ACTIONS
      ========================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2.5">
            Quản lý bài đăng tuyển dụng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi tình trạng kiểm duyệt, hạn nộp hồ sơ và hiệu suất tuyển dụng của các vị trí.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/post-job"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-hover active:scale-95 transition-all"
          >
            <Plus size={18} />
            <span>Tạo tin tuyển dụng</span>
          </Link>
        </div>
      </div>

      {/* =========================================
          2. METRIC SUMMARY STRIP
      ========================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Tổng số tin
            </span>
            <span className="text-2xl font-extrabold text-slate-800">
              {counts.ALL}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
            <Briefcase size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-emerald-200/80 bg-emerald-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider block">
              Đang hiển thị
            </span>
            <span className="text-2xl font-extrabold text-emerald-700">
              {counts.DA_DUYET}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <BadgeCheck size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-amber-200/80 bg-amber-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider block">
              Chờ duyệt
            </span>
            <span className="text-2xl font-extrabold text-amber-700">
              {counts.CHO_DUYET}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-rose-200/80 bg-rose-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-700 font-semibold uppercase tracking-wider block">
              Hết hạn
            </span>
            <span className="text-2xl font-extrabold text-rose-700">
              {counts.HET_HAN}
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <RotateCcw size={20} />
          </div>
        </div>
      </div>

      {/* =========================================
          3. STATUS TABS BAR (BADGE BAR)
      ========================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
        {/* Horizontal Status Tabs with Count Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 scrollbar-none">
          {STATUS_TABS.map((tab) => {
            const isSelected = currentStatus === tab.key;
            const count = counts[tab.key as keyof typeof counts] ?? 0;

            return (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white shadow-sm shadow-primary/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
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
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex-1 max-w-md"
          >
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm theo tiêu đề tin, vị trí, thành phố..."
              className="w-full pl-10 pr-9 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-800"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </form>

          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center gap-1.5">
              <ListFilter size={15} className="text-slate-400" />
              <select
                value={currentSortBy}
                onChange={handleSortChange}
                className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                <option value="newest">Mới đăng nhất</option>
                <option value="expiring_soon">Sắp hết hạn</option>
                <option value="most_viewed">Lượt xem nhiều nhất</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          4. JOB DATA TABLE
      ========================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-20 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="py-16 px-6 text-center">
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Đã xảy ra lỗi khi tải danh sách tin
            </h3>
            <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
              {error?.message || "Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau."}
            </p>
            <button
              onClick={() => refetch()}
              className="px-5 py-2 text-xs font-bold bg-primary text-white rounded-lg shadow-sm hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Thử lại ngay
            </button>
          </div>
        ) : jobList.length === 0 ? (
          /* Empty State */
          <div className="py-16 px-6 text-center">
            <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <FileQuestion size={32} />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Không tìm thấy tin tuyển dụng nào
            </h3>
            <p className="text-xs text-slate-500 mb-5 max-w-sm mx-auto">
              {urlSearch || currentStatus !== "ALL"
                ? "Không có tin nào phù hợp với bộ lọc hiện tại. Bạn hãy thử xóa bớt từ khóa hoặc chọn trạng thái khác."
                : "Doanh nghiệp của bạn chưa tạo bài đăng tuyển dụng nào. Hãy bắt đầu ngay để tìm kiếm nhân tài!"}
            </p>
            <div className="flex items-center justify-center gap-3">
              {(urlSearch || currentStatus !== "ALL") && (
                <button
                  type="button"
                  onClick={() => router.push(pathname)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Xóa bộ lọc
                </button>
              )}
              <Link
                href="/post-job"
                className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary-hover rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Plus size={15} />
                <span>Đăng tin tuyển dụng mới</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Data Table */
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-220">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-5">Vị trí tuyển dụng</th>
                  <th className="py-4 px-4">Thời gian & Hạn nộp</th>
                  <th className="py-4 px-4 text-center">Hồ sơ ứng tuyển</th>
                  <th className="py-4 px-4 text-center">Trạng thái</th>
                  <th className="py-4 px-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
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
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Tiêu đề & Thông tin */}
                      <td className="py-4 px-5 align-top">
                        <div className="flex flex-col gap-1.5 max-w-sm">
                          <Link
                            href={`/jobs/${job.slug}`}
                            target="_blank"
                            className="text-sm font-bold text-slate-800 hover:text-primary transition-colors line-clamp-2 leading-snug group-hover:text-primary flex items-center gap-1"
                          >
                            <span>{job.title}</span>
                            <ExternalLink
                              size={12}
                              className="opacity-0 group-hover:opacity-70 transition-opacity shrink-0"
                            />
                          </Link>

                          <div className="flex flex-wrap items-center gap-2 text-slate-500 text-[11px]">
                            <span className="flex items-center gap-1">
                              <MapPin size={12} />
                              {job.branch?.city || job.city || "Toàn quốc"}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-primary">
                              {job.salaryDisplay}
                            </span>
                            <span>•</span>
                            <span>{job.jobType}</span>
                          </div>

                          {/* Tech Stack Skills Badges */}
                          {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {job.skills.slice(0, 4).map((s) => (
                                <span
                                  key={s.id}
                                  className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                                >
                                  {s.name}
                                </span>
                              ))}
                              {job.skills.length > 4 && (
                                <span className="text-[10px] text-slate-400 font-medium px-1">
                                  +{job.skills.length - 4}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Thời gian */}
                      <td className="py-4 px-4 align-top text-slate-600">
                        <div className="flex flex-col gap-1 leading-snug">
                          <span className="text-[11px] text-slate-400">
                            Đăng: {formatDateToDDMMYYYY(job.postedAt)}
                          </span>
                          <span
                            className={`font-semibold flex items-center gap-1 ${
                              isExpired ? "text-rose-600" : "text-slate-700"
                            }`}
                          >
                            <Calendar size={13} />
                            Hạn: {job.deadline ? formatDateToDDMMYYYY(job.deadline) : "Không giới hạn"}
                          </span>
                          {isExpired && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-500 mt-0.5">
                              ⚠️ Đã quá hạn nhận hồ sơ
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Hồ sơ & Lượt xem */}
                      <td className="py-4 px-4 align-top text-center">
                        <div className="flex flex-col items-center gap-1">
                          <Link
                            href={`/employer/applications?jobId=${job.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-lg transition-colors"
                            title="Xem danh sách ứng viên đã nộp"
                          >
                            <Users size={13} />
                            <span>{job.applicationsCount} CV</span>
                          </Link>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Eye size={12} /> {job.views} lượt xem
                          </span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-4 px-4 align-top text-center">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            Hết hạn
                          </span>
                        ) : isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Đang hiển thị
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Chờ duyệt
                          </span>
                        ) : isHidden ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            Đã tạm ẩn
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            {job.status}
                          </span>
                        )}
                      </td>

                      {/* Menu thao tác nhanh */}
                      <td className="py-4 px-5 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Nút Đăng lại / Gia hạn nổi bật cho tin Hết hạn hoặc Đã ẩn */}
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
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                              title="Gia hạn hoặc đăng lại tin này"
                            >
                              <RotateCcw size={13} />
                              <span>Đăng lại</span>
                            </button>
                          )}

                          {/* Sửa tin */}
                          <Link
                            href={`/employer/jobs/${job.id}/edit`}
                            className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                            title="Chỉnh sửa tin tuyển dụng"
                          >
                            <Pencil size={15} />
                          </Link>

                          {/* Ẩn / Hiện tin */}
                          <button
                            type="button"
                            onClick={() => toggleVisibility(job.id)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title={isHidden ? "Hiện lại tin" : "Tạm dừng hiển thị"}
                          >
                            <EyeOff size={15} />
                          </button>

                          {/* Xóa tin */}
                          <button
                            type="button"
                            onClick={() =>
                              setDeleteModal({
                                isOpen: true,
                                jobId: job.id,
                                jobTitle: job.title,
                              })
                            }
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

        {/* =========================================
            5. PAGINATION BAR
        ========================================== */}
        {!isLoading && !isError && jobList.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100 gap-4">
            <div className="text-xs text-slate-500">
              Trang <strong className="text-slate-800">{currentPage}</strong> /{" "}
              {totalPages} • Tổng cộng{" "}
              <strong className="text-slate-800">
                {jobsResponse?.meta?.total || 0}
              </strong>{" "}
              tin tuyển dụng
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
                        <span className="px-1 text-slate-400">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => handlePageChange(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          currentPage === p
                            ? "bg-primary text-white shadow-xs"
                            : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
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
                className="w-8 h-8 rounded-lg flex items-center justify-center border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* =========================================
          6. MODALS
      ========================================== */}
      <RepostJobModal
        isOpen={repostModal.isOpen}
        jobId={repostModal.jobId}
        jobTitle={repostModal.jobTitle}
        onClose={() => setRepostModal({ isOpen: false, jobId: "", jobTitle: "" })}
      />

      <DeleteJobModal
        isOpen={deleteModal.isOpen}
        jobId={deleteModal.jobId}
        jobTitle={deleteModal.jobTitle}
        isLoading={isDeleting}
        onClose={() => setDeleteModal({ isOpen: false, jobId: "", jobTitle: "" })}
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
