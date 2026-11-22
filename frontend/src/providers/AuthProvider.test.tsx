import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AuthProvider from "./AuthProvider";

const replaceMock = vi.fn();
const setUserMock = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
  useRouter: () => ({ replace: replaceMock }),
}));

vi.mock("@/store/authStore", () => ({
  useAuthStore: (
    selector?: (s: {
      setUser: typeof setUserMock;
      isInitialized: boolean;
    }) => unknown,
  ) => {
    const state = { setUser: setUserMock, isInitialized: false };
    return selector ? selector(state) : state;
  },
}));

describe("AuthProvider", () => {
  beforeEach(() => {
    replaceMock.mockReset();
    setUserMock.mockReset();
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
  });

  it("gọi fetchUser khi mount và điều hướng về /login nếu chưa xác thực ở route bảo vệ", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 401 })),
    );

    render(
      <AuthProvider>
        <div>Protected Content</div>
      </AuthProvider>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();

    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalledWith(null);
      expect(replaceMock).toHaveBeenCalledWith(
        "/login?callbackUrl=%2Fdashboard",
      );
    });
  });

  it("không đẩy về /login khi /auth/me lỗi mạng để tránh redirect loop với middleware", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("Failed to fetch")),
    );

    render(
      <AuthProvider>
        <div>Protected Content</div>
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });
    expect(setUserMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
