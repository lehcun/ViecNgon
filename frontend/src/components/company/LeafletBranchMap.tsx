"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletBranchMapProps {
  lat: number;
  lng: number;
  isExact: boolean;
  companyName: string;
  city: string;
  address: string;
}

const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ARCGIS_TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function createPinIcon(): L.DivIcon {
  return L.divIcon({
    className: "viecngon-leaflet-pin",
    html: `<div style="display:flex;align-items:center;justify-content:center;filter:drop-shadow(0 3px 6px rgba(15,23,42,0.35));">
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 1C7.268 1 1 7.268 1 15C1 24.75 15 37 15 37C15 37 29 24.75 29 15C29 7.268 22.732 1 15 1Z" fill="#2563EB" stroke="#FFFFFF" stroke-width="2"/>
        <circle cx="15" cy="14.5" r="5" fill="#FFFFFF"/>
      </svg>
    </div>`,
    iconSize: [30, 38],
    iconAnchor: [15, 37],
    popupAnchor: [0, -34],
  });
}

export default function LeafletBranchMap({
  lat,
  lng,
  isExact,
  companyName,
  city,
  address,
}: LeafletBranchMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const zoom = isExact ? 16 : 13;
    const popupHtml = `
      <div style="min-width:170px;font-family:system-ui,sans-serif;line-height:1.4;">
        <div style="font-weight:700;font-size:13px;color:#0f172a;margin-bottom:2px;">
          ${escapeHtml(companyName)} (${escapeHtml(city)})
        </div>
        <div style="font-size:12px;color:#475569;">
          ${escapeHtml(address)}
        </div>
      </div>
    `;

    if (!mapRef.current && containerRef.current) {
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom,
        scrollWheelZoom: false,
      });

      const osmLayer = L.tileLayer(OSM_TILE_URL, {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      let osmErrorCount = 0;
      let switchedToFallback = false;
      osmLayer.on("tileerror", () => {
        osmErrorCount += 1;
        if (!switchedToFallback && osmErrorCount >= 3 && mapRef.current) {
          switchedToFallback = true;
          mapRef.current.removeLayer(osmLayer);
          L.tileLayer(ARCGIS_TILE_URL, {
            maxZoom: 19,
            attribution: "&copy; Esri &mdash; World Street Map",
          }).addTo(mapRef.current);
        }
      });

      const marker = L.marker([lat, lng], {
        icon: createPinIcon(),
      }).addTo(map);
      marker.bindPopup(popupHtml);

      mapRef.current = map;
      markerRef.current = marker;
      requestAnimationFrame(() => mapRef.current?.invalidateSize());
      return;
    }

    if (mapRef.current && markerRef.current) {
      mapRef.current.setView([lat, lng], zoom, { animate: true });
      markerRef.current.setLatLng([lat, lng]);
      markerRef.current.setPopupContent(popupHtml);
    }
  }, [lat, lng, isExact, companyName, city, address]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label={`Bản đồ văn phòng ${companyName} - ${city}`}
      className="w-full h-full min-h-68 isolate z-0"
    />
  );
}
