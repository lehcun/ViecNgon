import type {
  ApiValidationErrorResponse,
  FieldErrorMap,
} from "@viecngon/types";

/**
 * Lỗi API có kèm map lỗi theo từng trường (`fieldErrors`) từ NestJS ValidationPipe / Service.
 */
export class ApiFormError extends Error {
  public readonly statusCode?: number;
  public readonly fieldErrors: FieldErrorMap;

  constructor(
    message: string,
    fieldErrors: FieldErrorMap = {},
    statusCode?: number,
  ) {
    super(message);
    this.name = "ApiFormError";
    this.fieldErrors = fieldErrors;
    this.statusCode = statusCode;
  }
}

/**
 * Chuẩn hóa thông điệp trả về từ NestJS (string | string[]) thành 1 chuỗi dễ đọc.
 */
function normalizeApiMessage(
  rawMessage: unknown,
  fallback: string,
): string {
  if (Array.isArray(rawMessage)) {
    const first = rawMessage.find(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
    return first || fallback;
  }
  if (typeof rawMessage === "string" && rawMessage.trim().length > 0) {
    return rawMessage;
  }
  return fallback;
}

/**
 * Đọc response lỗi từ fetch và ném `ApiFormError` giữ nguyên `fieldErrors`.
 */
export async function throwApiFormError(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  const errorData = (await response
    .json()
    .catch(() => ({}))) as Partial<ApiValidationErrorResponse>;

  const message = normalizeApiMessage(errorData.message, fallbackMessage);
  const fieldErrors: FieldErrorMap = {};

  if (errorData.fieldErrors && typeof errorData.fieldErrors === "object") {
    for (const [key, val] of Object.entries(errorData.fieldErrors)) {
      if (typeof val === "string" && val.trim().length > 0) {
        fieldErrors[key] = val;
      }
    }
  }

  throw new ApiFormError(message, fieldErrors, response.status);
}

/**
 * Trích xuất `{ message, fieldErrors }` từ mọi loại Error bắt được ở UI.
 */
export function parseApiError(
  error: unknown,
  fallbackMessage = "Đã có lỗi xảy ra. Vui lòng thử lại.",
): { message: string; fieldErrors: FieldErrorMap } {
  if (error instanceof ApiFormError) {
    return {
      message: error.message || fallbackMessage,
      fieldErrors: error.fieldErrors,
    };
  }

  if (error instanceof Error) {
    const maybeFields = (error as Error & { fieldErrors?: FieldErrorMap })
      .fieldErrors;
    return {
      message: error.message || fallbackMessage,
      fieldErrors:
        maybeFields && typeof maybeFields === "object" ? maybeFields : {},
    };
  }

  return {
    message: fallbackMessage,
    fieldErrors: {},
  };
}

// =====================================================================
// CÁC HÀM VALIDATION DÙNG CHUNG (KHỚP VỚI RÀNG BUỘC DTO & SQL SERVER)
// =====================================================================

const EMAIL_REGEX = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;
const PHONE_VN_REGEX = /^(0|\+84)[0-9]{8,10}$/;

export interface PasswordCriteria {
  length: boolean;
  symbol: boolean;
  number: boolean;
  upper: boolean;
  lower: boolean;
}

export function getPasswordCriteria(password: string): PasswordCriteria {
  return {
    length: password.length >= 8,
    symbol: /[@$!%*?&#]/.test(password),
    number: /\d/.test(password),
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
  };
}

export function validateRequiredText(
  value: string,
  label: string,
  options?: { minLength?: number; maxLength?: number },
): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return `Vui lòng nhập ${label}.`;
  }
  if (options?.minLength && trimmed.length < options.minLength) {
    return `${capitalize(label)} phải có ít nhất ${options.minLength} ký tự.`;
  }
  if (options?.maxLength && trimmed.length > options.maxLength) {
    return `${capitalize(label)} không được vượt quá ${options.maxLength} ký tự.`;
  }
  return "";
}

export function validateEmail(value: string, required = true): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return required ? "Vui lòng nhập địa chỉ email." : "";
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Email không đúng định dạng (VD: tenban@gmail.com).";
  }
  if (trimmed.length > 100) {
    return "Email không được vượt quá 100 ký tự.";
  }
  return "";
}

export function validatePassword(
  value: string,
  options?: { minLength?: number; strong?: boolean; label?: string },
): string {
  const label = options?.label || "mật khẩu";
  const minLength = options?.minLength ?? (options?.strong ? 8 : 6);

  if (!value) {
    return `Vui lòng nhập ${label}.`;
  }
  if (value.length < minLength) {
    return `${capitalize(label)} phải có ít nhất ${minLength} ký tự.`;
  }
  if (value.length > 50) {
    return `${capitalize(label)} không được vượt quá 50 ký tự.`;
  }
  if (options?.strong) {
    const criteria = getPasswordCriteria(value);
    if (
      !criteria.length ||
      !criteria.symbol ||
      !criteria.number ||
      !criteria.upper ||
      !criteria.lower
    ) {
      return `${capitalize(label)} cần có chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&#).`;
    }
  }
  return "";
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
  label = "xác nhận mật khẩu",
): string {
  if (!confirmPassword) {
    return `Vui lòng nhập ${label}.`;
  }
  if (confirmPassword !== password) {
    return "Mật khẩu xác nhận không trùng khớp.";
  }
  return "";
}

export function validatePhoneVN(value: string, required = false): string {
  const trimmed = value.replace(/[\s.-]/g, "");
  if (!trimmed) {
    return required ? "Vui lòng nhập số điện thoại." : "";
  }
  if (trimmed.length > 20) {
    return "Số điện thoại không được vượt quá 20 ký tự.";
  }
  if (!PHONE_VN_REGEX.test(trimmed)) {
    return "Số điện thoại không hợp lệ (VD: 0912345678).";
  }
  return "";
}

export function validateUrl(
  value: string,
  options?: { required?: boolean; label?: string; maxLength?: number },
): string {
  const trimmed = value.trim();
  const label = options?.label || "đường dẫn URL";
  const maxLength = options?.maxLength ?? 255;

  if (!trimmed) {
    return options?.required ? `Vui lòng nhập ${label}.` : "";
  }
  if (trimmed.length > maxLength) {
    return `${capitalize(label)} không được vượt quá ${maxLength} ký tự.`;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return `${capitalize(label)} phải bắt đầu bằng http:// hoặc https://.`;
    }
  } catch {
    return `${capitalize(label)} không đúng định dạng URL (VD: https://example.com).`;
  }
  return "";
}

export function validatePositiveNumber(
  value: string | number,
  options?: { required?: boolean; min?: number; max?: number; label?: string },
): string {
  const label = options?.label || "giá trị";
  const raw = String(value).trim();
  if (!raw) {
    return options?.required ? `Vui lòng nhập ${label}.` : "";
  }
  const num = Number(raw);
  if (Number.isNaN(num)) {
    return `${capitalize(label)} phải là số hợp lệ.`;
  }
  if (options?.min !== undefined && num < options.min) {
    return `${capitalize(label)} phải lớn hơn hoặc bằng ${options.min}.`;
  }
  if (options?.max !== undefined && num > options.max) {
    return `${capitalize(label)} không được vượt quá ${options.max}.`;
  }
  return "";
}

export function validateDateOrder(
  startDate: string,
  endDate: string,
  message = "Thời gian kết thúc không được trước thời gian bắt đầu.",
): string {
  if (!startDate || !endDate) return "";
  return endDate < startDate ? message : "";
}

function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
}
