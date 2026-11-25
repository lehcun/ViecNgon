"use client";

import React, { useState } from "react";
import { X, ShieldCheck, ThumbsUp, Clock, Loader2 } from "lucide-react";
import type { CreateCompanyReviewPayload } from "@viecngon/types";
import { Button } from "@/components/ui/Button";
import StarRatingInput from "@/components/reviews/StarRatingInput";
import { COMPANY_CRITERIA_META } from "@/data/reviews.mock";

interface CompanyReviewFormModalProps {
  isOpen: boolean;
  companyName: string;
  initialRating?: number;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmitReview: (payload: CreateCompanyReviewPayload) => void;
}

type CriteriaKey = (typeof COMPANY_CRITERIA_META)[number]["key"];

export default function CompanyReviewFormModal({
  isOpen,
  companyName,
  initialRating = 5,
  isSubmitting = false,
  onClose,
  onSubmitReview,
}: CompanyReviewFormModalProps) {
  const safeInitial = Math.min(5, Math.max(1, Math.round(initialRating)));
  const [criteria, setCriteria] = useState<Record<CriteriaKey, number>>({
    diemLuongPhucLoi: safeInitial,
    diemDaoTao: safeInitial,
    diemQuanLy: safeInitial,
    diemVanHoa: safeInitial,
    diemVanPhong: safeInitial,
  });
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [noiDungUuDiem, setNoiDungUuDiem] = useState("");
  const [noiDungCaiThien, setNoiDungCaiThien] = useState("");
  const [khuyenLamViec, setKhuyenLamViec] = useState(true);
  const [coOtTot, setCoOtTot] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const avgRating = Number(
    (
      Object.values(criteria).reduce((sum, score) => sum + score, 0) /
      COMPANY_CRITERIA_META.length
    ).toFixed(1),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tieuDe.trim()) {
      setErrorMsg("Vui lòng nhập tiêu đề tóm tắt cho bài đánh giá.");
      return;
    }
    if (!noiDungUuDiem.trim() && !noiDung.trim()) {
      setErrorMsg("Vui lòng chia sẻ ít nhất nhận xét chung hoặc điểm cộng.");
      return;
    }

    onSubmitReview({
      ...criteria,
      khuyenLamViec,
      coOtTot,
      tieuDe: tieuDe.trim(),
      noiDung: noiDung.trim() || undefined,
      noiDungUuDiem: noiDungUuDiem.trim() || undefined,
      noiDungCaiThien: noiDungCaiThien.trim() || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-review-modal-title"
    >
      <div className="bg-surface-card border border-border-default rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3
              id="company-review-modal-title"
              className="text-lg font-bold text-text-primary truncate"
            >
              Viết đánh giá cho {companyName}
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Chia sẻ trải nghiệm thực tế để giúp cộng đồng kỹ sư IT chọn môi
              trường phù hợp.
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
          {/* Tổng điểm tự tính + 5 tiêu chí */}
          <div className="rounded-xl bg-surface-page border border-border-default p-4 space-y-3.5">
            <div className="flex items-center justify-between gap-3 pb-3 border-b border-border-default">
              <div>
                <p className="text-sm font-bold text-text-primary">
                  Đánh giá chi tiết theo 5 tiêu chí
                </p>
                <p className="text-xs text-text-muted">
                  Điểm tổng được tính tự động từ 5 tiêu chí bên dưới
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
              {COMPANY_CRITERIA_META.map((item) => (
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

          {/* Tiêu đề & Nội dung */}
          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="comp-rev-title"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Tiêu đề đánh giá <span className="text-danger">*</span>
              </label>
              <input
                id="comp-rev-title"
                type="text"
                maxLength={100}
                value={tieuDe}
                onChange={(e) => {
                  setTieuDe(e.target.value);
                  setErrorMsg("");
                }}
                placeholder="VD: Môi trường tech chuyên nghiệp, lương thưởng minh bạch"
                className="w-full h-10 px-3.5 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
            </div>

            <div>
              <label
                htmlFor="comp-rev-summary"
                className="block text-xs font-semibold text-text-primary mb-1.5"
              >
                Nhận xét chung
              </label>
              <textarea
                id="comp-rev-summary"
                rows={2}
                maxLength={500}
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                placeholder="Tóm tắt cảm nhận chung của bạn khi phỏng vấn hoặc làm việc tại công ty..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label
                  htmlFor="comp-rev-pros"
                  className="block text-xs font-semibold text-success-text mb-1.5"
                >
                  Điểm cộng / Điều bạn thích
                </label>
                <textarea
                  id="comp-rev-pros"
                  rows={3}
                  value={noiDungUuDiem}
                  onChange={(e) => {
                    setNoiDungUuDiem(e.target.value);
                    setErrorMsg("");
                  }}
                  placeholder="Phúc lợi, đồng nghiệp, công nghệ, sếp hỗ trợ..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                />
              </div>
              <div>
                <label
                  htmlFor="comp-rev-cons"
                  className="block text-xs font-semibold text-warning-text mb-1.5"
                >
                  Đề nghị cải thiện
                </label>
                <textarea
                  id="comp-rev-cons"
                  rows={3}
                  value={noiDungCaiThien}
                  onChange={(e) => setNoiDungCaiThien(e.target.value)}
                  placeholder="Quy trình, khối lượng công việc, OT..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Tùy chọn nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <label className="flex items-center gap-2 p-3 rounded-lg border border-border-default bg-surface-page cursor-pointer hover:border-primary/40 transition-colors">
              <input
                type="checkbox"
                checked={khuyenLamViec}
                onChange={(e) => setKhuyenLamViec(e.target.checked)}
                className="rounded border-border-strong text-primary focus:ring-primary"
              />
              <ThumbsUp size={14} className="text-success-text shrink-0" />
              <span className="text-xs font-medium text-text-primary">
                Khuyên làm việc
              </span>
            </label>

            <label className="flex items-center gap-2 p-3 rounded-lg border border-border-default bg-surface-page cursor-pointer hover:border-primary/40 transition-colors">
              <input
                type="checkbox"
                checked={coOtTot}
                onChange={(e) => setCoOtTot(e.target.checked)}
                className="rounded border-border-strong text-primary focus:ring-primary"
              />
              <Clock size={14} className="text-info-text shrink-0" />
              <span className="text-xs font-medium text-text-primary">
                Chính sách OT tốt
              </span>
            </label>
          </div>

          {errorMsg && (
            <p className="text-xs font-medium text-danger-text bg-danger-soft border border-danger-border rounded-lg px-3.5 py-2">
              {errorMsg}
            </p>
          )}

          {/* Footer */}
          <div className="pt-3 border-t border-border-default flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted">
              <ShieldCheck size={14} className="text-success-text" />
              Mọi đánh giá đều được đăng ẩn danh hoàn toàn để bảo vệ danh tính
            </span>
            <div className="flex items-center gap-2.5 ml-auto">
              <Button
                type="button"
                variant="secondary"
                size="md"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                Gửi đánh giá
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
