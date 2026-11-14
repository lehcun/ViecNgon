"use client";

import React from "react";
import Link from "next/link";
import { Crown, ChevronRight, Sparkles } from "lucide-react";
import { useFeaturedBanners } from "@/hooks/company/useFeaturedBanners";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

export default function FeaturedEmployerBanner() {
  const { data: banners = [], isLoading } = useFeaturedBanners();

  if (isLoading) {
    return (
      <div className="mt-6 bg-surface-card border border-border-default rounded-xl p-4 animate-pulse flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-surface-subtle" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-surface-subtle rounded" />
            <div className="h-3 w-64 bg-surface-muted rounded" />
          </div>
        </div>
        <div className="h-9 w-32 bg-surface-subtle rounded-lg" />
      </div>
    );
  }

  if (!banners.length) {
    return null;
  }

  return (
    <section
      aria-label="Nhà tuyển dụng nổi bật"
      className="mt-6 space-y-3"
    >
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ai">
        <Crown size={14} />
        <span>Nhà tuyển dụng nổi bật</span>
      </div>

      <div
        className={`grid grid-cols-1 ${
          banners.length > 1 ? "md:grid-cols-2" : ""
        } gap-4`}
      >
        {banners.map((item) => (
          <Link
            key={item.companyId}
            href={`/company/${item.slug}`}
            className="group relative overflow-hidden rounded-xl border border-ai-border bg-linear-to-r from-ai-light/80 via-surface-card to-primary-light/70 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs hover:shadow-md hover:border-primary/50 transition-all"
          >
            <div className="flex items-center gap-4 min-w-0">
              <CompanyLogo src={item.logo} name={item.companyName} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-bold text-text-primary group-hover:text-primary transition-colors truncate">
                    {item.companyName}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-ai-light text-ai border border-ai-border shrink-0">
                    <Sparkles size={10} /> Đối tác Kim Cương
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                  {item.tagline}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-success-light text-success-text border border-success-border tabular-nums">
                {item.activeJobsCount} việc làm
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                <span className="hidden sm:inline">Xem công ty</span>
                <ChevronRight size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
