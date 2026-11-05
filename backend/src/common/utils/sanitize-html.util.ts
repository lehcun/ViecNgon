import sanitizeHtml from 'sanitize-html';

/**
 * Whitelist các thẻ và thuộc tính HTML được phép dùng cho Rich Text Editor
 * Hỗ trợ định dạng văn bản: Tiêu đề (h1-h6), In đậm/nghiêng/gạch chân,
 * Danh sách (ul, ol, li), Trích dẫn (blockquote), Mã nguồn (code, pre), Link an toàn (a).
 */
export const RICH_TEXT_SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'p',
    'br',
    'b',
    'strong',
    'i',
    'em',
    'u',
    's',
    'ul',
    'ol',
    'li',
    'a',
    'code',
    'pre',
    'blockquote',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'span',
    'div',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
    span: ['style'],
    p: ['style'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowProtocolRelative: false,
  transformTags: {
    // Tự động gắn thuộc tính bảo mật chống Reverse Tabnabbing cho mọi liên kết
    a: sanitizeHtml.simpleTransform('a', {
      rel: 'noopener noreferrer nofollow',
    }),
  },
};

/** Cấu hình xoá sạch 100% thẻ HTML cho các trường Plain Text */
export const STRIP_ALL_TAGS_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

/**
 * Làm sạch chuỗi HTML từ các trình soạn thảo Rich Text (Mô tả, Phúc lợi, Yêu cầu...)
 * - Chỉ giữ lại các thẻ văn bản trong whitelist an toàn.
 * - Loại bỏ mã độc XSS, script injection, javascript: links.
 * - Tự động nhận diện chuỗi rỗng hoặc chỉ chứa thẻ HTML rỗng (VD: <p></p>, <p><br></p>) và trả về null.
 */
export function sanitizeRichText(html?: string | null): string | null {
  if (!html) return null;
  const cleanHtml = sanitizeHtml(html, RICH_TEXT_SANITIZE_OPTIONS).trim();
  const textOnly = sanitizeHtml(cleanHtml, STRIP_ALL_TAGS_OPTIONS).trim();
  return textOnly.length > 0 ? cleanHtml : null;
}

/**
 * Xóa sạch 100% các thẻ HTML, chỉ giữ lại nội dung văn bản thuần túy (Plain Text)
 * Dùng cho các trường: Slogan (aboutMe), Tiêu đề, Tags, Họ tên...
 */
export function stripHtml(text?: string | null): string | null {
  if (!text) return null;
  const stripped = sanitizeHtml(text, STRIP_ALL_TAGS_OPTIONS).trim();
  return stripped.length > 0 ? stripped : null;
}

/** Bí danh tiện ích cho các ngữ cảnh làm sạch Plain Text */
export const sanitizePlainText = stripHtml;

