"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  CircleDollarSign,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AppliedJobItem } from "@viecngon/types"; // Import type chuẩn từ hệ thống[cite: 6]
import ApplicationTracker from "./ApplicationTracker";
import InterviewDetails from "./InterviewDetails";

interface JobCardProps {
  item: AppliedJobItem;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function AppliedJobCard({
  item,
  isExpanded,
  onToggle,
}: JobCardProps) {
  const isExpired =
    item.job.status === "EXPIRED" || item.job.status === "Hết hạn";

  // Hàm map text trạng thái
  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      CHO_DUYET: "Đã gửi đơn ứng tuyển",
      DA_XEM: "Nhà tuyển dụng đã xem hồ sơ",
      PHU_HOP: "Hồ sơ phù hợp",
      PHONG_VAN: "Được mời phỏng vấn",
      TRUNG_TUYEN: "Trúng tuyển",
      KHONG_PHU_HOP: "Hồ sơ chưa phù hợp",
    };
    return statusMap[status] || "Đang xử lý";
  };

  return (
    <article className="border border-slate-200 rounded-xl overflow-hidden shadow-sm bg-white hover:border-primary/40 transition-colors">
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Info */}
        <div className="flex items-start gap-4 flex-1">
          <div className="w-14 h-14 rounded-xl border border-slate-100 flex items-center justify-center shrink-0 shadow-sm p-1 bg-white overflow-hidden">
            <Image
              src={item.job.company?.logo || "/images/default-company.png"}
              alt={item.job.company?.name || "Company"}
              width={56}
              height={56}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1 min-w-0">
            <Link href={`/job-it/${item.job.slug}`}>
              <h2 className="text-base md:text-lg font-bold text-slate-900 leading-snug hover:text-primary transition-colors line-clamp-1">
                {item.job.title}
              </h2>
            </Link>
            <p className="text-sm text-slate-500 font-medium mt-0.5 truncate">
              {item.job.company?.name}
            </p>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs md:text-sm text-slate-500 mt-2.5">
              <span className="flex items-center gap-1">
                <MapPin size={14} className="text-slate-400" />
                {item.job.location || "Toàn quốc"} • {item.job.workModel}
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-600">
                <CircleDollarSign size={14} />
                {item.job.salaryDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Date & Badge */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-2.5 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
          <span className="text-xs text-slate-500">
            Đã ứng tuyển:{" "}
            <strong className="text-slate-800 font-bold">
              {new Date(item.appliedDate).toLocaleDateString("vi-VN")}
            </strong>
          </span>
          <span
            className={`inline-block px-3 py-1 text-[11px] font-bold uppercase tracking-wide border rounded-full ${
              isExpired
                ? "bg-slate-50 text-slate-500 border-slate-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200/60"
            }`}
          >
            {isExpired ? "Hết hạn" : "Đang tuyển"}
          </span>
        </div>
      </div>

      {/* Accordion Trigger */}
      <button
        onClick={onToggle}
        className="w-full px-5 md:px-6 py-3 border-t border-slate-100 flex items-center justify-between text-left hover:bg-slate-50 transition-colors focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <CheckCircle2 size={16} className="text-primary" />
          <span className="text-sm font-bold text-slate-800">
            {getStatusText(item.applicationStatus)}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp size={18} className="text-primary" />
        ) : (
          <ChevronDown size={18} className="text-primary" />
        )}
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-5 md:p-6 bg-slate-50/70 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
          <ApplicationTracker
            status={item.applicationStatus}
            appliedDate={item.appliedDate}
          />

          {/* Hiện thẻ Phỏng vấn nếu status là PHONG_VAN */}
          {item.applicationStatus === "PHONG_VAN" && <InterviewDetails />}
        </div>
      )}
    </article>
  );
}
