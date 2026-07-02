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
import { CandidateProfileResponse } from "@viecngon/types";

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
                {candidateProfile.profession}
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
          {/* Render HTML từ Tiptap bằng dangerouslySetInnerHTML */}
          <div
            className="prose prose-slate prose-li:marker:text-rose-500 max-w-none text-slate-700"
            dangerouslySetInnerHTML={{ __html: candidateProfile.aboutMe || "" }}
          />
        </div>

        {/* 3. Học vấn */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Học vấn</h2>
            <button className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors">
              <PlusCircle size={22} />
            </button>
          </div>

          {candidateProfile?.educations?.length > 0 ? (
            candidateProfile.educations.map(
              (item: CandidateProfileResponse["educations"][number]) => {
                return (
                  <div key={item.id} className="group relative mb-6 last:mb-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-slate-800">
                        {item.schoolName}
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
                      {item.major}
                    </p>

                    <p className="text-xs text-slate-500 mb-3 uppercase">
                      {item.startDate} -{" "}
                      {item.endDate ? item.endDate : "HIỆN TẠI"}
                    </p>

                    {/* Chỉ hiển thị GPA nếu ứng viên có nhập */}
                    {item.gpa && (
                      <p className="text-sm text-slate-600">{item.gpa} GPA</p>
                    )}
                  </div>
                );
              },
            )
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa có thông tin học vấn.
            </p>
          )}
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

          {/* Duyệt mảng experiences từ dữ liệu API */}
          {candidateProfile?.experiences?.length > 0 ? (
            candidateProfile.experiences.map(
              (item: CandidateProfileResponse["experiences"][number]) => (
                <div key={item.id} className="group relative mb-6 last:mb-0">
                  <div className="flex justify-between items-start mb-1">
                    {/* Tên vị trí công việc */}
                    <h3 className="font-bold text-slate-800">
                      {item.position}
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

                  {/* Tên công ty */}
                  <p className="text-sm text-slate-600 font-medium mb-1">
                    {item.companyName}
                  </p>

                  {/* Thời gian làm việc */}
                  <p className="text-xs text-slate-500 mb-3 uppercase">
                    {item.startDate} -{" "}
                    {item.endDate ? item.endDate : "HIỆN TẠI"}
                  </p>

                  {/* Render nội dung HTML an toàn cho phần mô tả */}
                  {item.description && (
                    <div
                      className="text-sm text-slate-600 prose prose-sm max-w-none mt-2"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}
                </div>
              ),
            )
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa có thông tin kinh nghiệm làm việc.
            </p>
          )}
        </div>

        {/* 8. Dự án */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Dự án nổi bật</h2>
            <button className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors">
              <PlusCircle size={22} />
            </button>
          </div>

          <p className="text-sm text-slate-500 italic">Chưa nhập dự án nào.</p>
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
              </span>{" "}
              mức độ thông thạo cho kỹ năng
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

            {/* Duyệt mảng skills từ dữ liệu API */}
            {candidateProfile?.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {candidateProfile.skills.map(
                  (skill: CandidateProfileResponse["skills"][number]) => (
                    <span
                      key={skill.skillId}
                      className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-700 bg-white shadow-sm hover:border-primary transition-colors cursor-default"
                    >
                      <strong>{skill.skillName}</strong>
                      {/* Hiển thị level (ví dụ: Khá, Giỏi) */}
                      {skill.level && (
                        <span className="text-slate-500 ml-1.5 text-xs font-medium">
                          ({skill.level})
                        </span>
                      )}
                    </span>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Chưa có thông tin kỹ năng.
              </p>
            )}
          </div>
        </div>

        {/* 6. Chứng chỉ */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm  ">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Chứng chỉ</h2>
            <button className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors">
              <PlusCircle size={22} />
            </button>
          </div>

          {/* Duyệt mảng certificates từ dữ liệu API */}
          {candidateProfile?.certificates?.length > 0 ? (
            candidateProfile.certificates.map(
              (item: CandidateProfileResponse["certificates"][number]) => (
                <div
                  key={item.id}
                  className="group relative mb-6 last:mb-0 border-b border-dashed border-slate-100 pb-4 last:border-none last:pb-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    {/* Tên chứng chỉ */}
                    <h3 className="font-bold text-slate-800 text-base">
                      {item.name}
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

                  {/* Tổ chức cấp */}
                  <p className="text-sm text-slate-600 font-medium mb-1">
                    {item.organization}
                  </p>

                  {/* Thời gian hiệu lực */}
                  <p className="text-xs text-slate-500 uppercase">
                    {item.issueDate}
                    {item.expirationDate
                      ? ` - ${item.expirationDate}`
                      : " - Vô thời hạn"}
                  </p>
                </div>
              ),
            )
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa có thông tin chứng chỉ.
            </p>
          )}
        </div>

        {/* 7. Ngoại ngữ */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Ngoại ngữ</h2>
            <button className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors">
              <PlusCircle size={22} />
            </button>
          </div>

          <div className="group relative">
            {/* Duyệt mảng languages từ dữ liệu API */}
            {candidateProfile?.languages?.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {candidateProfile.languages.map(
                  (lang: CandidateProfileResponse["languages"][number]) => (
                    <div
                      key={lang.id}
                      className="flex items-center justify-between w-full sm:w-[calc(50%-0.375rem)] px-4 py-3 rounded-lg border border-slate-200 bg-white hover:border-primary transition-colors group/lang relative"
                    >
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">
                          {lang.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {lang.proficiency}
                        </p>
                      </div>

                      {/* Các nút hành động (Sửa/Xóa) sẽ hiện khi hover vào từng thẻ ngôn ngữ */}
                      <div className="flex items-center gap-1 opacity-0 group-hover/lang:opacity-100 transition-opacity">
                        <button className="text-slate-400 hover:text-primary p-1.5 rounded-full hover:bg-slate-50">
                          <Edit3 size={14} />
                        </button>
                        <button className="text-slate-400 hover:text-rose-500 p-1.5 rounded-full hover:bg-slate-50">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">
                Chưa có thông tin ngoại ngữ.
              </p>
            )}
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
