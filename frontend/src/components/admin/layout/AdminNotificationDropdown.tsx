"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  BellRing,
  Briefcase,
  CheckCheck,
  CreditCard,
  Info,
  UserPlus,
} from "lucide-react";
import type { NotificationItemResponse } from "@viecngon/types";
import {
  classifyAdminNotification,
  formatRelativeTimeVi,
  useAdminNotificationMutations,
  useAdminNotificationsList,
  useAdminUnreadNotificationCount,
  type AdminNotificationCategory,
} from "@/hooks/admin/useAdminNotifications";

function CategoryIcon({ category }: { category: AdminNotificationCategory }) {
  if (category === "employer") {
    return (
      <span className="w-8 h-8 rounded-lg bg-warning-light text-warning-text flex items-center justify-center shrink-0">
        <UserPlus size={15} />
      </span>
    );
  }
  if (category === "job") {
    return (
      <span className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
        <Briefcase size={15} />
      </span>
    );
  }
  if (category === "package") {
    return (
      <span className="w-8 h-8 rounded-lg bg-success-light text-success-text flex items-center justify-center shrink-0">
        <CreditCard size={15} />
      </span>
    );
  }
  return (
    <span className="w-8 h-8 rounded-lg bg-info-light text-info-text flex items-center justify-center shrink-0">
      <Info size={15} />
    </span>
  );
}

export default function AdminNotificationDropdown() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadQuery = useAdminUnreadNotificationCount();
  const listQuery = useAdminNotificationsList({
    filter: "ALL",
    page: 1,
    limit: 8,
  });
  const { markAsRead, markAllAsRead, isMarkingAllRead } =
    useAdminNotificationMutations();

  const unreadCount =
    unreadQuery.data?.count ?? listQuery.data?.unreadCount ?? 0;
  const items = listQuery.data?.data ?? [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelectItem = (notif: NotificationItemResponse) => {
    if (notif.status === "CHUA_DOC") {
      markAsRead(notif.id);
    }
    const { href } = classifyAdminNotification(notif);
    setIsOpen(false);
    router.push(href);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Thông báo quản trị"
        aria-expanded={isOpen}
        className={`relative w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
          isOpen
            ? "border-primary bg-primary-light text-primary"
            : "border-border-default bg-surface-card hover:bg-surface-muted text-text-secondary"
        }`}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full bg-danger text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-card shadow-xl border border-border-default z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header */}
          <div className="px-4 py-3.5 border-b border-border-default bg-surface-page flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text-primary">
                Thông báo quản trị
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-danger-soft text-danger-text border border-danger-border">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                disabled={isMarkingAllRead}
                onClick={() => markAllAsRead()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline disabled:opacity-50"
              >
                <CheckCheck size={14} />
                Đã đọc tất cả
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-96 overflow-y-auto divide-y divide-border-default">
            {listQuery.isLoading ? (
              <div className="p-4 space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-surface-subtle shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 w-3/4 bg-surface-subtle rounded" />
                      <div className="h-3 w-full bg-surface-muted rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 px-6 text-center">
                <div className="w-12 h-12 rounded-full bg-surface-muted text-text-muted flex items-center justify-center mx-auto mb-3">
                  <BellRing size={20} />
                </div>
                <p className="text-sm font-semibold text-text-primary">
                  Chưa có thông báo nào
                </p>
                <p className="text-xs text-text-muted mt-1">
                  Khi có NTD đăng ký mới, tin chờ duyệt hoặc giao dịch gói dịch
                  vụ, thông báo sẽ hiện tại đây.
                </p>
              </div>
            ) : (
              items.map((notif) => {
                const isUnread = notif.status === "CHUA_DOC";
                const { category } = classifyAdminNotification(notif);

                return (
                  <button
                    key={notif.id}
                    type="button"
                    onClick={() => handleSelectItem(notif)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isUnread
                        ? "bg-primary-light/40 hover:bg-primary-light/70"
                        : "bg-surface-card hover:bg-surface-page"
                    }`}
                  >
                    <CategoryIcon category={category} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-xs leading-snug line-clamp-2 ${
                            isUnread
                              ? "font-bold text-text-primary"
                              : "font-medium text-text-secondary"
                          }`}
                        >
                          {notif.title}
                        </p>
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-[11px] text-text-muted line-clamp-2 mt-1">
                        {notif.content}
                      </p>
                      <p className="text-[10px] text-text-placeholder mt-1.5 font-medium">
                        {formatRelativeTimeVi(notif.createdAt)}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border-default bg-surface-page">
            <Link
              href="/admin/notifications"
              onClick={() => setIsOpen(false)}
              className="block w-full py-3 text-center text-xs font-semibold text-primary hover:bg-surface-muted transition-colors"
            >
              Xem toàn bộ thông báo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
