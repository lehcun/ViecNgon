import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EmployerDashboardDropdown from "./EmployerDashboardDropdown";

const logoutMock = vi.fn();

vi.mock("@/store/authStore", () => ({
  useAuthStore: () => ({
    user: { name: "HR Lead", email: "hr@viecngon.vn" },
  }),
}));

vi.mock("@/hooks/auth/useLogout", () => ({
  useLogout: () => ({ mutate: logoutMock }),
}));

describe("EmployerDashboardDropdown", () => {
  it("mở dropdown menu bằng nút button native và gọi đăng xuất", () => {
    render(<EmployerDashboardDropdown />);
    const trigger = screen.getByRole("button", { name: /HR Lead/i });
    fireEvent.click(trigger);

    const logoutBtn = screen.getByRole("button", { name: /Đăng xuất/i });
    fireEvent.click(logoutBtn);
    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
