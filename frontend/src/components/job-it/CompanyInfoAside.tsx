"use client";

import React from "react";
import { JobDetailResponse } from "@viecngon/types";
import {
  Building2,
  Globe,
  MapPin,
  Clock,
  Briefcase,
  Users,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CompanyInfoAsideProps {
  company?: JobDetailResponse["company"];
  isLoading?: boolean;
}

export default function CompanyInfoAside({
  company,
  isLoading = false,
}: CompanyInfoAsideProps) {
  if (isLoading) {
    return (
      <div className="sticky top-24 bg-white rounded-2xl shadow-xs border border-slate-200 p-6 space-y-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-slate-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-3 pt-3 border-t border-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!company) {
    return null;
  }

  const logoUrl =
    company.logo ||
    "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=200&auto=format&fit=crop";

  return (
    <div className="sticky top-24 flex flex-col gap-6">
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6">
        {/* Header: Logo & Name */}
        <div className="flex items-start gap-4 mb-5">
          <Link
            href={`/company/${company.slug}`}
            className="w-16 h-16 sm:w-20 sm:h-20 border border-slate-100 rounded-xl p-2 bg-white shadow-xs shrink-0 flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity"
          >
            <img
              src={logoUrl}
              alt={company.name || "Company Logo"}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/100x100?text=Logo";
              }}
            />
          </Link>
          <div className="min-w-0 flex-1">
            <Link
              href={`/company/${company.slug}`}
              className="text-base sm:text-lg font-bold text-slate-800 line-clamp-2 hover:text-primary transition-colors block"
            >
              {company.name}
            </Link>
            <div className="inline-flex items-center gap-1 mt-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
              <ShieldCheck size={14} />
              <span>Đã xác thực</span>
            </div>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="space-y-3.5 text-xs sm:text-sm border-t border-slate-100 pt-4">
          {/* Địa chỉ trụ sở */}
          {company.address && (
            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-slate-500 shrink-0 inline-flex items-center gap-1.5">
                <MapPin size={15} className="text-slate-400" /> Trụ sở
              </span>
              <span className="font-medium text-slate-800 text-right">
                {company.address}
              </span>
            </div>
          )}

          {/* Mô hình công ty */}
          {company.companyModel && (
            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-slate-500 shrink-0 inline-flex items-center gap-1.5">
                <Building2 size={15} className="text-slate-400" /> Mô hình
              </span>
              <span className="font-medium text-slate-800 text-right">
                {company.companyModel}
              </span>
            </div>
          )}

          {/* Lĩnh vực hoạt động */}
          {company.industry && (
            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-slate-500 shrink-0 inline-flex items-center gap-1.5">
                <Briefcase size={15} className="text-slate-400" /> Lĩnh vực
              </span>
              <span className="font-medium text-slate-800 text-right">
                {company.industry}
              </span>
            </div>
          )}

          {/* Quy mô nhân sự */}
          {company.size && (
            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-slate-500 shrink-0 inline-flex items-center gap-1.5">
                <Users size={15} className="text-slate-400" /> Quy mô
              </span>
              <span className="font-medium text-slate-800 text-right">
                {company.size}
              </span>
            </div>
          )}

          {/* Giờ làm việc */}
          {company.workingTime && (
            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-slate-500 shrink-0 inline-flex items-center gap-1.5">
                <Clock size={15} className="text-slate-400" /> Giờ làm việc
              </span>
              <span className="font-medium text-slate-800 text-right">
                {company.workingTime}
              </span>
            </div>
          )}

          {/* Chính sách OT */}
          {company.otPolicy && (
            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-slate-500 shrink-0">Chính sách OT</span>
              <span className="font-medium text-slate-800 text-right">
                {company.otPolicy}
              </span>
            </div>
          )}

          {/* Quốc gia */}
          {company.country && (
            <div className="flex justify-between items-start gap-3 border-b border-slate-100 pb-3">
              <span className="text-slate-500 shrink-0">Quốc gia</span>
              <span className="font-medium text-slate-800 text-right">
                {company.country}
              </span>
            </div>
          )}

          {/* Website công ty */}
          {company.website && (
            <div className="flex justify-between items-center gap-3 pt-1">
              <span className="text-slate-500 shrink-0 inline-flex items-center gap-1.5">
                <Globe size={15} className="text-slate-400" /> Website
              </span>
              <a
                href={
                  company.website.startsWith("http")
                    ? company.website
                    : `https://${company.website}`
                }
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1 max-w-[180px] truncate"
              >
                {company.website.replace(/^https?:\/\//, "")}
                <ExternalLink size={13} className="shrink-0" />
              </a>
            </div>
          )}
        </div>

        {/* Nút Xem trang công ty */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <Link
            href={`/company/${company.slug}`}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl border border-primary/30 text-primary hover:bg-primary-light font-bold text-xs sm:text-sm transition-colors text-center"
          >
            Xem trang công ty &rsaquo;
          </Link>
        </div>
      </div>
    </div>
  );
}
