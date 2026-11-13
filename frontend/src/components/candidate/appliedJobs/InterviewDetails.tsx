"use client";

import React from "react";
import toast from "react-hot-toast";
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
} from "lucide-react";

interface InterviewDetailsProps {
  companyName?: string;
}

export default function InterviewDetails({ companyName }: InterviewDetailsProps) {
  const meetingLink = "https://meet.google.com/viecngon-interview";

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      toast.success("Đã sao chép liên kết phòng họp!");
    } catch {
      toast.error("Không thể sao chép liên kết.");
    }
  };

  return (
    <div className="mt-5 max-w-2xl mx-auto bg-surface-card rounded-xl border border-primary/25 shadow-xs relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

      <div className="p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
              <Calendar size={18} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-text-main leading-snug">
                  Lịch hẹn phỏng vấn trực tuyến
                </h3>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-success-light text-success-text font-semibold text-[11px] border border-success-border">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" />
                  Đã lên lịch
                </span>
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                Phỏng vấn cùng bộ phận tuyển dụng{" "}
                {companyName ? `tại ${companyName}` : ""}
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 self-start md:self-auto bg-warning-light border border-warning-border text-warning-text px-3 py-1 rounded-full text-xs font-semibold">
            <Hourglass size={13} />
            <span>Sắp diễn ra</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-surface-subtle/70 p-3.5 rounded-xl flex items-start gap-2.5 border border-border-subtle">
            <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center text-primary shrink-0">
              <Clock size={15} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-text-muted uppercase font-semibold tracking-wider">
                Thời gian
              </span>
              <span className="text-sm font-bold text-text-main mt-0.5">
                Theo email mời
              </span>
              <span className="text-xs text-text-muted">GMT+7 (Việt Nam)</span>
            </div>
          </div>

          <div className="bg-surface-subtle/70 p-3.5 rounded-xl flex items-start gap-2.5 border border-border-subtle">
            <div className="w-8 h-8 rounded-lg bg-success-light flex items-center justify-center text-success-text shrink-0">
              <MonitorPlay size={15} />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] text-text-muted uppercase font-semibold tracking-wider">
                Hình thức
              </span>
              <span className="text-sm font-bold text-text-main mt-0.5">
                Google Meet
              </span>
              <span className="text-xs text-text-muted">Phòng họp online</span>
            </div>
          </div>

          <div className="bg-surface-subtle/70 p-3.5 rounded-xl flex items-start gap-2.5 border border-border-subtle">
            <div className="w-8 h-8 rounded-lg bg-surface-card border border-border-default flex items-center justify-center text-text-secondary shrink-0">
              <LinkIcon size={15} />
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[11px] text-text-muted uppercase font-semibold tracking-wider">
                Đường dẫn
              </span>
              <span className="text-xs font-semibold text-primary truncate mt-0.5">
                meet.google.com
              </span>
              <button
                type="button"
                onClick={copyLink}
                className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline w-fit cursor-pointer"
              >
                <Copy size={12} /> Sao chép link
              </button>
            </div>
          </div>
        </div>

        <div className="bg-warning-light/60 p-3.5 rounded-xl flex items-start gap-3 border border-warning-border">
          <div className="w-7 h-7 rounded-full bg-surface-card text-warning-text flex items-center justify-center shrink-0 mt-0.5 border border-warning-border">
            <Lightbulb size={15} />
          </div>
          <div className="flex flex-col gap-0.5 text-xs text-text-secondary leading-relaxed">
            <span className="font-bold text-text-main">
              Lưu ý chuẩn bị trước buổi phỏng vấn:
            </span>
            <p>
              Vui lòng kiểm tra email chi tiết lịch hẹn từ nhà tuyển dụng và
              tham gia phòng họp trước <strong>5 phút</strong> để đảm bảo âm
              thanh và kết nối ổn định.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-surface-subtle/60 rounded-xl border border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-info-light text-info-text flex items-center justify-center shrink-0 border border-info-border">
              <User size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-text-main">
                Bộ phận Tuyển dụng {companyName || "ViecNgon"}
              </span>
              <div className="flex flex-wrap items-center gap-x-3 text-[11px] text-text-muted mt-0.5">
                <span className="inline-flex items-center gap-1">
                  <Mail size={12} /> Kiểm tra hộp thư đã đăng ký
                </span>
                <span className="inline-flex items-center gap-1">
                  <Phone size={12} /> Liên hệ HR theo thông báo
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <a
            href={meetingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold transition-colors"
          >
            <MonitorPlay size={15} /> Mở Google Meet
          </a>
        </div>
      </div>
    </div>
  );
}
