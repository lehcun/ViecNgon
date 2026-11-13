"use client";

import React, { useState } from "react";
import { Bell, Check, BellRing, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  useNotifications,
  NotificationFilterType,
} from "@/hooks/useNotifications";
import { getNotificationIcon } from "@/components/NotificationDropdown";
import { NotificationItemResponse } from "@viecngon/types";
import { formatRelativeTimeVN } from "@/lib/formatters";
import { EmptyState } from "@/components/ui/StateViews";

export default function CandidateNotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationFilterType>("ALL");

  const {
    notifications,
    unreadCount,
    readCount,
    allCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    setFilter,
  } = useNotifications({
    initialFilter: activeTab,
    limit: 50,
  });

  const handleTabChange = (tab: NotificationFilterType) => {
    setActiveTab(tab);
    setFilter(tab);
  };

  const handleNotificationClick = (item: NotificationItemResponse) => {
    if (item.status === "CHUA_DOC") {
      markAsRead(item.id);
    }
  };

  const handleMarkAll = () => {
    if (unreadCount === 0) {
      toast("Bạn không có thông báo chưa đọc nào");
      return;
    }
    markAllAsRead(undefined, {
      onSuccess: () => {
        toast.success("Đã đánh dấu tất cả thông báo là đã đọc!");
      },
      onError: () => {
        toast.error("Có lỗi xảy ra, vui lòng thử lại");
      },
    });
  };

  const tabs: { id: NotificationFilterType; label: string; count: number }[] = [
    { id: "ALL", label: "Tất cả", count: allCount },
    { id: "UNREAD", label: "Chưa đọc", count: unreadCount },
    { id: "READ", label: "Đã đọc", count: readCount },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
        <div className="flex items-center justify-between pb-5 border-b border-border-subtle">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold text-text-main">
              Thông báo của bạn
            </h1>
          </div>

          <button
            type="button"
            onClick={handleMarkAll}
            disabled={isMarkingAllRead || unreadCount === 0}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover hover:underline transition-colors cursor-pointer disabled:text-text-subtle disabled:no-underline disabled:cursor-not-allowed"
          >
            {isMarkingAllRead ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Check size={15} />
            )}
            <span>Đã đọc tất cả</span>
          </button>
        </div>

        <div className="flex items-center gap-6 border-b border-border-subtle mt-4 text-sm font-medium">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabChange(tab.id)}
                className={`pb-3 flex items-center gap-2 transition-colors relative cursor-pointer border-b-2 ${
                  isActive
                    ? "text-primary font-semibold border-primary"
                    : "text-text-secondary hover:text-text-main border-transparent"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-primary text-white"
                      : "bg-surface-subtle text-text-muted"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 divide-y divide-border-subtle">
          {isLoading ? (
            <div className="py-5 space-y-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4 p-3 rounded-xl">
                  <div className="w-10 h-10 bg-surface-subtle rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-subtle rounded w-1/3" />
                    <div className="h-3 bg-surface-subtle rounded w-3/4" />
                    <div className="h-3 bg-surface-subtle rounded w-1/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8">
              <EmptyState
                icon={<BellRing size={26} />}
                title="Không có thông báo nào"
                description={
                  activeTab === "UNREAD"
                    ? "Tuyệt vời! Bạn đã đọc hết toàn bộ thông báo."
                    : activeTab === "READ"
                      ? "Bạn chưa có thông báo đã đọc nào."
                      : "Các thông báo tuyển dụng và cập nhật hệ thống sẽ xuất hiện ở đây."
                }
              />
            </div>
          ) : (
            notifications.map((item) => {
              const isUnread = item.status === "CHUA_DOC";
              const { icon, bg } = getNotificationIcon(
                item.title,
                item.content,
              );

              return (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className="group flex items-start gap-4 py-4 px-2 sm:px-3 hover:bg-surface-subtle/60 rounded-xl transition-colors cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg}`}
                  >
                    {icon}
                  </div>

                  <div className="flex-1 min-w-0 pr-3">
                    <h3
                      className={`text-sm leading-snug transition-colors ${
                        isUnread
                          ? "font-bold text-text-main group-hover:text-primary"
                          : "font-medium text-text-secondary"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed">
                      {item.content}
                    </p>
                    <span className="inline-block text-xs text-text-subtle mt-1.5">
                      {formatRelativeTimeVN(item.createdAt)}
                    </span>
                  </div>

                  <div className="w-4 flex items-center justify-center self-center shrink-0">
                    {isUnread && (
                      <span className="w-2.5 h-2.5 bg-primary rounded-full ring-4 ring-primary/15" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
