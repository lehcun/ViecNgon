"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ExternalLink, MapPin, Navigation } from "lucide-react";
import type { CompanyBranchDetailItem } from "@viecngon/types";
import { cn } from "@/lib/utils";

const LeafletBranchMap = dynamic(() => import("./LeafletBranchMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-68 animate-pulse bg-surface-subtle" />
  ),
});

interface CompanyBranchesMapProps {
  branches: CompanyBranchDetailItem[];
  companyName: string;
}

interface ResolvedCoords {
  lat: number;
  lng: number;
  isExact: boolean;
}

const CITY_FALLBACK_COORDS: Array<{
  keywords: string[];
  lat: number;
  lng: number;
}> = [
  {
    keywords: ["ha noi", "hanoi"],
    lat: 21.0285,
    lng: 105.8542,
  },
  {
    keywords: ["ho chi minh", "hcm", "sai gon", "saigon"],
    lat: 10.7769,
    lng: 106.7009,
  },
  {
    keywords: ["da nang", "danang"],
    lat: 16.0544,
    lng: 108.2022,
  },
  {
    keywords: ["hai phong", "haiphong"],
    lat: 20.8449,
    lng: 106.6881,
  },
  {
    keywords: ["can tho", "cantho"],
    lat: 10.0452,
    lng: 105.7469,
  },
];

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replaceAll("đ", "d");
}

function resolveBranchCoords(branch: CompanyBranchDetailItem): ResolvedCoords {
  if (
    typeof branch.lat === "number" &&
    typeof branch.lng === "number" &&
    Number.isFinite(branch.lat) &&
    Number.isFinite(branch.lng)
  ) {
    return { lat: branch.lat, lng: branch.lng, isExact: true };
  }

  const haystack = normalizeText(`${branch.city} ${branch.address}`);
  for (const entry of CITY_FALLBACK_COORDS) {
    if (entry.keywords.some((kw) => haystack.includes(kw))) {
      return { lat: entry.lat, lng: entry.lng, isExact: false };
    }
  }

  return { lat: 10.7769, lng: 106.7009, isExact: false };
}

function buildGoogleMapsHref(
  branch: CompanyBranchDetailItem,
  coords: ResolvedCoords,
): string {
  if (coords.isExact) {
    return `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
  }
  if (branch.mapUrl && branch.mapUrl.startsWith("http")) {
    return branch.mapUrl;
  }
  return `https://www.google.com/maps?q=${encodeURIComponent(
    `${branch.address}, ${branch.city}`,
  )}`;
}

export default function CompanyBranchesMap({
  branches,
  companyName,
}: CompanyBranchesMapProps) {
  const [selectedId, setSelectedId] = useState<string>(
    () => branches[0]?.id ?? "",
  );

  if (branches.length === 0) {
    return null;
  }

  const activeBranch =
    branches.find((b) => b.id === selectedId) ?? branches[0];
  const coords = resolveBranchCoords(activeBranch);
  const googleMapsUrl = buildGoogleMapsHref(activeBranch, coords);

  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6">
      <div className="pb-3.5 mb-5 border-b border-dashed border-border-default">
        <h2 className="border-l-4 border-primary pl-3.5 pr-6 py-1.5 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent text-lg sm:text-xl font-bold text-text-primary">
          Địa điểm &amp; Chi nhánh ({branches.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* Danh sách chi nhánh */}
        <div className="md:col-span-5 flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
          {branches.map((branch) => {
            const isSelected = branch.id === activeBranch.id;

            return (
              <div
                key={branch.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedId(branch.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedId(branch.id);
                  }
                }}
                className={cn(
                  "rounded-xl border p-4 transition-all cursor-pointer text-left",
                  isSelected
                    ? "bg-primary-light/60 border-primary shadow-xs"
                    : "bg-surface-page border-border-default hover:border-border-strong",
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-text-primary">
                    <MapPin
                      size={14}
                      className={
                        isSelected ? "text-primary" : "text-text-muted"
                      }
                    />
                    {branch.city}
                  </span>
                  {branch.isHeadquarters && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-primary-light text-primary border border-primary-subtle">
                      Trụ sở chính
                    </span>
                  )}
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {branch.address}
                </p>
              </div>
            );
          })}
        </div>

        {/* Khung Bản đồ tương tác Leaflet + OpenStreetMap (Free, không API key) */}
        <div className="md:col-span-7 flex flex-col">
          <div className="relative w-full h-72 md:h-full min-h-68 rounded-xl overflow-hidden border border-border-default bg-surface-muted isolate">
            <LeafletBranchMap
              lat={coords.lat}
              lng={coords.lng}
              isExact={coords.isExact}
              companyName={companyName}
              city={activeBranch.city}
              address={activeBranch.address}
            />
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-2.5 left-13 z-10 inline-flex items-center gap-1.5 h-8 px-3 rounded-md bg-surface-card/95 hover:bg-surface-card text-xs font-semibold text-primary border border-border-strong shadow-sm backdrop-blur-xs transition-colors"
            >
              <Navigation size={13} />
              <span>Open in Maps</span>
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
