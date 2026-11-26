"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  X,
  Calendar,
  Download,
  CheckCircle2,
  BarChart3,
  DollarSign,
  Users,
} from "lucide-react";
import type {
  AdminChartPeriod,
  AdminExportReportParams,
  AdminReportType,
} from "@viecngon/types";
import { Button } from "@/components/ui/Button";

interface ExportReportModalProps {
  open: boolean;
  isExporting: boolean;
  onClose: () => void;
  onExport: (params: AdminExportReportParams) => void;
}

type DatePresetKey = "ALL" | "7D" | "30D" | "THIS_MONTH" | "CUSTOM";

const REPORT_TYPE_OPTIONS: Array<{
  value: AdminReportType;
  label: string;
  description: string;
  sheets: string[];
  icon: typeof BarChart3;
}> = [
  {
    value: "summary",
    label: "Báo cáo tổng hợp (Đầy đủ)",
    description: "Toàn bộ số liệu KPI, tăng trưởng, tuyển dụng và doanh thu.",
    sheets: [
      "Tổng quan KPI",
      "Tăng trưởng người dùng",
      "Phễu ứng tuyển",
      "Doanh thu theo gói",
      "Danh sách giao dịch",
    ],
    icon: BarChart3,
  },
  {
    value: "revenue",
    label: "Báo cáo doanh thu & giao dịch",
    description: "Tập trung vào cơ cấu gói dịch vụ và lịch sử thanh toán.",
    sheets: ["Tổng quan KPI", "Doanh thu theo gói", "Danh sách giao dịch"],
    icon: DollarSign,
  },
  {
    value: "recruitment",
    label: "Báo cáo tuyển dụng & người dùng",
    description: "Tập trung vào tăng trưởng tài khoản và phễu ứng tuyển.",
    sheets: ["Tổng quan KPI", "Tăng trưởng người dùng", "Phễu ứng tuyển"],
    icon: Users,
  },
];

const PERIOD_OPTIONS: Array<{ value: AdminChartPeriod; label: string }> = [
  { value: "monthly", label: "Theo Tháng" },
  { value: "quarterly", label: "Theo Quý" },
  { value: "yearly", label: "Theo Năm" },
];

const DATE_PRESETS: Array<{ key: DatePresetKey; label: string }> = [
  { key: "ALL", label: "Tất cả" },
  { key: "7D", label: "7 ngày qua" },
  { key: "30D", label: "30 ngày qua" },
  { key: "THIS_MONTH", label: "Tháng này" },
  { key: "CUSTOM", label: "Tùy chọn" },
];

function toYmd(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ExportReportModal({
  open,
  isExporting,
  onClose,
  onExport,
}: ExportReportModalProps) {
  const [reportType, setReportType] = useState<AdminReportType>("summary");
  const [period, setPeriod] = useState<AdminChartPeriod>("monthly");
  const [datePreset, setDatePreset] = useState<DatePresetKey>("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  if (!open) return null;

  const handlePresetClick = (preset: DatePresetKey) => {
    setDatePreset(preset);
    const today = new Date();
    if (preset === "ALL") {
      setFromDate("");
      setToDate("");
    } else if (preset === "7D") {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      setFromDate(toYmd(start));
      setToDate(toYmd(today));
    } else if (preset === "30D") {
      const start = new Date(today);
      start.setDate(today.getDate() - 29);
      setFromDate(toYmd(start));
      setToDate(toYmd(today));
    } else if (preset === "THIS_MONTH") {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      setFromDate(toYmd(start));
      setToDate(toYmd(today));
    }
  };

  const dateError =
    fromDate && toDate && fromDate > toDate
      ? "Ngày bắt đầu không được lớn hơn ngày kết thúc."
      : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dateError) return;
    onExport({
      reportType,
      period,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-label="Xuất báo cáo Excel quản trị"
    >
      <div
        className="fixed inset-0"
        onClick={() => !isExporting && onClose()}
        aria-hidden="true"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-2xl bg-surface-card border border-border-default rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-success-soft border border-success-border text-success-text flex items-center justify-center shrink-0">
              <FileSpreadsheet size={20} />
            </span>
            <div>
              <h2 className="text-base font-bold text-text-primary">
                Xuất báo cáo Excel (.xlsx)
              </h2>
              <p className="text-xs text-text-muted mt-0.5">
                Tùy chọn phạm vi số liệu và các Sheet cần xuất từ hệ thống ViecNgon
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            aria-label="Đóng hộp thoại"
            className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors cursor-pointer disabled:opacity-40"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* 1. Loại báo cáo */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              1. Chọn loại báo cáo
            </p>
            <div className="grid grid-cols-1 gap-2.5">
              {REPORT_TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = reportType === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setReportType(opt.value)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      active
                        ? "border-primary bg-primary-light/40 ring-1 ring-primary/30"
                        : "border-border-default bg-surface-card hover:bg-surface-page"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            active
                              ? "bg-primary text-white"
                              : "bg-surface-muted text-text-secondary"
                          }`}
                        >
                          <Icon size={16} />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-text-primary">
                            {opt.label}
                          </p>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                      {active && (
                        <CheckCircle2
                          size={18}
                          className="text-primary shrink-0 mt-0.5"
                        />
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2.5 pl-11">
                      {opt.sheets.map((sheetName) => (
                        <span
                          key={sheetName}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-surface-card border border-border-default text-text-secondary"
                        >
                          {sheetName}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Kỳ thống kê tăng trưởng */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              2. Kỳ thống kê tăng trưởng người dùng
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PERIOD_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPeriod(opt.value)}
                  className={`h-9 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    period === opt.value
                      ? "border-primary bg-primary text-white"
                      : "border-border-default bg-surface-card text-text-secondary hover:bg-surface-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Khoảng ngày lọc */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-muted">
              <Calendar size={13} />
              <span>3. Khoảng ngày lọc dữ liệu (Ứng tuyển & Giao dịch)</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {DATE_PRESETS.map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => handlePresetClick(p.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    datePreset === p.key
                      ? "border-primary bg-primary-light text-primary"
                      : "border-border-default bg-surface-card text-text-secondary hover:bg-surface-muted"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {datePreset !== "ALL" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label
                    htmlFor="export-from-date"
                    className="block text-xs font-semibold text-text-secondary mb-1"
                  >
                    Từ ngày
                  </label>
                  <input
                    id="export-from-date"
                    type="date"
                    value={fromDate}
                    onChange={(e) => {
                      setFromDate(e.target.value);
                      setDatePreset("CUSTOM");
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label
                    htmlFor="export-to-date"
                    className="block text-xs font-semibold text-text-secondary mb-1"
                  >
                    Đến ngày
                  </label>
                  <input
                    id="export-to-date"
                    type="date"
                    value={toDate}
                    onChange={(e) => {
                      setToDate(e.target.value);
                      setDatePreset("CUSTOM");
                    }}
                    className="w-full h-10 px-3 rounded-lg border border-border-default bg-surface-card text-sm text-text-primary focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}

            {dateError && (
              <p className="text-xs font-medium text-danger-text">{dateError}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-default bg-surface-page flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={isExporting}
            onClick={onClose}
            className="h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-secondary transition-colors cursor-pointer disabled:opacity-50"
          >
            Hủy
          </button>

          <Button
            type="submit"
            size="md"
            disabled={Boolean(dateError)}
            isLoading={isExporting}
            loadingText="Đang tạo file Excel..."
          >
            <Download size={16} />
            <span>Tải báo cáo Excel (.xlsx)</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
