"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useJobMatchScore } from "@/hooks/candidate/useJobMatchScore";
import { cn } from "@/lib/utils";
import { getAiScoreTone } from "@/components/ui/StatusBadge";

interface AiMatchBadgeProps {
  jobId: string;
}

const SCORE_TONE_STYLES = {
  success: "bg-success-light text-success-text border-success-border",
  warning: "bg-warning-light text-warning-text border-warning-border",
  danger: "bg-danger-light text-danger-text border-danger-border",
};

export default function AiMatchBadge({ jobId }: AiMatchBadgeProps) {
  const [triggered, setTriggered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const { data, isLoading, isError, error, refetch } = useJobMatchScore(
    jobId,
    triggered,
  );

  const handleAnalyze = () => {
    if (!triggered) {
      setTriggered(true);
    } else {
      void refetch();
    }
    setShowDetail(true);
  };

  const score = data?.matchScore ?? 0;
  const tone = getAiScoreTone(score);
  const colorClass =
    tone === "success"
      ? SCORE_TONE_STYLES.success
      : tone === "warning"
        ? SCORE_TONE_STYLES.warning
        : SCORE_TONE_STYLES.danger;

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {!data && !isLoading && (
          <button
            type="button"
            onClick={handleAnalyze}
            className="h-10 inline-flex items-center gap-2 px-4 rounded-lg bg-ai-light hover:bg-ai-border/40 text-ai font-semibold text-sm border border-ai-border transition-colors"
          >
            <Sparkles size={16} />
            <span>Kiểm tra độ phù hợp AI trước khi nộp</span>
          </button>
        )}

        {isLoading && (
          <div className="h-10 inline-flex items-center gap-2 px-4 rounded-lg bg-surface-muted text-text-secondary text-sm font-medium border border-border-default">
            <Loader2 size={16} className="animate-spin text-ai" />
            <span>AI đang đối chiếu hồ sơ của bạn với JD...</span>
          </div>
        )}

        {data && !isLoading && (
          <button
            type="button"
            onClick={() => setShowDetail((prev) => !prev)}
            className={cn(
              "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border font-semibold text-sm transition-colors",
              colorClass,
            )}
          >
            <span className="w-7 h-7 rounded-full bg-surface-card flex items-center justify-center text-xs font-bold tabular-nums">
              {score}%
            </span>
            <span>Độ phù hợp AI: {score}% Match</span>
            <span className="text-xs font-medium underline ml-1">
              {showDetail ? "Thu gọn" : "Xem chi tiết"}
            </span>
          </button>
        )}

        {isError && (
          <span className="text-xs text-danger-text font-medium inline-flex items-center gap-1">
            <AlertTriangle size={14} />
            {error?.message || "Không thể phân tích độ phù hợp."}
          </span>
        )}
      </div>

      {data && showDetail && (
        <div className="mt-3 p-4 rounded-xl border border-border-default bg-surface-page space-y-3 text-sm">
          <p className="text-text-secondary leading-relaxed">{data.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-surface-card p-3 rounded-lg border border-success-border">
              <p className="font-semibold text-success-text text-xs uppercase mb-1.5 flex items-center gap-1">
                <CheckCircle2 size={14} /> Điểm mạnh phù hợp
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
                {data.strengths.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-card p-3 rounded-lg border border-warning-border">
              <p className="font-semibold text-warning-text text-xs uppercase mb-1.5 flex items-center gap-1">
                <AlertTriangle size={14} /> Điểm còn thiếu
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-text-secondary">
                {data.weaknesses.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
