"use client";

import React from "react";
import { Info, ChevronDown } from "lucide-react";
import Link from "next/link";

interface AppliedJobsFilterProps {
  sortOrder?: "newest" | "oldest";
  onSortChange?: (order: "newest" | "oldest") => void;
}

export default function AppliedJobsFilter({
  sortOrder = "newest",
  onSortChange,
}: AppliedJobsFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm">
      <div className="flex items-start sm:items-center gap-2 text-text-secondary">
        <Info size={16} className="text-primary mt-0.5 sm:mt-0 shrink-0" />
        <p>
          Việc làm đã ứng tuyển được lưu trữ trong 12 tháng qua.{" "}
          <Link
            href="/jobs"
            className="text-primary hover:underline font-medium ml-0.5"
          >
            Tìm thêm việc làm IT
          </Link>
        </p>
      </div>

      <div className="flex items-center self-end sm:self-auto gap-1.5 text-text-secondary select-none">
        <span>Sắp xếp:</span>
        <div className="relative font-semibold text-text-main flex items-center">
          <select
            value={sortOrder}
            onChange={(e) =>
              onSortChange?.(e.target.value as "newest" | "oldest")
            }
            className="appearance-none bg-surface-subtle border border-border-default rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold cursor-pointer focus:outline-none focus:border-primary"
          >
            <option value="newest">Ngày ứng tuyển mới nhất</option>
            <option value="oldest">Ngày ứng tuyển cũ nhất</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted"
          />
        </div>
      </div>
    </div>
  );
}
