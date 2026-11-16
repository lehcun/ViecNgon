import {
  BadRequestException,
  UnauthorizedException,
  type ValidationError,
} from '@nestjs/common';

export type FieldErrors = Record<string, string>;

/**
 * Đệ quy trích xuất thông báo lỗi đầu tiên của mỗi trường từ `class-validator`.
 */
export function extractFieldErrors(
  validationErrors: ValidationError[],
  parentPath = '',
): FieldErrors {
  const fieldErrors: FieldErrors = {};

  for (const err of validationErrors) {
    const fieldPath = parentPath
      ? `${parentPath}.${err.property}`
      : err.property;

    if (err.constraints && !fieldErrors[fieldPath]) {
      const messages = Object.values(err.constraints);
      if (messages.length > 0) {
        fieldErrors[fieldPath] = messages[0];
      }
    }

    if (err.children && err.children.length > 0) {
      Object.assign(
        fieldErrors,
        extractFieldErrors(err.children, fieldPath),
      );
    }
  }

  return fieldErrors;
}

/**
 * Factory dùng cho NestJS Global ValidationPipe để trả về `{ statusCode, message, fieldErrors }`.
 */
export function createFieldValidationException(
  validationErrors: ValidationError[],
): BadRequestException {
  const fieldErrors = extractFieldErrors(validationErrors);
  const firstMessage =
    Object.values(fieldErrors)[0] || 'Dữ liệu đầu vào không hợp lệ.';

  return new BadRequestException({
    statusCode: 400,
    message: firstMessage,
    error: 'Bad Request',
    fieldErrors,
  });
}

export function fieldBadRequest(
  fieldErrors: FieldErrors,
  message?: string,
): BadRequestException {
  const firstMessage =
    message || Object.values(fieldErrors)[0] || 'Yêu cầu không hợp lệ.';
  return new BadRequestException({
    statusCode: 400,
    message: firstMessage,
    error: 'Bad Request',
    fieldErrors,
  });
}

export function fieldUnauthorized(
  fieldErrors: FieldErrors,
  message?: string,
): UnauthorizedException {
  const firstMessage =
    message || Object.values(fieldErrors)[0] || 'Thông tin xác thực không hợp lệ.';
  return new UnauthorizedException({
    statusCode: 401,
    message: firstMessage,
    error: 'Unauthorized',
    fieldErrors,
  });
}
