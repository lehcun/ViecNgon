"use client";

import React from "react";
import {
  MapPin,
  Star,
  ThumbsUp,
  Building2,
  Users,
  Clock,
  Globe,
  Award,
  ExternalLink,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useCompanyDetail } from "@/hooks/company/useCompanyDetail";
import CompanyJobLists from "./CompanyJobLists";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DetailPaneSkeleton, ErrorState, JobCardSkeleton } from "@/components/ui/StateViews";

export default function CompanyDetailModel() {
  const params = useParams();
  const rawSlug = params.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : (rawSlug as string);

  const { company, isLoading, isError } = useCompanyDetail(slug);

  if (isLoading) {
    return (
      <div className="bg-surface-page pb-16">
        <div className="bg-primary-dark pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-6 animate-pulse">
            <div className="w-24 h-24 rounded-xl bg-white/10 shrink-0" />
            <div className="space-y-3 flex-1">
              <div className="h-8 bg-white/15 rounded w-64" />
              <div className="h-4 bg-white/10 rounded w-48" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <DetailPaneSkeleton />
          </div>
          <div className="lg:col-span-4 space-y-4">
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !company) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-28">
        <ErrorState
          title="Không tìm thấy thông tin công ty"
          message="Hồ sơ công ty này hiện không khả dụng hoặc đường dẫn không tồn tại."
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-page pb-16">
      {/* 1. HEADER BANNER */}
      <section className="bg-linear-to-br from-primary-dark via-[#13294b] to-primary-dark pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <CompanyLogo src={company.logo} name={company.name} size="xl" />
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={15} className="text-primary-disabled" />
                  <span>{company.location || "Việt Nam"}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={15} className="text-primary-disabled" />
                  <span className="tabular-nums">
                    {company.totalJobs} việc làm đang tuyển dụng
                  </span>
                </span>
              </div>
              <div className="flex flex-wrap gap-3 mt-4">
                <a
                  href="#company-jobs"
                  className="h-9 inline-flex items-center px-4 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Xem việc làm đang tuyển
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 flex gap-6 border border-white/15 shrink-0">
            <div className="text-center">
              <div className="flex items-end gap-1.5 justify-center">
                <span className="text-2xl font-bold text-white tabular-nums">4.8</span>
                <div className="flex text-amber-400 pb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-1">Đánh giá tích cực</p>
            </div>
            <div className="w-px bg-white/15" />
            <div className="text-center flex flex-col justify-center">
              <span className="text-2xl font-bold text-emerald-400 tabular-nums">97%</span>
              <p className="text-xs text-slate-300 mt-1">
                Khuyên làm việc tại đây
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI (8/12) */}
        <div className="lg:col-span-8 flex flex-col gap-6 min-w-0">
          {/* Thông tin chung */}
          <div className="bg-surface-card rounded-xl border border-border-default p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-5 border-l-4 border-primary pl-3">
              Thông tin chung
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 text-sm">
              <div>
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
                  <Building2 size={14} /> Mô hình công ty
                </p>
                <p className="font-semibold text-text-primary">
                  {company.companyModel || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
                  <Building2 size={14} /> Lĩnh vực
                </p>
                <p className="font-semibold text-text-primary">
                  {company.industry || "Công nghệ thông tin"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
                  <Users size={14} /> Quy mô nhân sự
                </p>
                <p className="font-semibold text-text-primary">
                  {company.size || "Chưa cập nhật"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
                  <Globe size={14} /> Quốc gia
                </p>
                <p className="font-semibold text-text-primary">
                  {company.country || "Việt Nam"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
                  <Clock size={14} /> Thời gian làm việc
                </p>
                <p className="font-semibold text-text-primary">
                  {company.workingTime ?? "Thứ 2 - Thứ 6"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1.5">
                  <Clock size={14} /> Chính sách OT
                </p>
                <p className="font-semibold text-text-primary">
                  {company.otPolicy ?? "Theo quy định công ty"}
                </p>
              </div>
            </div>
          </div>

          {/* Giải thưởng */}
          <div className="bg-primary-light/60 rounded-xl border border-primary-subtle p-6">
            <h2 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2">
              <Award size={20} /> Giải thưởng &amp; Ghi nhận
            </h2>
            <div className="flex items-center justify-between bg-surface-card p-4 rounded-lg border border-border-default gap-4">
              <div className="font-semibold text-text-primary text-sm flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary shrink-0">
                  <Award size={16} />
                </div>
                <span>Top Doanh nghiệp Công nghệ IT tiêu biểu</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
                <span className="inline-flex items-center gap-1 text-text-secondary">
                  <Star size={14} className="text-amber-500" fill="currentColor" />
                  5.0
                </span>
                <span className="inline-flex items-center gap-1 text-success-text">
                  <ThumbsUp size={14} /> 100%
                </span>
              </div>
            </div>
          </div>

          {/* Giới thiệu công ty */}
          <div className="bg-surface-card rounded-xl border border-border-default p-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4 border-l-4 border-primary pl-3">
              Giới thiệu công ty
            </h2>

            {company.description ? (
              <div
                className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed mb-6"
                dangerouslySetInnerHTML={{ __html: company.description }}
              />
            ) : (
              <p className="text-sm text-text-muted italic mb-6">
                Chưa có mô tả chi tiết về công ty.
              </p>
            )}

            {company.website && (
              <div className="bg-surface-page border border-border-default rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-0.5">
                    <Globe size={16} className="text-primary" /> Website chính thức
                  </h3>
                  <p className="text-xs text-text-muted">
                    Tìm hiểu thêm về sản phẩm và văn hóa doanh nghiệp
                  </p>
                </div>
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 inline-flex items-center gap-1.5 px-4 bg-surface-card border border-primary text-primary text-xs font-semibold rounded-lg hover:bg-primary-light transition-colors shrink-0"
                >
                  <span>Truy cập website</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Phúc lợi */}
          {company.benefits && (
            <div className="bg-surface-card rounded-xl border border-border-default p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 border-l-4 border-primary pl-3">
                Phúc lợi &amp; Đãi ngộ
              </h2>
              <div
                className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: company.benefits }}
              />
            </div>
          )}

          {/* Về chúng tôi */}
          {company.aboutMe && (
            <div className="bg-surface-card rounded-xl border border-border-default p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-4 border-l-4 border-primary pl-3">
                Văn hóa &amp; Con người
              </h2>
              <div
                className="prose prose-sm prose-slate max-w-none text-text-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: company.aboutMe }}
              />
            </div>
          )}
        </div>

        {/* CỘT PHẢI (4/12): DANH SÁCH VIỆC LÀM */}
        <div id="company-jobs" className="lg:col-span-4 min-w-0">
          <CompanyJobLists
            totalJobs={company.totalJobs}
            jobs={company.activeJobs}
          />
        </div>
      </section>
    </div>
  );
}
