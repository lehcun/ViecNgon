import { describe, expect, it, vi } from "vitest";
import {
  formatDateTimeVN,
  formatDateVN,
  formatRelativeTimeVN,
  formatSalaryRange,
  formatVnd,
  stripHtmlTags,
} from "./formatters";

describe("formatters", () => {
  describe("formatSalaryRange", () => {
    it("định dạng khoảng lương triệu đồng và VNĐ", () => {
      expect(formatSalaryRange(20_000_000, 35_000_000)).toBe("20 - 35 triệu");
      expect(formatSalaryRange(500_000, 900_000)).toBe(
        "500.000 - 900.000 VNĐ",
      );
      expect(formatSalaryRange(15_000_000, null)).toBe("Từ 15 triệu");
      expect(formatSalaryRange(null, 25_500_000)).toBe("Lên đến 25.5 triệu");
      expect(formatSalaryRange(null, null)).toBe("Thỏa thuận");
    });
  });

  describe("formatVnd", () => {
    it("xử lý số hợp lệ, null và NaN", () => {
      expect(formatVnd(1800000)).toBe("1,800,000 VNĐ");
      expect(formatVnd(null)).toBe("0 VNĐ");
      expect(formatVnd("abc")).toBe("0 VNĐ");
    });
  });

  describe("formatDateVN & formatDateTimeVN", () => {
    it("định dạng ngày giờ hoặc trả về fallback nếu không hợp lệ", () => {
      const sample = new Date(2026, 4, 9, 8, 5);
      expect(formatDateVN(sample)).toBe("09/05/2026");
      expect(formatDateTimeVN(sample)).toBe("08:05 · 09/05/2026");
      expect(formatDateVN(null, "Chưa có")).toBe("Chưa có");
      expect(formatDateVN("not-a-date")).toBe("—");
      expect(formatDateTimeVN("not-a-date", "N/A")).toBe("N/A");
    });
  });

  describe("formatRelativeTimeVN", () => {
    it("trả về mốc thời gian tương đối tiếng Việt", () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-11-17T10:00:00.000Z"));

      expect(formatRelativeTimeVN("2026-11-17T09:59:50.000Z")).toBe("Vừa xong");
      expect(formatRelativeTimeVN("2026-11-17T09:45:00.000Z")).toBe(
        "15 phút trước",
      );
      expect(formatRelativeTimeVN("2026-11-17T07:00:00.000Z")).toBe(
        "3 giờ trước",
      );
      expect(formatRelativeTimeVN("2026-11-16T10:00:00.000Z")).toBe("Hôm qua");
      expect(formatRelativeTimeVN("2026-11-14T10:00:00.000Z")).toBe(
        "3 ngày trước",
      );
      expect(formatRelativeTimeVN("invalid")).toBe("");
      expect(formatRelativeTimeVN(null)).toBe("");

      vi.useRealTimers();
    });
  });

  describe("stripHtmlTags", () => {
    it("loại bỏ thẻ HTML tuyến tính và xử lý trường hợp rỗng hoặc < chưa đóng", () => {
      expect(stripHtmlTags(null)).toBe("");
      expect(stripHtmlTags("<p>Hello <b>ViecNgon</b></p>")).toBe(
        "Hello ViecNgon",
      );
      expect(stripHtmlTags(`<${"<".repeat(2000)}script`)).toBe("");
    });
  });
});
