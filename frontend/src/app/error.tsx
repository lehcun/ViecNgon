"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Application runtime error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-surface-page flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface-card border border-danger-border rounded-2xl p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-danger-soft text-danger flex items-center justify-center mx-auto mb-5">
          <AlertTriangle size={28} />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">
          Đã có lỗi xảy ra trong quá trình xử lý
        </h1>
        <p className="text-sm text-text-muted mb-6 leading-relaxed">
          Hệ thống gặp sự cố tạm thời. Bạn có thể thử tải lại trang hoặc quay về trang chủ.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>Thử lại</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-primary text-sm font-semibold transition-colors"
          >
            <Home size={16} />
            <span>Về trang chủ</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
