"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { FormattedTopCompany } from "@viecngon/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export default function EmployerCard(company: FormattedTopCompany) {
  return (
    <Link
      href={`/company/${company.slug}`}
      className="group flex flex-col justify-between w-full bg-surface-card border border-border-default rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Phần trên: Logo & Tên công ty */}
      <div className="p-6 flex flex-col items-center text-center">
        <div className="mb-4 transition-transform duration-200 group-hover:-translate-y-0.5">
          <CompanyLogo src={company.logo} name={company.name} size="xl" />
        </div>

        <h3 className="font-semibold text-text-primary text-base line-clamp-1 group-hover:text-primary transition-colors">
          {company.name}
        </h3>
        <p className="text-xs text-text-muted mt-1">
          Doanh nghiệp công nghệ IT
        </p>
      </div>

      {/* Phần chân card: Địa điểm + Số việc đang tuyển */}
      <div className="bg-surface-page border-t border-border-default px-5 py-3.5 flex items-center justify-between gap-2 text-xs">
        <span className="inline-flex items-center gap-1 text-text-muted font-medium truncate min-w-0">
          <MapPin size={13} className="shrink-0 text-text-placeholder" />
          <span className="truncate">{company.location || "Việt Nam"}</span>
        </span>

        <span className="inline-flex items-center gap-1.5 shrink-0 font-semibold text-success-text bg-success-light px-2.5 py-0.5 rounded-full border border-success-border">
          <span className="w-1.5 h-1.5 rounded-full bg-success" />
          <span className="tabular-nums">{company.jobs} việc làm</span>
          <ChevronRight size={13} className="text-success-text" />
        </span>
      </div>
    </Link>
  );
}
