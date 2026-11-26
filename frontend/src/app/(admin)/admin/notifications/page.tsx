"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BellRing,
  Briefcase,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Info,
  MessageSquareQuote,
  RefreshCw,
  Search,
  Trash2,
  UserPlus,
} from "lucide-react";
import type { NotificationItemResponse } from "@viecngon/types";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import {
  classifyAdminNotification,
  formatRelativeTimeVi,
  useAdminNotificationMutations,
  useAdminNotificationsList,
  type AdminNotificationCategory,
  type AdminNotificationFilter,
} from "@/hooks/admin/useAdminNotifications";

function CategoryBadge({ category }: { category: AdminNotificationCategory }) {
  const baseClass =
    "inline-flex items-center justify-center gap-1.5 w-36 h-7 px-2.5 rounded-lg text-xs font-semibold shrink-0 whitespace-nowrap";

  if (category === "employer") {
    return (
      <span className={`${baseClass} bg-warning-light text-warning-text`}>
        <UserPlus size={14} className="shrink-0" />
        Nhà tuyển dụng
      </span>
    );
  }
  if (category === "job") {
    return (
      <span className={`${baseClass} bg-primary-light text-primary`}>
        <Briefcase size={14} className="shrink-0" />
        Tin tuyển dụng
      </span>
    );
  }
  if (category === "review") {
    return (
      <span className={`${baseClass} bg-ai-light text-ai`}>
        <MessageSquareQuote size={14} className="shrink-0" />
        Đánh giá
      </span>
    );
  }
  if (category === "package") {
    return (
      <span className={`${baseClass} bg-success-light text-success-text`}>
        <CreditCard size={14} className="shrink-0" />
        Gói dịch vụ
      </span>
    );
  }
  return (
    <span className={`${baseClass} bg-info-light text-info-text`}>
      <Info size={14} className="shrink-0" />
      Hệ thống
    </span>
  );
}

export default function AdminNotificationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<AdminNotificationFilter>("ALL");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmState, setConfirmState] = useState<
    | { type: "deleteOne"; notif: NotificationItemResponse }
    | { type: "deleteAllRead" }
    | null
  >(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(searchInput.trim()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useAdminNotificationsList({
      filter,
      q: debouncedSearch,
      page,
      limit: 15,
    });

  const {
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    deleteOne,
    isDeletingOne,
    deleteAllRead,
    isDeletingRead,
  } = useAdminNotificationMutations();

  const items = data?.data ?? [];
  const allCount = data?.allCount ?? 0;
  const unreadCount = data?.unreadCount ?? 0;
  const readCount = data?.readCount ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const handleOpenTarget = (notif: NotificationItemResponse) => {
    if (notif.status === "CHUA_DOC") {
      markAsRead(notif.id);
    }
    const { href } = classifyAdminNotification(notif);
    if (href !== "/admin/notifications") {
      router.push(href);
    }
  };

  const tabs: Array<{
    key: AdminNotificationFilter;
    label: string;
    count: number;
  }> = [
    { key: "ALL", label: "Tất cả", count: allCount },
    { key: "UNREAD", label: "Chưa đọc", count: unreadCount },
    { key: "READ", label: "Đã đọc", count: readCount },
  ];

  return (
    <div className="pb-8">
      <div className="bg-surface-card border border-border-default rounded-xl shadow-xs overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-default flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-surface-page border border-border-default">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setFilter(tab.key);
                    setPage(1);
                  }}
                  className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold transition-colors ${
                    filter === tab.key
                      ? "bg-primary text-white shadow-xs"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      filter === tab.key
                        ? "bg-white/20 text-white"
                        : "bg-surface-muted text-text-muted"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-placeholder pointer-events-none"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  setPage(1);
                }}
                placeholder="Tìm tiêu đề, nội dung..."
                aria-label="Tìm kiếm thông báo"
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-border-default bg-surface-page text-sm text-text-primary placeholder:text-text-placeholder focus:outline-none focus:border-primary focus:bg-surface-card"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={unreadCount === 0 || isMarkingAllRead}
              onClick={() => markAllAsRead()}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-xs font-semibold text-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <CheckCheck size={14} className="text-primary" />
              Đã đọc tất cả
            </button>

            <button
              type="button"
              disabled={readCount === 0 || isDeletingRead}
              onClick={() => setConfirmState({ type: "deleteAllRead" })}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-danger-border bg-danger-soft hover:bg-danger-light text-xs font-semibold text-danger-text disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={14} />
              Xóa đã đọc
            </button>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              title="Tải lại"
              aria-label="Tải lại thông báo"
              className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        {isError ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-danger-soft text-danger-text flex items-center justify-center mx-auto mb-3">
              <AlertCircle size={22} />
            </div>
            <h3 className="text-base font-semibold text-text-primary">
              Không thể tải thông báo quản trị
            </h3>
            <p className="text-sm text-text-muted mt-1">
              {error instanceof Error ? error.message : "Vui lòng thử lại sau."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 inline-flex items-center gap-2 h-10 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold"
            >
              <RefreshCw size={15} />
              Thử lại
            </button>
          </div>
        ) : isLoading ? (
          <div className="divide-y divide-border-default">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="p-4 flex items-start justify-between gap-4 animate-pulse"
              >
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-56 bg-surface-subtle rounded" />
                  <div className="h-3.5 w-3/4 bg-surface-muted rounded" />
                  <div className="h-3 w-24 bg-surface-muted rounded" />
                </div>
                <div className="h-8 w-20 bg-surface-muted rounded-lg" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-surface-muted text-text-muted flex items-center justify-center mx-auto mb-3">
              <BellRing size={22} />
            </div>
            <h3 className="text-base font-semibold text-text-primary">
              Không có thông báo nào
            </h3>
            <p className="text-sm text-text-muted mt-1">
              Bạn đã xử lý hết các thông báo trong mục này.
            </p>
          </div>
        ) : (
          <div
            className={`divide-y divide-border-default transition-opacity ${
              isFetching ? "opacity-75" : "opacity-100"
            }`}
          >
            {items.map((notif) => {
              const isUnread = notif.status === "CHUA_DOC";
              const { category, href } = classifyAdminNotification(notif);

              return (
                <div
                  key={notif.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isUnread
                      ? "bg-primary-light/35 hover:bg-primary-light/60"
                      : "bg-surface-card hover:bg-surface-page"
                  }`}
                >
                  <div className="flex items-start gap-4 min-w-0 flex-1">
                    <CategoryBadge category={category} />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isUnread ? "bg-primary" : "bg-transparent"
                          }`}
                          aria-hidden="true"
                        />
                        <p
                          className={`text-sm truncate ${
                            isUnread
                              ? "font-bold text-text-primary"
                              : "font-semibold text-text-secondary"
                          }`}
                        >
                          {notif.title}
                        </p>
                      </div>
                      <p className="text-xs text-text-secondary mt-1 pl-4 leading-relaxed">
                        {notif.content}
                      </p>
                      <p className="text-[11px] text-text-muted mt-1.5 pl-4">
                        {formatRelativeTimeVi(notif.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1.5 sm:w-48 shrink-0 self-end sm:self-center">
                    {href !== "/admin/notifications" && (
                      <button
                        type="button"
                        onClick={() => handleOpenTarget(notif)}
                        className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-primary/30 bg-primary-light hover:bg-primary-subtle text-primary text-xs font-semibold transition-colors whitespace-nowrap"
                      >
                        Xử lý ngay
                        <ExternalLink size={12} />
                      </button>
                    )}

                    {isUnread && (
                      <button
                        type="button"
                        onClick={() => markAsRead(notif.id)}
                        title="Đánh dấu đã đọc"
                        aria-label={`Đánh dấu đã đọc ${notif.title}`}
                        className="p-2 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary hover:text-primary transition-colors shrink-0"
                      >
                        <Check size={14} />
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isDeletingOne}
                      onClick={() =>
                        setConfirmState({ type: "deleteOne", notif })
                      }
                      title="Xóa thông báo"
                      aria-label={`Xóa thông báo ${notif.title}`}
                      className="p-2 rounded-lg border border-danger-border bg-surface-card hover:bg-danger-soft text-danger-text disabled:opacity-40 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border-default bg-surface-page/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-text-muted">
          <span>
            Tổng cộng:{" "}
            <strong className="text-text-primary tabular-nums">
              {allCount}
            </strong>{" "}
            thông báo · Chưa đọc:{" "}
            <strong className="text-primary tabular-nums">{unreadCount}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1 || isLoading}
              onClick={() => setPage(page - 1)}
              className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-primary font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} />
              Trước
            </button>
            <span className="px-2 font-semibold text-text-primary tabular-nums">
              Trang {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || isLoading}
              onClick={() => setPage(page + 1)}
              className="inline-flex items-center gap-1 h-8 px-3 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-text-primary font-medium disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sau
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <AdminConfirmModal
        open={Boolean(confirmState)}
        variant="danger"
        title={
          confirmState?.type === "deleteAllRead"
            ? "Xóa tất cả thông báo đã đọc"
            : "Xóa thông báo"
        }
        description={
          confirmState?.type === "deleteAllRead" ? (
            <p>
              Bạn có chắc chắn muốn xóa toàn bộ{" "}
              <strong className="text-text-primary">{readCount}</strong> thông
              báo đã đọc? Hành động này không thể hoàn tác.
            </p>
          ) : confirmState?.type === "deleteOne" ? (
            <p>
              Bạn có chắc chắn muốn xóa thông báo{" "}
              <strong className="text-text-primary">
                &ldquo;{confirmState.notif.title}&rdquo;
              </strong>
              ? Hành động này không thể hoàn tác.
            </p>
          ) : null
        }
        confirmLabel="Xác nhận xóa"
        isSubmitting={isDeletingOne || isDeletingRead}
        onClose={() => setConfirmState(null)}
        onConfirm={() => {
          if (!confirmState) return;
          if (confirmState.type === "deleteAllRead") {
            deleteAllRead(undefined, {
              onSuccess: () => setConfirmState(null),
            });
          } else {
            deleteOne(confirmState.notif.id, {
              onSuccess: () => setConfirmState(null),
            });
          }
        }}
      />
    </div>
  );
}
