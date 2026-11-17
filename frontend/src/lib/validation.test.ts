import { describe, expect, it } from "vitest";
import {
  ApiFormError,
  getPasswordCriteria,
  parseApiError,
  throwApiFormError,
  validateConfirmPassword,
  validateDateOrder,
  validateEmail,
  validatePassword,
  validatePhoneVN,
  validatePositiveNumber,
  validateRequiredText,
  validateUrl,
} from "./validation";

describe("validation helpers", () => {
  it("parseApiError xử lý ApiFormError, Error thường và unknown", () => {
    const apiErr = new ApiFormError("Lỗi validate", { email: "Sai email" }, 400);
    expect(parseApiError(apiErr)).toEqual({
      message: "Lỗi validate",
      fieldErrors: { email: "Sai email" },
    });

    const plainErr = Object.assign(new Error("Mạng lỗi"), {
      fieldErrors: { phone: "Sai SĐT" },
    });
    expect(parseApiError(plainErr)).toEqual({
      message: "Mạng lỗi",
      fieldErrors: { phone: "Sai SĐT" },
    });

    expect(parseApiError("unknown", "Fallback")).toEqual({
      message: "Fallback",
      fieldErrors: {},
    });
  });

  it("throwApiFormError đọc JSON message mảng và fieldErrors từ Response", async () => {
    const response = new Response(
      JSON.stringify({
        message: ["Tiêu đề không hợp lệ"],
        fieldErrors: { title: "Bắt buộc nhập", empty: "   " },
      }),
      { status: 422 },
    );

    await expect(
      throwApiFormError(response, "Fallback message"),
    ).rejects.toMatchObject({
      message: "Tiêu đề không hợp lệ",
      fieldErrors: { title: "Bắt buộc nhập" },
      statusCode: 422,
    });
  });

  it("validateEmail kiểm tra định dạng EMAIL_REGEX an toàn và giới hạn độ dài", () => {
    expect(validateEmail("")).toBe("Vui lòng nhập địa chỉ email.");
    expect(validateEmail("", false)).toBe("");
    expect(validateEmail("invalid@domain")).toContain("Email không đúng định dạng");
    expect(validateEmail("user@viecngon.vn")).toBe("");
    expect(validateEmail(`${"a".repeat(95)}@viecngon.vn`)).toBe(
      "Email không được vượt quá 100 ký tự.",
    );
  });

  it("validatePassword & validateConfirmPassword & getPasswordCriteria", () => {
    expect(getPasswordCriteria("Abc@1234")).toEqual({
      length: true,
      symbol: true,
      number: true,
      upper: true,
      lower: true,
    });
    expect(validatePassword("", { strong: true })).toBe(
      "Vui lòng nhập mật khẩu.",
    );
    expect(validatePassword("weakpass", { strong: true })).toContain(
      "chữ hoa, chữ thường",
    );
    expect(validatePassword("Abc@1234", { strong: true })).toBe("");
    expect(validateConfirmPassword("Abc@1234", "Abc@1235")).toBe(
      "Mật khẩu xác nhận không trùng khớp.",
    );
    expect(validateConfirmPassword("Abc@1234", "Abc@1234")).toBe("");
  });

  it("validateRequiredText, validatePhoneVN, validateUrl, validatePositiveNumber, validateDateOrder", () => {
    expect(validateRequiredText("  ", "tiêu đề")).toBe(
      "Vui lòng nhập tiêu đề.",
    );
    expect(validateRequiredText("ab", "tiêu đề", { minLength: 3 })).toContain(
      "ít nhất 3 ký tự",
    );
    expect(validatePhoneVN("0912 345 678", true)).toBe("");
    expect(validatePhoneVN("12345", true)).toContain("không hợp lệ");
    expect(validateUrl("ftp://example.com")).toContain("http:// hoặc https://");
    expect(validateUrl("https://viecngon.vn")).toBe("");
    expect(validatePositiveNumber("abc")).toContain("số hợp lệ");
    expect(validatePositiveNumber("15", { min: 10, max: 20 })).toBe("");
    expect(validateDateOrder("2026-05-10", "2026-05-01")).toContain(
      "không được trước",
    );
    expect(validateDateOrder("2026-05-01", "2026-05-10")).toBe("");
  });
});
