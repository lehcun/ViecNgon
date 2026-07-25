"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Mail, Check, BellRing } from "lucide-react";
import { NotificationItemResponse } from "@viecngon/types";
import { useNotifications } from "@/hooks/useNotifications";
// ============================================================================
// UTILS HELPER (Hàm định dạng thời gian tương đối)
// ============================================================================
const getRelativeTime = (dateStr: string | Date) => {
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

  // Trả về định dạng DD/MM/YYYY nếu quá 7 ngày
  return `${`0${past.getDate()}`.slice(-2)}/${`0${past.getMonth() + 1}`.slice(-2)}/${past.getFullYear()}`;
};

// ============================================================================
// COMPONENT CHÍNH
// ============================================================================
export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy data thật từ Backend
  const { notifications, isLoading, markAsRead } = useNotifications();

  // Tự động đếm số lượng thông báo chưa đọc
  const unreadCount = notifications.filter(
    (n) => n.status === "CHUA_DOC",
  ).length;

  // Xử lý Click ra ngoài để đóng Dropdown
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

  // Hành động click vào 1 thông báo
  const handleNotificationClick = (notif: NotificationItemResponse) => {
    if (notif.status === "CHUA_DOC") {
      markAsRead(notif.id);
    }
    // TODO: Chuyển hướng trang (ví dụ: router.push('/candidate/applications'))
  };

  // Hành động đánh dấu tất cả đã đọc (Mở rộng cho tương lai)
  const handleMarkAllAsRead = () => {
    notifications.forEach((notif) => {
      if (notif.status === "CHUA_DOC") markAsRead(notif.id);
    });
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* --- NÚT BẤM (TRIGGER) --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-slate-600 hover:text-primary hover:bg-slate-100 rounded-full transition-all focus:outline-none"
      >
        <Bell
          size={22}
          className={unreadCount > 0 ? "fill-primary/10 text-primary" : ""}
        />

        {/* Badge đếm số (Chỉ hiện khi > 0) */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* --- PANEL DROPDOWN --- */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-90 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              Thông báo
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
              >
                <Check size={14} /> Đã đọc tất cả
              </button>
            )}
          </div>

          {/* CUSTOM SCROLLBAR CSS (Nhúng inline để đảm bảo hoạt động mọi nơi) */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          `,
            }}
          />

          {/* DANH SÁCH THÔNG BÁO */}
          <div className="max-h-100 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-3"></div>
                <p className="text-sm font-medium text-slate-500">
                  Đang tải...
                </p>
              </div>
            ) : notifications.length === 0 ? (
              // Trạng thái Rỗng (Empty State)
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                  <BellRing size={28} className="text-slate-300" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  Bạn chưa có thông báo nào
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Khi có cập nhật mới, chúng sẽ xuất hiện ở đây.
                </p>
              </div>
            ) : (
              // Danh sách Item
              <div className="flex flex-col">
                {notifications.map((notif) => {
                  const isUnread = notif.status === "CHUA_DOC";

                  return (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={`relative flex items-start gap-3 p-4 text-left border-b border-slate-50 last:border-none transition-colors duration-200 ${
                        isUnread
                          ? "bg-blue-50/40 hover:bg-blue-50/80"
                          : "bg-white hover:bg-slate-50"
                      }`}
                    >
                      {/* Icon */}
                      <div
                        className={`mt-0.5 shrink-0 p-2 rounded-full ${isUnread ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}
                      >
                        <Mail size={16} />
                      </div>

                      {/* Nội dung */}
                      <div className="flex-1 min-w-0 pr-4">
                        <p
                          className={`text-sm mb-1 ${isUnread ? "font-bold text-slate-800" : "font-semibold text-slate-700"}`}
                        >
                          {notif.title}
                        </p>
                        <p
                          className={`text-xs leading-relaxed line-clamp-2 ${isUnread ? "text-slate-600" : "text-slate-500"}`}
                        >
                          {notif.content}
                        </p>
                        <p className="text-[11px] font-medium text-slate-400 mt-2">
                          {getRelativeTime(notif.createdAt)}
                        </p>
                      </div>

                      {/* Chấm tròn đánh dấu chưa đọc */}
                      {isUnread && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER (Tuỳ chọn: Nút Xem tất cả) */}
          {/* {notifications.length > 0 && !isLoading && (
            <div className="border-t border-slate-100 bg-white">
              <button className="w-full py-3 text-sm font-bold text-center text-slate-600 hover:text-primary transition-colors">
                Xem tất cả thông báo
              </button>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
}
