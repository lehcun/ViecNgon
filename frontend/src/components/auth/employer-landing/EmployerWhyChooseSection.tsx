"use client";

import React from "react";
import { Cpu, Sparkles, ShieldCheck } from "lucide-react";

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
    index: "01",
    icon: Cpu,
    title: "Chuyên biệt cho Tuyển dụng IT",
    description:
      "Từ điển kỹ năng chuẩn hóa từ Backend, Frontend, Mobile đến AI & Cloud giúp tin đăng tiếp cận đúng kỹ sư cần tìm.",
  },
  {
    index: "02",
    icon: Sparkles,
    title: "Sàng lọc AI Match & Bóc tách CV",
    description:
      "Tự động chuẩn hóa CV PDF và chấm điểm độ tương thích với JD, giúp đội ngũ HR giảm hơn 60% thời gian đọc hồ sơ.",
  },
  {
    index: "03",
    icon: ShieldCheck,
    title: "Xác thực Doanh nghiệp Minh bạch",
    description:
      "Mỗi tài khoản doanh nghiệp đều được Quản trị viên ViecNgon kiểm duyệt, bảo vệ uy tín thương hiệu tuyển dụng.",
  },
];

export default function EmployerWhyChooseSection({
  stats,
  isLoading,
}: EmployerWhyChooseSectionProps) {
  const statItems = [
    {
      value: stats ? `${stats.candidatesCount.toLocaleString("vi-VN")}+` : "—",
      label: "Hồ sơ Ứng viên IT",
      detail: "Cập nhật liên tục theo kỹ năng thực tế",
    },
    {
      value: stats ? `${stats.companiesCount.toLocaleString("vi-VN")}+` : "—",
      label: "Doanh nghiệp Công nghệ",
      detail: "Đã xác thực và đang vận hành tuyển dụng",
    },
    {
      value: stats ? `${stats.activeJobsCount.toLocaleString("vi-VN")}+` : "—",
      label: "Vị trí IT Đang mở",
      detail: "Trải rộng Hà Nội, TP. Hồ Chí Minh & Đà Nẵng",
    },
  ];

  return (
    <section
      id="why-viecngon"
      className="py-20 sm:py-24 bg-surface-card border-y border-border-default scroll-mt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Vì sao chọn ViecNgon
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Dữ liệu thật, quy trình gọn và chuẩn mực dành riêng cho ngành IT
            </h2>
          </div>
          <p className="text-sm text-text-muted max-w-sm">
            Toàn bộ chỉ số dưới đây được đồng bộ trực tiếp từ hệ thống ViecNgon
            theo thời gian thực.
          </p>
        </div>

        {/* Hairline Editorial Stat Strip */}
        <div className="rounded-2xl border border-border-default bg-surface-page overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border-default">
            {isLoading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="p-7 animate-pulse space-y-3">
                    <div className="h-10 w-28 rounded bg-surface-subtle" />
                    <div className="h-4 w-40 rounded bg-surface-muted" />
                    <div className="h-3 w-52 rounded bg-surface-muted" />
                  </div>
                ))
              : statItems.map((item) => (
                  <div key={item.label} className="p-7 space-y-1.5">
                    <p className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight tabular-nums">
                      {item.value}
                    </p>
                    <p className="text-sm font-bold text-primary pt-1">
                      {item.label}
                    </p>
                    <p className="text-xs text-text-muted">{item.detail}</p>
                  </div>
                ))}
          </div>
        </div>

        {/* 3 Trụ cột kiến trúc có đánh số */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUE_PILLARS.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="group p-6 rounded-2xl bg-surface-card border border-border-default hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-primary-light text-primary group-hover:bg-primary group-hover:text-white transition-colors flex items-center justify-center">
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-extrabold tracking-widest text-text-placeholder tabular-nums">
                    {pillar.index}
                  </span>
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-text-primary">
                    {pillar.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
