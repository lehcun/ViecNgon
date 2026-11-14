"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight, Crown, MapPin } from "lucide-react";
import { FeaturedEmployerBannerItem } from "@viecngon/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { companyKeys } from "@/queries/queryKeys";
import { cn } from "@/lib/utils";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const LAST_SPOTLIGHT_STORAGE_KEY = "viecngon_spotlight_last_company_id";

// Bộ nhớ trên mỗi lần tải trang (reset mỗi khi F5 / reload trình duyệt)
let currentLoadSpotlightId: string | null = null;

function toPlainText(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/<\/(li|p|div|br|h[1-6])>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Banner "Nhà Tuyển Dụng Nổi Bật" (Company Spotlight) cho gói Kim Cương / Doanh nghiệp.
 * Tự động xoay vòng công ty mỗi lần F5 khi có >= 2 công ty đăng ký gói Kim Cương.
 */
export default function FeaturedEmployerBanner() {
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: companies = [], isLoading } = useQuery<
    FeaturedEmployerBannerItem[]
  >({
    queryKey: companyKeys.featuredBanners(),
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/company/featured-banners`, {
        credentials: "include",
      });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });

  // Xoay vòng sang một công ty gói Kim Cương khác mỗi lần ứng viên F5 tải lại trang
  useEffect(() => {
    if (companies.length <= 1) return;

    if (currentLoadSpotlightId) {
      const existingIdx = companies.findIndex(
        (c) => c.companyId === currentLoadSpotlightId,
      );
      if (existingIdx !== -1) {
        setActiveIndex(existingIdx);
        return;
      }
    }

    let nextIndex = 0;
    try {
      const lastCompanyId = window.localStorage.getItem(
        LAST_SPOTLIGHT_STORAGE_KEY,
      );
      if (lastCompanyId) {
        const lastIdx = companies.findIndex(
          (c) => c.companyId === lastCompanyId,
        );
        if (lastIdx !== -1) {
          nextIndex = (lastIdx + 1) % companies.length;
        }
      }
      const nextCompany = companies[nextIndex];
      currentLoadSpotlightId = nextCompany.companyId;
      window.localStorage.setItem(
        LAST_SPOTLIGHT_STORAGE_KEY,
        nextCompany.companyId,
      );
    } catch {
      nextIndex = 0;
    }

    setActiveIndex(nextIndex);
  }, [companies]);

  if (isLoading) {
    return (
      <section className="mb-6 bg-surface-card rounded-xl border border-border-default shadow-sm overflow-hidden animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-3 h-36 lg:h-40 bg-slate-200" />
          <div className="lg:col-span-5 p-5 flex flex-col justify-center gap-2.5">
            <div className="flex items-center gap-2">
              <div className="h-5 w-40 bg-slate-200 rounded" />
              <div className="h-5 w-24 bg-amber-100 rounded" />
            </div>
            <div className="h-3.5 w-28 bg-slate-100 rounded" />
            <div className="h-3.5 w-3/4 bg-slate-100 rounded" />
            <div className="h-4 w-32 bg-blue-100 rounded mt-1" />
          </div>
          <div className="lg:col-span-4 p-5 border-t lg:border-t-0 lg:border-l border-border-default flex flex-col justify-center gap-3">
            <div className="h-4 w-full bg-slate-100 rounded" />
            <div className="h-4 w-5/6 bg-slate-100 rounded" />
            <div className="h-4 w-4/5 bg-slate-100 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (!companies.length) return null;

  const safeIndex = activeIndex < companies.length ? activeIndex : 0;
  const company = companies[safeIndex];
  const spotlightJobs = (company.featuredJobs || []).slice(0, 5);
  const badgeLabel = company.bannerBadgeText?.trim() || "TOP HIRING";

  const handleManualSelect = (idx: number) => {
    setActiveIndex(idx);
    const chosen = companies[idx];
    if (chosen) {
      currentLoadSpotlightId = chosen.companyId;
      try {
        window.localStorage.setItem(
          LAST_SPOTLIGHT_STORAGE_KEY,
          chosen.companyId,
        );
      } catch {
        // Ignore storage errors in private mode
      }
    }
  };

  return (
    <section
      aria-label="Nhà tuyển dụng nổi bật"
      className="relative mb-6 bg-surface-card rounded-xl border border-border-default shadow-sm overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Cột trái: Ảnh nền tùy chỉnh (hoặc gradient) + Ribbon + Logo chồng mép */}
        <div className="lg:col-span-3 relative min-h-[148px] lg:min-h-[176px] flex items-center justify-between lg:justify-end">
          {company.bannerCoverUrl ? (
            <div className="absolute inset-0 overflow-hidden bg-slate-900">
              <img
                src={company.bannerCoverUrl}
                alt={`Banner ${company.companyName}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/45 via-slate-900/20 to-transparent" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-hover to-sky-700 overflow-hidden">
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 25% 30%, rgba(255,255,255,0.45) 0, transparent 45%), linear-gradient(120deg, rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(240deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                  backgroundSize: "100% 100%, 24px 24px, 24px 24px",
                }}
              />
            </div>
          )}

          {/* Nhãn góc trên bên trái giống Company Spotlight */}
          <div className="absolute top-3 left-0 z-10 inline-flex items-center px-3 py-1 rounded-r-md bg-warning text-white text-xs font-bold shadow-sm">
            Nhà tuyển dụng nổi bật
          </div>

          {/* Khung Logo công ty nổi bật chồng qua mép phải cột visual */}
          <Link
            href={`/company/${company.slug}`}
            className="relative z-10 mx-auto lg:mx-0 lg:-mr-10 mt-6 lg:mt-0 w-24 h-24 rounded-xl bg-surface-card border border-border-default shadow-md p-2 flex items-center justify-center hover:scale-[1.02] transition-transform"
          >
            <CompanyLogo
              src={company.logo}
              name={company.companyName}
              size="lg"
              className="border-0 bg-transparent shadow-none"
            />
          </Link>
        </div>

        {/* Cột giữa: Tên công ty, badge tùy chỉnh, thành phố, slogan & link xem việc làm */}
        <div
          className={cn(
            "px-5 py-4 lg:pl-14 lg:pr-6 flex flex-col justify-center",
            spotlightJobs.length > 0 ? "lg:col-span-5" : "lg:col-span-9",
          )}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/company/${company.slug}`}
              className="text-base font-bold text-text-primary hover:text-primary transition-colors line-clamp-1"
            >
              {company.companyName}
            </Link>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-warning text-white text-[11px] font-extrabold tracking-wide shrink-0">
              <Crown size={11} className="fill-white" />
              {badgeLabel}
            </span>
          </div>

          {company.city && (
            <div className="flex items-center gap-1.5 text-xs text-text-muted mt-1.5">
              <MapPin size={13} className="shrink-0 text-text-placeholder" />
              <span className="truncate">{company.city}</span>
            </div>
          )}

          <p className="text-xs sm:text-sm text-text-secondary line-clamp-2 mt-2 leading-relaxed">
            {toPlainText(company.tagline) ||
              "Doanh nghiệp công nghệ nổi bật đang mở tuyển kỹ sư IT"}
          </p>

          <div className="mt-3 flex items-center justify-between gap-2">
            <Link
              href={`/company/${company.slug}`}
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <span>
                {company.activeJobsCount > 0
                  ? `Xem ${company.activeJobsCount} việc làm`
                  : "Xem trang công ty"}
              </span>
              <ChevronRight size={15} />
            </Link>

            {companies.length > 1 && (
              <div
                className="flex items-center gap-1.5"
                title="Tự động luân phiên nhà tuyển dụng Kim Cương mỗi lần tải lại trang"
              >
                {companies.map((c, idx) => (
                  <button
                    key={c.companyId}
                    type="button"
                    aria-label={`Xem nhà tuyển dụng nổi bật ${c.companyName}`}
                    onClick={() => handleManualSelect(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      idx === safeIndex
                        ? "w-5 bg-primary"
                        : "w-1.5 bg-border-strong hover:bg-text-placeholder",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cột phải: 0 -> 5 việc làm nổi bật được HR chọn hiển thị */}
        {spotlightJobs.length > 0 && (
          <div className="lg:col-span-4 px-5 py-4 border-t lg:border-t-0 lg:border-l border-dashed border-border-default flex flex-col justify-center gap-2 bg-surface-card">
            {spotlightJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="group flex items-center gap-2.5 text-xs sm:text-sm font-medium text-text-primary hover:text-primary transition-colors"
              >
                <span className="w-4 h-4 rounded-full border border-danger-border bg-danger-bg/60 text-danger flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary-light group-hover:text-primary transition-colors">
                  <ArrowRight size={10} />
                </span>
                <span className="truncate">{job.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
