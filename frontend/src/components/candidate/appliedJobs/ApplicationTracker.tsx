"use client";
import React from "react";
import { Check, Video, FileCheck, LineChart } from "lucide-react";

interface TrackerProps {
  status: string;
  appliedDate: string;
}

export default function ApplicationTracker({
  status,
  appliedDate,
}: TrackerProps) {
  // Xác định vị trí current index dựa trên status
  let currentIndex = 0;
  if (status === "DA_XEM" || status === "PHU_HOP") currentIndex = 1;
  if (status === "PHONG_VAN") currentIndex = 2;
  if (status === "TRUNG_TUYEN" || status === "KHONG_PHU_HOP") currentIndex = 3;

  const steps = [
    {
      id: "CHO_DUYET",
      label: "Đã gửi đơn",
      icon: Check,
      date: new Date(appliedDate).toLocaleDateString("vi-VN"),
    },
    {
      id: "DA_XEM",
      label: "NTD đã xem",
      icon: Check,
      date: currentIndex >= 1 ? "Đã cập nhật" : "Chờ xem",
    },
    {
      id: "PHONG_VAN",
      label: "Phỏng vấn",
      icon: Video,
      date: currentIndex >= 2 ? "Đã đặt lịch" : "Chưa có",
    },
    {
      id: "RESULT",
      label: "Kết quả",
      icon: FileCheck,
      date: currentIndex >= 3 ? "Hoàn tất" : "Chờ đánh giá",
    },
  ];

  // Tính toán % cho thanh progress bar background
  const progressPercentage = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-1.5">
          <LineChart size={20} className="text-primary" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Quy trình xử lý hồ sơ
          </span>
        </div>
      </div>

      <div className="relative pt-2 pb-1">
        {/* Thanh Progress chìm */}
        <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-slate-100 z-0">
          <div
            className="h-full bg-linear-to-r from-emerald-500 to-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Các Bước */}
        <div className="grid grid-cols-4 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center text-center ${isPending ? "opacity-60" : ""}`}
              >
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? "bg-emerald-500 text-white shadow-md"
                        : isCurrent
                          ? "bg-primary text-white shadow-lg ring-4 ring-primary/20"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isCurrent ? "animate-pulse" : ""}
                    />
                  </div>
                </div>

                <div className="mt-2 flex flex-col items-center">
                  <div
                    className={`text-xs font-bold flex items-center gap-1 ${isCurrent ? "text-primary" : "text-slate-800"}`}
                  >
                    {index + 1}. {step.label}
                    {isCurrent && (
                      <span className="bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wider hidden sm:block">
                        Active
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[11px] font-semibold mt-0.5 ${isCurrent ? "text-primary" : "text-slate-500"}`}
                  >
                    {step.date}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
