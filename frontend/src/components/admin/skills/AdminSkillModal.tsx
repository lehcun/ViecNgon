"use client";

import React, { useState } from "react";
import { Code2, GitMerge, Loader2, Trash2, X } from "lucide-react";
import type { AdminSkillItem } from "@viecngon/types";

export type AdminSkillModalMode = "create" | "edit" | "merge" | "delete";

interface AdminSkillModalProps {
  mode: AdminSkillModalMode;
  skill: AdminSkillItem | null;
  allSkills: AdminSkillItem[];
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmCreate: (tenKyNang: string) => void;
  onConfirmEdit: (tenKyNang: string) => void;
  onConfirmMerge: (targetSkillId: string) => void;
  onConfirmDelete: () => void;
}

export default function AdminSkillModal({
  mode,
  skill,
  allSkills,
  isSubmitting,
  onClose,
  onConfirmCreate,
  onConfirmEdit,
  onConfirmMerge,
  onConfirmDelete,
}: AdminSkillModalProps) {
  const [name, setName] = useState(
    mode === "edit" && skill ? skill.tenKyNang : "",
  );
  const [targetSkillId, setTargetSkillId] = useState("");

  const mergeCandidates = allSkills.filter(
    (item) => item.maKyNang !== skill?.maKyNang,
  );

  const trimmedName = name.trim();
  const isFormInvalid =
    ((mode === "create" || mode === "edit") && !trimmedName) ||
    (mode === "merge" && !targetSkillId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormInvalid) return;

    if (mode === "create") {
      onConfirmCreate(trimmedName);
    } else if (mode === "edit") {
      onConfirmEdit(trimmedName);
    } else if (mode === "merge") {
      onConfirmMerge(targetSkillId);
    } else {
      onConfirmDelete();
    }
  };

  const title =
    mode === "create"
      ? "Thêm kỹ năng IT mới"
      : mode === "edit"
        ? "Đổi tên chuẩn hóa kỹ năng"
        : mode === "merge"
          ? "Gộp kỹ năng trùng lặp"
          : "Xóa kỹ năng chưa sử dụng";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-surface-card border border-border-default rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {(mode === "create" || mode === "edit") && (
              <span className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                <Code2 size={16} />
              </span>
            )}
            {mode === "merge" && (
              <span className="w-8 h-8 rounded-lg bg-ai-light text-ai flex items-center justify-center">
                <GitMerge size={16} />
              </span>
            )}
            {mode === "delete" && (
              <span className="w-8 h-8 rounded-lg bg-danger-light text-danger-text flex items-center justify-center">
                <Trash2 size={16} />
              </span>
            )}
            <h3 className="text-base font-bold text-text-primary">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {(mode === "create" || mode === "edit") && (
            <div className="space-y-1.5">
              <label
                htmlFor="skill-name-input"
                className="block text-xs font-semibold text-text-primary"
              >
                Tên kỹ năng chuẩn <span className="text-danger">*</span>
              </label>
              <input
                id="skill-name-input"
                type="text"
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: ReactJS, NestJS, PostgreSQL, Kubernetes..."
                className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
              />
              <p className="text-[11px] text-text-muted">
                Tên kỹ năng sẽ đồng bộ ngay trên bộ lọc việc làm, hồ sơ ứng viên
                và hệ thống AI Match.
              </p>
            </div>
          )}

          {mode === "merge" && skill && (
            <div className="space-y-3">
              <div className="bg-surface-page border border-border-default rounded-xl p-3.5 text-sm">
                <p className="text-xs text-text-muted">
                  Kỹ năng nguồn (sẽ bị xóa sau khi gộp):
                </p>
                <p className="font-bold text-text-primary mt-0.5">
                  {skill.tenKyNang}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Đang gắn trên {skill.jobsCount} tin tuyển dụng và{" "}
                  {skill.candidatesCount} hồ sơ ứng viên.
                </p>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="target-skill-select"
                  className="block text-xs font-semibold text-text-primary"
                >
                  Chọn kỹ năng chuẩn đích <span className="text-danger">*</span>
                </label>
                <select
                  id="target-skill-select"
                  value={targetSkillId}
                  onChange={(e) => setTargetSkillId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
                >
                  <option value="">-- Chọn kỹ năng đích --</option>
                  {mergeCandidates.map((candidate) => (
                    <option key={candidate.maKyNang} value={candidate.maKyNang}>
                      {candidate.tenKyNang} ({candidate.jobsCount} tin ·{" "}
                      {candidate.candidatesCount} hồ sơ)
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {mode === "delete" && skill && (
            <p className="text-sm text-text-secondary">
              Bạn có chắc chắn muốn xóa kỹ năng{" "}
              <strong className="text-text-primary">{skill.tenKyNang}</strong>{" "}
              khỏi từ điển hệ thống? Kỹ năng này hiện chưa gắn với bất kỳ tin
              tuyển dụng hay hồ sơ ứng viên nào.
            </p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border-default bg-surface-page flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-secondary transition-colors"
          >
            Hủy
          </button>

          <button
            type="submit"
            disabled={isSubmitting || isFormInvalid}
            className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
              mode === "delete"
                ? "bg-danger hover:bg-danger-hover"
                : "bg-primary hover:bg-primary-hover"
            }`}
          >
            {isSubmitting && <Loader2 size={15} className="animate-spin" />}
            {mode === "create"
              ? "Thêm mới"
              : mode === "edit"
                ? "Lưu tên mới"
                : mode === "merge"
                  ? "Xác nhận gộp"
                  : "Xác nhận xóa"}
          </button>
        </div>
      </form>
    </div>
  );
}
