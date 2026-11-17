import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import JobFilterPanel from "./JobFilterPanel";

describe("JobFilterPanel", () => {
  it("mở modal bộ lọc, chọn tiêu chí, đặt lại và áp dụng bộ lọc", () => {
    const onFilterChange = vi.fn();
    const onApplyMultiple = vi.fn();
    const onClearAll = vi.fn();

    render(
      <JobFilterPanel
        filters={{}}
        activeCount={1}
        totalResults={42}
        onFilterChange={onFilterChange}
        onApplyMultiple={onApplyMultiple}
        onClearAll={onClearAll}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Xóa 1 bộ lọc/i }));
    expect(onClearAll).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByLabelText("Cấp bậc"), {
      target: { value: "Senior" },
    });
    expect(onFilterChange).toHaveBeenCalledWith("capBac", "Senior");

    fireEvent.click(screen.getByRole("button", { name: /^Bộ lọc/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Remote" }));
    fireEvent.click(screen.getByRole("button", { name: /Đặt lại bộ lọc/i }));
    fireEvent.click(screen.getByRole("button", { name: "Lương cao nhất" }));
    fireEvent.click(screen.getByRole("button", { name: "Áp dụng" }));

    expect(onApplyMultiple).toHaveBeenCalledWith(
      expect.objectContaining({
        sortBy: "SALARY_DESC",
      }),
    );

    fireEvent.click(screen.getByRole("button", { name: /^Bộ lọc/i }));
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Bộ lọc/i }));
    fireEvent.click(screen.getAllByRole("button", { name: "Đóng bộ lọc" })[0]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
