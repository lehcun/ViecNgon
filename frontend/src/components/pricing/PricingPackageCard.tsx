"use client";

import React from "react";
import {
  Check,
  FileText,
  CalendarDays,
  Loader2,
  Star,
  Flame,
  Crown,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { PackageResponse } from "@viecngon/types";
import { formatVnd } from "@/lib/formatters";
import { cn } from "@/lib/utils";

interface PricingPackageCardProps {
  pkg: PackageResponse;
  isPurchasing: boolean;
  disabled: boolean;
  onPurchase: (pkg: PackageResponse) => void;
}

export default function PricingPackageCard({
  pkg,
  isPurchasing,
  disabled,
  onPurchase,
}: PricingPackageCardProps) {
  const level = pkg.priorityLevel ?? 1;
  const isPopular = Boolean(pkg.isPopular);
  const isVip = level === 3;
  const isDiamond = level >= 4;

  const badgeLabel =
    pkg.badgeText ||
    (isPopular
      ? "Phổ biến nhất"
      : isVip
        ? "VIP Đẩy Tin"
        : isDiamond
          ? "Doanh nghiệp"
          : null);

  return (
    <div
      className={cn(
        "relative rounded-2xl transition-all duration-200 flex flex-col justify-between",
        isPopular
          ? "bg-surface-card border-2 border-primary shadow-lg"
          : isDiamond
            ? "bg-linear-to-b from-ai-light/70 via-surface-card to-surface-card border-2 border-ai-border shadow-md"
            : isVip
              ? "bg-[#FFF5EE] border border-vip-border shadow-sm hover:shadow-md"
              : "bg-surface-card border border-border-default shadow-xs hover:shadow-md",
      )}
    >
      {/* Badge nổi phía trên Card */}
      {badgeLabel && (
        <div
          className={cn(
            "absolute -top-3.5 left-1/2 -translate-x-1/2 text-white text-[11px] font-bold px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 uppercase tracking-wider whitespace-nowrap",
            isPopular
              ? "bg-primary"
              : isDiamond
                ? "bg-ai"
                : isVip
                  ? "bg-danger"
                  : "bg-vip",
          )}
        >
          {isPopular && <Star size={12} className="fill-white" />}
          {isVip && <Flame size={12} className="fill-white" />}
          {isDiamond && <Crown size={12} />}
          <span>{badgeLabel}</span>
        </div>
      )}

      {/* Nội dung gói */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2 pt-1">
          <h3 className="text-lg font-bold text-text-primary leading-snug">
            {pkg.tieuDe}
          </h3>
          {pkg.loaiQuangCao && (
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0 border",
                isDiamond
                  ? "bg-ai-light text-ai border-ai-border"
                  : isVip
                    ? "bg-danger-light text-danger-text border-danger-border"
                    : isPopular
                      ? "bg-vip-light text-vip border-vip-border"
                      : "bg-surface-subtle text-text-secondary border-border-default",
              )}
            >
              {pkg.loaiQuangCao.replace("_", " ")}
            </span>
          )}
        </div>

        {pkg.description && (
          <p className="text-xs text-text-muted leading-relaxed min-h-8">
            {pkg.description}
          </p>
        )}

        {/* Giá tiền */}
        <div className="my-5 pb-5 border-b border-border-default">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-bold text-text-primary tabular-nums">
              {pkg.gia === 0 ? "Miễn phí" : formatVnd(pkg.gia)}
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Thanh toán một lần · Hiệu lực {pkg.thoiGianHieuLuc} ngày
          </p>
        </div>

        {/* Hạn mức tin & thời gian */}
        <div
          className={cn(
            "space-y-2.5 mb-5 p-3.5 rounded-xl border",
            isVip
              ? "bg-surface-card/85 border-vip-border"
              : "bg-surface-muted border-border-default",
          )}
        >
          <div className="flex items-center gap-2.5 text-sm font-semibold text-text-primary">
            <div className="p-1.5 bg-primary-light text-primary rounded-lg shrink-0">
              <FileText size={15} />
            </div>
            <span>{pkg.soLuotDangTin} tin tuyển dụng</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm font-semibold text-text-primary">
            <div className="p-1.5 bg-info-light text-info rounded-lg shrink-0">
              <CalendarDays size={15} />
            </div>
            <span>Hiển thị {pkg.thoiGianHieuLuc} ngày</span>
          </div>
        </div>

        {/* Kế thừa từ gói trước */}
        {pkg.inheritedFrom && (
          <div className="mb-3 px-3 py-2 rounded-lg bg-primary-light/70 border border-primary/15 text-xs font-semibold text-primary flex items-center gap-1.5">
            <Sparkles size={13} className="shrink-0" />
            <span>{pkg.inheritedFrom}</span>
          </div>
        )}

        {/* Danh sách quyền lợi */}
        <div className="space-y-2 flex-1">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
            Quyền lợi chi tiết
          </p>
          <ul className="space-y-2">
            {pkg.features.map((feat, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-xs sm:text-sm text-text-secondary leading-relaxed"
              >
                <Check size={15} className="text-success shrink-0 mt-0.5" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Nút Mua */}
      <div className="p-6 pt-0 mt-auto">
        <button
          type="button"
          onClick={() => onPurchase(pkg)}
          disabled={disabled}
          className={cn(
            "w-full h-11 px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2",
            isPopular
              ? "bg-primary hover:bg-primary-hover text-white"
              : isDiamond
                ? "bg-ai hover:opacity-95 text-white"
                : isVip
                  ? "bg-danger hover:bg-danger-hover text-white"
                  : "bg-primary-dark hover:opacity-90 text-white",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        >
          {isPurchasing ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Đang xử lý...</span>
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              <span>Chọn {pkg.tieuDe.split(" /")[0]}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
