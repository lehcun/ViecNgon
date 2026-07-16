"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  FileText,
  User,
  CalendarDays,
  Video,
  Save,
  MessageSquare,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  MoreVertical,
  Download,
} from "lucide-react";

// Mock Data (Thực tế sẽ lấy từ API qua useParams)
const MOCK_APPLICATION = {
  id: "APP-123",
  candidateName: "Lê Minh Hoàng",
  appliedPosition: "Senior Frontend Developer (React/Next.js)",
  appliedDate: "10/05/2026",
  status: "REVIEWING", // PENDING, REVIEWING, INTERVIEW, REJECTED, HIRED
  cvUrl:
    "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // Link giả lập
  email: "hoang.le@gmail.com",
  phone: "0983 334 445",
};

export default function ApplicationDetailPage() {
  const [activeTab, setActiveTab] = useState<"CV" | "PROFILE">("CV");
  const [currentStatus, setCurrentStatus] = useState(MOCK_APPLICATION.status);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      {/* --- HEADER --- */}
      <div className="max-w-350 mx-auto mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a
            href="/employer-dashboard/applications"
            className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-500"
          >
            <ChevronLeft size={20} />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              {MOCK_APPLICATION.candidateName}
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
                  currentStatus === "INTERVIEW"
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : currentStatus === "HIRED"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : currentStatus === "REJECTED"
                        ? "bg-rose-100 text-rose-700 border-rose-200"
                        : "bg-blue-100 text-blue-700 border-blue-200"
                }`}
              >
                {currentStatus === "INTERVIEW"
                  ? "Phỏng vấn"
                  : currentStatus === "HIRED"
                    ? "Đã nhận việc"
                    : currentStatus === "REJECTED"
                      ? "Từ chối"
                      : "Đang xem xét"}
              </span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Ứng tuyển vị trí:{" "}
              <span className="font-semibold text-slate-700">
                {MOCK_APPLICATION.appliedPosition}
              </span>{" "}
              • {MOCK_APPLICATION.appliedDate}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm">
            <Save size={16} /> Lưu hồ sơ
          </button>
          <button className="p-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* --- MAIN LAYOUT (2/3 - 1/3 SPLIT) --- */}
      <div className="max-w-350 mx-auto flex flex-col lg:flex-row gap-6 items-start">
        {/* ========================================== */}
        {/* CỘT TRÁI (2/3): HIỂN THỊ CV / PROFILE         */}
        {/* ========================================== */}
        <div className="w-full lg:w-2/3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden h-[calc(100vh-140px)]">
          {/* Tabs */}
          <div className="flex items-center border-b border-slate-100 px-2 pt-2 bg-slate-50/50">
            <button
              onClick={() => setActiveTab("CV")}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "CV" ? "border-primary text-primary bg-white rounded-t-lg" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <FileText size={16} /> CV Đính kèm
            </button>
            <button
              onClick={() => setActiveTab("PROFILE")}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-colors ${activeTab === "PROFILE" ? "border-primary text-primary bg-white rounded-t-lg" : "border-transparent text-slate-500 hover:text-slate-700"}`}
            >
              <User size={16} /> Hồ sơ ViecNgon
            </button>

            <div className="ml-auto pr-4">
              <a
                href={MOCK_APPLICATION.cvUrl}
                download
                className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-primary transition-colors"
              >
                <Download size={16} /> Tải xuống
              </a>
            </div>
          </div>

          {/* Nội dung View */}
          <div className="flex-1 bg-slate-200/50 relative">
            {activeTab === "CV" ? (
              <iframe
                src={`${MOCK_APPLICATION.cvUrl}#toolbar=0`}
                className="w-full h-full border-none"
                title="CV Viewer"
              />
            ) : (
              <div className="p-8 flex flex-col items-center justify-center h-full text-slate-400">
                <User size={48} className="mb-4 opacity-50" />
                <p>Hiển thị giao diện Profile Online của ứng viên tại đây.</p>
              </div>
            )}
          </div>
        </div>

        {/* ========================================== */}
        {/* CỘT PHẢI (1/3): THANH CÔNG CỤ (ACTION BAR) */}
        {/* ========================================== */}
        <div className="w-full lg:w-1/3 flex flex-col gap-5 sticky top-6">
          {/* 1. CHUYỂN TRẠNG THÁI */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
              Trạng thái ứng tuyển
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setCurrentStatus("REVIEWING")}
                className={`py-2 px-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 transition-all ${currentStatus === "REVIEWING" ? "bg-blue-50 border-blue-200 text-blue-700 shadow-inner" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"}`}
              >
                <Clock size={16} /> Xem xét
              </button>
              <button
                onClick={() => setCurrentStatus("INTERVIEW")}
                className={`py-2 px-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 transition-all ${currentStatus === "INTERVIEW" ? "bg-purple-50 border-purple-200 text-purple-700 shadow-inner" : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"}`}
              >
                <CalendarDays size={16} /> Phỏng vấn
              </button>
              <button
                onClick={() => setCurrentStatus("HIRED")}
                className={`py-2 px-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 transition-all ${currentStatus === "HIRED" ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-inner" : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300"}`}
              >
                <CheckCircle2 size={16} /> Nhận việc
              </button>
              <button
                onClick={() => setCurrentStatus("REJECTED")}
                className={`py-2 px-3 rounded-lg text-sm font-medium border flex items-center justify-center gap-1.5 transition-all ${currentStatus === "REJECTED" ? "bg-rose-50 border-rose-200 text-rose-700 shadow-inner" : "bg-white border-slate-200 text-slate-600 hover:border-rose-300"}`}
              >
                <XCircle size={16} /> Từ chối
              </button>
            </div>
          </div>

          {/* 2. LÊN LỊCH PHỎNG VẤN (Tính năng "Ăn điểm") */}
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-sm p-5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-200/50 rounded-full blur-xl"></div>
            <h3 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2 relative z-10">
              <Video size={18} className="text-purple-600" />
              Lên lịch phỏng vấn
            </h3>
            <p className="text-xs text-indigo-700/80 mb-4 relative z-10">
              Tự động gửi email mời và tạo phòng họp Google Meet cho ứng viên.
            </p>
            <button
              onClick={() => alert("Mở Modal Form tạo lịch phỏng vấn ở đây!")}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-2 relative z-10"
            >
              <CalendarDays size={18} /> Đặt lịch ngay
            </button>
          </div>

          {/* 3. ĐÁNH GIÁ & GHI CHÚ */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col flex-1">
            <div className="p-5 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                Đánh giá ứng viên
              </h3>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      size={28}
                      className={`${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "fill-slate-100 text-slate-300"
                      } transition-colors`}
                    />
                  </button>
                ))}
                <span className="ml-3 text-sm font-medium text-amber-600">
                  {rating > 0 ? `${rating}/5 sao` : "Chưa chấm điểm"}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-sm font-bold text-slate-800 mb-2">
                Ghi chú nội bộ
              </h3>
              <textarea
                className="w-full flex-1 min-h-25 p-3 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                placeholder="Nhập nhận xét về kỹ năng, thái độ của ứng viên. Ứng viên sẽ không thấy ghi chú này..."
              ></textarea>
              <button className="mt-3 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                <Save size={16} /> Lưu đánh giá
              </button>
            </div>
          </div>

          {/* 4. GỬI EMAIL NHANH */}
          <button className="w-full py-3.5 bg-white border border-slate-200 hover:border-primary hover:text-primary text-slate-700 rounded-2xl text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2">
            <MessageSquare size={18} /> Gửi Email cho ứng viên
          </button>
        </div>
      </div>
    </div>
  );
}
