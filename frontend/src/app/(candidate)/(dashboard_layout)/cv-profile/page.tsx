"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Edit3,
  PlusCircle,
  Trash2,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Link as LinkIcon,
  Bot,
} from "lucide-react";
import PersonalInfoModal from "@/components/candidate/PersonalInfoModal";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import { formatDateToDDMMYYYY } from "@/utils/date";

export default function CandidateProfilePage() {
  const { candidateProfile } = useCandidateProfile();

  console.log("candidateProfile: ", candidateProfile);

  //Các state
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const profileCompletion = 71;
  const arcLength = 220;

  if (!candidateProfile) return <h2>Ứng viên ko xác định</h2>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative">
      {/* Các Model nhập */}
      <PersonalInfoModal
        key={isEditInfoOpen ? "open" : "closed"} // Dòng này là phép thuật của React
        isOpen={isEditInfoOpen}
        onClose={() => setIsEditInfoOpen(false)}
        initialData={candidateProfile}
      />

      {/* ==================== CỘT GIỮA (NỘI DUNG CHÍNH) ==================== */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* 1. Header Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative group">
          <button
            onClick={() => setIsEditInfoOpen(true)}
            className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors p-1"
          >
            <Edit3 size={20} />
          </button>

          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
              C
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {candidateProfile.account.userName}
              </h1>
              <p className="text-slate-600 font-medium mt-1">
                Backend developer
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={16} className="text-slate-400" />
              {candidateProfile.account.email}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone size={16} className="text-slate-400" />
              {candidateProfile.account.phoneNumber}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={16} className="text-slate-400" />
              {formatDateToDDMMYYYY(candidateProfile.dateOfBirth)}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <User size={16} className="text-slate-400" />
              {candidateProfile.gender}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin size={16} className="text-slate-400" />
              {candidateProfile.address}
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <LinkIcon size={16} className="text-slate-400" />
              <Link
                href="https://github.com/lehcun"
                target="_blank"
                className="hover:text-primary transition-colors"
              >
                github.com/lehcun
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Giới thiệu bản thân */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative group">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Giới thiệu bản thân
            </h2>
            <button className="text-slate-400 hover:text-primary transition-colors p-1">
              <Edit3 size={20} />
            </button>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            I am Le Hung Cuong, a <strong>TypeScript Developer</strong> with a
            strong focus on <strong>Backend development</strong>. My core
            expertise lies in building scalable, high-performance web
            applications using <strong>NestJS</strong> and
            <strong>Next.js</strong>. I have a deep understanding of server-side
            logic, database optimization, and system architecture. While I am
            comfortable crafting modern, SEO-friendly frontends with Next.js, I
            find my greatest passion in solving complex backend challenges,
            designing <strong>RESTful APIs</strong>, and ensuring system
            reliability.
          </p>
        </div>

        {/* 3. Học vấn */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Học vấn</h2>
            <button className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors">
              <PlusCircle size={22} />
            </button>
          </div>

          <div className="group relative">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-slate-800">
                Trường Đại Học Duy Tân
              </h3>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-primary p-1">
                  <Edit3 size={16} />
                </button>
                <button className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">
              Cử nhân - Software Engineer
            </p>
            <p className="text-xs text-slate-500 mb-3">09/2023 - HIỆN TẠI</p>
            <p className="text-sm text-slate-600">3.7 GPA</p>
          </div>
        </div>

        {/* 4. Kinh nghiệm làm việc */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Kinh nghiệm làm việc
            </h2>
            <button className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors">
              <PlusCircle size={22} />
            </button>
          </div>

          <div className="group relative">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-bold text-slate-800">Internship</h3>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-primary p-1">
                  <Edit3 size={16} />
                </button>
                <button className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="text-sm text-slate-600 font-medium mb-1">
              Samsung Vietnam Mobile R&D Center
            </p>
            <p className="text-xs text-slate-500">08/2025 - 09/2025</p>
          </div>
        </div>

        {/* 5. Kỹ năng */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Kỹ năng</h2>
            <button className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors">
              <PlusCircle size={22} />
            </button>
          </div>

          {/* Banner Cập nhật nhanh */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-2 mb-6 cursor-pointer hover:bg-blue-100 transition-colors">
            <Edit3 size={16} className="text-blue-600" />
            <p className="text-sm text-slate-600">
              <span className="text-blue-600 font-semibold">
                Cập nhật nhanh
              </span>
              số năm kinh nghiệm cho kỹ năng
            </p>
          </div>

          <div className="group relative">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-slate-800 text-sm">Core Skills</h3>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-slate-400 hover:text-primary p-1">
                  <Edit3 size={16} />
                </button>
                <button className="text-slate-400 hover:text-rose-500 p-1">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-700 bg-white shadow-sm">
                <strong>CSS</strong>
                <span className="text-slate-400 ml-1">(&lt; 1 năm)</span>
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-700 bg-white shadow-sm">
                <strong>HTML</strong>
                <span className="text-slate-400 ml-1">(&lt; 1 năm)</span>
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-700 bg-white shadow-sm">
                <strong>MySQL</strong>
                <span className="text-slate-400 ml-1">(&lt; 1 năm)</span>
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-700 bg-white shadow-sm">
                <strong>Nest.js</strong>
                <span className="text-slate-400 ml-1">(&lt; 1 năm)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== CỘT PHẢI (WIDGETS) ==================== */}
      <div className="xl:col-span-1 flex flex-col gap-6">
        {/* Widget 1: Độ hoàn thiện hồ sơ */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
          <h2 className="text-center font-bold text-slate-800 mb-6">
            Độ hoàn thiện hồ sơ
          </h2>

          {/* Biểu đồ nửa vầng trăng */}
          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-24 overflow-hidden">
              <svg
                viewBox="0 0 200 100"
                className="w-full h-auto drop-shadow-sm"
              >
                <path
                  d="M 20 90 A 70 70 0 0 1 180 90"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
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
          </div>

          {/* Khung chat Mascot */}
          <div className="flex items-end gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-br-none p-3 text-[13px] text-slate-600 relative flex-1 shadow-sm">
              Chúc mừng! Bạn đã sẵn sàng để tạo CV. Tiếp tục hoàn thiện hồ sơ để
              CV của bạn thêm thu hút.
              {/* Mũi nhọn của bong bóng chat */}
              <div className="absolute -bottom-px -right-2 w-2 h-2 bg-slate-50 border-b border-r border-slate-200 transform rotate-45"></div>
            </div>
            {/* Mascot Icon giả lập */}
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200 text-slate-500">
              <Bot size={24} />
            </div>
          </div>

          <button className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95">
            Xem và Tải CV
          </button>
        </div>

        {/* Widget 2: Cập nhật nhanh bằng CV */}
        {/* <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex gap-4 items-start mb-6">
            <div>   
              <h3 className="font-bold text-slate-800 mb-2">
                Cập nhật nhanh hồ sơ của bạn
              </h3>
              <p className="text-sm text-slate-600">
                Điền nhanh hồ sơ bằng CV của bạn chỉ với ít phút.
              </p>
            </div>
            <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 text-blue-300">
              <FileText size={32} />
            </div>
          </div>

          <button className="w-full border-2 border-primary text-primary hover:bg-primary-50 font-bold py-2.5 rounded-lg transition-colors">
            Điền hồ sơ tự động
          </button>
        </div> */}
      </div>
    </div>
  );
}
