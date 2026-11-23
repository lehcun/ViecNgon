"use client";

import React from "react";
import Link from "next/link";
import {
  Building2,
  Calendar,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Loader2,
  Package,
  X,
} from "lucide-react";
import type { AdminTransactionItem } from "@viecngon/types";
import { formatVnd } from "./AdminPackagesTable";
import { TX_STATUS_META } from "./AdminTransactionsTable";

interface AdminTransactionDetailDrawerProps {
  transaction: AdminTransactionItem | null;
  isConfirming: boolean;
  onClose: () => void;
  onConfirmPayment: (tx: AdminTransactionItem) => void;
}

function formatDateVi(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function AdminTransactionDetailDrawer({
  transaction,
  isConfirming,
  onClose,
  onConfirmPayment,
}: AdminTransactionDetailDrawerProps) {
  if (!transaction) return null;

  const statusInfo = TX_STATUS_META[transaction.trangThaiTT];
  const isPending = transaction.trangThaiTT === "CHO_THANH_TOAN";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Chi tiết giao dịch thanh toán"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-lg bg-surface-card h-full shadow-2xl border-l border-border-default flex flex-col">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">
              Chi tiết giao dịch
            </h2>
            <p className="text-xs font-mono text-text-muted mt-0.5">
              {transaction.maGiaoDichDoiTac}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng chi tiết giao dịch"
            className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="bg-surface-page border border-border-default rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-text-muted">Số tiền thanh toán</p>
              <p className="text-2xl font-bold text-success-text tabular-nums mt-0.5">
                {formatVnd(transaction.soTienThanhToan)}
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
              />
              {statusInfo.label}
            </span>
          </div>

          {/* Doanh nghiệp & HR */}
          <div className="bg-surface-card border border-border-default rounded-xl p-4 space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
              <Building2 size={14} className="text-primary" />
              <span>Khách hàng doanh nghiệp</span>
            </div>
            {transaction.company && (
              <Link
                href={`/company/${transaction.company.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
              >
                <span>{transaction.company.tenCongTy}</span>
                <ExternalLink size={12} />
              </Link>
            )}
            <p className="text-xs text-text-secondary">
              HR phụ trách:{" "}
              <strong className="text-text-primary">
                {transaction.recruiter.tenNguoiDung}
              </strong>{" "}
              ({transaction.recruiter.email})
            </p>
          </div>

          {/* Thông tin Gói & Chiến dịch */}
          <div className="bg-surface-card border border-border-default rounded-xl p-4 space-y-2.5 text-sm">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted">
              <Package size={14} className="text-primary" />
              <span>Gói dịch vụ &amp; Chiến dịch</span>
            </div>
            <p className="font-semibold text-text-primary">
              {transaction.package.tieuDe}
            </p>
            {transaction.campaign.tieuDe && (
              <p className="text-xs text-text-secondary">
                Chiến dịch: {transaction.campaign.tieuDe}
              </p>
            )}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-surface-page rounded-lg p-2.5 border border-border-default">
                <p className="text-text-muted">Số lượt còn lại</p>
                <p className="font-bold text-text-primary text-sm mt-0.5 tabular-nums">
                  {transaction.campaign.soLuotConLai ?? 0} lượt
                </p>
              </div>
              <div className="bg-surface-page rounded-lg p-2.5 border border-border-default">
                <p className="text-text-muted">Trạng thái gói</p>
                <p className="font-semibold text-text-primary mt-0.5">
                  {transaction.campaign.trangThai || "—"}
                </p>
              </div>
            </div>
            <p className="text-xs text-text-secondary flex items-center gap-1.5 pt-1">
              <Calendar size={13} className="text-text-muted" />
              <span>
                Hiệu lực: {formatDateVi(transaction.campaign.ngayBatDau)} →{" "}
                {formatDateVi(transaction.campaign.ngayKetThuc)}
              </span>
            </p>
          </div>

          {/* Thanh toán */}
          <div className="bg-surface-page border border-border-default rounded-xl p-4 space-y-2 text-xs text-text-secondary">
            <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-text-muted">
              <CreditCard size={14} />
              <span>Thông tin thanh toán</span>
            </div>
            <p>
              <span className="text-text-muted">Phương thức:</span>{" "}
              <strong className="text-text-primary">
                {transaction.phuongThucTT || "Chuyển khoản"}
              </strong>
            </p>
            <p>
              <span className="text-text-muted">Ngày thanh toán:</span>{" "}
              {new Date(transaction.ngayThanhToan).toLocaleString("vi-VN")}
            </p>
            {transaction.ghiChu && (
              <p>
                <span className="text-text-muted">Ghi chú:</span>{" "}
                {transaction.ghiChu}
              </p>
            )}
          </div>
        </div>

        {isPending && (
          <div className="px-6 py-4 border-t border-border-default bg-surface-page flex justify-end">
            <button
              type="button"
              disabled={isConfirming}
              onClick={() => onConfirmPayment(transaction)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-success hover:bg-success-hover text-white text-sm font-semibold disabled:opacity-50 transition-colors"
            >
              {isConfirming ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <CheckCircle2 size={15} />
              )}
              Xác nhận đã thanh toán &amp; Kích hoạt gói
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
