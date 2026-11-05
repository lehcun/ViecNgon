/**
 * =====================================================================
 * HẰNG SỐ CẤU HÌNH CHO MODULE COMPANY PROFILE (BACKEND)
 * =====================================================================
 */

export const COMPANY_PROFILE_CONSTANTS = {
  /** Số lượng tag lĩnh vực tối đa */
  MAX_SECTORS: 10,
  /** Độ dài tối đa 1 tag lĩnh vực */
  MAX_SECTOR_LENGTH: 50,
  /** Độ dài tối đa chuỗi serialize (Khớp CONGTY.linhVuc NVarChar(150)) */
  MAX_SECTORS_SERIALIZED_LENGTH: 150,
  /** Độ dài tối đa cho nội dung Rich Text (moTa, phucLoi, chuyenMon) */
  MAX_RICH_TEXT_LENGTH: 20000,
  /** Đối tượng đánh giá trong bảng DANHGIA */
  REVIEW_TARGET_COMPANY: 'CONGTY',
  /** Ký tự phân tách khi lưu chuỗi lĩnh vực */
  SECTOR_SEPARATOR: ', ',
} as const;

/** Cấu hình tùy chọn URL hợp lệ (chỉ cho phép giao thức http / https an toàn) */
export const VALID_URL_OPTIONS = {
  protocols: ['http', 'https'],
  require_protocol: true,
};

