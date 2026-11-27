"use client";

import React from "react";
import { Check, Minus, RefreshCw, ArrowRight } from "lucide-react";
import type { EmployerLandingPackageItem } from "@viecngon/types";
import { Reveal } from "./EmployerMotionPrimitives";

interface EmployerPackagesSectionProps {
  packages: EmployerLandingPackageItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const BADGE_LABEL: Record<string, string> = {
  DIAMOND: "DIAMOND",
  SUPER_HOT: "SUPER HOT",
  HOT: "HOT",
  BASIC: "CƠ BẢN",
};

function formatVnd(amount: number): string {
  return `${amount.toLocaleString("vi-VN")} VNĐ`;
}

export default function EmployerPackagesSection({
  packages,
  isLoading,
  isError,
  onRetry,
}: EmployerPackagesSectionProps) {
  const comparisonRows: Array<{
    label: string;
    render: (pkg: EmployerLandingPackageItem) => React.ReactNode;
  }> = [
    {
      label: "Thời gian hiệu lực gói",
      render: (pkg) => (
        <span className="font-semibold text-text-primary tabular-nums">
          {pkg.thoiGianHieuLuc} ngày
        </span>
      ),
    },
    {
      label: "Số lượt đăng tin tuyển dụng",
      render: (pkg) => (
        <span className="font-semibold text-text-primary tabular-nums">
          {pkg.soLuotDangTin} tin
        </span>
      ),
    },
    {
      label: "Huy hiệu nổi bật trên tin đăng",
      render: (pkg) =>
        pkg.loaiHuyHieu ? (
          <span
            className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              pkg.capDoUuTien >= 4
                ? "bg-primary-dark text-white"
                : pkg.capDoUuTien === 3
                  ? "bg-vip-light text-vip border border-vip-border"
                  : "bg-primary-light text-primary"
            }`}
          >
            {BADGE_LABEL[pkg.loaiHuyHieu] || pkg.loaiHuyHieu}
          </span>
        ) : (
          <Minus size={15} className="mx-auto text-text-muted" />
        ),
    },
    {
      label: "Ưu tiên vị trí trên trang tìm kiếm",
      render: (pkg) =>
        pkg.capDoUuTien >= 2 ? (
          <Check size={16} className="mx-auto text-success-text" />
        ) : (
          <Minus size={15} className="mx-auto text-text-muted" />
        ),
    },
    {
      label: "AI Match Score & Phân tích hồ sơ",
      render: () => <Check size={16} className="mx-auto text-success-text" />,
    },
    {
      label: "Tự động đẩy tin định kỳ (Auto-Refresh)",
      render: (pkg) =>
        pkg.capDoUuTien >= 3 ? (
          <Check size={16} className="mx-auto text-success-text" />
        ) : (
          <Minus size={15} className="mx-auto text-text-muted" />
        ),
    },
    {
      label: "Banner Nhà tuyển dụng nổi bật trang chủ",
      render: (pkg) =>
        pkg.capDoUuTien >= 4 ? (
          <Check size={16} className="mx-auto text-success-text" />
        ) : (
          <Minus size={15} className="mx-auto text-text-muted" />
        ),
    },
  ];

  return (
    <section id="packages" className="py-20 sm:py-24 bg-surface-page scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Bảng giá gói đăng tin
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              Minh bạch quyền lợi cho từng quy mô tuyển dụng IT
            </h2>
          </div>
          <p className="text-sm text-text-muted max-w-sm">
            Kích hoạt linh hoạt ngay trong Cổng Nhà tuyển dụng sau khi tài khoản
            được duyệt.
          </p>
        </Reveal>

        {isError ? (
          <div className="p-10 rounded-2xl bg-surface-card border border-border-default text-center space-y-3">
            <p className="text-sm font-medium text-danger-text">
              Không thể tải bảng giá gói dịch vụ từ hệ thống.
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold cursor-pointer"
            >
              <RefreshCw size={14} />
              Thử lại
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-surface-card border border-border-default animate-pulse space-y-4"
              >
                <div className="h-5 w-28 bg-surface-subtle rounded" />
                <div className="h-8 w-36 bg-surface-subtle rounded" />
                <div className="h-3 w-full bg-surface-muted rounded" />
                <div className="space-y-2 pt-2">
                  <div className="h-3 w-5/6 bg-surface-muted rounded" />
                  <div className="h-3 w-4/6 bg-surface-muted rounded" />
                  <div className="h-3 w-5/6 bg-surface-muted rounded" />
                </div>
                <div className="h-10 w-full bg-surface-subtle rounded-xl" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
              {packages.map((pkg, idx) => {
                const isPopular = pkg.capDoUuTien === 3;
                const isDiamond = pkg.capDoUuTien >= 4;
                return (
                  <Reveal key={pkg.maGoi} index={idx} className="h-full">
                    <div
                      className={`relative h-full flex flex-col justify-between p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 ${
                        isDiamond
                          ? "bg-primary-dark text-white border-primary-dark shadow-md hover:shadow-lg"
                          : isPopular
                            ? "bg-surface-card border-primary shadow-sm ring-1 ring-primary/20 hover:shadow-md"
                            : "bg-surface-card border-border-default shadow-2xs hover:shadow-md hover:border-primary/35"
                      }`}
                    >
                    {(isPopular || isDiamond) && (
                      <span
                        className={`self-start mb-3 inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          isDiamond
                            ? "bg-white/15 text-white border border-white/20"
                            : "bg-vip-light text-vip border border-vip-border"
                        }`}
                      >
                        {isDiamond ? "Cao cấp nhất" : "Phổ biến nhất"}
                      </span>
                    )}

                    <div className="space-y-4 flex-1">
                      <div>
                        <h3
                          className={`text-base font-bold ${
                            isDiamond ? "text-white" : "text-text-primary"
                          }`}
                        >
                          {pkg.tieuDe}
                        </h3>
                        <p
                          className={`text-xs mt-1 min-h-8 leading-relaxed ${
                            isDiamond ? "text-white/75" : "text-text-muted"
                          }`}
                        >
                          {pkg.moTaNgan ||
                            `Hiệu lực ${pkg.thoiGianHieuLuc} ngày · ${pkg.soLuotDangTin} lượt đăng tin`}
                        </p>
                      </div>

                      <div
                        className={`pb-4 border-b ${
                          isDiamond
                            ? "border-white/15"
                            : "border-border-default"
                        }`}
                      >
                        <p
                          className={`text-2xl font-extrabold tabular-nums ${
                            isDiamond ? "text-white" : "text-primary"
                          }`}
                        >
                          {formatVnd(pkg.gia)}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            isDiamond ? "text-white/70" : "text-text-muted"
                          }`}
                        >
                          {pkg.soLuotDangTin} lượt đăng · {pkg.thoiGianHieuLuc}{" "}
                          ngày
                        </p>
                      </div>

                      <ul
                        className={`space-y-2.5 text-xs ${
                          isDiamond ? "text-white/85" : "text-text-secondary"
                        }`}
                      >
                        {(pkg.quyenLois.length > 0
                          ? pkg.quyenLois.slice(0, 5)
                          : [
                              `Hiệu lực hiển thị ${pkg.thoiGianHieuLuc} ngày`,
                              `${pkg.soLuotDangTin} lượt đăng tin tuyển dụng`,
                              "Hỗ trợ AI Match Score chấm điểm hồ sơ",
                            ]
                        ).map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2">
                            <Check
                              size={14}
                              className={`shrink-0 mt-0.5 ${
                                isDiamond
                                  ? "text-primary-disabled"
                                  : "text-success-text"
                              }`}
                            />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="#register-form"
                      className={`mt-6 w-full h-10 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                        isDiamond
                          ? "bg-surface-card hover:bg-surface-muted text-primary-dark"
                          : isPopular
                            ? "bg-primary hover:bg-primary-hover text-white"
                            : "bg-surface-page hover:bg-surface-muted border border-border-default text-text-primary"
                      }`}
                    >
                      <span>Đăng ký sử dụng gói</span>
                      <ArrowRight size={13} />
                    </a>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {packages.length > 0 && (
              <Reveal index={1}>
                <div className="bg-surface-card rounded-2xl border border-border-default overflow-hidden shadow-2xs">
                <div className="px-6 py-4 border-b border-border-default flex items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-text-primary">
                    Ma trận so sánh chi tiết quyền lợi
                  </h3>
                  <span className="text-xs text-text-muted hidden sm:inline">
                    Đồng bộ trực tiếp từ danh mục gói hiện hành
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-160 text-sm">
                    <thead>
                      <tr className="bg-surface-page border-b border-border-default">
                        <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-text-muted">
                          Quyền lợi
                        </th>
                        {packages.map((pkg) => (
                          <th
                            key={pkg.maGoi}
                            className="text-center px-4 py-3.5 text-xs font-bold text-text-primary"
                          >
                            {pkg.tieuDe}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                      {comparisonRows.map((row) => (
                        <tr
                          key={row.label}
                          className="odd:bg-surface-card even:bg-surface-page/40 hover:bg-primary-light/30 transition-colors"
                        >
                          <td className="px-6 py-3.5 text-xs sm:text-sm font-medium text-text-secondary">
                            {row.label}
                          </td>
                          {packages.map((pkg) => (
                            <td
                              key={pkg.maGoi}
                              className="px-4 py-3.5 text-center text-xs sm:text-sm"
                            >
                              {row.render(pkg)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              </Reveal>
            )}
          </>
        )}
      </div>
    </section>
  );
}
