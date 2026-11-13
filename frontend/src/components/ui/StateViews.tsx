"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

/* ============================================================================
 * 1. EMPTY STATE
 * ========================================================================== */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "bg-surface-card border border-dashed border-border-strong rounded-xl py-12 px-6 text-center flex flex-col items-center justify-center",
        className,
      )}
    >
      <div className="w-12 h-12 rounded-full bg-primary-light text-primary flex items-center justify-center mb-4">
        {icon ?? <Inbox size={24} />}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-text-muted max-w-md mb-5 leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors"
        >
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button variant="primary" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

/* ============================================================================
 * 2. ERROR STATE
 * ========================================================================== */
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Không thể tải dữ liệu",
  message = "Đã có lỗi xảy ra trong quá trình kết nối máy chủ. Vui lòng thử lại.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "bg-surface-card border border-danger-border rounded-xl py-10 px-6 text-center flex flex-col items-center justify-center",
        className,
      )}
    >
      <div className="w-12 h-12 rounded-full bg-danger-soft text-danger flex items-center justify-center mb-3">
        <AlertCircle size={24} />
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-md mb-5">{message}</p>
      {onRetry && (
        <Button variant="secondary" size="md" onClick={onRetry}>
          <RefreshCw size={15} />
          Thử lại
        </Button>
      )}
    </div>
  );
}

/* ============================================================================
 * 3. SKELETON COMPONENTS (Tuân thủ ui-skeleton-loading)
 * ========================================================================== */

export function JobCardSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-5 animate-pulse space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-surface-subtle rounded-lg shrink-0" />
        <div className="space-y-2.5 flex-1 min-w-0">
          <div className="h-5 bg-surface-subtle rounded w-3/4" />
          <div className="h-4 bg-surface-muted rounded w-1/2" />
          <div className="h-4 bg-surface-subtle rounded w-1/3" />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-6 w-20 bg-surface-muted rounded-md" />
        <div className="h-6 w-16 bg-surface-muted rounded-md" />
        <div className="h-6 w-20 bg-surface-muted rounded-md" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-border-default">
        <div className="flex gap-1.5">
          <div className="h-5 w-14 bg-surface-muted rounded" />
          <div className="h-5 w-14 bg-surface-muted rounded" />
          <div className="h-5 w-14 bg-surface-muted rounded" />
        </div>
        <div className="h-4 w-20 bg-surface-muted rounded" />
      </div>
    </div>
  );
}

export function CompanyCardSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-5 animate-pulse flex flex-col justify-between h-52">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-surface-subtle rounded-xl" />
        <div className="h-5 bg-surface-subtle rounded w-2/3" />
        <div className="h-3.5 bg-surface-muted rounded w-1/2" />
      </div>
      <div className="pt-3 border-t border-border-default flex items-center justify-between">
        <div className="h-4 bg-surface-muted rounded w-20" />
        <div className="h-4 bg-surface-subtle rounded w-24" />
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-5 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-surface-muted rounded w-28" />
        <div className="w-9 h-9 bg-surface-subtle rounded-lg" />
      </div>
      <div className="h-8 bg-surface-subtle rounded w-24" />
      <div className="h-3.5 bg-surface-muted rounded w-36" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse border-b border-border-default">
      {Array.from({ length: cols }).map((_, idx) => (
        <td key={idx} className="py-4 px-4">
          <div className="h-4 bg-surface-subtle rounded w-4/5" />
        </td>
      ))}
    </tr>
  );
}

export function DetailPaneSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 animate-pulse space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-surface-subtle rounded-xl shrink-0" />
        <div className="flex-1 space-y-2.5">
          <div className="h-6 bg-surface-subtle rounded w-3/4" />
          <div className="h-4 bg-surface-muted rounded w-1/2" />
          <div className="h-5 bg-surface-subtle rounded w-1/3" />
        </div>
      </div>
      <div className="h-10 bg-surface-subtle rounded-lg w-40" />
      <div className="space-y-3 pt-4 border-t border-border-default">
        <div className="h-5 bg-surface-subtle rounded w-48" />
        <div className="h-4 bg-surface-muted rounded w-full" />
        <div className="h-4 bg-surface-muted rounded w-5/6" />
        <div className="h-4 bg-surface-muted rounded w-4/6" />
      </div>
      <div className="space-y-3 pt-4 border-t border-border-default">
        <div className="h-5 bg-surface-subtle rounded w-44" />
        <div className="h-4 bg-surface-muted rounded w-full" />
        <div className="h-4 bg-surface-muted rounded w-3/4" />
      </div>
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 animate-pulse">
      <div className="flex items-center gap-5 mb-6">
        <div className="w-20 h-20 bg-surface-subtle rounded-full shrink-0" />
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-surface-subtle rounded w-1/3" />
          <div className="h-4 bg-surface-muted rounded w-1/4" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border-default">
        <div className="h-4 bg-surface-muted rounded w-3/4" />
        <div className="h-4 bg-surface-muted rounded w-2/3" />
        <div className="h-4 bg-surface-muted rounded w-3/4" />
        <div className="h-4 bg-surface-muted rounded w-1/2" />
      </div>
    </div>
  );
}
