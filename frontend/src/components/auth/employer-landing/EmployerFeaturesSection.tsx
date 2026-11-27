"use client";

import React from "react";
import {
  Sparkles,
  FileSearch,
  Video,
  ClipboardCheck,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

export default function EmployerFeaturesSection() {
  return (
    <section
      id="features"
      className="py-20 sm:py-24 bg-surface-card border-y border-border-default scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Hệ sinh thái công cụ HR
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Tự động hóa những khâu tốn thời gian nhất trong tuyển dụng IT
            </h2>
          </div>
          <p className="text-sm text-text-muted max-w-sm">
            Mọi tính năng đều tích hợp sẵn trong Cổng Nhà tuyển dụng ViecNgon.
          </p>
        </div>

        {/* 4 thẻ tính năng kèm mảnh UI thật */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. AI Match Score */}
          <div className="p-6 rounded-2xl bg-surface-page border border-border-default hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-ai-light border border-ai-border text-ai text-[11px] font-bold">
                <Sparkles size={12} />
                <span>AI Match Score</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Chấm điểm tương thích CV ↔ JD tự động
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Phân tích kỹ năng khớp, kinh nghiệm liên quan và điểm cần kiểm
                tra sâu trong buổi phỏng vấn kỹ thuật.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-card border border-border-default space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">
                  Độ phù hợp kỹ thuật
                </span>
                <span className="font-extrabold text-success-text tabular-nums">
                  92%
                </span>
              </div>
              <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
                <div className="h-full w-[92%] rounded-full bg-linear-to-r from-ai to-success" />
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                {["Java Spring ✓", "Microservices ✓", "AWS ✓"].map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-success-soft text-success-text font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Bóc tách CV PDF */}
          <div className="p-6 rounded-2xl bg-surface-page border border-border-default hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-[11px] font-bold">
                <FileSearch size={12} />
                <span>CV Parsing</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Bóc tách CV PDF sang hồ sơ chuẩn hóa
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Tự động trích xuất kinh nghiệm làm việc, học vấn, chứng chỉ và
                danh sách công nghệ từ file CV PDF trong vài giây.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-card border border-border-default flex items-center justify-between gap-2 text-xs">
              <span className="px-2.5 py-1.5 rounded-lg bg-surface-page border border-border-default font-mono font-semibold text-text-secondary">
                CV_Senior_Dev.pdf
              </span>
              <ArrowRight size={15} className="text-primary shrink-0" />
              <div className="flex flex-wrap gap-1 justify-end">
                <span className="px-2 py-1 rounded-md bg-primary-light text-primary font-semibold">
                  Kinh nghiệm
                </span>
                <span className="px-2 py-1 rounded-md bg-primary-light text-primary font-semibold">
                  Kỹ năng
                </span>
                <span className="px-2 py-1 rounded-md bg-primary-light text-primary font-semibold">
                  Học vấn
                </span>
              </div>
            </div>
          </div>

          {/* 3. Đặt lịch phỏng vấn Google Meet */}
          <div className="p-6 rounded-2xl bg-surface-page border border-border-default hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-info-soft border border-info-border text-info-text text-[11px] font-bold">
                <Video size={12} />
                <span>Google Calendar & Meet</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Đặt lịch phỏng vấn tự động sinh link Meet
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Chọn khung giờ trực tiếp trên đơn ứng tuyển, tự động tạo phòng
                Google Meet và gửi email mời kèm lịch cho ứng viên.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-card border border-border-default flex items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-text-primary">
                  Phỏng vấn Kỹ thuật · Vòng 1
                </p>
                <p className="text-text-muted mt-0.5">
                  Thứ 4 · 14:00 – 15:00 · Trực tuyến
                </p>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-info-soft border border-info-border text-info-text font-bold shrink-0">
                <Check size={12} />
                Google Meet
              </span>
            </div>
          </div>

          {/* 4. Đánh giá ứng viên đa vòng */}
          <div className="p-6 rounded-2xl bg-surface-page border border-border-default hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between gap-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-warning-soft border border-warning-border text-warning-text text-[11px] font-bold">
                <ClipboardCheck size={12} />
                <span>Đa vòng phỏng vấn</span>
              </div>
              <h3 className="text-lg font-bold text-text-primary">
                Đánh giá ứng viên 4 tiêu chí & chia sẻ phản hồi
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Lưu lịch sử nhận xét theo từng vòng phỏng vấn và chủ động chia
                sẻ phản hồi chuyên nghiệp tới ứng viên chỉ với 1 tùy chọn.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-card border border-border-default flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} className="fill-current" />
                ))}
                <span className="ml-1 font-extrabold text-text-primary tabular-nums">
                  4.8/5
                </span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-success-soft border border-success-border text-success-text font-bold">
                Đạt · Đề xuất Offer
              </span>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-r from-primary-dark from-60% via-primary-active via-85% to-primary text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              Sẵn sàng rút ngắn 60% thời gian tuyển dụng kỹ sư IT?
            </h3>
            <p className="text-xs sm:text-sm text-white/80">
              Đăng ký hồ sơ doanh nghiệp trong 2 phút — Quản trị viên xác thực
              trong 24 giờ làm việc.
            </p>
          </div>
          <a
            href="#register-form"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-surface-card hover:bg-surface-muted text-primary text-sm font-bold shrink-0 transition-all active:scale-[0.98]"
          >
            <span>Đăng ký tài khoản ngay</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
