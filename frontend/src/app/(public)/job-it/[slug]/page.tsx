"use client";

import { useParams } from "next/navigation";
import CompanyInfoAside from "@/components/job-it/CompanyInfoAside";
import JobDetailMain from "@/components/job-it/JobDetailMain";
import { useJobDetail } from "@/hooks/job/useJobDetail";

export default function JobDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { job } = useJobDetail(slug);

  return (
    <div className="relative">
      {/* Background Banner (Curve Pattern) */}
      <div className="absolute top-0 left-0 w-full h-100 bg-primary-dark overflow-hidden z-0">
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

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* ==================== CỘT TRÁI (THÔNG TIN CHÍNH) ==================== */}
          <div className="w-full lg:w-2/3 flex flex-col gap-6">
            <JobDetailMain job={job} />
          </div>

          {/* ==================== CỘT PHẢI (THÔNG TIN CÔNG TY) ==================== */}
          <div className="w-full lg:w-1/3">
            <CompanyInfoAside company={job?.company} />
          </div>
        </div>
      </main>
    </div>
  );
}
