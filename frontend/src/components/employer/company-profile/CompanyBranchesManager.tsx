"use client";

import React from "react";
import dynamic from "next/dynamic";
import {
  Building,
  Crosshair,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BranchCoordinatePickerMap = dynamic(
  () => import("@/components/company/BranchCoordinatePickerMap"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-68 animate-pulse bg-surface-subtle" />
    ),
  },
);

export interface BranchFormItem {
  localKey: string;
  maChiNhanh?: string;
  thanhPho: string;
  diaChi: string;
  mapUrl: string;
  viDo: string;
  kinhDo: string;
}

export const CITY_OPTIONS = [
  "Hà Nội",
  "TP.HCM",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
  "Bình Dương",
];

export const CITY_DEFAULT_COORDS: Record<string, { lat: number; lng: number }> =
  {
    "Hà Nội": { lat: 21.0285, lng: 105.8542 },
    "TP.HCM": { lat: 10.7769, lng: 106.7009 },
    "Đà Nẵng": { lat: 16.0544, lng: 108.2022 },
    "Hải Phòng": { lat: 20.8449, lng: 106.6881 },
    "Cần Thơ": { lat: 10.0452, lng: 105.7469 },
    "Bình Dương": { lat: 10.9804, lng: 106.6519 },
  };

function buildCityOptions(currentCity: string): string[] {
  const trimmed = currentCity.trim();
  if (!trimmed || CITY_OPTIONS.includes(trimmed)) return CITY_OPTIONS;
  return [trimmed, ...CITY_OPTIONS];
}

function resolvePreviewCoords(branch: BranchFormItem): {
  lat: number;
  lng: number;
  isExact: boolean;
} {
  const parsedLat = Number(branch.viDo);
  const parsedLng = Number(branch.kinhDo);
  if (
    branch.viDo.trim() !== "" &&
    branch.kinhDo.trim() !== "" &&
    Number.isFinite(parsedLat) &&
    Number.isFinite(parsedLng)
  ) {
    return { lat: parsedLat, lng: parsedLng, isExact: true };
  }

  const cityDefaults = CITY_DEFAULT_COORDS[branch.thanhPho.trim()];
  if (cityDefaults) {
    return { lat: cityDefaults.lat, lng: cityDefaults.lng, isExact: false };
  }

  return { lat: 10.7769, lng: 106.7009, isExact: false };
}

export function buildCitiesBannerPreview(
  branches: BranchFormItem[],
  fallbackCity?: string | null,
): string {
  const seen = new Set<string>();
  const labels: string[] = [];

  for (const branch of branches) {
    const label = branch.thanhPho.trim();
    if (!label) continue;
    const key = label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    labels.push(label);
  }

  if (labels.length > 0) return labels.join(" - ");
  return fallbackCity?.trim() || "Việt Nam";
}

interface CompanyBranchesManagerProps {
  branchesList: BranchFormItem[];
  selectedBranchKey: string;
  mainAddress: string;
  citiesPreview: string;
  geocodingKey: string | null;
  onSelectBranch: (localKey: string) => void;
  onAddBranch: () => void;
  onUpdateBranch: (localKey: string, patch: Partial<BranchFormItem>) => void;
  onRemoveBranch: (localKey: string) => void;
  onLookupCoords: (branch: BranchFormItem) => Promise<void>;
  onSetHeadquarters: (branch: BranchFormItem) => void;
}

export function CompanyBranchesManager({
  branchesList,
  selectedBranchKey,
  mainAddress,
  citiesPreview,
  geocodingKey,
  onSelectBranch,
  onAddBranch,
  onUpdateBranch,
  onRemoveBranch,
  onLookupCoords,
  onSetHeadquarters,
}: CompanyBranchesManagerProps) {
  const activeBranch =
    branchesList.find((b) => b.localKey === selectedBranchKey) ??
    branchesList[0];
  const normalizedMainAddress = mainAddress.trim().toLowerCase();

  const activeCoords = activeBranch
    ? resolvePreviewCoords(activeBranch)
    : { lat: 10.7769, lng: 106.7009, isExact: false };
  const activeMapsHref = activeBranch
    ? activeCoords.isExact
      ? `https://www.google.com/maps?q=${activeBranch.viDo.trim()},${activeBranch.kinhDo.trim()}`
      : `https://www.google.com/maps?q=${encodeURIComponent(
          `${activeBranch.diaChi} ${activeBranch.thanhPho}`.trim(),
        )}`
    : "https://www.google.com/maps?q=10.7769,106.7009";

  return (
    <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border-default pb-3.5">
        <div className="min-w-0 flex-1">
          <h3 className="border-l-4 border-primary pl-3.5 pr-5 py-1 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent font-bold text-text-primary text-base">
            Quản lý Chi nhánh &amp; Tọa độ Bản đồ ({branchesList.length})
          </h3>
          <p className="text-xs text-text-muted mt-1.5">
            Đồng bộ danh sách địa điểm lên bản đồ Leaflet và nút &ldquo;Open in
            Maps&rdquo; tại trang DetailCompany.
          </p>
        </div>
        <button
          type="button"
          onClick={onAddBranch}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary-light hover:bg-primary-subtle text-primary border border-primary-subtle rounded-lg text-xs font-semibold transition shrink-0"
        >
          <Plus size={15} />
          <span>Thêm chi nhánh</span>
        </button>
      </div>

      <div className="rounded-xl border border-primary-subtle bg-primary-light/50 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-text-secondary">
          Hiển thị địa điểm trên Banner trang công ty:
        </span>
        <span className="inline-flex items-center gap-1.5 font-bold text-primary">
          <MapPin size={13} />
          {citiesPreview}
        </span>
      </div>

      {branchesList.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border-strong bg-surface-page p-8 text-center">
          <MapPin
            size={28}
            className="mx-auto text-text-placeholder mb-2"
          />
          <p className="text-sm font-semibold text-text-primary">
            Chưa có chi nhánh nào được khai báo
          </p>
          <p className="text-xs text-text-muted mt-1 mb-4">
            Thêm các chi nhánh (VD: Hà Nội, TP.HCM) để trang công ty hiển thị
            đầy đủ danh sách địa điểm &amp; bản đồ tương tác.
          </p>
          <button
            type="button"
            onClick={onAddBranch}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg text-xs font-semibold transition"
          >
            <Plus size={15} /> Thêm chi nhánh đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Danh sách form chi nhánh */}
          <div className="xl:col-span-7 space-y-3.5">
            {branchesList.map((branch, idx) => {
              const isSelected = activeBranch?.localKey === branch.localKey;
              const isHeadquarters =
                normalizedMainAddress !== "" &&
                branch.diaChi.trim().toLowerCase() === normalizedMainAddress;
              const branchCoords = resolvePreviewCoords(branch);
              const previewGoogleMapsUrl = branchCoords.isExact
                ? `https://www.google.com/maps?q=${branch.viDo.trim()},${branch.kinhDo.trim()}`
                : `https://www.google.com/maps?q=${encodeURIComponent(
                    `${branch.diaChi} ${branch.thanhPho}`,
                  )}`;

              return (
                <div
                  key={branch.localKey}
                  onClick={() => onSelectBranch(branch.localKey)}
                  className={cn(
                    "rounded-xl border p-4 space-y-3 transition-colors cursor-pointer",
                    isSelected
                      ? "bg-primary-light/35 border-primary shadow-2xs"
                      : "bg-surface-page border-border-default hover:border-border-strong",
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                        Chi nhánh #{idx + 1}
                      </span>
                      {isHeadquarters ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-light text-primary border border-primary-subtle">
                          <Building size={11} />
                          Trụ sở chính
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetHeadquarters(branch);
                          }}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-card hover:bg-primary-light text-text-secondary hover:text-primary border border-border-default transition"
                        >
                          Đặt làm trụ sở chính
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectBranch(branch.localKey);
                          void onLookupCoords(branch);
                        }}
                        disabled={geocodingKey === branch.localKey}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-card hover:bg-primary-light text-primary border border-primary-subtle rounded-md text-xs font-semibold transition"
                      >
                        {geocodingKey === branch.localKey ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <Crosshair size={13} />
                        )}
                        <span>Lấy tọa độ</span>
                      </button>

                      <a
                        href={previewGoogleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-surface-card hover:bg-surface-muted text-text-secondary border border-border-default rounded-md text-xs font-semibold transition"
                      >
                        <Navigation size={12} />
                        <span>Open in Maps</span>
                      </a>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveBranch(branch.localKey);
                        }}
                        aria-label="Xóa chi nhánh"
                        className="p-1.5 text-text-muted hover:text-danger transition"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Thành phố <span className="text-danger">*</span>
                      </label>
                      <select
                        value={branch.thanhPho}
                        onFocus={() => onSelectBranch(branch.localKey)}
                        onChange={(e) => {
                          const city = e.target.value;
                          const defaults = CITY_DEFAULT_COORDS[city];
                          onUpdateBranch(branch.localKey, {
                            thanhPho: city,
                            ...(defaults && !branch.viDo && !branch.kinhDo
                              ? {
                                  viDo: String(defaults.lat),
                                  kinhDo: String(defaults.lng),
                                }
                              : {}),
                          });
                        }}
                        className="w-full px-3 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        {buildCityOptions(branch.thanhPho).map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Địa chỉ chi tiết <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={branch.diaChi}
                        onFocus={() => onSelectBranch(branch.localKey)}
                        onChange={(e) =>
                          onUpdateBranch(branch.localKey, {
                            diaChi: e.target.value,
                          })
                        }
                        placeholder="VD: Số 8 Hoàng Văn Thái, Quận 7..."
                        className="w-full px-3 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Vĩ độ (Latitude)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={branch.viDo}
                        onFocus={() => onSelectBranch(branch.localKey)}
                        onChange={(e) =>
                          onUpdateBranch(branch.localKey, {
                            viDo: e.target.value,
                          })
                        }
                        placeholder="VD: 10.7295"
                        className="w-full px-3 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary mb-1">
                        Kinh độ (Longitude)
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={branch.kinhDo}
                        onFocus={() => onSelectBranch(branch.localKey)}
                        onChange={(e) =>
                          onUpdateBranch(branch.localKey, {
                            kinhDo: e.target.value,
                          })
                        }
                        placeholder="VD: 106.7218"
                        className="w-full px-3 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary tabular-nums focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cột bản đồ tương tác chọn/kéo ghim */}
          {activeBranch && (
            <div className="xl:col-span-5 xl:sticky xl:top-24 space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-bold text-text-primary truncate">
                  Bản đồ chi nhánh đang chọn: {activeBranch.thanhPho || "Chưa chọn TP"}
                </span>
              </div>
              <div className="relative w-full h-80 rounded-xl overflow-hidden border border-border-default bg-surface-muted isolate">
                <BranchCoordinatePickerMap
                  lat={activeCoords.lat}
                  lng={activeCoords.lng}
                  isExact={activeCoords.isExact}
                  city={activeBranch.thanhPho}
                  address={activeBranch.diaChi}
                  onPickCoords={(lat, lng) => {
                    onUpdateBranch(activeBranch.localKey, {
                      viDo: String(lat),
                      kinhDo: String(lng),
                    });
                  }}
                />
                <a
                  href={activeMapsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-2.5 left-13 z-10 inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-surface-card/95 hover:bg-surface-card text-xs font-semibold text-primary border border-border-strong shadow-sm backdrop-blur-xs transition-colors"
                >
                  <Navigation size={13} />
                  <span>Open in Maps</span>
                  <ExternalLink size={11} />
                </a>
              </div>
              <p className="text-[11px] text-text-muted leading-relaxed">
                Nhấp trực tiếp lên bản đồ hoặc kéo ghim xanh để tinh chỉnh tọa
                độ cho chi nhánh đang chọn.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
