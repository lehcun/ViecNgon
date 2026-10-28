"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRecruiterProfile } from "@/hooks/recruiter/useRecruiterProfile";
import { useRemoveJob } from "@/hooks/job/useRemoveJob";
import { formatDateToDDMMYYYY } from "@/utils/date";
import { DashboardJobItem } from "@viecngon/types";
import toast from "react-hot-toast";
import {
  Download,
  Plus,
  Briefcase,
  ArrowUp,
  BadgeCheck,
  Hourglass,
  Clock,
  Users,
  TrendingUp,
  Zap,
  Search,
  Code,
  ListFilter,
  MapPin,
  Timer,
  Pencil,
  RefreshCw,
  EyeOff,
  Trash2,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronLeft,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useJobMetrics } from "@/hooks/recruiter/useJobMetrics";

const EmployerMainContent = () => {
  // ================= HOOKS & STATE =================
  const { recruiterProfile: recruiter, isLoading: isLoadingProfile } =
    useRecruiterProfile();
  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    isError,
  } = useJobMetrics();
  const { mutate: removeJob } = useRemoveJob();

  const currentTime =
    metrics || recruiter
      ? `Cập nhật lúc: ${new Date().toLocaleTimeString("vi-VN")}`
      : "Đang cập nhật...";

  // State quản lý Modal Xóa
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    jobId: "",
    jobTitle: "",
  });
  const [isConfirmDeleteChecked, setIsConfirmDeleteChecked] = useState(false);

  // ================= XỬ LÝ HÀNH ĐỘNG =================
  const openDeleteModal = (jobId: string, jobTitle: string) => {
    setDeleteModal({ isOpen: true, jobId, jobTitle });
    setIsConfirmDeleteChecked(false);
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, jobId: "", jobTitle: "" });
  };

  const executeDelete = () => {
    if (!deleteModal.jobId) return;

    removeJob(deleteModal.jobId, {
      onSuccess: () => {
        toast.success("Đã xóa tin tuyển dụng thành công!");
        closeDeleteModal();
      },
      onError: (error) => {
        toast.error(error.message || "Có lỗi xảy ra khi xóa!");
      },
    });
  };

  // ================= RENDER TRẠNG THÁI =================
  if (isError) {
    return (
      <div className="p-6 text-center text-rose-500 font-medium bg-white rounded-xl shadow-sm border border-slate-100">
        Lỗi tải dữ liệu bảng điều khiển. Vui lòng tải lại trang.
      </div>
    );
  }

  if (isLoadingProfile || isLoadingMetrics) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-16 bg-slate-100 rounded-xl"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl"></div>
          ))}
        </div>
        <div className="h-96 bg-slate-100 rounded-xl"></div>
      </div>
    );
  }

  const companyName = recruiter?.company?.name || "Doanh nghiệp";

  return (
    <div className="flex flex-col w-full gap-6 pb-12">
      {/* =========================================
          1. HEADER & QUICK ACTIONS
      ========================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
              Quản lý tin tuyển dụng
            </h1>
            <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20 line-clamp-1 max-w-[150px]">
              {companyName}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1.5 flex items-center gap-2">
            Theo dõi, chỉnh sửa và quản lý hiệu quả bài đăng của doanh nghiệp.
            <span className="hidden sm:inline-block text-slate-300">|</span>
            <span className="font-medium">{currentTime}</span>
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm hover:bg-slate-50 transition-all">
            <Download size={18} className="text-slate-500" />
            <span>Xuất báo cáo</span>
          </button>
          <Link
            href="/post-job"
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 hover:bg-primary-hover transition-all active:scale-95"
          >
            <Plus size={20} />
            <span>Tạo tin tuyển dụng</span>
          </Link>
        </div>
      </div>

      {/* =========================================
          2. METRIC OVERVIEW CARDS
      ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-semibold">
              Tổng số tin đăng
            </span>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {metrics?.totalJobs?.count ||
                  recruiter?.statistics?.totalJobs ||
                  0}
              </span>
              <span className="text-sm text-slate-500 font-medium">tin</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <TrendingUp size={14} />
              <span>
                +{(metrics?.totalJobs as any)?.changeThisMonth || 1} tháng này
              </span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-semibold">
              Đang hiển thị
            </span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <BadgeCheck size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {metrics?.activeJobs?.count || 0}
              </span>
              <span className="text-sm text-slate-500 font-medium">vị trí</span>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-full text-emerald-700 text-[11px] font-bold border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Đang hoạt động</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-orange-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-semibold">
              Chờ kiểm duyệt
            </span>
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
              <Hourglass size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {metrics?.pendingJobs?.count || 0}
              </span>
              <span className="text-sm text-slate-500 font-medium">tin</span>
            </div>
            <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold">
              <Clock size={14} />
              <span>
                {metrics?.pendingJobs?.avgReviewTimeText || "~2h xét duyệt"}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 font-semibold">
              Tổng hồ sơ ứng tuyển
            </span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {metrics?.totalApplications?.count ||
                  recruiter?.statistics?.totalApplications ||
                  0}
              </span>
              <span className="text-sm text-slate-500 font-medium">CV</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
              <ArrowUp size={14} />
              <span>
                +{metrics?.totalApplications?.percentChangeThisWeek || 12}% tuần
                này
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================
          3. FILTER TABS & SEARCH
      ========================================== */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-col gap-5">
        {/* Filter Tabs Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <button className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold flex items-center gap-2 shadow-sm">
              <span>Tất cả</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-bold">
                {recruiter?.jobs?.list?.length || 0}
              </span>
            </button>
            <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-sm font-semibold flex items-center gap-2 transition-all">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Đang tuyển</span>
            </button>
            <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-sm font-semibold flex items-center gap-2 transition-all">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>Chờ duyệt</span>
            </button>
            <button className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-200 text-sm font-semibold flex items-center gap-2 transition-all">
              <span className="w-2 h-2 rounded-full bg-slate-400"></span>
              <span>Đã đóng</span>
            </button>
          </div>
          <div className="hidden xl:flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
            <Zap size={18} className="text-orange-400 fill-orange-400" />
            <span>
              Tỷ lệ phản hồi:{" "}
              <strong className="text-slate-800">
                {metrics?.averageResponseRate || 94.2}%
              </strong>{" "}
              trong 24 giờ
            </span>
          </div>
        </div>

        {/* Inputs Row */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 min-w-70">
            <Search
              size={20}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder="Tìm theo tiêu đề công việc, kỹ năng, vị trí..."
              type="text"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Code size={18} className="text-slate-400" />
              <span>Tech Stack</span>
              <ChevronRight size={16} className="text-slate-400 rotate-90" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <ListFilter size={18} className="text-slate-400" />
              <span>Mới nhất</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          4. JOB MANAGEMENT DATA TABLE
      ========================================== */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[960px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Tiêu đề công việc & Vị trí
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Hồ sơ & Tương tác
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="py-4 px-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!recruiter?.jobs?.list || recruiter.jobs.list.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    Chưa có tin tuyển dụng nào được đăng.
                  </td>
                </tr>
              ) : (
                recruiter.jobs.list.map((job: DashboardJobItem) => {
                  const isActive =
                    job.status === "Đang nhận hồ sơ" ||
                    job.status === "Active" ||
                    job.status === "DANG_TUYEN";
                  const isPending =
                    job.status === "Chờ duyệt" || job.status === "CHO_DUYET";

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-50 transition-colors group"
                    >
                      {/* Tiêu đề & Vị trí */}
                      <td className="py-5 px-5">
                        <div className="flex flex-col gap-2 max-w-[340px]">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-base font-bold text-slate-800 hover:text-primary transition-colors line-clamp-2"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
                            <span className="flex items-center gap-1">
                              <MapPin size={14} /> {job.location || "Toàn quốc"}
                            </span>
                          </div>
                          {/* Mock Data Stack cho đẹp layout, bạn có thể thay bằng job.skills nếu API có */}
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {job.skills?.map((skill) => (
                              <span
                                key={skill}
                                className="bg-primary/10 text-primary px-2 py-0.5 rounded text-[11px] font-bold"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Thời gian */}
                      <td className="py-5 px-5 align-top pt-6">
                        <div className="flex flex-col gap-1 text-sm text-slate-600 font-medium">
                          <span>
                            Đăng: {formatDateToDDMMYYYY(job.postedAt)}
                          </span>
                          <span className="text-slate-400">
                            Hạn: {formatDateToDDMMYYYY(job.deadline)}
                          </span>
                          {isActive && (
                            <span className="text-emerald-600 font-bold flex items-center gap-1 mt-1 text-xs">
                              <Timer size={14} /> Còn hạn
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Hồ sơ */}
                      <td className="py-5 px-5 align-top pt-6">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-extrabold text-slate-800">
                              {job.applicationsCount || 0}
                            </span>
                            <span className="text-sm text-slate-500 font-medium">
                              ứng viên
                            </span>
                          </div>
                          <span className="text-slate-500 text-xs font-medium flex items-center gap-1.5">
                            <Eye size={14} className="text-slate-400" />{" "}
                            {job.views || 0} lượt xem
                          </span>
                        </div>
                      </td>

                      {/* Trạng thái */}
                      <td className="py-5 px-5 align-top pt-6">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs px-3 py-1.5 rounded-full font-bold border border-emerald-100">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Đang tuyển
                          </span>
                        ) : isPending ? (
                          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-bold border border-primary/20">
                            <span className="w-2 h-2 rounded-full bg-primary"></span>
                            Chờ duyệt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs px-3 py-1.5 rounded-full font-bold border border-slate-200">
                            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                            Đã đóng
                          </span>
                        )}
                      </td>

                      {/* Thao tác */}
                      <td className="py-5 px-5 text-right align-top pt-5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/employer/applications?jobId=${job.id}`}
                            className="px-3.5 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors"
                          >
                            Xem ứng viên
                          </Link>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Đăng lại / Làm mới"
                          >
                            <RefreshCw size={18} />
                          </button>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                            title="Tạm dừng hiển thị"
                          >
                            <EyeOff size={18} />
                          </button>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                            onClick={() => openDeleteModal(job.id, job.title)}
                            title="Xóa bài đăng"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 bg-slate-50 border-t border-slate-100 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Hiển thị</span>
            <span className="font-bold text-slate-800">
              {recruiter?.jobs?.list?.length ? 1 : 0} -{" "}
              {recruiter?.jobs?.list?.length || 0}
            </span>
            <span>
              trên tổng số{" "}
              <strong className="text-slate-800">
                {recruiter?.statistics?.totalJobs || 0}
              </strong>{" "}
              bài đăng
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-40"
              disabled
            >
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-sm font-bold flex items-center justify-center shadow-sm">
              1
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors disabled:opacity-40"
              disabled
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* =========================================
          5. BOTTOM TIP
      ========================================== */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Sparkles size={24} />
          </div>
          <div>
            <h4 className="text-base text-slate-800 font-bold mb-1">
              Tối ưu tin tuyển dụng với ViecNgon AI Screener
            </h4>
            <p className="text-sm text-slate-500">
              Bài đăng có đầy đủ Tech Stack và mức lương minh bạch có tỷ lệ nhận
              hồ sơ phù hợp cao hơn 45%.
            </p>
          </div>
        </div>
        <button className="whitespace-nowrap px-6 py-2.5 rounded-lg bg-white border border-slate-200 text-primary font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors">
          Tìm hiểu thêm
        </button>
      </div>

      {/* =========================================
          MODAL XÓA BÀI ĐĂNG (CUSTOM UI)
      ========================================== */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative overflow-hidden flex flex-col gap-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-100">
                <AlertTriangle size={26} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-slate-800">
                  Xác nhận xóa bài đăng
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                  Bạn có chắc chắn muốn xóa tin tuyển dụng:
                  <span className="font-bold text-slate-800 block mt-2 py-1.5 px-3 bg-slate-50 border border-slate-100 rounded-md">
                    {deleteModal.jobTitle}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600 flex items-start gap-3">
              <Info size={20} className="text-slate-400 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Hành động này không thể hoàn tác. Toàn bộ thông tin ứng viên và
                dữ liệu liên quan đến tin đăng này sẽ bị xóa khỏi hệ thống.
              </span>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mt-2 select-none group">
              <input
                type="checkbox"
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-rose-500 focus:ring-rose-500 cursor-pointer"
                checked={isConfirmDeleteChecked}
                onChange={(e) => setIsConfirmDeleteChecked(e.target.checked)}
              />
              <span className="text-sm text-slate-700 group-hover:text-slate-900 font-medium transition-colors">
                Tôi hiểu các rủi ro và xác nhận muốn tiếp tục
              </span>
            </label>

            <div className="flex items-center justify-end gap-3 mt-4 border-t border-slate-100 pt-6">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={executeDelete}
                disabled={!isConfirmDeleteChecked}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${
                  isConfirmDeleteChecked
                    ? "bg-rose-600 text-white hover:bg-rose-700 shadow-md shadow-rose-600/20"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"
                }`}
              >
                <Trash2 size={18} />
                Xóa bài đăng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerMainContent;
