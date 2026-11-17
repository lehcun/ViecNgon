import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import JobTemplateSelector from "./JobTemplateSelector";

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe("JobTemplateSelector", () => {
  const templates = [
    {
      id: "tpl-1",
      title: "Mẫu Backend Chuẩn",
      roleBadge: "Senior",
      description: "Mô tả mẫu backend",
      content: "<p>Xây dựng API với NestJS</p>",
    },
  ];

  it("áp dụng mẫu ngay khi ô soạn thảo trống", () => {
    const onApply = vi.fn();
    render(
      <JobTemplateSelector
        label="Mô tả"
        templates={templates as never}
        currentContent="<p><br></p>"
        onApply={onApply}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Dùng mẫu gợi ý/i }));
    fireEvent.click(screen.getByText("Mẫu Backend Chuẩn"));
    fireEvent.click(screen.getByText(/Áp dụng mẫu này/i));
    expect(onApply).toHaveBeenCalledWith("<p>Xây dựng API với NestJS</p>");
  });

  it("mở hộp thoại xác nhận và thay thế toàn bộ khi ô soạn thảo đã có nội dung", () => {
    const onApply = vi.fn();
    render(
      <JobTemplateSelector
        label="Mô tả"
        templates={templates as never}
        currentContent="<p>Nội dung đang có</p>"
        onApply={onApply}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Dùng mẫu gợi ý/i }));
    fireEvent.click(screen.getByText("Mẫu Backend Chuẩn"));
    fireEvent.click(screen.getByText(/Áp dụng mẫu này/i));
    fireEvent.click(screen.getByText(/Thay thế toàn bộ/i));
    expect(onApply).toHaveBeenCalledWith("<p>Xây dựng API với NestJS</p>");
  });
});
