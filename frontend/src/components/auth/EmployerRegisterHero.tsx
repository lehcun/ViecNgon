"use client";

import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Users,
  CheckCircle2,
  Building2,
} from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: Sparkles,
    title: "Sàng lọc CV bằng AI Match",
    description:
      "Tự động chấm điểm mức độ tương thích giữa hồ sơ ứng viên IT và yêu cầu kỹ thuật của vị trí.",
  },
  {
    icon: Users,
    title: "Tiếp cận đúng nhân sự IT chất lượng",
    description:
      "Hồ sơ kỹ sư chuẩn hóa theo kỹ năng, năm kinh nghiệm và lịch sử dự án thực tế.",
  },
  {
    icon: ShieldCheck,
    title: "Xác thực doanh nghiệp minh bạch",
    description:
      "Mỗi tài khoản doanh nghiệp đều được Quản trị viên ViecNgon xác minh nhằm bảo vệ uy tín thương hiệu.",
  },
];

export default function EmployerRegisterHero() {
  return (
    <div className="w-full lg:w-5/12 flex flex-col gap-6">
      <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-semibold">
        <Building2 size={14} />
        <span>Giải pháp Tuyển dụng IT chuyên biệt</span>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary leading-tight tracking-tight">
          Tuyển dụng nhân sự IT{" "}
          <span className="text-primary">nhanh hơn & chính xác hơn</span>
        </h1>
        <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
          Đăng ký tài khoản doanh nghiệp trên ViecNgon để đăng tin tuyển dụng,
          quản lý quy trình phỏng vấn và tìm kiếm ứng viên công nghệ phù hợp
          nhất.
        </p>
      </div>

      <div className="space-y-3.5 pt-1">
        {HIGHLIGHTS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="flex items-start gap-3.5 p-3.5 rounded-xl bg-surface-card border border-border-default shadow-2xs"
            >
              <div className="w-9 h-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
                <Icon size={18} />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-sm font-bold text-text-primary">
                  {item.title}
                </h2>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs text-text-muted">
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-success-text" />
          Duyệt hồ sơ trong 24h làm việc
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-success-text" />
          Hỗ trợ 1-1: love@viecngon.vn
        </span>
      </div>
    </div>
  );
}
