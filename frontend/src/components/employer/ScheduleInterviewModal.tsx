"use client";

import React, { useState } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Video,
  AlignLeft,
  Send,
  Loader2,
} from "lucide-react";
import { useScheduleInterview } from "@/hooks/recruiter/useScheduleInterview";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
}

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
}: ScheduleInterviewModalProps) {
  // --- STATES FORM ---
  const [title, setTitle] = useState(`Phỏng vấn vị trí ${jobTitle}`);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState(
    "Chào bạn,\nChúng tôi rất ấn tượng với hồ sơ của bạn và muốn mời bạn tham gia buổi phỏng vấn trực tuyến...",
  );
  const [isGoogleMeet, setIsGoogleMeet] = useState(true); // Mặc định bật tạo Google Meet

  const { mutate: scheduleInterview, isPending } = useScheduleInterview();

  if (!isOpen) return null;

  // Xử lý Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Ghép ngày và giờ thành 1 chuỗi ISO chuẩn để gửi xuống Backend
    const interviewDateTime = new Date(`${date}T${time}`).toISOString();

    scheduleInterview(
      {
        maDon: applicationId,
        tieuDe: title,
        thoiGian: interviewDateTime,
        moTa: description,
        taoGoogleMeet: isGoogleMeet,
      },
      {
        // Khi API chạy thành công thì đóng Modal
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Lên lịch phỏng vấn
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Ứng viên:{" "}
              <span className="font-semibold text-primary">
                {candidateName}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* BODY FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tiêu đề buổi phỏng vấn */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Tiêu đề phỏng vấn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              required
            />
          </div>

          {/* Ngày & Giờ (Chia 2 cột) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className=" text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <CalendarIcon size={16} className="text-slate-400" /> Ngày phỏng
                vấn <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm cursor-pointer"
                required
              />
            </div>
            <div>
              <label className=" text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock size={16} className="text-slate-400" /> Thời gian{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Tích hợp Google Meet (Công tắc) */}
          <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl flex items-start gap-3">
            <div className="mt-0.5 p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Video size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800">
                Tự động tạo Google Meet
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Hệ thống sẽ tạo link họp trực tuyến và đính kèm vào email gửi
                cho ứng viên.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isGoogleMeet}
                onChange={(e) => setIsGoogleMeet(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Lời nhắn / Mô tả */}
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <AlignLeft size={16} className="text-slate-400" /> Lời nhắn cho
              ứng viên
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm resize-none"
            ></textarea>
          </div>

          {/* FOOTER BUTTONS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending} // Dùng isPending của React Query
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isPending ? "Đang xử lý..." : "Xác nhận tạo lịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
