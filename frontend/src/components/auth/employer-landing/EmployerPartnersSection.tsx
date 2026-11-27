"use client";

import React from "react";
import Link from "next/link";
import { Quote, MapPin, Briefcase } from "lucide-react";
import type { EmployerLandingPartnerItem } from "@viecngon/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

interface EmployerPartnersSectionProps {
  partners: EmployerLandingPartnerItem[];
  isLoading: boolean;
}

const TESTIMONIALS = [
  {
    quote:
      "AI Match Score giúp đội ngũ tuyển dụng kỹ thuật của chúng tôi rút ngắn đáng kể thời gian sàng lọc hồ sơ Senior Java và Cloud.",
    author: "Nguyễn Thảo Nhi",
    role: "Senior IT Recruiter · FPT Software",
  },
  {
    quote:
      "Tính năng đặt lịch Google Meet trực tiếp trên hồ sơ và đánh giá đa vòng giúp Tech Lead và HR phối hợp mượt mà hơn hẳn.",
    author: "Lê Ngọc Anh",
    role: "Technical Recruiter · VNG Corporation",
  },
  {
    quote:
      "Trang hồ sơ công ty kết hợp đánh giá ẩn danh minh bạch giúp chúng tôi thu hút được đúng những ứng viên phù hợp văn hóa.",
    author: "Phạm Khánh Vy",
    role: "HRBP Engineering · Shopee Vietnam",
  },
];

export default function EmployerPartnersSection({
  partners,
  isLoading,
}: EmployerPartnersSectionProps) {
  return (
    <section id="partners" className="py-16 sm:py-20 bg-surface-page scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">
            Doanh nghiệp đồng hành
          </p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Các công ty công nghệ hàng đầu tin dùng ViecNgon
          </h2>
        </div>

        {/* Tường Logo doanh nghiệp thật từ DB */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-surface-card border border-border-default animate-pulse flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-xl bg-surface-subtle" />
                <div className="h-3.5 w-24 rounded bg-surface-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.slice(0, 6).map((partner) => (
              <Link
                key={partner.maCongTy}
                href={`/company/${partner.slug}`}
                className="group p-4 rounded-xl bg-surface-card border border-border-default hover:border-primary/40 hover:shadow-xs transition-all flex flex-col items-center text-center gap-2.5"
              >
                <CompanyLogo
                  src={partner.logoUrl}
                  name={partner.tenCongTy}
                  size="lg"
                />
                <div className="space-y-1 min-w-0 w-full">
                  <p className="text-xs font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                    {partner.tenCongTy}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-[11px] text-text-muted">
                    {partner.thanhPho && (
                      <span className="inline-flex items-center gap-0.5 truncate">
                        <MapPin size={10} />
                        {partner.thanhPho}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-0.5 shrink-0 text-primary font-semibold">
                      <Briefcase size={10} />
                      {partner.jobsCount}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Trích dẫn HR đối tác */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.author}
              className="p-6 rounded-2xl bg-surface-card border border-border-default shadow-2xs flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <Quote size={22} className="text-primary/40" />
                <p className="text-sm text-text-secondary leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-border-default">
                <p className="text-sm font-bold text-text-primary">
                  {item.author}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
