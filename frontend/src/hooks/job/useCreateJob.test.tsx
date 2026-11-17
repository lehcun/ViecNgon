import { act, renderHook } from "@testing-library/react";
import type { FormEvent } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateJob } from "./useCreateJob";

const pushMock = vi.fn();
const toastSuccessMock = vi.fn();
const toastErrorMock = vi.fn();

let mockUser: { id?: string; sub?: string } | null = { id: "hr-1" };

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/store/authStore", () => ({
  useAuthStore: () => ({ user: mockUser }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: (...args: unknown[]) => toastSuccessMock(...args),
    error: (...args: unknown[]) => toastErrorMock(...args),
  },
}));

describe("useCreateJob", () => {
  beforeEach(() => {
    mockUser = { id: "hr-1" };
    pushMock.mockReset();
    toastSuccessMock.mockReset();
    toastErrorMock.mockReset();
    process.env.NEXT_PUBLIC_API_URL = "http://localhost:3001";
  });

  it("validate rich text qua stripHtmlText, xử lý remote & đăng tin thành công", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ id: "job-1" }), { status: 201 }));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCreateJob(2));

    const updates: Array<() => void> = [
      () => result.current.setFieldValue("tenCongViec", "Senior React Dev"),
      () => result.current.setFieldValue("capBac", "Senior"),
      () => result.current.setFieldValue("loaiHinh", "Fulltime"),
      () => result.current.setFieldValue("hinhThucLamViec", "Remote"),
      () => result.current.setFieldValue("thanhPho", "Hà Nội"),
      () => result.current.setFieldValue("ngayHetHan", "2099-12-31"),
      () => result.current.setFieldValue("mucLuongToiThieu", 20000000),
      () => result.current.setFieldValue("mucLuongToiDa", 35000000),
      () =>
        result.current.handleRichTextChange(
          "moTa",
          "<p>Mô tả&nbsp;chi tiết</p>",
        ),
      () =>
        result.current.handleRichTextChange(
          "yeuCauCongViec",
          "<p>3 năm React</p>",
        ),
      () =>
        result.current.handleRichTextChange(
          "phucLoi",
          "<p>Thưởng tháng 13</p>",
        ),
      () => result.current.handleToggleSkill("skill-react"),
    ];

    for (const apply of updates) {
      act(() => {
        apply();
      });
    }

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(toastSuccessMock).toHaveBeenCalledWith("Đăng tin tuyển dụng thành công!");
    expect(result.current.remainingCredits).toBe(1);
  });

  it("chặn submit khi thiếu user hoặc hết lượt đăng tin", async () => {
    mockUser = null;
    const { result: unauthHook } = renderHook(() => useCreateJob(1));
    await act(async () => {
      await unauthHook.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent);
    });
    expect(toastErrorMock).toHaveBeenCalledWith(
      "Bạn cần đăng nhập để thực hiện chức năng này!",
    );

    mockUser = { id: "hr-1" };
    const { result: noCreditsHook } = renderHook(() => useCreateJob(0));
    await act(async () => {
      await noCreditsHook.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent);
    });
    expect(noCreditsHook.current.showUpgradeModal).toBe(true);
  });

  it("hỗ trợ handleInputChange, resetForm và xử lý lỗi từ API", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Trùng tiêu đề" }), {
          status: 400,
        }),
      ),
    );

    const { result } = renderHook(() => useCreateJob(1));

    act(() => {
      result.current.handleInputChange({
        target: { name: "tenCongViec", value: "Frontend Dev", type: "text" },
      } as never);
    });
    act(() => {
      result.current.handleInputChange({
        target: { name: "negotiable", checked: true, type: "checkbox", value: "" },
      } as never);
    });
    expect(result.current.formData.tenCongViec).toBe("Frontend Dev");
    expect(result.current.formData.negotiable).toBe(true);

    act(() => {
      result.current.resetForm();
    });
    expect(result.current.formData.tenCongViec).toBe("");

    const updates: Array<() => void> = [
      () => result.current.setFieldValue("tenCongViec", "Frontend Dev"),
      () => result.current.setFieldValue("capBac", "Junior"),
      () => result.current.setFieldValue("loaiHinh", "Fulltime"),
      () => result.current.setFieldValue("hinhThucLamViec", "Hybrid"),
      () => result.current.setFieldValue("thanhPho", "Hà Nội"),
      () => result.current.setFieldValue("ngayHetHan", "2099-12-31"),
      () => result.current.setFieldValue("negotiable", true),
      () => result.current.handleRichTextChange("moTa", "<p>Mô tả</p>"),
      () =>
        result.current.handleRichTextChange("yeuCauCongViec", "<p>Yêu cầu</p>"),
      () => result.current.handleRichTextChange("phucLoi", "<p>Phúc lợi</p>"),
      () => result.current.handleToggleSkill("sk-1"),
    ];
    for (const apply of updates) {
      act(() => apply());
    }

    await act(async () => {
      await result.current.handleSubmit({
        preventDefault: vi.fn(),
      } as unknown as FormEvent);
    });
    expect(toastErrorMock).toHaveBeenCalled();
  });
});
