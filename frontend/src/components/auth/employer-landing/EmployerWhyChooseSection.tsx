"use client";

import React from "react";
import {
  Users,
  Building2,
  Briefcase,
  Cpu,
  Sparkles,
  ShieldCheck,
  Award,
} from "lucide-react";

interface EmployerWhyChooseSectionProps {
  stats?: {
    candidatesCount: number;
    companiesCount: number;
    activeJobsCount: number;
  };
  isLoading: boolean;
}

const VALUE_PILLARS = [
  {
    icon: Cpu,
    title: "Chuyên biệt cho Tuyển dụng IT",
    description:
      "Tập trung 100% vào nhân sự công nghệ thông tin với từ điển kỹ năng chuẩn hóa từ Backend, Frontend, Mobile đến AI & Cloud.",
  },
  {
    icon: Sparkles,
    title: "Sàng lọc AI Match & Bóc tách CV",
    description:
      "Tự động phân tích CV PDF và chấm điểm độ tương thích với mô tả công việc, giúp đội ngũ HR giảm hơn 60% thời gian đọc hồ sơ.",
  },
  {
    icon: ShieldCheck,
    title: "Xác thực Doanh nghiệp Minh bạch",
    description:
      "Mỗi tài khoản doanh nghiệp đều được Quản trị viên ViecNgon kiểm duyệt, đảm bảo môi trường tuyển dụng uy tín và an toàn.",
  },
];

export default function EmployerWhyChooseSection({
  stats,
  isLoading,
}: EmployerWhyChooseSectionProps) {
  const statCards = [
    {
      icon: Users,
      value: stats ? `${stats.candidatesCount.toLocaleString("vi-VN")}+` : "—",
      label: "Hồ sơ Ứng viên IT",
      note: "Cập nhật liên tục theo kỹ năng thực tế",
    },
    {
      icon: Building2,
      value: stats ? `${stats.companiesCount.toLocaleString("vi-VN")}+` : "—",
      label: "Doanh nghiệp Công nghệ",
      note: "Đã xác thực và đang tuyển dụng",
    },
    {
      icon: Briefcase,
      value: stats ? `${stats.activeJobsCount.toLocaleString("vi-VN")}+` : "—",
      label: "Vị trí IT Đang mở",
      note: "Trải rộng Hà Nội, TP.HCM & Đà Nẵng",
    },
  ];

  return (
    <section
      id="why-viecngon"
      className="py-16 sm:py-20 bg-surface-card border-y border-border-default scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
            <Award size={14} />
            <span>Vì sao nên chọn ViecNgon?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Nền tảng được Nhà tuyển dụng và Kỹ sư IT tin tưởng
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Số liệu vận hành thực tế theo thời gian thực trên hệ sinh thái tuyển
            dụng công nghệ ViecNgon.
          </p>
        </div>

        {/* 3 chỉ số nổi bật */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-surface-page border border-border-default animate-pulse space-y-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-subtle" />
                  <div className="h-8 w-24 rounded bg-surface-subtle" />
                  <div className="h-4 w-40 rounded bg-surface-muted" />
                </div>
              ))
            : statCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="p-6 rounded-2xl bg-surface-page border border-border-default flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-1">
                      <Icon size={22} />
                    </div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-primary tabular-nums">
                      {item.value}
                    </p>
                    <p className="text-sm font-bold text-text-primary">
                      {item.label}
                    </p>
                    <p className="text-xs text-text-muted">{item.note}</p>
                  </div>
                );
              })}
        </div>

        {/* 3 trụ cột giá trị */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-6 rounded-2xl bg-surface-card border border-border-default shadow-2xs space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold text-text-primary">
                  {pillar.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
