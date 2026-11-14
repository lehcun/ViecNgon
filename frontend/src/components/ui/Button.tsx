"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "soft" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingText?: string;
}

const VARIANT_CLASSES: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover active:bg-primary-active border border-transparent shadow-xs disabled:bg-primary-disabled disabled:cursor-not-allowed",
  secondary:
    "bg-surface-card text-text-primary border border-border-default hover:bg-surface-muted hover:border-border-strong",
  soft: "bg-primary-light text-primary border border-primary-subtle hover:bg-primary-subtle/70",
  ghost:
    "bg-transparent text-text-secondary border border-transparent hover:bg-surface-muted hover:text-text-primary",
  danger:
    "bg-danger-soft text-danger-text border border-danger-border hover:bg-danger-light",
};

const SIZE_CLASSES: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-6 text-sm gap-2 rounded-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  loadingText,
  disabled,
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex flex-row items-center justify-center whitespace-nowrap font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed shrink-0 [&>svg]:shrink-0",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {isLoading && <Loader2 size={16} className="animate-spin shrink-0" />}
      {isLoading && loadingText ? <span>{loadingText}</span> : children}
    </button>
  );
}
