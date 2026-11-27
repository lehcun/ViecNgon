"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Briefcase, Quote } from "lucide-react";
import type { EmployerLandingPartnerItem } from "@viecngon/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Reveal } from "./EmployerMotionPrimitives";

interface EmployerPartnersSectionProps {
  partners: EmployerLandingPartnerItem[];
  isLoading: boolean;
}

const TESTIMONIALS = [
  {
    initials: "TN",
    quote:
      "AI Match Score giúp đội ngũ tuyển dụng kỹ thuật của chúng tôi rút ngắn đáng kể thời gian sàng lọc hồ sơ Senior Java và Cloud.",
    author: "Nguyễn Thảo Nhi",
    role: "Senior IT Recruiter · FPT Software",
  },
  {
    initials: "NA",
    quote:
      "Tính năng đặt lịch Google Meet trực tiếp trên hồ sơ và đánh giá đa vòng giúp Tech Lead và HR phối hợp mượt mà hơn hẳn.",
    author: "Lê Ngọc Anh",
    role: "Technical Recruiter · VNG Corporation",
  },
  {
    initials: "KV",
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
    <section id="partners" className="py-20 sm:py-24 bg-surface-page scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Doanh nghiệp đồng hành
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Các đội ngũ kỹ thuật hàng đầu đang tuyển dụng trên ViecNgon
            </h2>
          </div>
          <p className="text-sm text-text-muted max-w-sm">
            Nhấn vào từng doanh nghiệp để xem trang thương hiệu tuyển dụng thực
            tế.
          </p>
        </Reveal>

        {/* Tường Logo doanh nghiệp thật từ DB */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-surface-card border border-border-default animate-pulse flex flex-col items-center gap-3"
              >
                <div className="w-16 h-16 rounded-xl bg-surface-subtle" />
                <div className="h-3.5 w-24 rounded bg-surface-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {partners.slice(0, 6).map((partner, idx) => (
              <Reveal key={partner.maCongTy} index={idx} className="h-full">
                <Link
                  href={`/company/${partner.slug}`}
                  className="group h-full p-4 rounded-2xl bg-surface-card border border-border-default hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center gap-3"
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
                      <span className="inline-flex items-center gap-0.5 shrink-0 text-primary font-semibold tabular-nums">
                        <Briefcase size={10} />
                        {partner.jobsCount}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        {/* Trích dẫn HR đối tác */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, idx) => (
            <Reveal key={item.author} index={idx} className="h-full">
              <div className="h-full p-6 rounded-2xl bg-surface-card border border-border-default shadow-2xs hover:-translate-y-0.5 hover:shadow-md hover:border-primary/30 transition-all duration-200 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <Quote size={20} className="text-primary/40" />
                <p className="text-sm text-text-secondary leading-relaxed">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>
              <div className="pt-4 border-t border-border-default flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold flex items-center justify-center shrink-0">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-text-primary truncate">
                    {item.author}
                  </p>
                  <p className="text-xs text-text-muted truncate">{item.role}</p>
                </div>
              </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
