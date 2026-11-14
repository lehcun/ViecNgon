"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Crown,
  ImagePlus,
  Loader2,
  MapPin,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  SpotlightBannerConfigResponse,
  UpdateSpotlightBannerPayload,
} from "@viecngon/types";
import { useSpotlightBanner } from "@/hooks/recruiter/useSpotlightBanner";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { ErrorState } from "@/components/ui/StateViews";
import { cn } from "@/lib/utils";

interface SpotlightBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SpotlightBannerModal({
  isOpen,
  onClose,
}: SpotlightBannerModalProps) {
  const {
    config,
    isLoading,
    isError,
    error,
    refetch,
    saveBanner,
    isSaving,
    uploadCover,
    isUploadingCover,
  } = useSpotlightBanner(isOpen);

  // Đóng bằng phím Escape và khóa scroll nền (chỉ đồng bộ DOM bên ngoài, không gọi setState)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving && !isUploadingCover) {
        onClose();
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isSaving, isUploadingCover, onClose]);

  if (!isOpen) return null;

  const formKey = config
    ? [
        config.companyId,
        config.bannerCoverUrl ?? "",
        config.bannerCity,
        config.bannerTagline,
        config.bannerBadgeText,
        config.selectedJobIds.join(","),
      ].join("|")
    : "empty";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="spotlight-banner-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-[1px]"
      onClick={() => {
        if (!isSaving && !isUploadingCover) onClose();
      }}
    >
      <div
        className="w-full max-w-4xl bg-surface-card rounded-2xl border border-border-default shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="px-6 py-4 border-b border-border-default flex items-center justify-between bg-surface-card">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-warning-bg text-warning flex items-center justify-center border border-warning-border shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h3
                id="spotlight-banner-modal-title"
                className="text-lg font-bold text-text-primary"
              >
                Tùy chỉnh Banner Nhà Tuyển Dụng Nổi Bật
              </h3>
              <p className="text-xs text-text-muted">
                Đặc quyền Gói Kim Cương — Hiển thị tại đầu trang Tìm việc làm
                (/jobs)
              </p>
            </div>
          </div>

          <button
            type="button"
            aria-label="Đóng cửa sổ"
            onClick={onClose}
            disabled={isSaving || isUploadingCover}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-muted transition-colors disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="p-6 space-y-5 overflow-y-auto animate-pulse">
            <div className="h-40 w-full rounded-xl bg-slate-100 border border-border-default" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-11 bg-slate-100 rounded-lg" />
              <div className="h-11 bg-slate-100 rounded-lg" />
            </div>
            <div className="h-20 bg-slate-100 rounded-lg" />
            <div className="h-44 bg-slate-100 rounded-lg" />
          </div>
        ) : isError || !config ? (
          <div className="p-6">
            <ErrorState
              title="Không thể tải cấu hình Banner"
              message={
                error?.message ||
                "Vui lòng thử lại sau hoặc kiểm tra gói Kim Cương."
              }
              onRetry={() => void refetch()}
            />
          </div>
        ) : !config.hasDiamondAccess ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-base font-bold text-text-primary">
              Doanh nghiệp hiện chưa có Gói Kim Cương đang hoạt động
            </p>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Vui lòng kích hoạt hoặc gia hạn Gói Kim Cương / Doanh nghiệp để mở
              khóa quyền tùy chỉnh Banner Spotlight trên trang chủ tìm việc.
            </p>
          </div>
        ) : (
          <SpotlightBannerForm
            key={formKey}
            config={config}
            onClose={onClose}
            saveBanner={saveBanner}
            isSaving={isSaving}
            uploadCover={uploadCover}
            isUploadingCover={isUploadingCover}
          />
        )}
      </div>
    </div>
  );
}

interface SpotlightBannerFormProps {
  config: SpotlightBannerConfigResponse;
  onClose: () => void;
  saveBanner: (
    payload: UpdateSpotlightBannerPayload,
  ) => Promise<SpotlightBannerConfigResponse>;
  isSaving: boolean;
  uploadCover: (file: File) => Promise<{ url: string }>;
  isUploadingCover: boolean;
}

function SpotlightBannerForm({
  config,
  onClose,
  saveBanner,
  isSaving,
  uploadCover,
  isUploadingCover,
}: SpotlightBannerFormProps) {
  const [bannerCoverUrl, setBannerCoverUrl] = useState(
    config.bannerCoverUrl || "",
  );
  const [bannerCity, setBannerCity] = useState(
    config.bannerCity || config.defaultCity || "",
  );
  const [bannerTagline, setBannerTagline] = useState(
    config.bannerTagline || config.defaultTagline || "",
  );
  const [bannerBadgeText, setBannerBadgeText] = useState(
    config.bannerBadgeText || "TOP HIRING",
  );
  const [selectedJobIds, setSelectedJobIds] = useState<string[]>(
    config.selectedJobIds || [],
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const availableJobs = config.availableJobs || [];
  const jobsMap = new Map(availableJobs.map((j) => [j.id, j]));
  const previewJobs = selectedJobIds
    .map((id) => jobsMap.get(id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 5);

  const handleToggleJob = (jobId: string) => {
    setSelectedJobIds((prev) => {
      if (prev.includes(jobId)) {
        return prev.filter((id) => id !== jobId);
      }
      if (prev.length >= 5) {
        toast.error("Chỉ được chọn tối đa 5 việc làm nổi bật trên Banner");
        return prev;
      }
      return [...prev, jobId];
    });
  };

  const handleMoveJob = (jobId: string, direction: "up" | "down") => {
    setSelectedJobIds((prev) => {
      const idx = prev.indexOf(jobId);
      if (idx === -1) return prev;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const next = [...prev];
      const [item] = next.splice(idx, 1);
      next.splice(targetIdx, 0, item);
      return next;
    });
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dung lượng ảnh tối đa là 5MB");
      return;
    }
    try {
      const res = await uploadCover(file);
      setBannerCoverUrl(res.url);
      toast.success("Đã tải ảnh nền lên thành công");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveBanner({
      bannerCoverUrl: bannerCoverUrl.trim() || null,
      bannerCity: bannerCity.trim() || null,
      bannerTagline: bannerTagline.trim() || null,
      bannerBadgeText: bannerBadgeText.trim() || "TOP HIRING",
      selectedJobIds: selectedJobIds.slice(0, 5),
    });
    onClose();
  };

  return (
    <form
      id="spotlight-banner-form"
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 overflow-hidden"
    >
      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Live Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Xem trước giao diện hiển thị (/jobs)
            </span>
            <span className="text-xs text-text-muted">
              Đang hiển thị{" "}
              <strong className="text-primary">{previewJobs.length}/5</strong>{" "}
              việc làm
            </span>
          </div>

          <div className="bg-surface-card rounded-xl border border-border-default shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Visual */}
              <div className="lg:col-span-3 relative min-h-34 flex items-center justify-between lg:justify-end">
                {bannerCoverUrl.trim() ? (
                  <div className="absolute inset-0 bg-slate-900">
                    <Image
                      src={bannerCoverUrl.trim()}
                      alt="Xem trước ảnh nền"
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 240px"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-r from-slate-900/45 via-slate-900/20 to-transparent" />
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-primary-hover to-sky-700" />
                )}

                <div className="absolute top-2.5 left-0 z-10 px-2.5 py-0.5 rounded-r bg-warning text-white text-[11px] font-bold">
                  Nhà tuyển dụng nổi bật
                </div>

                <div className="relative z-10 mx-auto lg:mx-0 lg:-mr-8 mt-5 lg:mt-0 w-20 h-20 rounded-xl bg-surface-card border border-border-default shadow-md p-1.5 flex items-center justify-center">
                  <CompanyLogo
                    src={config.logo}
                    name={config.companyName}
                    size="md"
                    className="border-0 bg-transparent shadow-none"
                  />
                </div>
              </div>

              {/* Middle Info */}
              <div
                className={cn(
                  "px-4 py-3.5 lg:pl-12 lg:pr-4 flex flex-col justify-center",
                  previewJobs.length > 0 ? "lg:col-span-5" : "lg:col-span-9",
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-sm font-bold text-text-primary line-clamp-1">
                    {config.companyName}
                  </span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-warning text-white text-[10px] font-extrabold">
                    <Crown size={10} className="fill-white" />
                    {bannerBadgeText.trim() || "TOP HIRING"}
                  </span>
                </div>

                {(bannerCity.trim() || config.defaultCity) && (
                  <div className="flex items-center gap-1 text-xs text-text-muted mt-1">
                    <MapPin size={12} className="shrink-0" />
                    <span>{bannerCity.trim() || config.defaultCity}</span>
                  </div>
                )}

                <p className="text-xs text-text-secondary line-clamp-2 mt-1.5">
                  {bannerTagline.trim() || config.defaultTagline}
                </p>

                <span className="mt-2 text-xs font-semibold text-primary">
                  Xem {config.activeJobsCount} việc làm &gt;
                </span>
              </div>

              {/* Right Jobs */}
              {previewJobs.length > 0 && (
                <div className="lg:col-span-4 px-4 py-3.5 border-t lg:border-t-0 lg:border-l border-dashed border-border-default flex flex-col justify-center gap-1.5">
                  {previewJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center gap-2 text-xs font-medium text-text-primary"
                    >
                      <span className="w-4 h-4 rounded-full border border-danger-border bg-danger-bg/60 text-danger flex items-center justify-center shrink-0">
                        <ArrowRight size={9} />
                      </span>
                      <span className="truncate">{job.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cover Upload + URL */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-semibold text-text-primary">
              Ảnh nền cột trái Banner (tùy chọn)
            </label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handleUploadFile}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingCover}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary-light/60 text-primary text-xs font-semibold hover:bg-primary-light transition-colors disabled:opacity-60"
              >
                {isUploadingCover ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ImagePlus size={14} />
                )}
                <span>
                  {isUploadingCover ? "Đang tải lên..." : "Tải ảnh từ máy"}
                </span>
              </button>
              {bannerCoverUrl && (
                <button
                  type="button"
                  onClick={() => setBannerCoverUrl("")}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border-default text-xs font-medium text-text-secondary hover:bg-surface-muted transition-colors"
                >
                  <RotateCcw size={13} />
                  <span>Dùng nền mặc định</span>
                </button>
              )}
            </div>
          </div>
          <input
            type="text"
            maxLength={255}
            value={bannerCoverUrl}
            onChange={(e) => setBannerCoverUrl(e.target.value)}
            placeholder="https://... hoặc bấm 'Tải ảnh từ máy' (JPG, PNG, WEBP <= 5MB)"
            className="w-full h-10 px-3.5 rounded-lg border border-border-default bg-surface-page text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:bg-surface-card transition-colors"
          />
        </div>

        {/* Thành phố & Nhãn Badge */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="banner-city-input"
              className="block text-sm font-semibold text-text-primary mb-1.5"
            >
              Thành phố hiển thị
            </label>
            <input
              id="banner-city-input"
              type="text"
              maxLength={100}
              value={bannerCity}
              onChange={(e) => setBannerCity(e.target.value)}
              placeholder={
                config.defaultCity || "Ví dụ: Hà Nội, TP. Hồ Chí Minh..."
              }
              className="w-full h-10 px-3.5 rounded-lg border border-border-default bg-surface-page text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:bg-surface-card transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="banner-badge-input"
              className="block text-sm font-semibold text-text-primary mb-1.5"
            >
              Nhãn nổi bật bên cạnh tên công ty
            </label>
            <input
              id="banner-badge-input"
              type="text"
              maxLength={40}
              value={bannerBadgeText}
              onChange={(e) => setBannerBadgeText(e.target.value)}
              placeholder="TOP HIRING"
              className="w-full h-10 px-3.5 rounded-lg border border-border-default bg-surface-page text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:bg-surface-card transition-colors"
            />
          </div>
        </div>

        {/* Slogan */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="banner-tagline-input"
              className="text-sm font-semibold text-text-primary"
            >
              Slogan / Mô tả nổi bật
            </label>
            <span className="text-xs text-text-muted tabular-nums">
              {bannerTagline.length}/200
            </span>
          </div>
          <textarea
            id="banner-tagline-input"
            rows={2}
            maxLength={200}
            value={bannerTagline}
            onChange={(e) => setBannerTagline(e.target.value)}
            placeholder="Ví dụ: Ngân hàng số hàng đầu Việt Nam — Gia nhập đội ngũ hơn 1.000 kỹ sư công nghệ"
            className="w-full px-3.5 py-2.5 rounded-lg border border-border-default bg-surface-page text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:bg-surface-card transition-colors resize-none"
          />
        </div>

        {/* Chọn 0 -> 5 Việc làm nổi bật */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div>
              <h4 className="text-sm font-semibold text-text-primary">
                Chọn việc làm hiển thị trên Banner (0 → 5 vị trí)
              </h4>
              <p className="text-xs text-text-muted">
                Bạn có thể chọn từ 0 đến 5 việc làm đang tuyển và sắp xếp thứ tự
                ưu tiên hiển thị.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-primary-light text-primary text-xs font-bold tabular-nums">
                Đã chọn: {selectedJobIds.length}/5
              </span>
              {selectedJobIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedJobIds([])}
                  className="text-xs font-semibold text-danger-text hover:underline"
                >
                  Bỏ chọn hết (0 tin)
                </button>
              )}
            </div>
          </div>

          {availableJobs.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-border-default text-xs text-text-muted text-center">
              Công ty hiện chưa có tin tuyển dụng nào ở trạng thái Đang tuyển.
            </div>
          ) : (
            <div className="border border-border-default rounded-xl divide-y divide-border-default max-h-56 overflow-y-auto bg-surface-page/50">
              {availableJobs.map((job) => {
                const orderIdx = selectedJobIds.indexOf(job.id);
                const isChecked = orderIdx !== -1;
                const isDisabled = !isChecked && selectedJobIds.length >= 5;

                return (
                  <div
                    key={job.id}
                    className={cn(
                      "px-3.5 py-2.5 flex items-center justify-between gap-3 transition-colors",
                      isChecked ? "bg-primary-light/35" : "bg-surface-card",
                      isDisabled && "opacity-55",
                    )}
                  >
                    <button
                      type="button"
                      disabled={isDisabled}
                      onClick={() => handleToggleJob(job.id)}
                      className="flex-1 flex items-center gap-3 text-left min-w-0 disabled:cursor-not-allowed"
                    >
                      <span
                        className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors",
                          isChecked
                            ? "bg-primary border-primary text-white"
                            : "border-border-strong bg-surface-card",
                        )}
                      >
                        {isChecked && <Check size={13} />}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {job.title}
                        </p>
                        {job.city && (
                          <p className="text-xs text-text-muted truncate">
                            {job.city}
                          </p>
                        )}
                      </div>
                    </button>

                    {isChecked && (
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[11px] font-bold text-primary mr-1 tabular-nums">
                          #{orderIdx + 1}
                        </span>
                        <button
                          type="button"
                          aria-label="Đưa lên trên"
                          disabled={orderIdx === 0}
                          onClick={() => handleMoveJob(job.id, "up")}
                          className="w-7 h-7 rounded-md border border-border-default bg-surface-card flex items-center justify-center text-text-secondary hover:text-primary disabled:opacity-40"
                        >
                          <ArrowUp size={13} />
                        </button>
                        <button
                          type="button"
                          aria-label="Đưa xuống dưới"
                          disabled={orderIdx === selectedJobIds.length - 1}
                          onClick={() => handleMoveJob(job.id, "down")}
                          className="w-7 h-7 rounded-md border border-border-default bg-surface-card flex items-center justify-center text-text-secondary hover:text-primary disabled:opacity-40"
                        >
                          <ArrowDown size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer Modal */}
      <div className="px-6 py-4 border-t border-border-default bg-surface-card flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="px-4 py-2 rounded-lg border border-border-default text-sm font-semibold text-text-secondary hover:bg-surface-muted transition-colors disabled:opacity-50"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSaving || isUploadingCover}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors shadow-xs disabled:opacity-60"
        >
          {isSaving && <Loader2 size={15} className="animate-spin" />}
          <span>{isSaving ? "Đang lưu..." : "Lưu cấu hình Banner"}</span>
        </button>
      </div>
    </form>
  );
}
