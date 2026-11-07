"use client";

import React, { useState } from "react";
import {
  Bell,
  Mail,
  Briefcase,
  Megaphone,
  Check,
  BellRing,
  Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNotifications, NotificationFilterType } from "@/hooks/useNotifications";
import { getRelativeTime, getNotificationIcon } from "@/components/NotificationDropdown";
import { NotificationItemResponse } from "@viecngon/types";

export default function CandidateNotificationsPage() {
  const [activeTab, setActiveTab] = useState<NotificationFilterType>("ALL");

  const {
    notifications,
    unreadCount,
    readCount,
    allCount,
    isLoading,
    isRefetching,
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

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* HEADER: TIÊU ĐỀ & NÚT ĐÃ ĐỌC TẤT CẢ (Marker 3) */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Bell className="w-6 h-6 text-primary" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
              Thông báo của bạn
            </h1>
          </div>

          <button
            type="button"
            onClick={handleMarkAll}
            disabled={isMarkingAllRead || unreadCount === 0}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover hover:underline transition-all cursor-pointer disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
          >
            {isMarkingAllRead ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Check size={16} />
            )}
            <span>Đã đọc tất cả</span>
          </button>
        </div>

        {/* TABS BỘ LỌC (Marker 2): TẤT CẢ | CHƯA ĐỌC | ĐÃ ĐỌC */}
        <div className="flex items-center gap-6 border-b border-slate-100 mt-4 text-sm font-medium">
          {/* Tab 1: Tất cả */}
          <button
            type="button"
            onClick={() => handleTabChange("ALL")}
            className={`pb-3 flex items-center gap-2 transition-all relative cursor-pointer ${
              activeTab === "ALL"
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Tất cả</span>
            <span
              className={`text-xs font-bold transition-colors ${
                activeTab === "ALL"
                  ? "bg-primary text-white px-2 py-0.5 rounded-full"
                  : "text-slate-500 font-normal"
              }`}
            >
              {allCount}
            </span>
          </button>

          {/* Tab 2: Chưa đọc */}
          <button
            type="button"
            onClick={() => handleTabChange("UNREAD")}
            className={`pb-3 flex items-center gap-2 transition-all relative cursor-pointer ${
              activeTab === "UNREAD"
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Chưa đọc</span>
            <span
              className={`text-xs font-bold transition-colors ${
                activeTab === "UNREAD"
                  ? "bg-primary text-white px-2 py-0.5 rounded-full"
                  : "text-slate-500 font-normal"
              }`}
            >
              {unreadCount}
            </span>
          </button>

          {/* Tab 3: Đã đọc */}
          <button
            type="button"
            onClick={() => handleTabChange("READ")}
            className={`pb-3 flex items-center gap-2 transition-all relative cursor-pointer ${
              activeTab === "READ"
                ? "text-primary font-bold border-b-2 border-primary"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>Đã đọc</span>
            <span
              className={`text-xs font-bold transition-colors ${
                activeTab === "READ"
                  ? "bg-primary text-white px-2 py-0.5 rounded-full"
                  : "text-slate-500 font-normal"
              }`}
            >
              {readCount}
            </span>
          </button>
        </div>

        {/* DANH SÁCH THÔNG BÁO */}
        <div className="mt-2 divide-y divide-slate-100">
          {isLoading ? (
            /* Skeleton Loading State */
            <div className="py-6 space-y-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl">
                  <div className="w-11 h-11 bg-slate-200 rounded-full shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-3">
                <BellRing size={32} />
              </div>
              <h3 className="text-base font-bold text-slate-700">
                Không có thông báo nào
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm">
                {activeTab === "UNREAD"
                  ? "Tuyệt vời! Bạn đã đọc hết toàn bộ thông báo."
                  : activeTab === "READ"
                  ? "Bạn chưa có thông báo đã đọc nào."
                  : "Các thông báo tuyển dụng và cập nhật hệ thống sẽ xuất hiện ở đây."}
              </p>
            </div>
          ) : (
            /* List Items */
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
                  className="group flex items-start gap-4 py-5 px-2 sm:px-3 hover:bg-slate-50/70 rounded-xl transition-all duration-150 cursor-pointer"
                >
                  {/* Icon loại thông báo */}
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${bg}`}
                  >
                    {icon}
                  </div>

                  {/* Nội dung thông báo */}
                  <div className="flex-1 min-w-0 pr-4">
                    <h3
                      className={`text-[15px] leading-snug transition-colors ${
                        isUnread
                          ? "font-bold text-slate-900 group-hover:text-primary"
                          : "font-medium text-slate-800"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                      {item.content}
                    </p>
                    <span className="inline-block text-xs font-normal text-slate-400 mt-1.5">
                      {getRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  {/* Marker 4 (Chấm tròn xanh Chưa đọc) / Marker 5 (Đã đọc không có chấm) */}
                  <div className="w-5 flex items-center justify-center self-center shrink-0">
                    {isUnread && (
                      <span className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_0_3px_rgba(25,103,210,0.18)]" />
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

