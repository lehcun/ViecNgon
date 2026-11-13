"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  shape?: "rounded" | "circle";
  className?: string;
}

const SIZE_MAP: Record<NonNullable<CompanyLogoProps["size"]>, string> = {
  sm: "w-10 h-10 text-xs",
  md: "w-12 h-12 text-sm",
  lg: "w-16 h-16 text-lg",
  xl: "w-20 h-20 text-xl",
};

function getInitials(name?: string | null): string {
  if (!name) return "VN";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function CompanyLogo({
  src,
  name,
  size = "md",
  shape = "rounded",
  className,
}: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false);

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";
  const showFallback = !src || hasError;

  return (
    <div
      className={cn(
        "shrink-0 border border-border-default bg-surface-card flex items-center justify-center overflow-hidden",
        SIZE_MAP[size],
        shapeClass,
        showFallback
          ? "bg-primary-light text-primary font-bold"
          : "p-1.5",
        className,
      )}
    >
      {showFallback ? (
        <span aria-hidden="true">{getInitials(name)}</span>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ? `Logo ${name}` : "Logo"}
          className={cn(
            "w-full h-full",
            shape === "circle" ? "object-cover" : "object-contain",
          )}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
