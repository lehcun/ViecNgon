/**
 * Các hàm định dạng dữ liệu chuẩn hóa theo Design System ViecNgon (Mục 6.1).
 */

export function formatSalaryRange(
  min?: number | string | null,
  max?: number | string | null,
): string {
  const minNum = min !== null && min !== undefined ? Number(min) : null;
  const maxNum = max !== null && max !== undefined ? Number(max) : null;

  const formatMillions = (val: number): string => {
    if (val >= 1_000_000) {
      const m = val / 1_000_000;
      return Number.isInteger(m) ? `${m}` : m.toFixed(1).replace(/\.0$/, "");
    }
    return val.toLocaleString("vi-VN");
  };

  if (minNum && maxNum && minNum > 0 && maxNum > 0) {
    if (minNum >= 1_000_000 || maxNum >= 1_000_000) {
      return `${formatMillions(minNum)} - ${formatMillions(maxNum)} triệu`;
    }
    return `${minNum.toLocaleString("vi-VN")} - ${maxNum.toLocaleString("vi-VN")} VNĐ`;
  }

  if (minNum && minNum > 0) {
    return minNum >= 1_000_000
      ? `Từ ${formatMillions(minNum)} triệu`
      : `Từ ${minNum.toLocaleString("vi-VN")} VNĐ`;
  }

  if (maxNum && maxNum > 0) {
    return maxNum >= 1_000_000
      ? `Lên đến ${formatMillions(maxNum)} triệu`
      : `Lên đến ${maxNum.toLocaleString("vi-VN")} VNĐ`;
  }

  return "Thỏa thuận";
}

export function formatVnd(amount: number | string | null | undefined): string {
  const num = Number(amount ?? 0);
  if (Number.isNaN(num)) return "0 VNĐ";
  return `${num.toLocaleString("en-US")} VNĐ`;
}

export function formatDateVN(
  dateInput: string | Date | null | undefined,
  fallback = "—",
): string {
  if (!dateInput) return fallback;
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return fallback;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTimeVN(
  dateInput: string | Date | null | undefined,
  fallback = "—",
): string {
  if (!dateInput) return fallback;
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return fallback;
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${mins} · ${formatDateVN(d, fallback)}`;
}

export function formatRelativeTimeVN(
  dateInput: string | Date | null | undefined,
): string {
  if (!dateInput) return "";
  const past = new Date(dateInput);
  if (Number.isNaN(past.getTime())) return "";

  const diffMs = Date.now() - past.getTime();
  const diffMins = Math.round(diffMs / 60_000);
  const diffHours = Math.round(diffMs / 3_600_000);
  const diffDays = Math.round(diffMs / 86_400_000);

  if (diffMins < 1) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return "Hôm qua";
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return formatDateVN(past);
}

export function stripHtmlTags(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
