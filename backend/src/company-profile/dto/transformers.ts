import { Transform, TransformFnParams } from 'class-transformer';

/**
 * Custom Transformer:
 * - Cắt bỏ khoảng trắng 2 đầu chuỗi (trim).
 * - Biến chuỗi rỗng ("") thành null (quy ước xoá dữ liệu tương ứng).
 */
export function TrimToNull(): PropertyDecorator {
  return Transform(({ value }: TransformFnParams): unknown => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? null : trimmed;
  });
}

