"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Briefcase,
  Activity,
  Ticket,
  PlusCircle,
  CreditCard,
  RefreshCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useCampaigns } from "@/hooks/recruiter/useCampaigns";
import { CampaignStatus } from "@viecngon/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import SpotlightBannerModal from "@/components/employer/SpotlightBannerModal";
import {
  EmptyState,
  ErrorState,
  MetricCardSkeleton,
  TableRowSkeleton,
} from "@/components/ui/StateViews";
import { formatDateVN, formatVnd } from "@/lib/formatters";

function normalizeCampaignStatus(
  rawStatus?: string | null,
  ngayKetThuc?: string | Date | null,
): CampaignStatus {
  const key = (rawStatus ?? "").toUpperCase().trim();

  if (key === "CHO_THANH_TOAN" || key === "CHỜ THANH TOÁN") {
    return "CHO_THANH_TOAN";
  }

  if (
    key === "DA_KET_THUC" ||
    key === "ĐÃ KẾT THÚC" ||
    key === "HET_HAN" ||
    key === "HẾT HẠN"
  ) {
    return "DA_KET_THUC";
  }

  if (key === "DANG_CHAY" || key === "ĐANG CHẠY") {
    if (ngayKetThuc) {
      const endOfDay = new Date(ngayKetThuc);
      endOfDay.setHours(23, 59, 59, 999);
      if (
        !Number.isNaN(endOfDay.getTime()) &&
        endOfDay.getTime() < Date.now()
      ) {
        return "DA_KET_THUC";
      }
    }
    return "DANG_CHAY";
  }

  return "DA_KET_THUC";
}

export default function CampaignsPage() {
  const { campaigns, isLoading, isError, refetch } = useCampaigns();
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);

  const normalizedCampaigns = campaigns.map((c) => ({
    ...c,
    normalizedStatus: normalizeCampaignStatus(c.trangThai, c.ngayKetThuc),
  }));

  const activeCampaigns = normalizedCampaigns.filter(
    (c) => c.normalizedStatus === "DANG_CHAY",
  );

  const activeCampaignsCount = activeCampaigns.length;

  const totalCredits = activeCampaigns.reduce(
    (sum, c) => sum + Math.max(0, Number(c.soLuotConLai) || 0),
    0,
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10">
      {/* Header & CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-card p-6 rounded-xl border border-border-default shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Quản lý Gói dịch vụ & Chiến dịch
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Theo dõi lịch sử mua gói, thời hạn hiệu lực và số lượt đăng tin còn
            lại.
          </p>
        </div>

        <Link
          href="/pricing"
          className="inline-flex items-center justify-center gap-2 h-10 px-5 bg-primary hover:bg-primary-hover text-white text-sm font-semibold rounded-lg shadow-xs transition-colors shrink-0"
        >
          <ShoppingCart size={16} /> Mua thêm gói
        </Link>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <MetricCardSkeleton />
          <MetricCardSkeleton />
          <MetricCardSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-surface-card p-5 rounded-xl border border-border-default shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-surface-muted text-text-secondary flex items-center justify-center shrink-0">
              <Briefcase size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted mb-1">
                Tổng số chiến dịch
              </p>
              <h3 className="text-2xl font-bold text-text-primary tabular-nums">
                {normalizedCampaigns.length}
              </h3>
            </div>
          </div>

          <div className="bg-surface-card p-5 rounded-xl border border-border-default shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success-light text-success flex items-center justify-center shrink-0">
              <Activity size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted mb-1">
                Gói đang hoạt động
              </p>
              <h3 className="text-2xl font-bold text-text-primary tabular-nums">
                {activeCampaignsCount}
              </h3>
            </div>
          </div>

          <div className="bg-surface-card p-5 rounded-xl border border-border-default shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Ticket size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-muted mb-1">
                Tổng lượt đăng tin còn lại
              </p>
              <h3 className="text-2xl font-bold text-primary tabular-nums">
                {totalCredits}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Bảng lịch sử chiến dịch */}
      <div className="bg-surface-card rounded-xl border border-border-default shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary">
            Lịch sử chiến dịch
          </h2>
        </div>

        {isError ? (
          <div className="p-6">
            <ErrorState
              title="Không thể tải danh sách chiến dịch"
              message="Vui lòng kiểm tra kết nối máy chủ và thử lại."
              onRetry={() => void refetch()}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-muted text-text-muted text-xs font-semibold uppercase tracking-wide border-b border-border-default">
                  <th className="px-6 py-3.5">Thông tin gói</th>
                  <th className="px-6 py-3.5">Thời hạn</th>
                  <th className="px-6 py-3.5 text-center">Lượt đăng</th>
                  <th className="px-6 py-3.5 text-center">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-default">
                {isLoading ? (
                  <>
                    <TableRowSkeleton cols={5} />
                    <TableRowSkeleton cols={5} />
                    <TableRowSkeleton cols={5} />
                  </>
                ) : normalizedCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6">
                      <EmptyState
                        icon={<Ticket size={26} />}
                        title="Chưa có chiến dịch nào"
                        description="Mua gói dịch vụ đăng tin để kích hoạt lượt đăng tin và tiếp cận ứng viên IT nhanh hơn."
                        actionLabel="Xem bảng giá dịch vụ"
                        actionHref="/pricing"
                      />
                    </td>
                  </tr>
                ) : (
                  normalizedCampaigns.map((c) => {
                    const rowKey =
                      c.id ||
                      (c as unknown as { maMua?: string }).maMua ||
                      c.tieuDe;
                    const remaining = Math.max(0, Number(c.soLuotConLai) || 0);

                    return (
                      <tr
                        key={rowKey}
                        className="hover:bg-surface-muted/70 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-text-primary text-sm mb-1">
                            {c.tieuDe}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-text-muted">
                            <span className="px-2 py-0.5 bg-surface-subtle text-text-secondary rounded font-medium">
                              {c.tenGoi}
                            </span>
                            <span>•</span>
                            <span className="tabular-nums">
                              {c.giaTaiThoiDiemMua === 0
                                ? "Miễn phí"
                                : formatVnd(c.giaTaiThoiDiemMua)}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1 text-xs text-text-secondary">
                            <div className="flex items-center gap-2">
                              <span className="text-text-muted w-6">Từ:</span>
                              <span className="font-medium tabular-nums">
                                {formatDateVN(c.ngayMua)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-text-muted w-6">Đến:</span>
                              <span className="font-medium tabular-nums">
                                {formatDateVN(c.ngayKetThuc)}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span
                            className={`inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full text-xs font-bold tabular-nums ${
                              remaining === 0
                                ? "bg-danger-light text-danger-text"
                                : "bg-primary-light text-primary"
                            }`}
                          >
                            {remaining > 100 ? "∞" : remaining}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {c.normalizedStatus === "DANG_CHAY" && (
                            <StatusBadge
                              type="custom"
                              tone="success"
                              label="Đang chạy"
                            />
                          )}
                          {c.normalizedStatus === "DA_KET_THUC" && (
                            <StatusBadge
                              type="custom"
                              tone="neutral"
                              label="Đã kết thúc"
                            />
                          )}
                          {c.normalizedStatus === "CHO_THANH_TOAN" && (
                            <StatusBadge
                              type="custom"
                              tone="warning"
                              label="Chờ thanh toán"
                            />
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {c.normalizedStatus === "DANG_CHAY" &&
                              ((c.priorityLevel ?? 0) >= 4 ||
                                c.tenGoi.toLowerCase().includes("kim cương") ||
                                c.badgeType === "DIAMOND") && (
                                <button
                                  type="button"
                                  onClick={() => setIsBannerModalOpen(true)}
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-warning-bg hover:bg-warning-light text-warning-text font-semibold rounded-lg text-xs transition-colors border border-warning-border"
                                >
                                  <SlidersHorizontal size={14} /> Tùy chỉnh Banner
                                </button>
                              )}

                            {c.normalizedStatus === "DANG_CHAY" &&
                              remaining > 0 && (
                                <Link
                                  href="/post-job"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-light hover:bg-primary/15 text-primary font-semibold rounded-lg text-xs transition-colors border border-primary/20"
                                >
                                  <PlusCircle size={15} /> Đăng tin
                                </Link>
                              )}

                            {c.normalizedStatus === "DANG_CHAY" &&
                              remaining === 0 && (
                                <Link
                                  href="/pricing"
                                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-card hover:bg-surface-muted text-text-primary font-semibold rounded-lg text-xs transition-colors border border-border-default"
                                >
                                  <ShoppingCart size={14} /> Mua thêm
                                </Link>
                              )}

                            {c.normalizedStatus === "DA_KET_THUC" && (
                              <Link
                                href="/pricing"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-card hover:bg-surface-muted text-text-primary font-semibold rounded-lg text-xs transition-colors border border-border-default"
                              >
                                <RefreshCcw size={14} /> Gia hạn
                              </Link>
                            )}

                            {c.normalizedStatus === "CHO_THANH_TOAN" && (
                              <Link
                                href="/pricing"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-warning text-white font-semibold rounded-lg text-xs transition-colors hover:opacity-90"
                              >
                                <CreditCard size={14} /> Thanh toán
                              </Link>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SpotlightBannerModal
        isOpen={isBannerModalOpen}
        onClose={() => setIsBannerModalOpen(false)}
      />
    </div>
  );
}
