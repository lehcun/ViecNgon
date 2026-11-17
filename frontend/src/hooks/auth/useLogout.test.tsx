import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper, createTestQueryClient } from "@/test/query-wrapper";
import { useLogout } from "./useLogout";

const pushMock = vi.fn();
const clearAuthMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/store/authStore", () => ({
  useAuthStore: () => ({ clearAuth: clearAuthMock }),
}));

describe("useLogout", () => {
  beforeEach(() => {
    pushMock.mockReset();
    clearAuthMock.mockReset();
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:4000";
  });

  it("xóa auth, dọn query cache và chuyển hướng mặc định /login khi thành công", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    const queryClient = createTestQueryClient();
    const clearSpy = vi.spyOn(queryClient, "clear");
    const { result } = renderHook(() => useLogout(), {
      wrapper: createQueryWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(clearAuthMock).toHaveBeenCalledTimes(1);
    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  it("hỗ trợ redirectTo = false khi không muốn chuyển trang", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 200 })),
    );

    const { result } = renderHook(() => useLogout({ redirectTo: false }), {
      wrapper: createQueryWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(pushMock).not.toHaveBeenCalled();
  });

  it("vẫn dọn state và chuyển về /login nếu API đăng xuất lỗi", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("{}", { status: 500 })),
    );
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const { result } = renderHook(() => useLogout(), {
      wrapper: createQueryWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync().catch(() => undefined);
    });

    expect(clearAuthMock).toHaveBeenCalledTimes(1);
    expect(pushMock).toHaveBeenCalledWith("/login");
    expect(consoleSpy).toHaveBeenCalled();
  });
});
