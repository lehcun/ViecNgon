"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Crown, MapPin } from "lucide-react";
import { FormattedTopCompany } from "@viecngon/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export default function EmployerCard(company: FormattedTopCompany) {
  const skills = (company.skills ?? []).slice(0, 6);

  return (
    <Link
      href={`/company/${company.slug}`}
      className="group relative flex flex-col justify-between w-full bg-surface-card border border-border-default rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Dải băng TOP HIRING cho doanh nghiệp nổi bật */}
      {company.isTopHiring && (
        <div className="pointer-events-none absolute top-4 -right-9 z-20 rotate-45 bg-vip text-white text-[10px] font-bold tracking-wider uppercase py-1 w-32 flex items-center justify-center gap-1 shadow-xs">
          <Crown size={10} className="shrink-0" />
          <span>TOP HIRING</span>
        </div>
      )}

      {/* Phần trên: Nền họa tiết vòng cung đồng tâm + Logo nổi */}
      <div className="relative pt-8 pb-6 px-6 flex flex-col items-center text-center flex-1">
        {/* Background họa tiết vòng cung tinh tế phía trên */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-36 overflow-hidden"
        >
          <div className="absolute inset-0 bg-linear-to-b from-primary-light/70 via-surface-muted/40 to-transparent" />
          <svg
            viewBox="0 0 400 160"
            fill="none"
            preserveAspectRatio="none"
            className="w-full h-full opacity-70"
          >
            <circle
              cx="200"
              cy="12"
              r="78"
              stroke="#CBD5E1"
              strokeWidth="1"
              strokeOpacity="0.55"
            />
            <circle
              cx="200"
              cy="12"
              r="104"
              stroke="#CBD5E1"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            <circle
              cx="200"
              cy="12"
              r="130"
              stroke="#93C5FD"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            <circle
              cx="200"
              cy="12"
              r="156"
              stroke="#CBD5E1"
              strokeWidth="1"
              strokeOpacity="0.35"
            />
            <circle
              cx="200"
              cy="12"
              r="182"
              stroke="#CBD5E1"
              strokeWidth="1"
              strokeOpacity="0.25"
            />
          </svg>
        </div>

        {/* Khung Logo nổi cỡ lớn */}
        <div className="relative z-10 mb-5 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-surface-card border border-border-subtle shadow-md p-2.5 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-1">
          <CompanyLogo
            src={company.logo}
            name={company.name}
            size="xl"
            className="w-full h-full border-0 rounded-xl"
          />
        </div>

        {/* Tên công ty */}
        <h3 className="relative z-10 font-bold text-text-primary text-lg leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-3.5 min-h-11 flex items-center justify-center">
          {company.name}
        </h3>

        {/* Danh sách Kỹ năng thay cho "Doanh nghiệp công nghệ IT" */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 min-h-15 content-start">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full text-xs font-medium bg-surface-muted text-text-secondary border border-border-subtle/70"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Phần chân card: Địa điểm + Số việc làm */}
      <div className="bg-surface-page/90 border-t border-border-default px-6 py-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="inline-flex items-center gap-1.5 text-text-muted font-medium truncate min-w-0">
          <MapPin size={14} className="shrink-0 text-text-placeholder" />
          <span className="truncate">{company.location || "Việt Nam"}</span>
        </span>

        {company.jobs > 0 ? (
          <span className="inline-flex items-center gap-1.5 shrink-0 font-semibold text-success-text">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="tabular-nums">{company.jobs} việc làm</span>
            <ChevronRight size={14} className="text-success-text" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 shrink-0 font-semibold text-text-secondary group-hover:text-primary transition-colors">
            <span>Xem công ty</span>
            <ChevronRight size={14} />
          </span>
        )}
      </div>
    </Link>
  );
}
