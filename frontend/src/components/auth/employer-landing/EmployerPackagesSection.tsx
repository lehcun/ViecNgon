"use client";

import React from "react";
import { Check, Minus, Sparkles, RefreshCw } from "lucide-react";
import type { EmployerLandingPackageItem } from "@viecngon/types";

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
          <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold bg-primary-light text-primary">
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
    <section id="packages" className="py-16 sm:py-20 bg-surface-page scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-light border border-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>Giải pháp Đăng tin tuyển dụng IT</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
            Linh hoạt theo quy mô & tốc độ tuyển dụng
          </h2>
          <p className="text-sm sm:text-base text-text-secondary">
            Chọn gói phù hợp ngay sau khi tài khoản doanh nghiệp của bạn được
            kích hoạt.
          </p>
        </div>

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
            {/* 4 Thẻ gói dịch vụ thật từ DB */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {packages.map((pkg) => {
                const isHighlight = pkg.capDoUuTien === 3;
                const isDiamond = pkg.capDoUuTien >= 4;
                return (
                  <div
                    key={pkg.maGoi}
                    className={`relative flex flex-col justify-between p-6 rounded-2xl border bg-surface-card transition-shadow ${
                      isHighlight
                        ? "border-primary shadow-md ring-1 ring-primary/20"
                        : isDiamond
                          ? "border-primary-dark/40 shadow-sm"
                          : "border-border-default shadow-2xs"
                    }`}
                  >
                    {(isHighlight || isDiamond) && (
                      <span
                        className={`absolute -top-3 right-4 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${
                          isDiamond
                            ? "bg-primary-dark text-white"
                            : "bg-primary text-white"
                        }`}
                      >
                        {isDiamond ? "Cao cấp nhất" : "Phổ biến nhất"}
                      </span>
                    )}

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-base font-bold text-text-primary">
                          {pkg.tieuDe}
                        </h3>
                        <p className="text-xs text-text-muted mt-1 min-h-8">
                          {pkg.moTaNgan ||
                            `Hiệu lực ${pkg.thoiGianHieuLuc} ngày · ${pkg.soLuotDangTin} lượt đăng tin`}
                        </p>
                      </div>

                      <div className="pb-4 border-b border-border-default">
                        <p className="text-2xl font-extrabold text-primary tabular-nums">
                          {formatVnd(pkg.gia)}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {pkg.soLuotDangTin} lượt đăng · {pkg.thoiGianHieuLuc}{" "}
                          ngày
                        </p>
                      </div>

                      <ul className="space-y-2 text-xs text-text-secondary">
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
                              className="text-success-text shrink-0 mt-0.5"
                            />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <a
                      href="#register-form"
                      className={`mt-6 w-full h-10 rounded-xl text-xs font-bold inline-flex items-center justify-center transition-colors ${
                        isHighlight
                          ? "bg-primary hover:bg-primary-hover text-white"
                          : "bg-surface-page hover:bg-surface-muted border border-border-default text-text-primary"
                      }`}
                    >
                      Đăng ký sử dụng gói
                    </a>
                  </div>
                );
              })}
            </div>

            {/* Bảng ma trận so sánh chi tiết quyền lợi */}
            {packages.length > 0 && (
              <div className="bg-surface-card rounded-2xl border border-border-default overflow-hidden shadow-2xs">
                <div className="px-6 py-4 border-b border-border-default">
                  <h3 className="text-base font-bold text-text-primary">
                    So sánh chi tiết quyền lợi các gói
                  </h3>
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
                        <tr key={row.label} className="hover:bg-surface-page/60">
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
            )}
          </>
        )}
      </div>
    </section>
  );
}
