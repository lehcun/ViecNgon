"use client";

import React, { useMemo, useState } from "react";
import {
  ClipboardCheck,
  Plus,
  Star,
  Eye,
  Lock,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/StateViews";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import CandidateEvaluationModal from "./CandidateEvaluationModal";
import {
  CANDIDATE_CRITERIA_META,
  EVAL_RESULT_META,
  MOCK_CANDIDATE_EVALUATIONS,
  type CandidateEvaluationItem,
} from "@/data/reviews.mock";
import { formatDateVN } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface CandidateEvaluationCardProps {
  candidateName: string;
  jobTitle: string;
  evaluatorName?: string;
  isLoading?: boolean;
}

export function CandidateEvaluationSkeleton() {
  return (
    <div className="bg-surface-card border border-border-default rounded-xl p-6 space-y-5 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-56 bg-surface-subtle rounded" />
        <div className="h-9 w-36 bg-surface-subtle rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="h-20 bg-surface-muted rounded-xl" />
        ))}
      </div>
      <div className="h-28 bg-surface-muted rounded-xl" />
    </div>
  );
}

export default function CandidateEvaluationCard({
  candidateName,
  jobTitle,
  evaluatorName,
  isLoading = false,
}: CandidateEvaluationCardProps) {
  const [evaluations, setEvaluations] = useState<CandidateEvaluationItem[]>(
    MOCK_CANDIDATE_EVALUATIONS,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalKey, setModalKey] = useState(0);

  const summary = useMemo(() => {
    const count = evaluations.length;
    if (count === 0) {
      return {
        avg: 0,
        criteriaAvg: {
          diemChuyenMon: 0,
          diemThaiDo: 0,
          diemGiaiQuyetVanDe: 0,
          diemPhuHopVanHoa: 0,
        },
      };
    }

    return {
      avg: Number(
        (evaluations.reduce((s, item) => s + item.rating, 0) / count).toFixed(
          1,
        ),
      ),
      criteriaAvg: {
        diemChuyenMon: Number(
          (
            evaluations.reduce((s, item) => s + item.diemChuyenMon, 0) / count
          ).toFixed(1),
        ),
        diemThaiDo: Number(
          (
            evaluations.reduce((s, item) => s + item.diemThaiDo, 0) / count
          ).toFixed(1),
        ),
        diemGiaiQuyetVanDe: Number(
          (
            evaluations.reduce((s, item) => s + item.diemGiaiQuyetVanDe, 0) /
            count
          ).toFixed(1),
        ),
        diemPhuHopVanHoa: Number(
          (
            evaluations.reduce((s, item) => s + item.diemPhuHopVanHoa, 0) /
            count
          ).toFixed(1),
        ),
      },
    };
  }, [evaluations]);

  if (isLoading) return <CandidateEvaluationSkeleton />;

  const handleOpenModal = () => {
    setModalKey((prev) => prev + 1);
    setIsModalOpen(true);
  };

  return (
    <section className="bg-surface-card border border-border-default rounded-xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-default">
        <div>
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <ClipboardCheck size={18} className="text-primary" />
            <span>Đánh giá ứng viên ({evaluations.length})</span>
            {evaluations.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-warning-light text-warning-text border border-warning-border tabular-nums">
                <Star size={12} fill="currentColor" />
                {summary.avg.toFixed(1)}/5
              </span>
            )}
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Tổng hợp điểm phỏng vấn theo 4 tiêu chí và ghi chú nội bộ của hội
            đồng tuyển dụng.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleOpenModal}
          className="shrink-0"
        >
          <Plus size={15} />
          Thêm đánh giá
        </Button>
      </div>

      {/* Điểm trung bình 4 tiêu chí */}
      {evaluations.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {CANDIDATE_CRITERIA_META.map((item) => {
            const score = summary.criteriaAvg[item.key];
            const pct = Math.round((score / 5) * 100);
            return (
              <div
                key={item.key}
                className="rounded-xl border border-border-default bg-surface-page p-3.5 space-y-2"
              >
                <p className="text-xs font-medium text-text-secondary line-clamp-1">
                  {item.label}
                </p>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg font-extrabold text-text-primary tabular-nums">
                    {score.toFixed(1)}
                    <span className="text-xs font-normal text-text-muted">
                      /5
                    </span>
                  </span>
                  <StarRatingInput value={score} readOnly size="sm" />
                </div>
                <div className="h-1.5 rounded-full bg-surface-subtle overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Danh sách phiếu đánh giá */}
      {evaluations.length === 0 ? (
        <EmptyState
          icon={<MessageSquareText size={22} />}
          title="Chưa có phiếu đánh giá nào"
          description="Hãy thêm nhận xét sau buổi phỏng vấn để đội ngũ tuyển dụng dễ dàng so sánh và ra quyết định."
          actionLabel="Tạo phiếu đánh giá đầu tiên"
          onAction={handleOpenModal}
        />
      ) : (
        <div className="space-y-3.5">
          {evaluations.map((item) => {
            const resultMeta = EVAL_RESULT_META[item.ketQuaDanhGia];
            return (
              <article
                key={item.id}
                className="rounded-xl border border-border-default bg-surface-page p-4 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-text-primary">
                      {item.evaluatorName}
                    </span>
                    <span className="text-text-muted">
                      · {item.evaluatorRole}
                    </span>
                    <span className="text-text-muted">
                      · {formatDateVN(item.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
                        resultMeta.badgeClass,
                      )}
                    >
                      {resultMeta.label}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
                        item.chiaSeUngVien
                          ? "bg-info-soft text-info-text border-info-border"
                          : "bg-surface-muted text-text-muted border-border-default",
                      )}
                    >
                      {item.chiaSeUngVien ? (
                        <>
                          <Eye size={11} />
                          Chia sẻ ứng viên
                        </>
                      ) : (
                        <>
                          <Lock size={11} />
                          Nội bộ HR
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-text-primary">
                    {item.tieuDe}
                  </h3>
                  <StarRatingInput
                    value={item.rating}
                    readOnly
                    size="sm"
                    showValue
                  />
                </div>

                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.noiDung}
                </p>

                <div className="flex flex-wrap gap-2 pt-1 text-xs text-text-muted">
                  {CANDIDATE_CRITERIA_META.map((crit) => (
                    <span
                      key={crit.key}
                      className="px-2 py-0.5 rounded-md bg-surface-card border border-border-default tabular-nums"
                    >
                      {crit.label}:{" "}
                      <strong className="text-text-primary">
                        {item[crit.key]}/5
                      </strong>
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <CandidateEvaluationModal
        key={modalKey}
        isOpen={isModalOpen}
        candidateName={candidateName}
        jobTitle={jobTitle}
        evaluatorName={evaluatorName}
        onClose={() => setIsModalOpen(false)}
        onSubmitMock={(newEval) => setEvaluations((prev) => [newEval, ...prev])}
      />
    </section>
  );
}
