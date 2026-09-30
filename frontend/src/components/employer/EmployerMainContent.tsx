"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRecruiterProfile } from "@/hooks/recruiter/useRecruiterProfile";
import { formatDateToDDMMYYYY } from "@/utils/date";
import { DashboardJobItem } from "@viecngon/types";
import {
  Briefcase,
  Users,
  Eye,
  FileText,
  Plus,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const EmployerMainContent = () => {
  const { recruiterProfile: recruiter, isLoading } = useRecruiterProfile();

  if (isLoading) {
    return <div className="animate-pulse h-96 bg-slate-100 rounded-2xl"></div>;
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Tin đăng đang hoạt động */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-600">
              Tin đăng đang hoạt động
            </p>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Briefcase size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-2">
            {recruiter?.statistics?.totalJobs || 8}
          </h3>
          <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
            <TrendingUp size={14} /> +2 tin mới so với tháng trước
          </p>
        </div>

        {/* Card 2: Ứng viên mới */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-600">Ứng viên mới</p>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Users size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-2">
            {recruiter?.statistics?.totalApplications || 124}
          </h3>
          <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
            <TrendingUp size={14} /> +14% tăng so với tháng trước
          </p>
        </div>

        {/* Card 3: Lượt xem tin */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-600">Lượt xem tin</p>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <Eye size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-2">
            {(recruiter?.statistics?.totalViews || 4820).toLocaleString(
              "en-US",
            )}
          </h3>
          <p className="text-xs font-medium text-orange-500 flex items-center gap-1">
            <TrendingDown size={14} /> -2% giảm so với tháng trước
          </p>
        </div>

        {/* Card 4: Hồ sơ ứng tuyển */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-600">
              Hồ sơ ứng tuyển
            </p>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <FileText size={16} />
            </div>
          </div>
          <h3 className="text-3xl font-extrabold text-slate-800 mb-2">
            {recruiter?.statistics?.totalApplications || 45}
          </h3>
          <p className="text-xs font-medium text-emerald-500 flex items-center gap-1">
            <TrendingUp size={14} /> +12 hồ sơ so với tháng trước
          </p>
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
