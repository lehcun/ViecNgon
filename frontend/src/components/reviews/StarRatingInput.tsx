"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingInputProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  ariaLabel?: string;
}

const SIZE_MAP = {
  sm: 14,
  md: 18,
  lg: 24,
} as const;

const RATING_LABELS: Record<number, string> = {
  1: "Rất tệ",
  2: "Chưa tốt",
  3: "Bình thường",
  4: "Tốt",
  5: "Xuất sắc",
};

export default function StarRatingInput({
  value,
  onChange,
  readOnly = false,
  size = "md",
  showValue = false,
  ariaLabel = "Chọn số sao đánh giá",
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value;
  const iconSize = SIZE_MAP[size];

  return (
    <div
      className="inline-flex items-center gap-1"
      role={readOnly ? "img" : "radiogroup"}
      aria-label={ariaLabel}
      onMouseLeave={() => !readOnly && setHovered(null)}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= Math.round(displayValue);

        if (readOnly) {
          return (
            <Star
              key={starValue}
              size={iconSize}
              fill={isFilled ? "currentColor" : "none"}
              className={cn(
                "shrink-0",
                isFilled ? "text-amber-400" : "text-border-strong",
              )}
            />
          );
        }

        return (
          <button
            key={starValue}
            type="button"
            role="radio"
            aria-checked={value === starValue}
            aria-label={`${starValue} sao - ${RATING_LABELS[starValue]}`}
            onMouseEnter={() => setHovered(starValue)}
            onClick={() => onChange?.(starValue)}
            className="p-0.5 rounded transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            <Star
              size={iconSize}
              fill={isFilled ? "currentColor" : "none"}
              className={cn(
                "transition-colors",
                isFilled
                  ? "text-amber-400"
                  : "text-border-strong hover:text-amber-300",
              )}
            />
          </button>
        );
      })}

      {showValue && (
        <span className="ml-1.5 text-xs font-semibold text-text-secondary tabular-nums">
          {value > 0
            ? readOnly
              ? `${value.toFixed(1)}/5`
              : `${value}/5 · ${RATING_LABELS[Math.round(value)] || ""}`
            : "Chưa chọn"}
        </span>
      )}
    </div>
  );
}
