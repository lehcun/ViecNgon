"use client";
import React from "react";
import { Info, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function AppliedJobsFilter() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
      <div className="flex items-start sm:items-center gap-2 text-slate-600">
        <Info size={16} className="text-primary mt-0.5 sm:mt-0 shrink-0" />
        <p>
          Việc làm đã ứng tuyển được lưu trữ trong 12 tháng qua.{" "}
          <Link
            href="#"
            className="text-primary hover:underline font-medium ml-0.5"
          >
            Tìm hiểu về trạng thái ứng tuyển
          </Link>
        </p>
      </div>

      <div className="flex items-center self-end sm:self-auto gap-1 text-slate-600 cursor-pointer select-none">
        <span>Sắp xếp theo:</span>
        <div className="relative font-semibold text-slate-900 flex items-center gap-1">
          <select className="appearance-none bg-transparent pr-5 cursor-pointer focus:outline-none">
            <option>Ngày ứng tuyển mới nhất</option>
            <option>Ngày ứng tuyển cũ nhất</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-700"
          />
        </div>
      </div>
    </div>
  );
}
