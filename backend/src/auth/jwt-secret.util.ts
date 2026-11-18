/**
 * Trả về khóa ký JWT từ biến môi trường và chặn khởi động ở Production nếu thiếu `JWT_SECRET`.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Biến môi trường JWT_SECRET là bắt buộc khi chạy ở chế độ production.',
    );
  }

  return 'secret';
}
