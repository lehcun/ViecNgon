"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type FormFieldTone = "light" | "dark";

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  tone?: FormFieldTone;
}

export function FormLabel({
  children,
  required = false,
  tone = "light",
  className,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={cn(
        "block text-sm font-medium mb-1.5",
        tone === "dark" ? "text-slate-300 text-xs font-semibold" : "text-text-secondary",
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <span className="text-danger ml-0.5" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

interface FieldErrorProps {
  id?: string;
  message?: string | null;
  tone?: FormFieldTone;
  className?: string;
}

/**
 * Hiển thị dòng báo lỗi inline ngay bên dưới trường nhập liệu theo Design System Mục 5.3.
 */
export function FieldError({
  id,
  message,
  tone = "light",
  className,
}: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn(
        "mt-1.5 text-xs flex items-start gap-1.5 leading-snug font-medium",
        tone === "dark" ? "text-rose-400" : "text-danger",
        className,
      )}
    >
      <AlertCircle size={14} className="shrink-0 mt-0.5" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

interface FormBannerErrorProps {
  message?: string | null;
  tone?: FormFieldTone;
  className?: string;
  children?: React.ReactNode;
}

export function FormBannerError({
  message,
  tone = "light",
  className,
  children,
}: FormBannerErrorProps) {
  if (!message && !children) return null;

  return (
    <div
      role="alert"
      className={cn(
        "p-3 rounded-lg border flex items-start gap-2.5 text-xs leading-relaxed",
        tone === "dark"
          ? "bg-danger/15 border-danger/30 text-rose-300 rounded-xl p-3.5"
          : "bg-danger-soft border-danger-border text-danger-text",
        className,
      )}
    >
      <AlertCircle
        size={16}
        className={cn("shrink-0 mt-0.5", tone === "dark" && "text-rose-400")}
        aria-hidden="true"
      />
      <div className="flex-1 min-w-0">
        {message && <span>{message}</span>}
        {children}
      </div>
    </div>
  );
}

interface InputClassOptions {
  hasError?: boolean;
  tone?: FormFieldTone;
  className?: string;
}

/**
 * Chuẩn hóa style input/select/textarea theo Design System Mục 5.3 + highlight viền đỏ khi có lỗi.
 */
export function getInputClassName({
  hasError = false,
  tone = "light",
  className,
}: InputClassOptions = {}): string {
  if (tone === "dark") {
    return cn(
      "w-full h-11 rounded-xl text-sm text-white placeholder:text-slate-500 transition-all focus:outline-hidden focus:ring-2",
      hasError
        ? "bg-rose-950/30 border border-rose-500/80 focus:border-rose-400 focus:ring-rose-500/25"
        : "bg-slate-900/80 border border-slate-700/80 focus:border-primary focus:bg-slate-900 focus:ring-primary/25",
      className,
    );
  }

  return cn(
    "w-full h-11 rounded-lg px-4 text-sm outline-none transition-all placeholder:text-text-placeholder bg-surface-card border",
    hasError
      ? "border-danger bg-danger-soft/20 focus:border-danger focus:ring-2 focus:ring-danger/20"
      : "border-border-default hover:border-border-strong focus:border-primary focus:ring-2 focus:ring-primary/15",
    className,
  );
}

export function getFieldA11yProps(fieldId: string, error?: string | null) {
  const hasError = Boolean(error);
  return {
    "aria-invalid": hasError,
    "aria-describedby": hasError ? `${fieldId}-error` : undefined,
  } as const;
}
