"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { useJobMatchScore } from "@/hooks/candidate/useJobMatchScore";

interface AiMatchBadgeProps {
  jobId: string;
}

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
  const colorClass =
    score >= 75
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 50
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-3">
        {!data && !isLoading && (
          <button
            type="button"
            onClick={handleAnalyze}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/15 text-primary font-semibold text-sm border border-primary/20 transition-all"
          >
            <Sparkles size={16} />
            Kiểm tra độ phù hợp AI trước khi nộp
          </button>
        )}

        {isLoading && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-sm font-medium">
            <Loader2 size={16} className="animate-spin text-primary" />
            AI đang đối chiếu hồ sơ của bạn với JD...
          </div>
        )}

        {data && !isLoading && (
          <button
            type="button"
            onClick={() => setShowDetail((prev) => !prev)}
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border font-bold text-sm transition-all shadow-xs ${colorClass}`}
          >
            <span className="w-7 h-7 rounded-full bg-white/80 flex items-center justify-center text-xs font-extrabold">
              {score}%
            </span>
            <span>Độ phù hợp AI: {score}% Match</span>
            <span className="text-xs font-normal underline ml-1">
              {showDetail ? "Thu gọn" : "Xem chi tiết"}
            </span>
          </button>
        )}

        {isError && (
          <span className="text-xs text-rose-600 font-medium">
            {error?.message || "Không thể phân tích độ phù hợp."}
          </span>
        )}
      </div>

      {data && showDetail && (
        <div className="mt-3 p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-3 text-sm">
          <p className="text-slate-700 leading-relaxed">{data.summary}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-emerald-100">
              <p className="font-semibold text-emerald-700 text-xs uppercase mb-1.5 flex items-center gap-1">
                <CheckCircle2 size={14} /> Điểm mạnh phù hợp
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                {data.strengths.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-100">
              <p className="font-semibold text-amber-700 text-xs uppercase mb-1.5 flex items-center gap-1">
                <AlertTriangle size={14} /> Điểm còn thiếu
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
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

