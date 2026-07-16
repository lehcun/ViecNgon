"use client";

import React from "react";
import Image from "next/image";
import { Clock, Mail, FileText, ExternalLink, Loader2 } from "lucide-react";
import { useUpdateApplicationStatus } from "@/hooks/recruiter/useUpdateApplicationStatus";
import { ApplicationItem } from "@viecngon/types";
import Link from "next/link";

// Hàm helper tô màu nhãn trạng thái chuẩn UI/UX
const getStatusBadge = (status: string) => {
  switch (status) {
    case "CHO_DUYET":
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          Chờ duyệt
        </span>
      );
    case "DANG_XEM_XET":
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
          Đang xem xét
        </span>
      );
    case "PHONG_VAN":
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
          Phỏng vấn
        </span>
      );
    case "DUOC_NHAN":
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
          Được nhận
        </span>
      );
    case "BI_LOAI":
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-rose-100 text-rose-700">
          Bị loại
        </span>
      );
    default:
      return null;
  }
};

export default function CandidateCard({
  application,
}: {
  application: ApplicationItem;
}) {
  const { mutate: updateStatus, isPending } = useUpdateApplicationStatus();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    updateStatus({ maDon: application.applicationId, status: newStatus });
  };

  return (
    <Link
      href={`/applications/${application.applicationId}`}
      className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-primary/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      {/* Cột trái: Thông tin ứng viên */}
      <div className="flex items-start gap-4 flex-1">
        {/* Avatar */}
        {application.avatarUrl ? (
          <Image
            src={application.avatarUrl}
            alt={application.candidateName}
            width={56}
            height={56}
            className="rounded-full object-cover shrink-0 border border-slate-100"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-primary-light text-primary flex items-center justify-center font-bold text-xl shrink-0 uppercase">
            {application.candidateName.charAt(0)}
          </div>
        )}

        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-lg font-bold text-slate-800">
              {application.candidateName}
            </h3>
            {getStatusBadge(application.status)}
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
            <Mail size={14} className="text-slate-400" />
            <span>{application.contactEmail}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-500">
            <span className="font-medium text-slate-700 flex items-center gap-1">
              Ứng tuyển:{" "}
              <span className="text-primary">{application.jobTitle}</span>
            </span>
            <span className="hidden sm:block text-slate-300">|</span>
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {new Date(application.appliedAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Cột phải: Hành động (Xem CV & Đổi trạng thái) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
        {/* Nút Xem CV */}
        {application.cvUrl ? (
          <a
            href={application.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 transition-colors flex items-center justify-center gap-2"
          >
            <FileText size={16} className="text-blue-500" /> Xem CV{" "}
            <ExternalLink size={14} />
          </a>
        ) : (
          <span className="text-sm text-slate-400 italic">Không có CV</span>
        )}

        {/* Dropdown Đổi Trạng thái */}
        <div className="relative w-full sm:w-auto">
          <select
            value={application.status}
            onChange={handleStatusChange}
            disabled={isPending}
            className="w-full sm:w-40 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-primary disabled:opacity-50 appearance-none cursor-pointer"
          >
            <option value="CHO_DUYET">Chờ duyệt</option>
            <option value="DANG_XEM_XET">Đang xem xét</option>
            <option value="PHONG_VAN">Phỏng vấn</option>
            <option value="DUOC_NHAN">Được nhận</option>
            <option value="BI_LOAI">Bị loại</option>
          </select>
          {isPending && (
            <Loader2
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-primary pointer-events-none"
            />
          )}
        </div>
      </div>
    </Link>
  );
}
