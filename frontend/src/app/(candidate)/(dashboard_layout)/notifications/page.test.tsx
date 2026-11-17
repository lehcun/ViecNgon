import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CandidateNotificationsPage from "./page";

const markAsReadMock = vi.fn();
const markAllAsReadMock = vi.fn();
const setFilterMock = vi.fn();

vi.mock("@/hooks/useNotifications", () => ({
  useNotifications: () => ({
    notifications: [
      {
        id: "n-1",
        title: "Lịch phỏng vấn mới",
        content: "Bạn có lịch phỏng vấn",
        type: "INTERVIEW",
        status: "CHUA_DOC",
        createdAt: new Date().toISOString(),
      },
    ],
    unreadCount: 1,
    readCount: 0,
    allCount: 1,
    isLoading: false,
    markAsRead: markAsReadMock,
    markAllAsRead: markAllAsReadMock,
    isMarkingAllRead: false,
    setFilter: setFilterMock,
  }),
}));

vi.mock("@/components/NotificationDropdown", () => ({
  getNotificationIcon: () => <span>icon</span>,
}));

describe("CandidateNotificationsPage", () => {
  it("hiển thị nút thông báo và đánh dấu đã đọc khi click", () => {
    render(<CandidateNotificationsPage />);
    fireEvent.click(screen.getByRole("button", { name: /Lịch phỏng vấn mới/i }));
    expect(markAsReadMock).toHaveBeenCalledWith("n-1");
  });
});
