"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  CircleDollarSign,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Clock,
  Eye,
  CalendarCheck,
  Briefcase,
} from "lucide-react";
import { useAppliedJobs } from "@/hooks/candidate/useAppliedJobs";

export default function AppliedJobsPage() {
  const [activeTab, setActiveTab] = useState<"APPLIED" | "SAVED" | "VIEWED">(
    "APPLIED",
  );
  // Lưu applicationId đang được mở (expand) để xem tiến trình trạng thái
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Gọi Hook lấy dữ liệu từ Backend
  const { appliedJobs, isLoading, isError, error } = useAppliedJobs();

  const toggleExpand = (id: string) => {
    setExpandedJobId(expandedJobId === id ? null : id);
  };

  // Helper function render trạng thái đơn ứng tuyển (Tracker) đồng bộ với Backend
  const renderStatusTracker = (status: string) => {
    const steps = [
      { id: "CHO_DUYET", label: "Đã gửi đơn", icon: Clock },
      { id: "DA_XEM", label: "NTD đã xem", icon: Eye },
      { id: "PHONG_VAN", label: "Phỏng vấn", icon: CalendarCheck },
      { id: "RESULT", label: "Kết quả", icon: CheckCircle2 },
    ];

    let currentIndex = 0;
    if (status === "DA_XEM" || status === "PHU_HOP") currentIndex = 1;
    if (status === "PHONG_VAN") currentIndex = 2;
    if (status === "TRUNG_TUYEN" || status === "KHONG_PHU_HOP")
      currentIndex = 3;

    return (
      <div className="flex items-center justify-between w-full max-w-2xl mt-4 px-2 sm:px-8 py-4 bg-slate-50 rounded-lg border border-slate-100 mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index <= currentIndex;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center relative z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  isCompleted
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-slate-200 text-slate-400"
                }`}
              >
                <Icon size={16} />
              </div>
              <span
                className={`text-[11px] sm:text-xs font-semibold ${
                  isCompleted ? "text-primary-dark" : "text-slate-400"
                }`}
              >
                {step.label}
              </span>

              {/* Đường line kết nối (trừ item cuối cùng) */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                    index < currentIndex ? "bg-primary" : "bg-slate-200"
                  }`}
                  style={{ width: "calc(100% + 40px)", left: "50%" }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // 1. Giao diện Loading
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-4">
        <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-6"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  // 2. Giao diện báo Lỗi
  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center text-rose-500 font-medium">
        {error || "Đã có lỗi xảy ra khi tải dữ liệu."}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* ================= HEADER & TABS ================= */}
      <div className="px-6 pt-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Briefcase className="text-primary" /> Việc làm của tôi
        </h1>

        <div className="flex items-center gap-6 md:gap-8 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab("APPLIED")}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "APPLIED"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Đã ứng tuyển
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === "APPLIED"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {appliedJobs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("SAVED")}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "SAVED"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Việc làm đã lưu
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === "SAVED"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              0
            </span>
          </button>

          <button
            onClick={() => setActiveTab("VIEWED")}
            className={`pb-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === "VIEWED"
                ? "border-primary text-primary"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Đã xem gần đây
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === "VIEWED"
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              0
            </span>
          </button>
        </div>
      </div>

      {/* ================= INFO BAR & FILTER ================= */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-start gap-2 text-sm text-slate-600">
            <Info size={18} className="text-primary shrink-0 mt-0.5" />
            <p>
              Việc làm đã ứng tuyển được lưu trữ trong 12 tháng qua.{" "}
              <Link
                href="#"
                className="text-primary font-semibold hover:underline inline-flex items-center gap-1"
              >
                Tìm hiểu về trạng thái ứng tuyển
              </Link>
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm shrink-0">
            <span className="text-slate-500">Sắp xếp theo:</span>
            <div className="relative">
              <select className="appearance-none bg-transparent font-semibold text-slate-800 pr-5 cursor-pointer focus:outline-none">
                <option>Ngày ứng tuyển mới nhất</option>
                <option>Ngày ứng tuyển cũ nhất</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-800 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* ================= JOB LIST (Render từ API) ================= */}
        <div className="flex flex-col gap-4">
          {appliedJobs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-slate-500 mb-4">
                Bạn chưa ứng tuyển công việc nào.
              </p>
              <Link
                href="/job-it"
                className="inline-block px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover transition-colors"
              >
                Khám phá việc làm ngay
              </Link>
            </div>
          ) : (
            appliedJobs.map((item) => {
              const isExpanded = expandedJobId === item.applicationId;
              const isExpired =
                item.job.status === "EXPIRED" || item.job.status === "Hết hạn";

              return (
                <div
                  key={item.applicationId}
                  className="border border-slate-200 rounded-xl overflow-hidden hover:border-primary-light hover:shadow-md hover:shadow-primary/5 transition-all bg-white"
                >
                  {/* Phần thông tin chính */}
                  <div className="p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                      {/* Cột Trái: Avatar */}
                      <div className="shrink-0">
                        <div className="w-16 h-16 rounded-lg border border-slate-100 overflow-hidden bg-white shadow-sm p-1">
                          <Image
                            src={
                              item.job.company?.logo ||
                              "/images/default-company.png"
                            }
                            alt={item.job.company?.name || "Company"}
                            width={60}
                            height={60}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>

                      {/* Cột Giữa: Info */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/job-it/${item.job.slug}`}>
                          <h3 className="text-base font-bold text-slate-800 mb-1 line-clamp-1 hover:text-primary cursor-pointer transition-colors">
                            {item.job.title}
                          </h3>
                        </Link>
                        <p className="text-sm text-slate-500 mb-2 truncate">
                          {item.job.company?.name}
                        </p>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-slate-600 font-medium">
                          <div className="flex items-center gap-1.5">
                            <MapPin size={16} className="text-slate-400" />
                            {item.job.location || "Toàn quốc"} •{" "}
                            {item.job.workModel}
                          </div>
                          <div className="flex items-center gap-1.5 text-emerald-600">
                            <CircleDollarSign size={16} />
                            {item.job.salaryDisplay}
                          </div>
                        </div>
                      </div>

                      {/* Cột Phải: Status & Date */}
                      <div className="flex flex-col items-start md:items-end justify-between shrink-0 mt-4 md:mt-0">
                        <p className="text-xs font-medium text-slate-500 mb-2 md:mb-0">
                          Đã ứng tuyển:{" "}
                          <span className="text-slate-800 font-bold">
                            {new Date(item.appliedDate).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </p>

                        {/* Badge trạng thái Job (Công việc còn hạn hay không) */}
                        <span
                          className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                            isExpired
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {isExpired ? "Hết hạn" : "Đang tuyển"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Phần Accordion: Trạng thái đơn ứng tuyển */}
                  <div className="border-t border-slate-100">
                    <button
                      onClick={() => toggleExpand(item.applicationId)}
                      className="w-full px-5 py-3 flex items-center justify-between bg-primary-light/30 hover:bg-primary-light/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-sm font-bold text-primary-dark">
                          {item.applicationStatus === "CHO_DUYET" &&
                            "Hồ sơ đã được gửi đi"}
                          {item.applicationStatus === "DA_XEM" &&
                            "NTD đã xem hồ sơ"}
                          {item.applicationStatus === "PHU_HOP" &&
                            "Hồ sơ phù hợp"}
                          {item.applicationStatus === "PHONG_VAN" &&
                            "Được mời phỏng vấn"}
                          {item.applicationStatus === "TRUNG_TUYEN" &&
                            "Trúng tuyển"}
                          {item.applicationStatus === "KHONG_PHU_HOP" &&
                            "Hồ sơ chưa phù hợp"}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp size={18} className="text-primary" />
                      ) : (
                        <ChevronDown size={18} className="text-primary" />
                      )}
                    </button>

                    {/* Thanh Tracker hiển thị khi mở rộng */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 bg-white animate-in fade-in slide-in-from-top-2 duration-300">
                        {renderStatusTracker(item.applicationStatus)}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
