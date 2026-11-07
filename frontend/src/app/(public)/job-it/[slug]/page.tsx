"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import CompanyInfoAside from "@/components/job-it/CompanyInfoAside";
import JobDetailMain from "@/components/job-it/JobDetailMain";
import { useJobDetail } from "@/hooks/job/useJobDetail";

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { job, isLoading } = useJobDetail(slug);

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Background Banner (Curve Pattern) */}
      <div className="absolute top-0 left-0 w-full h-80 bg-primary-dark overflow-hidden z-0">
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 120"
          fill="none"
        >
          <path
            d="M0,0 C480,160 960,160 1440,0 L1440,120 L0,120 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>

      {/* Main Content with comfortable margin from fixed Header Navbar */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-20">
        {/* Navigation Breadcrumb / Back button */}
        <div className="mb-5">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            <span>Quay lại danh sách việc làm</span>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ==================== CỘT TRÁI (THÔNG TIN CHÍNH - 70%) ==================== */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <JobDetailMain job={job} isLoading={isLoading} />
          </div>

          {/* ==================== CỘT PHẢI (THÔNG TIN CÔNG TY - 30%) ==================== */}
          <div className="w-full lg:w-1/3">
            <CompanyInfoAside company={job?.company} isLoading={isLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
