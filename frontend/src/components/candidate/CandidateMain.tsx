"use client";
import React from "react";
import Link from "next/link";
import {
  Briefcase,
  Mail,
  ChevronRight,
  UploadCloud,
  Send,
  Heart,
  MailOpen,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCandidate } from "@/hooks/candidate/useCandidate";

const CandidateMain = () => {
  const profileCompletion = 69; // Giả lập dữ liệu % hoàn thành hồ sơ
  const arcLength = 220; // Chu vi của nửa vòng tròn SVG

  const { candidateProfile } = useCandidate();
  const { user } = useAuthStore();

  return (
    <div className="w-full lg:w-3/4 flex flex-col gap-6">
      {/* 1. Header Info Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 bg-primary text-white text-4xl font-bold flex items-center justify-center rounded-full shadow-md shrink-0">
          C
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            {user?.tenNguoiDung}
          </h1>
          <div className="space-y-2 text-slate-600 text-sm">
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <Briefcase size={16} className="text-slate-400" /> Software
              {candidateProfile?.chuyenMon} Engineer
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2">
              <Mail size={16} className="text-slate-400" /> {user?.email}
            </p>
          </div>
          <Link
            href="/dashboard/profile/edit"
            className="inline-flex items-center gap-1 text-primary font-semibold mt-4 hover:underline"
          >
            Cập nhật hồ sơ <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* 2. Hồ sơ đính kèm Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          Hồ sơ đính kèm của bạn
        </h2>

        <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:border-primary/50 hover:bg-primary-light/20 cursor-pointer group">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud
              size={32}
              className="text-slate-300 group-hover:text-primary transition-colors"
            />
          </div>
          <p className="text-slate-600 mb-4 max-w-sm">
            Bạn chưa đính kèm CV. Tải lên CV của bạn để tối ưu hoá quá trình tìm
            việc và nhận gợi ý phù hợp nhất.
          </p>
          <Link
            href="/dashboard/cv/upload"
            className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
          >
            Quản lý hồ sơ đính kèm <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* 3. Hồ sơ ViecNgon Card (Biểu đồ nửa vầng trăng) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        {/* SVG Biểu đồ nửa vầng trăng */}
        <div className="shrink-0 relative w-40 h-24 overflow-hidden">
          <svg viewBox="0 0 200 100" className="w-full h-auto drop-shadow-sm">
            {/* Nền xám */}
            <path
              d="M 20 90 A 70 70 0 0 1 180 90"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="18"
              strokeLinecap="round"
            />
            {/* Phần trăm hoàn thành (Màu Primary) */}
            <path
              d="M 20 90 A 70 70 0 0 1 180 90"
              fill="none"
              stroke="currentColor"
              strokeWidth="18"
              strokeLinecap="round"
              className="text-primary transition-all duration-1000 ease-out"
              strokeDasharray={arcLength}
              strokeDashoffset={
                arcLength - arcLength * (profileCompletion / 100)
              }
            />
          </svg>
          <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
            <span className="text-3xl font-black text-slate-800 leading-none">
              {profileCompletion}%
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-1">
              hoàn thành
            </span>
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h2 className="text-lg font-bold text-slate-800 mb-2">
            Hồ sơ ViecNgon
          </h2>
          <p className="text-slate-600 text-sm mb-4 max-w-md">
            Nâng cấp hồ sơ của bạn lên{" "}
            <span className="font-bold text-primary">70%</span> để bắt đầu tạo
            mẫu CV IT chuyên nghiệp.
          </p>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
          >
            Nâng cấp hồ sơ <ChevronRight size={16} />
          </Link>
        </div>

        {/* Khám phá mẫu CV */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Template 1 Mockup */}
          <div className="w-20 h-28 bg-slate-50 border border-slate-200 rounded p-2 shadow-sm flex flex-col gap-1 opacity-60">
            <div className="w-full h-2 bg-slate-200 rounded"></div>
            <div className="w-3/4 h-2 bg-slate-200 rounded"></div>
            <div className="w-full h-1 bg-slate-100 rounded mt-2"></div>
            <div className="w-full h-1 bg-slate-100 rounded"></div>
          </div>
          {/* Khám phá */}
          <Link
            href="/portfolio"
            className="w-24 h-32 border border-slate-200 rounded flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary-light/30 transition-colors cursor-pointer group shadow-sm bg-white"
          >
            <div className="w-8 h-8 rounded-full border-2 border-primary text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <ChevronRight size={16} className="ml-0.5" />
            </div>
            <span className="text-[11px] text-primary font-semibold text-center leading-tight">
              Khám phá
              <br />
              mẫu CV
            </span>
          </Link>
        </div>
      </div>

      {/* 4. HOẠT ĐỘNG CỦA BẠN (MỚI THÊM) */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">
          Hoạt động của bạn
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Ứng tuyển */}
          <div className="bg-primary-light rounded-xl p-5 relative overflow-hidden h-32 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow">
            <span className="text-sm font-semibold text-slate-700 relative z-10 group-hover:text-blue-700 transition-colors">
              Việc làm đã ứng tuyển
            </span>
            <span className="text-4xl font-black text-blue-600 relative z-10">
              0
            </span>
            <Send className="absolute -bottom-2 -right-2 w-16 h-16 text-blue-200/60 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>

          {/* Card 2: Đã lưu */}
          <div className="bg-[#fff1f2] rounded-xl p-5 relative overflow-hidden h-32 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow">
            <span className="text-sm font-semibold text-slate-700 relative z-10 group-hover:text-rose-700 transition-colors">
              Việc làm đã lưu
            </span>
            <span className="text-4xl font-black text-rose-600 relative z-10">
              0
            </span>
            <Heart
              fill="currentColor"
              className="absolute -bottom-3 -right-2 w-20 h-20 text-rose-200/60 -rotate-12 group-hover:scale-110 transition-transform"
            />
          </div>

          {/* Card 3: Lời mời */}
          <div className="bg-[#ecfdf5] rounded-xl p-5 relative overflow-hidden h-32 flex flex-col justify-between group cursor-pointer hover:shadow-md transition-shadow">
            <span className="text-sm font-semibold text-slate-700 relative z-10 group-hover:text-emerald-700 transition-colors">
              Lời mời công việc
            </span>
            <span className="text-4xl font-black text-emerald-600 relative z-10">
              0
            </span>
            <MailOpen className="absolute -bottom-2 -right-2 w-16 h-16 text-emerald-200/60 -rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateMain;
