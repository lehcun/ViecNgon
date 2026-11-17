import {
  extractJobHighlights,
  normalizePromotionBadge,
  resolvePackageTierTemplate,
} from './package-tiers.util';

describe('package-tiers.util', () => {
  describe('resolvePackageTierTemplate', () => {
    it('trả về gói DIAMOND khi capDoUuTien >= 4 hoặc tên chứa kim cương', () => {
      expect(resolvePackageTierTemplate({ capDoUuTien: 4 }).key).toBe('DIAMOND');
      expect(
        resolvePackageTierTemplate({ tieuDe: 'Gói Kim Cương Doanh nghiệp' }).key,
      ).toBe('DIAMOND');
    });

    it('trả về gói VIP, STANDARD, BASIC theo đúng thứ tự ưu tiên', () => {
      expect(resolvePackageTierTemplate({ loaiQuangCao: 'SUPER_HOT' }).key).toBe(
        'VIP',
      );
      expect(resolvePackageTierTemplate({ capDoUuTien: 2 }).key).toBe(
        'STANDARD',
      );
      expect(resolvePackageTierTemplate({ capDoUuTien: 1 }).key).toBe('BASIC');
    });
  });

  describe('normalizePromotionBadge', () => {
    it('chuẩn hóa badge hợp lệ và fallback theo priorityLevel', () => {
      expect(normalizePromotionBadge(' diamond ')).toBe('DIAMOND');
      expect(normalizePromotionBadge(null, 4)).toBe('DIAMOND');
      expect(normalizePromotionBadge(null, 3)).toBe('SUPER_HOT');
      expect(normalizePromotionBadge(null, 2)).toBe('HOT');
      expect(normalizePromotionBadge(null, 1)).toBe('BASIC');
      expect(normalizePromotionBadge(null, 0)).toBeNull();
    });
  });

  describe('extractJobHighlights', () => {
    it('trả về mảng rỗng khi input rỗng hoặc null', () => {
      expect(extractJobHighlights(null)).toEqual([]);
      expect(extractJobHighlights('   ')).toEqual([]);
    });

    it('trích xuất tối đa maxItems mục từ thẻ <li> và decode khoảng trắng', () => {
      const html =
        '<ul><li><b>Lương</b>&nbsp;tháng 13</li><li>Bảo hiểm &amp; khám sức khỏe</li><li>Laptop MacBook</li><li>Dòng thứ 4</li></ul>';
      expect(extractJobHighlights(html, 3)).toEqual([
        'Lương tháng 13',
        'Bảo hiểm & khám sức khỏe',
        'Laptop MacBook',
      ]);
    });

    it('fallback tách dòng từ thẻ <p>/<br> khi không có <li>', () => {
      const html =
        '<p>Thưởng quý &amp; KPI</p><p>Làm việc&nbsp;Hybrid</p><p>Du lịch năm</p>';
      expect(extractJobHighlights(html, 2)).toEqual([
        'Thưởng quý & KPI',
        'Làm việc Hybrid',
      ]);
    });
  });
});
