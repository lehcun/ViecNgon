"use client";

import React, { useState } from "react";
import { X, Eye, Lock, ClipboardCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import {
  CANDIDATE_CRITERIA_META,
  EVAL_RESULT_META,
  type CandidateEvalResult,
  type CandidateEvaluationItem,
} from "@/data/reviews.mock";
import { cn } from "@/lib/utils";

interface CandidateEvaluationModalProps {
  isOpen: boolean;
  candidateName: string;
  jobTitle: string;
  evaluatorName?: string;
  onClose: () => void;
  onSubmitMock: (evaluation: CandidateEvaluationItem) => void;
}

type EvalCriteriaKey = (typeof CANDIDATE_CRITERIA_META)[number]["key"];

export default function CandidateEvaluationModal({
  isOpen,
  candidateName,
  jobTitle,
  evaluatorName = "Nhà tuyển dụng",
  onClose,
  onSubmitMock,
}: CandidateEvaluationModalProps) {
  const [criteria, setCriteria] = useState<Record<EvalCriteriaKey, number>>({
    diemChuyenMon: 4,
    diemThaiDo: 5,
    diemGiaiQuyetVanDe: 4,
    diemPhuHopVanHoa: 4,
  });
  const [ketQuaDanhGia, setKetQuaDanhGia] =
    useState<CandidateEvalResult>("DAT");
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [chiaSeUngVien, setChiaSeUngVien] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const avgRating = Number(
    (
      Object.values(criteria).reduce((sum, score) => sum + score, 0) /
      CANDIDATE_CRITERIA_META.length
    ).toFixed(1),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieuDe.trim()) {
      setErrorMsg("Vui lòng nhập tiêu đề tóm tắt đánh giá ứng viên.");
      return;
    }
    if (!noiDung.trim()) {
      setErrorMsg("Vui lòng nhập nhận xét chi tiết sau buổi phỏng vấn.");
      return;
    }

    const newEval: CandidateEvaluationItem = {
      id: `mock-cand-eval-${Date.now()}`,
      evaluatorName,
      evaluatorRole: "Người phỏng vấn (HR / Hiring Manager)",
      rating: avgRating,
      ...criteria,
      ketQuaDanhGia,
      tieuDe: tieuDe.trim(),
      noiDung: noiDung.trim(),
      chiaSeUngVien,
      createdAt: new Date().toISOString(),
    };

    onSubmitMock(newEval);
    toast.success("Đã lưu phiếu đánh giá ứng viên (dữ liệu mock tạm thời)!");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="candidate-eval-modal-title"
    >
      <div className="bg-surface-card border border-border-default rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3
              id="candidate-eval-modal-title"
              className="text-lg font-bold text-text-primary truncate flex items-center gap-2"
            >
              <ClipboardCheck size={18} className="text-primary shrink-0" />
              <span>Đánh giá ứng viên: {candidateName}</span>
            </h3>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              Vị trí ứng tuyển: {jobTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-5"
          noValidate
        >
          {/* Chấm điểm 4 tiêu chí */}
          <div className="rounded-xl bg-surface-page border border-border-default p-4 space-y-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-border-default">
              <div>
                <p className="text-sm font-bold text-text-primary">
                  Thang điểm 4 tiêu chí phỏng vấn
                </p>
                <p className="text-xs text-text-muted">
                  Tự động tính điểm trung bình của phiếu đánh giá
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-2xl font-extrabold text-primary tabular-nums">
                  {avgRating}
                </span>
                <span className="text-xs text-text-muted">/5.0</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {CANDIDATE_CRITERIA_META.map((item) => (
                <div
                  key={item.key}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5"
                >
                  <span className="text-sm font-medium text-text-secondary">
                    {item.label}
                  </span>
                  <StarRatingInput
                    value={criteria[item.key]}
                    onChange={(val) =>
                      setCriteria((prev) => ({ ...prev, [item.key]: val }))
                    }
                    size="md"
                    showValue
                    ariaLabel={item.label}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Kết luận đánh giá */}
          <div>
            <p className="text-xs font-semibold text-text-primary mb-2">
              Đề xuất kết quả phỏng vấn <span className="text-danger">*</span>
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {(["DAT", "CAN_NHAC", "CHUA_PHU_HOP"] as const).map((status) => {
                const meta = EVAL_RESULT_META[status];
                const isSelected = ketQuaDanhGia === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setKetQuaDanhGia(status)}
                    className={cn(
                      "px-3 py-2.5 rounded-lg border text-xs font-semibold transition-all text-center",
                      isSelected
                        ? meta.activeClass
                        : "bg-surface-page text-text-secondary border-border-default hover:border-border-strong",
                    )}
                  >
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tiêu đề & Nhận xét */}
          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="cand-eval-title"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Tóm tắt đánh giá <span className="text-danger">*</span>
              </label>
              <input
                id="cand-eval-title"
                type="text"
                maxLength={100}
                value={tieuDe}
                onChange={(e) => {
                  setTieuDe(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="VD: Chuyên môn vững, giao tiếp tốt, phù hợp vị trí Senior"
                className="w-full h-10 px-3.5 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div>
              <label
                htmlFor="cand-eval-content"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Nhận xét chi tiết <span className="text-danger">*</span>
              </label>
              <textarea
                id="cand-eval-content"
                rows={4}
                maxLength={500}
                value={noiDung}
                onChange={(e) => {
                  setNoiDung(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="Ghi chú điểm mạnh, điểm cần cải thiện, mức độ phù hợp kỹ thuật và đội ngũ..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
              />
            </div>
          </div>

          {/* Tùy chọn chia sẻ ứng viên */}
          <label className="flex items-start gap-3 p-3.5 rounded-xl border border-border-default bg-surface-page cursor-pointer hover:border-primary/40 transition-colors">
            <input
              type="checkbox"
              checked={chiaSeUngVien}
              onChange={(e) => setChiaSeUngVien(e.target.checked)}
              className="mt-0.5 rounded border-border-strong text-primary focus:ring-primary"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-text-primary">
                {chiaSeUngVien ? (
                  <Eye size={14} className="text-info-text" />
                ) : (
                  <Lock size={14} className="text-text-muted" />
                )}
                <span>Chia sẻ nhận xét này cho ứng viên xem</span>
              </div>
              <p className="text-xs text-text-muted">
                {chiaSeUngVien
                  ? "Ứng viên sẽ thấy điểm tổng và nhận xét góp ý trong trang việc làm đã ứng tuyển."
                  : "Giữ ở chế độ nội bộ, chỉ Nhà tuyển dụng trong công ty xem được."}
              </p>
            </div>
          </label>

          {errorMsg && (
            <p className="text-xs font-medium text-danger-text bg-danger-soft border border-danger-border rounded-lg px-3.5 py-2">
              {errorMsg}
            </p>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-border-default flex items-center justify-end gap-2.5">
            <Button type="button" variant="secondary" size="md" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" size="md">
              Lưu đánh giá
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
