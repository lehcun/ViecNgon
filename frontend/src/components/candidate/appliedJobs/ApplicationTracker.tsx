"use client";

import React from "react";
import { Check, Video, FileCheck, LineChart, XCircle } from "lucide-react";
import { formatDateVN } from "@/lib/formatters";

interface TrackerProps {
  status: string;
  appliedDate: string;
}

export default function ApplicationTracker({
  status,
  appliedDate,
}: TrackerProps) {
  const isRejected = status === "TU_CHOI" || status === "KHONG_PHU_HOP";

  let currentIndex = 0;
  if (status === "DA_XEM" || status === "PHU_HOP") currentIndex = 1;
  if (status === "PHONG_VAN") currentIndex = 2;
  if (status === "TRUNG_TUYEN" || isRejected) currentIndex = 3;

  const steps = [
    {
      id: "CHO_DUYET",
      label: "Đã gửi đơn",
      icon: Check,
      date: formatDateVN(appliedDate),
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
      label: isRejected ? "Chưa phù hợp" : "Kết quả",
      icon: isRejected ? XCircle : FileCheck,
      date:
        status === "TRUNG_TUYEN"
          ? "Trúng tuyển"
          : isRejected
            ? "Đã đóng"
            : "Chờ đánh giá",
    },
  ];

  const progressPercentage = (currentIndex / (steps.length - 1)) * 100;

  return (
    <div className="bg-surface-card rounded-xl p-5 sm:p-6 shadow-xs border border-border-default max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <LineChart size={18} className="text-primary" />
          <span className="text-xs font-bold text-text-main uppercase tracking-wider">
            Quy trình xử lý hồ sơ
          </span>
        </div>
      </div>

      <div className="relative pt-2 pb-1">
        <div className="absolute top-5 left-[12.5%] right-[12.5%] h-1 bg-surface-subtle z-0">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isRejected ? "bg-danger" : "bg-linear-to-r from-success to-primary"
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <div className="grid grid-cols-4 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            const isPending = index > currentIndex;
            const isLastRejected = index === 3 && isCurrent && isRejected;

            return (
              <div
                key={step.id}
                className={`flex flex-col items-center text-center ${isPending ? "opacity-60" : ""}`}
              >
                <div className="relative">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                      isLastRejected
                        ? "bg-danger text-white shadow-sm ring-4 ring-danger/15"
                        : isCompleted
                          ? "bg-success text-white shadow-sm"
                          : isCurrent
                            ? "bg-primary text-white shadow-sm ring-4 ring-primary/15"
                            : "bg-surface-subtle text-text-subtle border border-border-default"
                    }`}
                  >
                    <Icon size={17} />
                  </div>
                </div>

                <div className="mt-2 flex flex-col items-center">
                  <div
                    className={`text-xs font-semibold flex items-center gap-1 ${
                      isLastRejected
                        ? "text-danger-text"
                        : isCurrent
                          ? "text-primary"
                          : "text-text-main"
                    }`}
                  >
                    <span>
                      {index + 1}. {step.label}
                    </span>
                  </div>
                  <div
                    className={`text-[11px] font-medium mt-0.5 ${
                      isLastRejected
                        ? "text-danger-text"
                        : isCurrent
                          ? "text-primary"
                          : "text-text-muted"
                    }`}
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
