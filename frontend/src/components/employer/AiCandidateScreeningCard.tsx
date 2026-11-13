"use client";

import React from "react";
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  BrainCircuit,
} from "lucide-react";
import {
  useApplicationAiAnalysis,
  useRescanApplicationAi,
} from "@/hooks/employer/useApplicationAiAnalysis";
import { Button } from "@/components/ui/Button";
import { getAiScoreTone, StatusBadge } from "@/components/ui/StatusBadge";
import { ErrorState } from "@/components/ui/StateViews";
import { formatDateTimeVN } from "@/lib/formatters";

interface AiCandidateScreeningCardProps {
  applicationId: string;
}

const SCORE_TONE_BAR: Record<string, string> = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export default function AiCandidateScreeningCard({
  applicationId,
}: AiCandidateScreeningCardProps) {
  const { data, isLoading, isError, error, refetch } = useApplicationAiAnalysis(
    applicationId,
    Boolean(applicationId),
  );
  const { mutate: rescan, isPending: isRescanning } =
    useRescanApplicationAi(applicationId);

  if (isLoading) {
    return (
      <div className="bg-surface-card border border-ai-border rounded-xl p-6 shadow-xs animate-pulse space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-ai-light" />
            <div className="space-y-2">
              <div className="h-4 w-48 bg-surface-subtle rounded" />
              <div className="h-3 w-36 bg-surface-muted rounded" />
            </div>
          </div>
          <div className="h-9 w-28 bg-surface-subtle rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="h-24 bg-ai-light/50 rounded-xl" />
          <div className="md:col-span-3 h-24 bg-surface-muted rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 bg-surface-muted rounded-xl" />
          <div className="h-28 bg-surface-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-xs">
        <ErrorState
          title="Không thể phân tích hồ sơ bằng AI"
          message={
            error?.message ||
            "Hệ thống AI tạm thời gián đoạn. Vui lòng thử lại sau."
          }
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const scoreTone = getAiScoreTone(data.matchScore);
  const breakdownItems = data.breakdown
    ? [
        { label: "Kỹ năng chuyên môn", value: data.breakdown.skillsScore },
        { label: "Kinh nghiệm thực tế", value: data.breakdown.experienceScore },
        { label: "Học vấn & Chứng chỉ", value: data.breakdown.educationScore },
        { label: "Mức độ phù hợp lĩnh vực", value: data.breakdown.domainScore },
      ]
    : [];

  return (
    <div className="bg-surface-card border border-ai-border rounded-xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-ai-light border border-ai-border flex items-center justify-center text-ai shrink-0">
            <BrainCircuit size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-text-primary">
                Sàng lọc & Đánh giá hồ sơ AI
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-ai-light text-ai border border-ai-border">
                <Sparkles size={11} /> AI Matching
              </span>
            </div>
            {data.analyzedAt && (
              <p className="text-xs text-text-muted mt-0.5 inline-flex items-center gap-1">
                <Clock size={12} />
                Phân tích lúc {formatDateTimeVN(data.analyzedAt)}
              </p>
            )}
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => rescan()}
          isLoading={isRescanning}
          loadingText="Đang quét lại..."
        >
          <RefreshCw size={14} />
          Quét lại AI
        </Button>
      </div>

      {/* Score & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-4 bg-ai-light/50 border border-ai-border rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-ai">
              Độ phù hợp tổng quan
            </span>
            <StatusBadge
              type="custom"
              tone={scoreTone}
              label={
                data.matchScore >= 80
                  ? "Rất phù hợp"
                  : data.matchScore >= 50
                    ? "Tiềm năng"
                    : "Cần cân nhắc"
              }
            />
          </div>

          <div className="my-3 flex items-baseline gap-1.5">
            <span className="text-4xl font-bold text-text-primary tabular-nums">
              {data.matchScore}%
            </span>
            <span className="text-xs text-text-muted">/ 100%</span>
          </div>

          <div className="w-full h-2 bg-surface-card rounded-full overflow-hidden border border-ai-border/50">
            <div
              className={`h-full rounded-full transition-all ${SCORE_TONE_BAR[scoreTone] || "bg-ai"}`}
              style={{
                width: `${Math.min(100, Math.max(0, data.matchScore))}%`,
              }}
            />
          </div>
        </div>

        <div className="lg:col-span-8 bg-surface-muted border border-border-default rounded-xl p-5 flex flex-col justify-between gap-4">
          {data.summary && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {data.summary}
            </p>
          )}

          {breakdownItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-border-default">
              {breakdownItems.map((item) => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-text-secondary">
                      {item.label}
                    </span>
                    <span className="font-bold text-text-primary tabular-nums">
                      {item.value}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-surface-subtle rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ai rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(0, item.value))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-success-light/60 border border-success-border rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-success-text mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 size={14} /> Điểm mạnh nổi bật
          </h3>
          {data.strengths && data.strengths.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-text-primary">
              {data.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-muted">Chưa ghi nhận điểm mạnh.</p>
          )}
        </div>

        <div className="bg-warning-light/60 border border-warning-border rounded-xl p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-warning-text mb-2.5 flex items-center gap-1.5">
            <AlertTriangle size={14} /> Điểm cần lưu ý / Thiếu hụt
          </h3>
          {data.weaknesses && data.weaknesses.length > 0 ? (
            <ul className="space-y-1.5 text-sm text-text-primary">
              {data.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-text-muted">
              Hồ sơ đáp ứng khá đầy đủ yêu cầu công việc.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
