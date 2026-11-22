"use client";

import React from "react";

interface ProfileCompletionGaugeProps {
  percentage: number;
  className?: string;
}

const ARC_RADIUS = 80;
const ARC_LENGTH = Math.PI * ARC_RADIUS;

export default function ProfileCompletionGauge({
  percentage,
  className = "",
}: ProfileCompletionGaugeProps) {
  const clamped = Math.min(100, Math.max(0, Math.round(percentage)));
  const dashOffset = ARC_LENGTH - (ARC_LENGTH * clamped) / 100;

  return (
    <div className={`relative w-40 h-24 overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 200 105"
        className="w-full h-auto"
        role="img"
        aria-label={`Độ hoàn thiện hồ sơ ${clamped}%`}
      >
        <path
          d="M 20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke="currentColor"
          className="text-surface-subtle"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <path
          d="M 20 90 A 80 80 0 0 1 180 90"
          fill="none"
          stroke="currentColor"
          strokeWidth="18"
          strokeLinecap="round"
          className="text-primary transition-all duration-700 ease-out"
          strokeOpacity={clamped === 0 ? 0 : 1}
          strokeDasharray={ARC_LENGTH}
          strokeDashoffset={dashOffset}
          data-testid="profile-completion-progress"
        />
      </svg>
      <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
        <span className="text-2xl font-bold text-text-main leading-none tabular-nums">
          {clamped}%
        </span>
        <span className="text-[11px] text-text-muted font-medium mt-1">
          hoàn thành
        </span>
      </div>
    </div>
  );
}
