"use client";

import React from "react";
import Link from "next/link";
import {
  ExternalLink,
  MapPin,
  Briefcase,
  Award,
  Clock,
  Send,
  Globe,
  Users,
} from "lucide-react";
import { JobDetailResponse } from "@viecngon/types";

interface JobDetailPreviewPaneProps {
  job: JobDetailResponse | null;
}

export default function JobDetailPreviewPane({ job }: JobDetailPreviewPaneProps) {
  if (!job) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-400 sticky top-24 shadow-xs">
        <Briefcase size={40} className="mx-auto mb-3 opacity-40 text-slate-400" />
        <p className="text-sm font-semibold text-slate-600">
          Chọn một công việc để xem nhanh thông tin chi tiết
        </p>
      </div>
    );
  }

  const company = job.company;
  const companyLogo =
    company?.logo ||
    "https://images.unsplash.com/photo-1549923746-c502d488b3ea?q=80&w=200&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-7 shadow-xs sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
      {/* 1. Header: Logo, Tên, Công ty */}
      <div className="flex items-start gap-4 pb-5 border-b border-slate-100">
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl border border-slate-100 p-2 shrink-0 bg-white flex items-center justify-center shadow-xs overflow-hidden">
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

        <div className="flex-1 min-w-0">
          <Link
            href={`/jobs/${job.slug}`}
            className="text-lg sm:text-xl font-bold text-slate-900 leading-snug hover:text-primary transition-colors block"
          >
            {job.title}
          </Link>
          <p className="text-sm font-medium text-slate-600 mt-1 line-clamp-1">
            {company?.name}
          </p>

          <div className="mt-2 text-base sm:text-lg font-black text-emerald-600">
            {job.salaryDisplay}
          </div>
        </div>
      </div>

      {/* 2. Nút Hành động */}
      <div className="flex items-center gap-3 py-4 border-b border-slate-100">
        <Link
          href={`/jobs/${job.slug}`}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-xl shadow-md shadow-primary/25 transition-all text-center cursor-pointer"
        >
          <Send size={16} />
          <span>Ứng tuyển ngay</span>
        </Link>

        <Link
          href={`/jobs/${job.slug}`}
          target="_blank"
          className="p-3 border border-slate-200 hover:border-primary hover:text-primary rounded-xl text-slate-600 transition-colors cursor-pointer"
          title="Mở trong tab mới"
        >
          <ExternalLink size={18} />
        </Link>
      </div>

      {/* 3. Lưới thông số quan trọng (Được mở rộng hiển thị 4 cột) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin size={16} className="text-slate-400 shrink-0" />
          <span className="truncate">{job.location || "Toàn quốc"}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Briefcase size={16} className="text-slate-400 shrink-0" />
          <span className="truncate">{job.workModel || "Linh hoạt"}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Award size={16} className="text-slate-400 shrink-0" />
          <span className="truncate">{job.level || "Tất cả cấp bậc"}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <Clock size={16} className="text-slate-400 shrink-0" />
          <span className="truncate">
            {job.experience ? `${job.experience} năm KN` : "Không yêu cầu KN"}
          </span>
        </div>
      </div>

      {/* 4. Kỹ năng yêu cầu */}
      {job.skills && job.skills.length > 0 && (
        <div className="py-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Kỹ năng chuyên môn
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {job.skills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-primary-light text-primary border border-primary/20"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 5. Mô tả công việc */}
      <div className="py-4 border-b border-slate-100">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          Mô tả công việc
        </h3>
        {job.description ? (
          <div
            className="text-xs sm:text-sm text-slate-700 prose prose-slate max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        ) : (
          <p className="text-xs text-slate-400 italic">Chưa có mô tả chi tiết.</p>
        )}
      </div>

      {/* 6. Yêu cầu công việc */}
      {job.requirements && (
        <div className="py-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Yêu cầu ứng viên
          </h3>
          <div
            className="text-xs sm:text-sm text-slate-700 prose prose-slate max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.requirements }}
          />
        </div>
      )}

      {/* 7. Quyền lợi / Phúc lợi */}
      {job.benefits && (
        <div className="py-4 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Quyền lợi & Phúc lợi
          </h3>
          <div
            className="text-xs sm:text-sm text-slate-700 prose prose-slate max-w-none leading-relaxed"
            dangerouslySetInnerHTML={{ __html: job.benefits }}
          />
        </div>
      )}

      {/* 8. Thông tin công ty */}
      {company && (
        <div className="pt-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
            Về công ty
          </h3>
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-3">
            {company.industry || company.companyModel || "Công ty công nghệ"}
          </p>

          <div className="space-y-1.5 text-xs text-slate-500">
            {company.size && (
              <p className="flex items-center gap-2">
                <Users size={14} className="text-slate-400" /> Quy mô: {company.size}
              </p>
            )}
            {company.website && (
              <p className="flex items-center gap-2">
                <Globe size={14} className="text-slate-400" />
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate"
                >
                  {company.website.replace(/^https?:\/\//, "")}
                </a>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
