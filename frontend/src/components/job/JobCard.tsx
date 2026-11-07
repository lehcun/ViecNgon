"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, DollarSign, Clock, Building2, Briefcase } from "lucide-react";
import { JobDetailResponse } from "@viecngon/types";
import { getRelativeTime } from "@/components/NotificationDropdown";

interface JobCardProps {
  job: JobDetailResponse;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function JobCard({ job, isSelected = false, onSelect }: JobCardProps) {
  const company = job.company;
  const companyLogo =
    company?.logo ||
    "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=200&auto=format&fit=crop";

  return (
    <div
      onClick={onSelect}
      className={`group relative bg-white rounded-2xl border p-5 transition-all duration-200 cursor-pointer ${isSelected
          ? "border-primary ring-2 ring-primary/20 bg-primary-light/50 shadow-md"
          : "border-slate-200 hover:border-primary/50 hover:shadow-md"
        }`}
    >
      <div className="flex items-start gap-4">
        {/* Logo Công ty */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border border-slate-100 bg-white p-2 shrink-0 flex items-center justify-center shadow-xs overflow-hidden">
          <img
            src={companyLogo}
            alt={company?.name || "Company Logo"}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/100x100?text=Logo";
            }}
          />
        </div>

        {/* Nội dung công việc */}
        <div className="flex-1 min-w-0">
          {/* Tiêu đề */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
            {job.title}
          </h3>

          {/* Tên công ty */}
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5 line-clamp-1">
            {company?.name}
          </p>

          {/* Mức lương highlight */}
          <div className="mt-2 text-sm font-extrabold text-emerald-600 flex items-center gap-1">
            <DollarSign size={16} className="-ml-0.5 shrink-0" />
            <span>{job.salaryDisplay}</span>
          </div>

          {/* Badges thông tin: Địa điểm, Hình thức, Cấp bậc */}
          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500 font-medium">
            {job.location && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                <MapPin size={12} className="text-slate-400" />
                {job.location}
              </span>
            )}

            {job.workModel && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-light text-primary font-medium">
                  <Briefcase size={12} />
                  {job.workModel}
                </span>
            )}

                {job.level && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800">
                    {job.level}
                  </span>
                )}
              </div>

          {/* Danh sách Kỹ năng Tags */}
            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {job.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="px-1.5 py-0.5 rounded-md text-[11px] text-slate-400">
                    +{job.skills.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Thời gian đăng */}
            <div className="flex items-center justify-between mt-3.5 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                Đăng {getRelativeTime(job.postedAt)}
              </span>

              <span className="text-primary font-semibold group-hover:underline">
                Xem nhanh &rsaquo;
              </span>
            </div>
          </div>
        </div>
      </div>
      );
}

