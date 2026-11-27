"use client";

import React, { useState } from "react";
import Image from "next/image";
import Marquee from "react-fast-marquee";
import EmployerCard from "./EmployerCard";
import { useTopCompanies } from "@/hooks/company/useTopCompanies";
import { FormattedTopCompany } from "@viecngon/types";
import { Reveal } from "@/components/auth/employer-landing/EmployerMotionPrimitives";
import {
  CompanyCardSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/ui/StateViews";

function MarqueeLogo({ name, logo }: { name: string; logo?: string | null }) {
  const [imgErr, setImgErr] = useState(false);
  if (!logo || imgErr) {
    return (
      <span className="text-sm font-bold text-text-muted tracking-tight">
        {name}
      </span>
    );
  }
  return (
    <Image
      src={logo}
      alt={`Logo ${name}`}
      width={120}
      height={40}
      unoptimized
      className="object-contain h-10 w-auto max-w-30"
      onError={() => setImgErr(true)}
    />
  );
}

export default function TopEmployers() {
  const { companies, isLoading, isError, refetch } = useTopCompanies();

  return (
    <section
      id="top-companies"
      className="w-full bg-surface-page py-16 overflow-x-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề khu vực căn giữa */}
        <Reveal className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Nhà tuyển dụng hàng đầu
          </h2>
          <p className="text-sm text-text-muted mt-1.5">
            Các doanh nghiệp công nghệ uy tín đang mở tuyển kỹ sư IT trên
            ViecNgon
          </p>
        </Reveal>

        {/* Trạng thái Loading Skeleton (bố cục 3 + 2 cân đều) */}
        {isLoading ? (
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]"
              >
                <CompanyCardSkeleton />
              </div>
            ))}
          </div>
        ) : isError ? (
          <ErrorState
            title="Không thể tải danh sách công ty"
            onRetry={() => void refetch()}
          />
        ) : !companies || companies.length === 0 ? (
          <EmptyState
            title="Chưa có công ty nổi bật"
            description="Danh sách doanh nghiệp đang tuyển dụng sẽ sớm được cập nhật."
            actionLabel="Xem danh sách việc làm"
            actionHref="/jobs"
          />
        ) : (
          <>
            {/* Marquee Logo */}
            <div className="w-full min-w-0 mb-12 py-4 bg-surface-card border border-border-default rounded-xl overflow-hidden">
              <Marquee
                gradient={true}
                gradientColor="#ffffff"
                speed={36}
                pauseOnHover={true}
              >
                {companies
                  .concat(companies)
                  .map((emp: FormattedTopCompany, index: number) => (
                    <div
                      key={`${emp.id}-${index}`}
                      className="mx-10 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 flex items-center justify-center h-12"
                    >
                      <MarqueeLogo name={emp.name} logo={emp.logo} />
                    </div>
                  ))}
              </Marquee>
            </div>

            {/* Lưới 5 công ty chia 3 trên - 2 dưới căn giữa đều nhau */}
            <div className="flex flex-wrap justify-center gap-6">
              {companies.slice(0, 5).map((company: FormattedTopCompany) => (
                <div
                  key={company.id}
                  className="w-full md:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)] flex"
                >
                  <EmployerCard {...company} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
