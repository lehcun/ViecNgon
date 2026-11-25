"use client";

import React, { useMemo, useState } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import {
  COMPANY_CRITERIA_META,
  type CompanyReviewItem,
} from "@/data/reviews.mock";
import { cn } from "@/lib/utils";

interface CompanyReviewsSummaryCardProps {
  reviews: CompanyReviewItem[];
}

type CriteriaKey = (typeof COMPANY_CRITERIA_META)[number]["key"];

const CRITERIA_DISPLAY_LABELS: Record<CriteriaKey, string> = {
  diemLuongPhucLoi: "Lương thưởng & phúc lợi",
  diemDaoTao: "Đào tạo & học hỏi",
  diemQuanLy: "Sự quan tâm đến nhân viên",
  diemVanHoa: "Văn hóa công ty",
  diemVanPhong: "Văn phòng làm việc",
};

function AmberStars({ value, size = 18 }: { value: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, idx) => {
        const filled = idx + 1 <= Math.round(value);
        return (
          <Star
            key={idx}
            size={size}
            fill={filled ? "currentColor" : "none"}
            className={cn(
              "shrink-0",
              filled ? "text-amber-500" : "text-amber-200",
            )}
          />
        );
      })}
    </div>
  );
}

function RecommendDonut({ percent }: { percent: number }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-22 h-22 shrink-0 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 84 84">
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="8"
        />
        <circle
          cx="42"
          cy="42"
          r={radius}
          fill="none"
          stroke="#16a34a"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-lg font-extrabold text-success-text tabular-nums">
        {percent}%
      </span>
    </div>
  );
}

export default function CompanyReviewsSummaryCard({
  reviews,
}: CompanyReviewsSummaryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [selectedCriteria, setSelectedCriteria] =
    useState<CriteriaKey>("diemLuongPhucLoi");

  const stats = useMemo(() => {
    const count = reviews.length;
    if (count === 0) {
      return {
        avg: 0,
        recommendPct: 0,
        distribution: [5, 4, 3, 2, 1].map((star) => ({ star, pct: 0 })),
        criteriaAvg: {
          diemLuongPhucLoi: 0,
          diemDaoTao: 0,
          diemQuanLy: 0,
          diemVanHoa: 0,
          diemVanPhong: 0,
        },
      };
    }

    const avg = Number(
      (reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1),
    );
    const recommendPct = Math.round(
      (reviews.filter((r) => r.khuyenLamViec).length / count) * 100,
    );
    const distribution = [5, 4, 3, 2, 1].map((star) => {
      const matched = reviews.filter(
        (r) => Math.round(r.rating) === star,
      ).length;
      return { star, pct: Math.round((matched / count) * 100) };
    });

    const avgKey = (key: CriteriaKey) =>
      Number(
        (reviews.reduce((sum, r) => sum + r[key], 0) / count).toFixed(1),
      );

    return {
      avg,
      recommendPct,
      distribution,
      criteriaAvg: {
        diemLuongPhucLoi: avgKey("diemLuongPhucLoi"),
        diemDaoTao: avgKey("diemDaoTao"),
        diemQuanLy: avgKey("diemQuanLy"),
        diemVanHoa: avgKey("diemVanHoa"),
        diemVanPhong: avgKey("diemVanPhong"),
      },
    };
  }, [reviews]);

  const selectedDistribution = useMemo(() => {
    const count = reviews.length;
    return [5, 4, 3, 2, 1].map((star) => {
      if (count === 0) return { star, pct: 0 };
      const matched = reviews.filter(
        (r) => Math.round(r[selectedCriteria]) === star,
      ).length;
      return { star, pct: Math.round((matched / count) * 100) };
    });
  }, [reviews, selectedCriteria]);

  return (
    <section className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs">
      <h2 className="text-lg sm:text-xl font-bold text-text-primary pb-4 border-b border-dashed border-border-default">
        Đánh giá chung
      </h2>

      {/* Hàng tổng quan 3 cột */}
      <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Cột 1: Điểm tổng & Sao vàng */}
        <div className="md:col-span-3 flex flex-col items-center justify-center text-center">
          <div className="text-4xl font-extrabold text-text-primary tabular-nums leading-none">
            {stats.avg.toFixed(1)}
          </div>
          <div className="mt-2">
            <AmberStars value={stats.avg} size={20} />
          </div>
          <p className="text-sm text-text-secondary mt-1.5 font-medium">
            {reviews.length} đánh giá
          </p>
        </div>

        {/* Cột 2: Phân bố 5★ -> 1★ tông vàng-cam */}
        <div className="md:col-span-5 space-y-2 md:border-r md:border-border-default md:pr-6">
          {stats.distribution.map((row) => (
            <div key={row.star} className="flex items-center gap-2.5 text-xs">
              <span className="inline-flex items-center gap-1 w-8 font-semibold text-text-primary tabular-nums shrink-0">
                {row.star}
                <Star
                  size={12}
                  fill="currentColor"
                  className="text-amber-500"
                />
              </span>
              <div className="flex-1 h-2 rounded-full bg-amber-100/80 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="w-9 text-right font-medium text-text-secondary tabular-nums shrink-0">
                {row.pct}%
              </span>
            </div>
          ))}
        </div>

        {/* Cột 3: Donut Khuyến khích làm việc */}
        <div className="md:col-span-4 flex items-center justify-center md:justify-start gap-4 md:pl-2">
          <RecommendDonut percent={stats.recommendPct} />
          <p className="text-sm font-semibold text-text-primary leading-snug max-w-36">
            Khuyến khích làm việc tại đây
          </p>
        </div>
      </div>

      {/* Bảng chi tiết 5 tiêu chí khi bấm Xem thêm */}
      {expanded && (
        <div className="mb-5 rounded-xl border border-border-default overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Trái: 5 tiêu chí chọn được */}
          <div className="lg:col-span-7 divide-y divide-border-default lg:border-r lg:border-border-default">
            {COMPANY_CRITERIA_META.map((item) => {
              const isSelected = selectedCriteria === item.key;
              const score = stats.criteriaAvg[item.key];
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setSelectedCriteria(item.key)}
                  className={cn(
                    "w-full px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-colors border-l-4",
                    isSelected
                      ? "border-l-amber-500 bg-amber-50/50"
                      : "border-l-transparent bg-surface-card hover:bg-surface-page",
                  )}
                >
                  <span
                    className={cn(
                      "text-sm",
                      isSelected
                        ? "font-bold text-text-primary"
                        : "font-medium text-text-secondary",
                    )}
                  >
                    {CRITERIA_DISPLAY_LABELS[item.key]}
                  </span>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <AmberStars value={score} size={15} />
                    <span className="text-sm font-bold text-text-primary tabular-nums w-7 text-right">
                      {score.toFixed(1)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Phải: Đánh giá chi tiết theo tiêu chí đang chọn */}
          <div className="lg:col-span-5 p-5 bg-surface-card flex flex-col justify-center space-y-3.5">
            <h3 className="text-sm font-bold text-text-primary">
              Đánh giá chi tiết
            </h3>
            <div className="space-y-2.5">
              {selectedDistribution.map((row) => (
                <div
                  key={row.star}
                  className="flex items-center gap-2.5 text-xs"
                >
                  <span className="inline-flex items-center gap-1 w-8 font-semibold text-text-primary tabular-nums shrink-0">
                    {row.star}
                    <Star
                      size={12}
                      fill="currentColor"
                      className="text-amber-500"
                    />
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-amber-100/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="w-9 text-right font-medium text-text-secondary tabular-nums shrink-0">
                    {row.pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nút Xem thêm / Thu gọn */}
      <div className="pt-4 border-t border-dashed border-border-default flex justify-center">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <span>{expanded ? "Thu gọn" : "Xem thêm"}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
    </section>
  );
}
