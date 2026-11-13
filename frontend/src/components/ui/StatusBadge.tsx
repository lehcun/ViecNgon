import React from "react";
import { cn } from "@/lib/utils";

export type BadgeTone =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "ai"
  | "vip"
  | "neutral";

const TONE_CLASSES: Record<BadgeTone, string> = {
  primary: "bg-primary-light text-primary border-primary-subtle",
  success: "bg-success-light text-success-text border-success-border",
  warning: "bg-warning-light text-warning-text border-warning-border",
  danger: "bg-danger-light text-danger-text border-danger-border",
  info: "bg-info-light text-info-text border-info-border",
  ai: "bg-ai-light text-ai border-ai-border",
  vip: "bg-vip-light text-vip border-vip-border",
  neutral: "bg-surface-muted text-text-secondary border-border-default",
};

interface StatusMeta {
  label: string;
  tone: BadgeTone;
}

const APPLICATION_STATUS_MAP: Record<string, StatusMeta> = {
  CHO_DUYET: { label: "Chờ duyệt", tone: "warning" },
  CHUA_XEM: { label: "Chờ duyệt", tone: "warning" },
  "CHỜ XỬ LÝ": { label: "Chờ duyệt", tone: "warning" },
  "CHỜ DUYỆT": { label: "Chờ duyệt", tone: "warning" },
  DA_XEM: { label: "Đã xem", tone: "info" },
  "ĐÃ XEM": { label: "Đã xem", tone: "info" },
  DANG_XEM_XET: { label: "Đang xem xét", tone: "info" },
  PHU_HOP: { label: "Phù hợp", tone: "success" },
  "PHÙ HỢP": { label: "Phù hợp", tone: "success" },
  PHONG_VAN: { label: "Phỏng vấn", tone: "primary" },
  "PHỎNG VẤN": { label: "Phỏng vấn", tone: "primary" },
  TRUNG_TUYEN: { label: "Trúng tuyển", tone: "success" },
  DUOC_NHAN: { label: "Được nhận", tone: "success" },
  TU_CHOI: { label: "Chưa phù hợp", tone: "danger" },
  KHONG_PHU_HOP: { label: "Chưa phù hợp", tone: "danger" },
  BI_LOAI: { label: "Chưa phù hợp", tone: "danger" },
};

const JOB_STATUS_MAP: Record<string, StatusMeta> = {
  "ĐANG TUYỂN": { label: "Đang tuyển", tone: "success" },
  DANG_TUYEN: { label: "Đang tuyển", tone: "success" },
  ACTIVE: { label: "Đang tuyển", tone: "success" },
  CHO_DUYET: { label: "Chờ duyệt", tone: "warning" },
  "TẠM DỪNG": { label: "Tạm dừng", tone: "neutral" },
  TAM_DUNG: { label: "Tạm dừng", tone: "neutral" },
  "ĐÃ ĐÓNG": { label: "Đã đóng", tone: "neutral" },
  DA_DONG: { label: "Đã đóng", tone: "neutral" },
  "HẾT HẠN": { label: "Hết hạn", tone: "danger" },
  HET_HAN: { label: "Hết hạn", tone: "danger" },
};

const PAYMENT_STATUS_MAP: Record<string, StatusMeta> = {
  PAID: { label: "Thành công", tone: "success" },
  "THÀNH CÔNG": { label: "Thành công", tone: "success" },
  "ĐANG CHẠY": { label: "Đang chạy", tone: "success" },
  PENDING: { label: "Chờ xử lý", tone: "warning" },
  FAILED: { label: "Thất bại", tone: "danger" },
};

export interface StatusBadgeProps {
  status?: string | null;
  type?: "application" | "job" | "payment" | "custom";
  tone?: BadgeTone;
  label?: string;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({
  status,
  type = "application",
  tone,
  label,
  icon,
  className,
}: StatusBadgeProps) {
  const key = (status ?? "").toUpperCase().trim();

  let resolved: StatusMeta = {
    label: label || status || "Không xác định",
    tone: tone || "neutral",
  };

  if (type === "application" && APPLICATION_STATUS_MAP[key]) {
    resolved = APPLICATION_STATUS_MAP[key];
  } else if (type === "job" && JOB_STATUS_MAP[key]) {
    resolved = JOB_STATUS_MAP[key];
  } else if (type === "payment" && PAYMENT_STATUS_MAP[key]) {
    resolved = PAYMENT_STATUS_MAP[key];
  }

  const finalTone = tone ?? resolved.tone;
  const finalLabel = label ?? resolved.label;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border whitespace-nowrap",
        TONE_CLASSES[finalTone],
        className,
      )}
    >
      {icon}
      <span>{finalLabel}</span>
    </span>
  );
}

export function getAiScoreTone(score: number): BadgeTone {
  if (score >= 80) return "success";
  if (score >= 50) return "warning";
  return "danger";
}
