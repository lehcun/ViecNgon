import Link from "next/link";
import { Compass, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-surface-page flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-surface-card border border-border-default rounded-2xl p-8 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-primary-light text-primary flex items-center justify-center mx-auto mb-5">
          <Compass size={28} />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">
          Lỗi 404
        </p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Không tìm thấy trang bạn yêu cầu
        </h1>
        <p className="text-sm text-text-muted mb-6 leading-relaxed">
          Đường dẫn có thể đã thay đổi hoặc tin tuyển dụng này không còn tồn tại.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
          >
            <Home size={16} />
            <span>Về trang chủ</span>
          </Link>
          <Link
            href="/jobs"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-primary text-sm font-semibold transition-colors"
          >
            <Search size={16} />
            <span>Tìm việc làm IT</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
