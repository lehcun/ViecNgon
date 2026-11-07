"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Bell,
  Mail,
  Briefcase,
  Megaphone,
  Check,
  BellRing,
  ArrowRight,
} from "lucide-react";
import { NotificationItemResponse } from "@viecngon/types";
import { useNotifications } from "@/hooks/useNotifications";

// Helper định dạng thời gian tương đối
export const getRelativeTime = (dateStr: string | Date) => {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now.getTime() - past.getTime();

  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return `${`0${past.getDate()}`.slice(-2)}/${`0${past.getMonth() + 1}`.slice(-2)}/${past.getFullYear()}`;
};

// Helper chọn Icon phù hợp với tiêu đề hoặc nội dung thông báo
export const getNotificationIcon = (title: string, content: string) => {
  const text = (title + " " + content).toLowerCase();

  if (
    text.includes("phỏng vấn") ||
    text.includes("trao đổi") ||
    text.includes("email") ||
    text.includes("thư mời")
  ) {
    return {
      icon: <Mail size={16} />,
      bg: "bg-blue-100 text-blue-600",
    };
  }

  if (
    text.includes("thưởng") ||
    text.includes("viết lách") ||
    text.includes("story hub") ||
    text.includes("khảo sát") ||
    text.includes("sự kiện")
  ) {
    return {
      icon: <Megaphone size={16} />,
      bg: "bg-indigo-100 text-indigo-600",
    };
  }

  return {
    icon: <Briefcase size={16} />,
    bg: "bg-slate-100 text-slate-600",
  };
};

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
  } = useNotifications({ limit: 5 });

  // Xử lý click ra ngoài để tự đóng Dropdown
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

  const handleNotificationClick = (notif: NotificationItemResponse) => {
    if (notif.status === "CHUA_DOC") {
      markAsRead(notif.id);
    }
  };

  const handleMarkAll = () => {
    if (unreadCount > 0 && !isMarkingAllRead) {
      markAllAsRead();
    }
  };

  const displayList = notifications.slice(0, 5);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* Nút chuông thông báo */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Thông báo"
        className="relative p-2 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-all focus:outline-none cursor-pointer"
      >
        <Bell
          size={20}
          className={unreadCount > 0 ? "text-primary" : ""}
        />

        {/* Badge đếm số CHUA_DOC (ẩn nếu = 0) */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown xổ xuống */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_12px_45px_-10px_rgba(0,0,0,0.18)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-3 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-white">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">
                Thông báo
              </h3>
              {unreadCount > 0 && (
                <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                disabled={isMarkingAllRead}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Check size={14} /> Đã đọc tất cả
              </button>
            )}
          </div>

          {/* Danh sách thông báo (tối đa 5 thông báo gần nhất) */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-7 h-7 border-3 border-slate-200 border-t-primary rounded-full animate-spin mb-2"></div>
                <p className="text-xs font-medium text-slate-400">
                  Đang tải thông báo...
                </p>
              </div>
            ) : displayList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-2.5">
                  <BellRing size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Bạn chưa có thông báo nào
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Khi có tin tuyển dụng hoặc cập nhật mới, chúng sẽ xuất hiện ở đây.
                </p>
              </div>
            ) : (
              displayList.map((notif) => {
                const isUnread = notif.status === "CHUA_DOC";
                const { icon, bg } = getNotificationIcon(
                  notif.title,
                  notif.content,
                );

                return (
                  <button
                    type="button"
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`relative w-full flex items-start gap-3 p-3.5 text-left transition-colors cursor-pointer ${isUnread
                        ? "bg-indigo-50/40 hover:bg-indigo-50/80"
                        : "bg-white hover:bg-slate-50"
                      }`}
                  >
                    {/* Icon */}
                    <div
                      className={`mt-0.5 shrink-0 p-2 rounded-xl ${bg}`}
                    >
                      {icon}
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1 min-w-0 pr-3">
                      <p
                        className={`text-xs sm:text-sm mb-1 line-clamp-1 ${isUnread
                            ? "font-bold text-slate-900"
                            : "font-semibold text-slate-700"
                          }`}
                      >
                        {notif.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {notif.content}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400 mt-1.5">
                        {getRelativeTime(notif.createdAt)}
                      </p>
                    </div>

                    {/* Chấm tròn chưa đọc */}
                    {isUnread && (
                      <div className="shrink-0 w-2 h-2 mt-2 bg-primary rounded-full shadow-[0_0_0_3px_rgba(37,99,235,0.15)]"></div>
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer có nút Xem tất cả thông báo */}
          <div className="p-2.5 border-t border-slate-100 bg-slate-50/70 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 text-xs font-bold text-primary hover:text-primary-hover hover:underline transition-colors"
            >
              Xem tất cả thông báo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
