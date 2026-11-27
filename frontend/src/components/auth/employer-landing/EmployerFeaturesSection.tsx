"use client";

import React from "react";
import {
  Sparkles,
  FileSearch,
  Video,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Sparkles,
    badge: "AI Powered",
    title: "AI Match Score thông minh",
    description:
      "Tự động chấm điểm mức độ tương thích (0–100%) giữa CV ứng viên và yêu cầu JD, chỉ rõ kỹ năng khớp và khoảng trống cần phỏng vấn.",
  },
  {
    icon: FileSearch,
    badge: "Tiết kiệm 60% thời gian",
    title: "Bóc tách CV PDF tự động",
    description:
      "Chuẩn hóa hồ sơ ứng viên từ file PDF thành dữ liệu có cấu trúc (kinh nghiệm, học vấn, chứng chỉ, kỹ năng) để HR đối chiếu cực nhanh.",
  },
  {
    icon: Video,
    badge: "Google Calendar",
    title: "Đặt lịch phỏng vấn Google Meet",
    description:
      "Lên lịch phỏng vấn trực tuyến hoặc trực tiếp ngay trên hồ sơ ứng viên, tự động sinh link Google Meet và gửi email mời hai chiều.",
  },
  {
    icon: ClipboardCheck,
    badge: "Đa vòng phỏng vấn",
    title: "Đánh giá ứng viên bài bản",
    description:
      "Chấm điểm ứng viên theo 4 tiêu chí chuẩn hóa, lưu lịch sử nhiều vòng phỏng vấn và tùy chọn chia sẻ nhận xét chuyên nghiệp tới ứng viên.",
  },
];

export default function EmployerFeaturesSection() {
  return (
    <section
      id="features"
      className="py-16 sm:py-20 bg-surface-card border-y border-border-default scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Hệ sinh thái tiện ích tuyển dụng
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Mọi công cụ HR công nghệ cần trên một nền tảng duy nhất
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Từ lúc đăng tin, sàng lọc hồ sơ bằng AI cho đến đặt lịch phỏng vấn
            và gửi nhận xét trúng tuyển.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="p-6 rounded-2xl bg-surface-page border border-border-default flex items-start gap-4 hover:border-primary/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                  <Icon size={22} />
                </div>
                <div className="space-y-1.5">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-card border border-border-default text-text-muted">
                    {feat.badge}
                  </span>
                  <h3 className="text-base font-bold text-text-primary">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-linear-to-r from-primary-dark from-60% via-primary-active via-85% to-primary text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">
              Sẵn sàng trải nghiệm quy trình tuyển dụng IT thế hệ mới?
            </h3>
            <p className="text-xs sm:text-sm text-white/80">
              Đăng ký hồ sơ doanh nghiệp chỉ trong 2 phút — Quản trị viên xác
              thực trong vòng 24 giờ làm việc.
            </p>
          </div>
          <a
            href="#register-form"
            className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-surface-card hover:bg-surface-muted text-primary text-sm font-bold shrink-0 transition-colors"
          >
            <span>Đăng ký ngay</span>
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
