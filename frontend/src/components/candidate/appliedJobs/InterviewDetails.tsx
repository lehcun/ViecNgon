"use client";
import React from "react";
import {
  Calendar,
  Hourglass,
  Clock,
  MonitorPlay,
  LinkIcon,
  Copy,
  Lightbulb,
  User,
  Mail,
  Phone,
  CalendarPlus,
  RefreshCcw,
} from "lucide-react";

export default function InterviewDetails() {
  const meetingLink = "https://meet.google.com/xyz-qopt-mfe";

  const copyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    alert("Đã sao chép liên kết phòng họp!");
  };

  return (
    <div className="mt-5 max-w-2xl mx-auto bg-linear-to-br from-primary/5 via-white to-slate-50 rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden">
      {/* Cạnh trái line trang trí */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>

      <div className="p-5 md:p-6 flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0 shadow-sm">
              <Calendar size={20} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  Lịch hẹn phỏng vấn trực tuyến
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[10px] uppercase tracking-wide border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Đã xác nhận
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Vòng 2: Phỏng vấn chuyên sâu kiến trúc Front-end
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 self-start md:self-auto bg-amber-50 border border-amber-200/60 text-amber-700 px-3 py-1 rounded-xl text-xs font-semibold">
            <Hourglass size={14} />
            <span>Còn 22 giờ</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-3.5 rounded-xl flex items-start gap-2.5 shadow-sm border border-slate-200/70">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Clock size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                Thời gian
              </span>
              <span className="text-sm font-bold text-slate-900 mt-0.5">
                09:30 - 10:30
              </span>
              <span className="text-xs text-slate-500 font-medium">
                17/10/2026 (GMT+7)
              </span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl flex items-start gap-2.5 shadow-sm border border-slate-200/70">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <MonitorPlay size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                Hình thức
              </span>
              <span className="text-xs font-bold text-slate-900 mt-0.5">
                Google Meet
              </span>
              <span className="text-xs text-slate-500">Phòng họp online</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-xl flex items-start gap-2.5 shadow-sm border border-slate-200/70">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
              <LinkIcon size={16} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider">
                Đường dẫn
              </span>
              <span className="text-xs font-semibold text-primary truncate mt-0.5">
                {meetingLink.split("https://")[1]}
              </span>
              <button
                onClick={copyLink}
                className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
              >
                <Copy size={12} /> Sao chép link
              </button>
            </div>
          </div>
        </div>

        {/* Note Box */}
        <div className="bg-amber-50/50 p-3.5 rounded-xl flex items-start gap-3 border border-amber-200/60">
          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
            <Lightbulb size={16} />
          </div>
          <div className="flex flex-col gap-0.5 text-xs text-amber-900 leading-relaxed">
            <span className="font-bold">Lưu ý chuẩn bị từ Nhà tuyển dụng:</span>
            <p>
              Vui lòng chuẩn bị sẵn sàng thực hành live-coding hoặc review kiến
              trúc dự án. Hãy vào phòng họp trước <strong>5 phút</strong> để
              kiểm tra kỹ micro và đường truyền.
            </p>
          </div>
        </div>

        {/* HR Contact */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-slate-200/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold shrink-0 border border-orange-200">
              <User size={18} />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Trần Thu Thảo
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                  Talent Acquisition
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-slate-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Mail size={12} /> thao.tran@vng.com
                </span>
                <span className="flex items-center gap-1">
                  <Phone size={12} /> (+84) 909 123 456
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow-sm transition-all"
          >
            <MonitorPlay size={16} /> Tham gia Meet
          </a>
          <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors">
            <CalendarPlus size={16} className="text-primary" /> Thêm vào
            Calendar
          </button>
          <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-700 text-xs font-semibold border border-slate-200 transition-colors sm:ml-auto">
            <RefreshCcw size={16} className="text-amber-600" /> Dời lịch / Liên
            hệ
          </button>
        </div>
      </div>
    </div>
  );
}
