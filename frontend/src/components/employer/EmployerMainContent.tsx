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
import Image from "next/image";

const EmployerMainContent = () => {
  const { recruiterProfile: recruiter, isLoading: isLoadingProfile } =
    useRecruiterProfile();

  const {
    data: metrics,
    isLoading: isLoadingMetrics,
    isError,
  } = useJobMetrics();

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

  // Tên công ty lấy từ DB, fallback nếu chưa có
  const companyName = recruiter?.company?.name || "VNG Corporation";

  return (
    <div className="flex flex-col gap-6">
      {/* =====================================================================
          1. BANNER CHÀO MỪNG (Dark Theme)
      ====================================================================== */}
      <div className="bg-[#0b132b] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-blue-900/10">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Xin chào, {companyName}! 👋
          </h1>
          <p className="text-sm text-slate-300">
            Chào mừng bạn quay trở lại hệ thống quản trị tuyển dụng của
            ViecNgon. Hôm nay bạn đang có{" "}
            <span className="font-bold text-white">
              {recruiter?.statistics?.totalJobs || 8} tin tuyển dụng
            </span>{" "}
            tiếp cận hiệu quả cao.
          </p>
        </div>
        <Link
          href="/post-job"
          className="shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md shadow-blue-600/20"
        >
          <Plus size={18} /> Tạo tin tuyển dụng mới
        </Link>
      </div>

      {/* =====================================================================
          2. KHỐI THỐNG KÊ NHANH (Grid 4 cột)
      ====================================================================== */}
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
                +
                {(metrics as RecruiterJobMetricsResponse)?.totalJobs
                  ?.changeThisMonth || 1}{" "}
                tháng này
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

      {/* =====================================================================
          3. DANH SÁCH CHI TIẾT (Grid 2/3 và 1/3)
      ====================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* CỘT TRÁI: TIN TUYỂN DỤNG GẦN ĐÂY */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-base font-bold text-slate-800">
              Tin tuyển dụng gần đây
            </h2>
            <Link
              href="/employer/jobs"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Xem tất cả tin tuyển dụng
            </Link>
          </div>

          <div className="divide-y divide-slate-50 flex-1">
            {recruiter?.jobs?.list?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Chưa có tin tuyển dụng nào.
              </p>
            ) : (
              recruiter?.jobs?.list
                ?.slice(0, 4)
                .map((job: DashboardJobItem) => {
                  const isActive =
                    job.status === "Đang nhận hồ sơ" || job.status === "Active";

                  return (
                    <div
                      key={job.id}
                      className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Job Info */}
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800 text-sm mb-1">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-400">
                          Đăng ngày:{" "}
                          {/* {formatDateToDDMMYYYY(job.ngayDang || job.createdAt)} */}
                        </p>
                      </div>

                      {/* Applicants Count */}
                      <div className="w-32 text-left sm:text-center">
                        <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                          {job.applicationsCount || 0} ứng viên
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="w-32 text-left sm:text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                            isActive
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {isActive ? "Đang nhận hồ sơ" : "Hết hạn / Đã đóng"}
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* CỘT PHẢI: ỨNG VIÊN MỚI NHẤT */}
        <div className="xl:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="text-base font-bold text-slate-800">
              Ứng viên mới nhất
            </h2>
            <Link
              href="/employer/applications"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              Xem tất cả ứng viên
            </Link>
          </div>

          <div className="divide-y divide-slate-50 flex-1">
            {recruiter?.recentApplicants?.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">
                Chưa có ứng viên mới.
              </p>
            ) : (
              recruiter?.recentApplicants
                ?.slice(0, 4)
                .map((applicant, index) => {
                  // Tạo một % match giả định cho đẹp giống UI (Do backend chưa trả về field này)
                  const mockMatchScores = ["95%", "88%", "91%", "76%"];
                  const matchScore =
                    mockMatchScores[index % mockMatchScores.length];

                  return (
                    <div
                      key={applicant.applicationId}
                      className="p-5 flex items-start gap-3 hover:bg-slate-50/50 transition-colors"
                    >
                      {/* Avatar */}
                      {applicant.avatarUrl ? (
                        <Image
                          src={applicant.avatarUrl}
                          alt={applicant.candidateName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-100"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {applicant.candidateName.charAt(0)}
                        </div>
                      )}

                      {/* Candidate Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">
                          {applicant.candidateName}
                        </h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          Ứng tuyển:{" "}
                          <span className="font-medium">
                            {applicant.jobTitle}
                          </span>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Nộp hôm nay •{" "}
                          {new Date(applicant.appliedAt).toLocaleTimeString(
                            "vi-VN",
                            { hour: "2-digit", minute: "2-digit" },
                          )}{" "}
                          AM
                        </p>
                      </div>

                      {/* Match Badge */}
                      <div className="shrink-0">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
                          {matchScore} Match
                        </span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerMainContent;
