"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, Briefcase, Check, BellRing } from "lucide-react";
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

  return `${("0" + past.getDate()).slice(-2)}/${("0" + (past.getMonth() + 1)).slice(-2)}/${past.getFullYear()}`;
};

export default function EmployerNotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy data thật từ API (Tự động nhận diện tài khoản HR qua Cookie)
  const { notifications, isLoading, markAsRead } = useNotifications();

  // Đếm số lượng thông báo chưa đọc
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
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Hành động click vào 1 thông báo
  const handleNotificationClick = (notif: NotificationItemResponse) => {
    if (notif.status === "CHUA_DOC") {
      markAsRead(notif.id); // Gọi API cập nhật ngầm
    }
    // TODO: Chuyển hướng HR đến trang chi tiết ứng viên nếu thông báo là có người nộp đơn
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach((notif) => {
      if (notif.status === "CHUA_DOC") markAsRead(notif.id);
    });
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      {/* --- NÚT CHUÔNG TRÊN HEADER CỦA HR --- */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-primary hover:bg-primary-light/20 rounded-full transition-all focus:outline-none flex items-center justify-center h-10 w-10"
      >
        <Bell
          size={20}
          className={unreadCount > 0 ? "fill-primary/20 text-primary" : ""}
        />

        {/* Badge đếm số */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4.5 h-4.5 flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* --- PANEL DROPDOWN --- */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
              Thông báo hệ thống
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs font-semibold text-primary hover:text-primary-hover flex items-center gap-1 transition-colors"
              >
                <Check size={14} /> Đã đọc tất cả
              </button>
            )}
          </div>

          {/* CUSTOM SCROLLBAR */}
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
          <div className="max-h-100px overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="py-10 text-center text-slate-400 text-sm font-medium">
                Đang tải...
              </div>
            ) : notifications.length === 0 ? (
              // Trạng thái Rỗng (Dành cho HR)
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                  <BellRing size={24} className="text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Chưa có thông báo nào
                </p>
                <p className="text-xs text-slate-500 mt-1 max-w-50">
                  Khi có ứng viên nộp hồ sơ hoặc lịch phỏng vấn mới, thông báo
                  sẽ hiển thị tại đây.
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
                      {/* Icon (Đổi icon phù hợp với công việc HR) */}
                      <div
                        className={`mt-0.5 shrink-0 p-2 rounded-full ${isUnread ? "bg-primary-light/20 text-primary" : "bg-slate-100 text-slate-500"}`}
                      >
                        <Briefcase size={16} />
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
                        <p className="text-[11px] font-medium text-slate-400 mt-2 flex items-center gap-1">
                          {getRelativeTime(notif.createdAt)}
                        </p>
                      </div>

                      {/* Chấm đánh dấu */}
                      {isUnread && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* FOOTER */}
          {notifications.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/50">
              <button className="w-full py-3 text-xs font-bold text-center text-slate-500 hover:text-primary transition-colors">
                Xem toàn bộ thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
