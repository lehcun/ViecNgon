"use client";

import React from "react";
import Link from "next/link";
import { Info, UploadCloud, Edit3, AlertCircle, FileText } from "lucide-react";
import { useCandidate } from "@/hooks/candidate/useCandidate";
import { useAuthStore } from "@/store/authStore";

const CandidatePersonCVContent = () => {
  const { candidateProfile } = useCandidate();
  const { user } = useAuthStore();
  //   console.log("candidateProfile: ", candidateProfile);
  //   console.log("user: ", user);

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Alert Banner: Bạn nên biết */}
      <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 flex gap-3 shadow-sm">
        <div className="mt-0.5">
          <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Info size={16} />
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          <span className="font-bold text-emerald-700">Bạn nên biết: </span>
          ViecNgon luôn gửi CV gần nhất cho nhà tuyển dụng khi bạn ứng tuyển
          hoặc chấp nhận chia sẻ CV qua Lời mời công việc.
        </p>
      </div>

      {/* Khối 1: CV Của Bạn */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-4">CV của bạn</h2>

        {/* Vùng Upload */}
        <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="text-slate-300" size={28} />
            <span className="text-slate-500 font-medium">
              Bạn chưa đính kèm CV nào
            </span>
          </div>

          <button className="flex items-center justify-center gap-2 px-6 py-2.5 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary-light transition-colors w-max">
            <UploadCloud size={20} /> Tải CV lên
          </button>

          <p className="text-[13px] text-slate-500 mt-4">
            Hỗ trợ định dạng .doc, .docx hoặc .pdf, dưới 3MB và không chứa mật
            khẩu bảo vệ
          </p>
        </div>

        <div className="mt-4 text-right">
          <Link
            href="#"
            className="text-[13px] text-slate-500 hover:text-primary underline transition-colors"
          >
            Bạn thắc mắc CV của mình được xét duyệt như thế nào?
          </Link>
        </div>
      </div>

      {/* Khối 2: Thông tin cơ bản */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">Thông tin cơ bản</h2>
          <button className="text-primary hover:bg-primary-light p-2 rounded-md transition-colors">
            <Edit3 size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 font-medium">
              Họ và Tên
            </span>
            <span className="text-sm font-bold text-slate-800">
              {candidateProfile?.tenUngVien || (
                <label className="flex items-center gap-1 text-sm font-medium text-amber-500 w-max">
                  <AlertCircle size={16} /> Thêm thông tin
                </label>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 font-medium">
              Số điện thoại
            </span>
            <span className="text-sm font-bold text-slate-800">
              {user?.sdt || (
                <label className="flex items-center gap-1 text-sm font-medium text-amber-500 w-max">
                  <AlertCircle size={16} /> Thêm thông tin
                </label>
              )}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 pb-2">
            <span className="text-sm text-slate-500 font-medium">
              Nơi làm việc mong muốn
            </span>
            <label className="flex items-center gap-1 text-sm font-medium text-amber-500 w-max">
              <AlertCircle size={16} /> Thêm thông tin
            </label>
          </div>
        </div>
      </div>

      {/* Khối 3: Thông tin chung */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-800">Thông tin chung</h2>
          <button className="text-primary hover:bg-primary-light p-2 rounded-md transition-colors">
            <Edit3 size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 font-medium">
              Tổng số năm kinh nghiệm
            </span>
            {candidateProfile?.soNamKinhNghiem || (
              <label className="text-sm font-medium text-slate-400 text-left w-max">
                Thêm thông tin
              </label>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 border-b border-slate-100 pb-4">
            <span className="text-sm text-slate-500 font-medium">
              Cấp bậc hiện tại
            </span>
            <label className="text-sm font-medium text-slate-400 text-left w-max">
              Thêm thông tin
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-1 sm:gap-4 pb-2">
            <span className="text-sm text-slate-500 font-medium">
              Hình thức làm việc mong muốn
            </span>
            <label className="text-sm font-medium text-slate-400 text-left w-max">
              Thêm thông tin
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatePersonCVContent;
