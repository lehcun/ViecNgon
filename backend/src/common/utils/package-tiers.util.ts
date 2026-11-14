import type { JobPromotionBadge } from '@viecngon/types';

export interface PackageTierTemplate {
  key: 'BASIC' | 'STANDARD' | 'VIP' | 'DIAMOND';
  title: string;
  loaiQuangCao: string;
  price: number;
  durationDays: number;
  postCredits: number;
  priorityLevel: number;
  badgeType: JobPromotionBadge;
  badgeText: string | null;
  isPopular: boolean;
  description: string;
  inheritedFrom: string | null;
  features: string[];
}

export const PACKAGE_TIER_TEMPLATES: readonly PackageTierTemplate[] = [
  {
    key: 'BASIC',
    title: 'Gói Cơ Bản',
    loaiQuangCao: 'BASIC',
    price: 500000,
    durationDays: 14,
    postCredits: 1,
    priorityLevel: 1,
    badgeType: 'BASIC',
    badgeText: null,
    isPopular: false,
    description: 'Phù hợp nhu cầu tuyển dụng nhanh cho 1 vị trí IT cụ thể.',
    inheritedFrom: null,
    features: [
      '1 tin tuyển dụng hiển thị trên sàn',
      'Thời gian hiển thị tin 14 ngày',
      'Tiếp cận danh sách ứng viên nộp hồ sơ chuẩn ATS',
      'Bộ lọc sàng lọc ứng viên cơ bản (kỹ năng, địa điểm)',
      'Nhận thông báo Email ngay khi có ứng viên nộp đơn',
    ],
  },
  {
    key: 'STANDARD',
    title: 'Gói Tiêu Chuẩn',
    loaiQuangCao: 'HOT',
    price: 1800000,
    durationDays: 30,
    postCredits: 3,
    priorityLevel: 2,
    badgeType: 'HOT',
    badgeText: 'Phổ biến nhất',
    isPopular: true,
    description: 'Tối ưu chi phí tuyển dụng đa vị trí với huy hiệu nổi bật.',
    inheritedFrom: 'Toàn bộ quyền lợi của Gói Cơ Bản',
    features: [
      '3 tin tuyển dụng hiển thị trên sàn',
      'Thời gian hiển thị tin 30 ngày',
      'Huy hiệu "HOT JOB" nổi bật trên trang tìm kiếm việc làm',
      'Ưu tiên hiển thị trên các tin tuyển dụng thông thường',
      'Đặt lịch phỏng vấn Google Meet trực tiếp trên nền tảng',
    ],
  },
  {
    key: 'VIP',
    title: 'Gói VIP Đẩy Tin',
    loaiQuangCao: 'SUPER_HOT',
    price: 3500000,
    durationDays: 45,
    postCredits: 5,
    priorityLevel: 3,
    badgeType: 'SUPER_HOT',
    badgeText: 'VIP Đẩy Tin',
    isPopular: false,
    description: 'Thu hút ứng viên chất lượng cao nhờ AI Match & Auto Refresh.',
    inheritedFrom: 'Toàn bộ quyền lợi của Gói Tiêu Chuẩn',
    features: [
      '5 tin tuyển dụng hiển thị trên sàn',
      'Thời gian hiển thị tin 45 ngày',
      'Huy hiệu "SUPER HOT" cùng nền thẻ việc làm nổi bật',
      'Tự động làm mới (Auto Refresh) lên đầu trang mỗi thứ Hai',
      'Xếp hạng CV bằng AI Match Score Ranking cho mọi hồ sơ',
    ],
  },
  {
    key: 'DIAMOND',
    title: 'Gói Kim Cương / Doanh nghiệp',
    loaiQuangCao: 'DIAMOND',
    price: 8000000,
    durationDays: 60,
    postCredits: 10,
    priorityLevel: 4,
    badgeType: 'DIAMOND',
    badgeText: 'Doanh nghiệp',
    isPopular: false,
    description: 'Giải pháp thương hiệu tuyển dụng toàn diện cấp doanh nghiệp.',
    inheritedFrom: 'Toàn bộ quyền lợi của Gói VIP Đẩy Tin',
    features: [
      '10 tin tuyển dụng hiển thị trên sàn',
      'Thời gian hiển thị tin 60 ngày',
      'Banner "Nhà Tuyển Dụng Nổi Bật" ở đầu trang Tìm việc (/jobs)',
      'Hiển thị Logo tại mục "Nhà tuyển dụng hàng đầu" Trang chủ',
      'Không giới hạn tài khoản HR phụ trong cùng doanh nghiệp',
    ],
  },
] as const;

export function resolvePackageTierTemplate(pkg: {
  tieuDe?: string | null;
  loaiQuangCao?: string | null;
  capDoUuTien?: number | null;
}): PackageTierTemplate {
  const level = pkg.capDoUuTien ?? 0;
  const code = (pkg.loaiQuangCao ?? '').toUpperCase().trim();
  const title = (pkg.tieuDe ?? '').toLowerCase();

  if (
    level >= 4 ||
    code === 'DIAMOND' ||
    title.includes('kim cương') ||
    title.includes('doanh nghiệp')
  ) {
    return PACKAGE_TIER_TEMPLATES[3];
  }
  if (
    level === 3 ||
    code === 'SUPER_HOT' ||
    code === 'PREMIUM' ||
    code === 'VIP' ||
    title.includes('vip')
  ) {
    return PACKAGE_TIER_TEMPLATES[2];
  }
  if (
    level === 2 ||
    code === 'HOT' ||
    code === 'TIÊU CHUẨN' ||
    title.includes('tiêu chuẩn') ||
    title.includes('nhanh')
  ) {
    return PACKAGE_TIER_TEMPLATES[1];
  }
  return PACKAGE_TIER_TEMPLATES[0];
}

export function normalizePromotionBadge(
  rawBadge?: string | null,
  priorityLevel?: number | null,
): JobPromotionBadge | null {
  const normalized = (rawBadge ?? '').toUpperCase().trim();
  if (
    normalized === 'DIAMOND' ||
    normalized === 'SUPER_HOT' ||
    normalized === 'HOT' ||
    normalized === 'HEADHUNT' ||
    normalized === 'BASIC'
  ) {
    return normalized;
  }

  const level = priorityLevel ?? 0;
  if (level >= 4) return 'DIAMOND';
  if (level === 3) return 'SUPER_HOT';
  if (level === 2) return 'HOT';
  if (level === 1) return 'BASIC';
  return null;
}

/**
 * Trích xuất tối đa `maxItems` dòng phúc lợi ngắn gọn từ HTML Rich Text
 * để hiển thị ở chân thẻ SUPER HOT mà không render HTML thô.
 */
export function extractJobHighlights(
  phucLoiHtml?: string | null,
  maxItems = 3,
): string[] {
  if (!phucLoiHtml || !phucLoiHtml.trim()) {
    return [];
  }

  const liMatches = Array.from(
    phucLoiHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi),
  )
    .map((m) =>
      m[1]
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter(Boolean);

  if (liMatches.length > 0) {
    return liMatches.slice(0, maxItems);
  }

  const plainLines = phucLoiHtml
    .replace(/<\/(p|div|br|li)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return plainLines.slice(0, maxItems);
}
