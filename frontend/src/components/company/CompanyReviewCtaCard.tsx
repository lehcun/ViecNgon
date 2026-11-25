"use client";

import React, { useState } from "react";
import { Star, Info, MessageSquareHeart } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyReviewCtaCardProps {
  companyName: string;
  onStartReview: (initialRating: number) => void;
}

export default function CompanyReviewCtaCard({
  companyName,
  onStartReview,
}: CompanyReviewCtaCardProps) {
  const [hoveredStar, setHoveredStar] = useState(0);

  return (
    <section className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* Minh họa bên trái */}
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0">
        <MessageSquareHeart size={30} className="text-amber-500" />
      </div>

      {/* Nội dung & 5 sao tương tác */}
      <div className="space-y-2.5 flex-1 min-w-0">
        <h3 className="text-base sm:text-lg font-bold text-text-primary leading-snug">
          Hãy dành 1 phút để chia sẻ trải nghiệm làm việc của bạn tại{" "}
          <span>{companyName}</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3">
          <div
            className="inline-flex items-center gap-1"
            onMouseLeave={() => setHoveredStar(0)}
          >
            {Array.from({ length: 5 }).map((_, idx) => {
              const star = idx + 1;
              const isHighlighted = star <= hoveredStar;
              return (
                <button
                  key={star}
                  type="button"
                  aria-label={`Đánh giá ${star} sao`}
                  onMouseEnter={() => setHoveredStar(star)}
                  onClick={() => onStartReview(star)}
                  className="p-0.5 rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                >
                  <Star
                    size={28}
                    fill={isHighlighted ? "currentColor" : "none"}
                    strokeWidth={1.6}
                    className={cn(
                      "transition-colors",
                      isHighlighted
                        ? "text-amber-500"
                        : "text-text-placeholder hover:text-amber-400",
                    )}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => onStartReview(5)}
            className="text-sm font-medium text-text-muted hover:text-primary transition-colors"
          >
            Nhấn để bắt đầu đánh giá
          </button>
        </div>

        <p className="inline-flex items-center gap-1.5 text-xs text-text-muted">
          <Info size={14} className="shrink-0 text-text-placeholder" />
          <span>
            Đánh giá của bạn cho {companyName} sẽ được gửi ẩn danh.
          </span>
        </p>
      </div>
    </section>
  );
}
