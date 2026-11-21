"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  Loader2,
  Move,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { ImageCropShape } from "@viecngon/types";
import { cn } from "@/lib/utils";

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const CROP_HOLE_RATIO = 0.78;
const OUTPUT_SIZE_PX = 512;
const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

export function validateAvatarImageFile(file: File): string | null {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return "Chỉ hỗ trợ ảnh định dạng JPG, PNG, WEBP hoặc GIF.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return "Dung lượng ảnh tối đa là 5MB.";
  }
  return null;
}

function getNormalizedImageRatio(width: number, height: number): {
  normW: number;
  normH: number;
} {
  if (width <= 0 || height <= 0) {
    return { normW: 1, normH: 1 };
  }
  const aspect = width / height;
  if (aspect >= 1) {
    return { normW: aspect, normH: 1 };
  }
  return { normW: 1, normH: 1 / aspect };
}

function clampPanOffset(
  panX: number,
  panY: number,
  zoom: number,
  naturalWidth: number,
  naturalHeight: number,
): { x: number; y: number } {
  const { normW, normH } = getNormalizedImageRatio(naturalWidth, naturalHeight);
  const maxX = Math.max(0, (normW * zoom - 1) / 2);
  const maxY = Math.max(0, (normH * zoom - 1) / 2);
  return {
    x: Math.min(maxX, Math.max(-maxX, panX)),
    y: Math.min(maxY, Math.max(-maxY, panY)),
  };
}

function exportCroppedImageFile(params: {
  imageElement: HTMLImageElement;
  originalFile: File;
  zoom: number;
  pan: { x: number; y: number };
}): Promise<File> {
  return new Promise((resolve, reject) => {
    const { imageElement, originalFile, zoom, pan } = params;
    const natW = imageElement.naturalWidth;
    const natH = imageElement.naturalHeight;
    if (!natW || !natH) {
      reject(new Error("Ảnh chưa sẵn sàng để cắt, vui lòng thử lại."));
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE_PX;
    canvas.height = OUTPUT_SIZE_PX;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Trình duyệt không hỗ trợ xử lý ảnh Canvas."));
      return;
    }

    const { normW, normH } = getNormalizedImageRatio(natW, natH);
    const drawW = normW * zoom * OUTPUT_SIZE_PX;
    const drawH = normH * zoom * OUTPUT_SIZE_PX;
    const centerX = OUTPUT_SIZE_PX / 2 + pan.x * OUTPUT_SIZE_PX;
    const centerY = OUTPUT_SIZE_PX / 2 + pan.y * OUTPUT_SIZE_PX;

    const keepAlpha =
      originalFile.type === "image/png" || originalFile.type === "image/webp";
    const outputMime = keepAlpha ? "image/png" : "image/jpeg";
    const ext = keepAlpha ? "png" : "jpg";

    if (!keepAlpha) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, OUTPUT_SIZE_PX, OUTPUT_SIZE_PX);
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(
      imageElement,
      centerX - drawW / 2,
      centerY - drawH / 2,
      drawW,
      drawH,
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Không thể tạo tệp ảnh đã cắt."));
          return;
        }
        const baseName = originalFile.name.replace(/\.[^.]+$/, "") || "avatar";
        resolve(
          new File([blob], `${baseName}-cropped.${ext}`, { type: outputMime }),
        );
      },
      outputMime,
      keepAlpha ? undefined : 0.92,
    );
  });
}

interface ImageCropperModalProps {
  isOpen: boolean;
  file: File | null;
  title?: string;
  cropShape?: ImageCropShape;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: (croppedFile: File) => void | Promise<void>;
}

export function ImageCropperModal({
  isOpen,
  file,
  title = "Cập nhật ảnh đại diện",
  cropShape = "circle",
  isSubmitting = false,
  onClose,
  onConfirm,
}: ImageCropperModalProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragOriginRef = useRef<{
    pointerX: number;
    pointerY: number;
    startPanX: number;
    startPanY: number;
  } | null>(null);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 1, height: 1 });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingCanvas, setIsProcessingCanvas] = useState(false);

  useEffect(() => {
    if (!isOpen || !file) return;
    let active = true;
    const url = URL.createObjectURL(file);
    queueMicrotask(() => {
      if (active) {
        setPreviewUrl(url);
        setImageLoaded(false);
      }
    });
    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [isOpen, file]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting && !isProcessingCanvas) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitting, isProcessingCanvas, onClose]);

  if (!isOpen || !file) {
    return null;
  }

  const busy = isSubmitting || isProcessingCanvas;
  const { normW, normH } = getNormalizedImageRatio(
    naturalSize.width,
    naturalSize.height,
  );

  const updateZoom = (nextZoomRaw: number) => {
    const nextZoom = Number(
      Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, nextZoomRaw)).toFixed(2),
    );
    setZoom(nextZoom);
    setPan((prev) =>
      clampPanOffset(
        prev.x,
        prev.y,
        nextZoom,
        naturalSize.width,
        naturalSize.height,
      ),
    );
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (busy) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    dragOriginRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const origin = dragOriginRef.current;
    if (!origin || busy) return;
    const stageWidth = stageRef.current?.clientWidth || 320;
    const cropSizePx = stageWidth * CROP_HOLE_RATIO;
    const deltaXRatio = (e.clientX - origin.pointerX) / cropSizePx;
    const deltaYRatio = (e.clientY - origin.pointerY) / cropSizePx;

    setPan(
      clampPanOffset(
        origin.startPanX + deltaXRatio,
        origin.startPanY + deltaYRatio,
        zoom,
        naturalSize.width,
        naturalSize.height,
      ),
    );
  };

  const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragOriginRef.current) {
      dragOriginRef.current = null;
      setIsDragging(false);
    }
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  const handleConfirm = async () => {
    if (busy || !imageRef.current) return;
    try {
      setIsProcessingCanvas(true);
      const croppedFile = await exportCroppedImageFile({
        imageElement: imageRef.current,
        originalFile: file,
        zoom,
        pan,
      });
      await onConfirm(croppedFile);
    } finally {
      setIsProcessingCanvas(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-120 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-xs"
      onClick={() => {
        if (!busy) onClose();
      }}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-surface-card border border-border-default shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header modal */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-border-default">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              aria-label="Quay lại"
              className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-surface-muted disabled:opacity-50 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="text-base sm:text-lg font-bold text-text-primary truncate">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Đóng cửa sổ"
            className="p-1.5 rounded-full text-text-muted hover:text-text-primary hover:bg-surface-muted disabled:opacity-50 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Khung xem trước & kéo cắt ảnh */}
        <div
          ref={stageRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onWheel={(e) => {
            if (busy) return;
            e.preventDefault();
            const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
            updateZoom(zoom + delta);
          }}
          className="relative w-full aspect-square max-h-96 bg-surface-muted overflow-hidden flex items-center justify-center select-none touch-none cursor-grab active:cursor-grabbing"
        >
          {/* Khung tham chiếu tỷ lệ vùng cắt 78% */}
          <div className="relative w-[78%] aspect-square pointer-events-none">
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                transform: `translate(${pan.x * 100}%, ${pan.y * 100}%)`,
              }}
            >
              {previewUrl && (
                <Image
                  ref={imageRef}
                  src={previewUrl}
                  alt="Xem trước ảnh cắt"
                  width={Math.max(naturalSize.width, 512)}
                  height={Math.max(naturalSize.height, 512)}
                  unoptimized
                  draggable={false}
                  onLoad={(e) => {
                    const w = e.currentTarget.naturalWidth || 1;
                    const h = e.currentTarget.naturalHeight || 1;
                    setNaturalSize({ width: w, height: h });
                    setPan((prev) => clampPanOffset(prev.x, prev.y, zoom, w, h));
                    setImageLoaded(true);
                  }}
                  style={{
                    width: `${normW * zoom * 100}%`,
                    height: `${normH * zoom * 100}%`,
                    maxWidth: "none",
                    maxHeight: "none",
                  }}
                  className={cn(
                    "shrink-0 select-none pointer-events-none transition-opacity duration-150",
                    imageLoaded ? "opacity-100" : "opacity-0",
                  )}
                />
              )}
            </div>

            {/* Mặt nạ che vùng thừa bên ngoài khung cắt */}
            <div
              aria-hidden="true"
              className={cn(
                "absolute inset-0 pointer-events-none shadow-[0_0_0_9999px_rgba(255,255,255,0.62)] ring-1 ring-slate-300/80",
                cropShape === "circle" ? "rounded-full" : "rounded-2xl",
              )}
            />
          </div>

          {/* Nhãn gợi ý kéo để di chuyển */}
          <div
            className={cn(
              "pointer-events-none absolute px-3 py-1.5 rounded-lg bg-slate-900/70 text-white text-xs font-semibold inline-flex items-center gap-1.5 backdrop-blur-xs transition-opacity duration-150",
              isDragging ? "opacity-30" : "opacity-100",
            )}
          >
            <Move size={14} />
            <span>Kéo để di chuyển</span>
          </div>
        </div>

        {/* Thanh trượt thu phóng (-) [====] (+) */}
        <div className="px-6 py-4 flex items-center gap-3.5 border-b border-border-default bg-surface-card">
          <button
            type="button"
            onClick={() => updateZoom(zoom - ZOOM_STEP)}
            disabled={busy || zoom <= MIN_ZOOM}
            aria-label="Thu nhỏ"
            className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-surface-muted disabled:opacity-40 transition"
          >
            <ZoomOut size={18} />
          </button>

          <input
            type="range"
            min={MIN_ZOOM}
            max={MAX_ZOOM}
            step={0.02}
            value={zoom}
            disabled={busy}
            onChange={(e) => updateZoom(Number(e.target.value))}
            aria-label="Mức thu phóng"
            className="flex-1 h-1.5 accent-primary cursor-pointer"
          />

          <button
            type="button"
            onClick={() => updateZoom(zoom + ZOOM_STEP)}
            disabled={busy || zoom >= MAX_ZOOM}
            aria-label="Phóng to"
            className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-surface-muted disabled:opacity-40 transition"
          >
            <ZoomIn size={18} />
          </button>
        </div>

        {/* Footer hành động */}
        <div className="px-6 py-4 bg-surface-page flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="h-10 px-4 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-sm font-semibold text-text-secondary disabled:opacity-50 transition"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={busy}
            className="h-10 px-5 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-primary-disabled text-white text-sm font-semibold inline-flex items-center gap-2 transition"
          >
            {busy && <Loader2 size={15} className="animate-spin" />}
            <span>{busy ? "Đang cập nhật..." : "Cập nhật"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
