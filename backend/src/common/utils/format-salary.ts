import { Decimal } from '@prisma/client/runtime/library'; // Hoặc định nghĩa type linh hoạt bên dưới

// Kiểu dữ liệu chấp nhận cả primitive (number, string) lẫn Prisma Decimal
type SalaryInput =
  | number
  | string
  | Decimal
  | { toNumber(): number }
  | null
  | undefined;

interface FormatSalaryOptions {
  /**
   * Style hiển thị:
   * - 'compact': "10 - 20 triệu" hoặc "Từ 15 triệu"
   * - 'full': "10.000.000 - 20.000.000 VNĐ"
   * @default 'compact'
   */
  style?: 'compact' | 'full';
  fallbackText?: string;
}

/**
 * Hàm ép kiểu an toàn từ Decimal/String/Number sang number
 */
function parseSalaryToNumber(val: SalaryInput): number {
  if (!val) return 0;
  // Nếu là Decimal của Prisma
  if (
    typeof val === 'object' &&
    'toNumber' in val &&
    typeof val.toNumber === 'function'
  ) {
    return val.toNumber();
  }
  return Number(val) || 0;
}

/**
 * Chuyển đổi mức lương thành chuỗi hiển thị thân thiện
 */
export function formatSalaryDisplay(
  minSalary?: SalaryInput,
  maxSalary?: SalaryInput,
  options: FormatSalaryOptions = {},
): string {
  const { style = 'compact', fallbackText = 'Thỏa thuận' } = options;

  // Chuyển đổi Prisma Decimal sang number an toàn
  const min = parseSalaryToNumber(minSalary);
  const max = parseSalaryToNumber(maxSalary);

  // Trường hợp không nhập lương hoặc <= 0
  if ((!min || min <= 0) && (!max || max <= 0)) {
    return fallbackText;
  }

  // 1. Hiển thị ngắn gọn theo "triệu"
  if (style === 'compact') {
    const minInMillion = min > 0 ? (min / 1000000).toFixed(0) : null;
    const maxInMillion = max > 0 ? (max / 1000000).toFixed(0) : null;

    if (minInMillion && maxInMillion) {
      return `${minInMillion} - ${maxInMillion} triệu`;
    }
    if (minInMillion) {
      return `Từ ${minInMillion} triệu`;
    }
    if (maxInMillion) {
      return `Lên đến ${maxInMillion} triệu`;
    }
  }

  // 2. Hiển thị đầy đủ định dạng VNĐ
  const minFormatted = min > 0 ? min.toLocaleString('vi-VN') : null;
  const maxFormatted = max > 0 ? max.toLocaleString('vi-VN') : null;

  if (minFormatted && maxFormatted) {
    return `${minFormatted} - ${maxFormatted} VNĐ`;
  }
  if (minFormatted) {
    return `Từ ${minFormatted} VNĐ`;
  }
  if (maxFormatted) {
    return `Lên đến ${maxFormatted} VNĐ`;
  }

  return fallbackText;
}
