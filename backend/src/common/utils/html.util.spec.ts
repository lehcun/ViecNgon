import { stripHtmlTags } from './html.util';

describe('stripHtmlTags', () => {
  it('loại bỏ thẻ HTML chuẩn và giữ văn bản thuần', () => {
    expect(stripHtmlTags('<p>Xin chào <strong>ViecNgon</strong></p>')).toBe(
      ' Xin chào  ViecNgon  ',
    );
  });

  it('hỗ trợ ký tự thay thế tùy chỉnh', () => {
    expect(stripHtmlTags('<div>A</div><span>B</span>', '')).toBe('AB');
  });

  it('xử lý thẻ < chưa đóng trong O(n) mà không treo (chống ReDoS)', () => {
    const malformed = `<${'<'.repeat(5000)}tag`;
    expect(stripHtmlTags(malformed)).toBe('');
  });

  it('trả nguyên chuỗi nếu không có thẻ HTML', () => {
    expect(stripHtmlTags('React TypeScript NodeJS')).toBe(
      'React TypeScript NodeJS',
    );
  });

  it('bỏ qua ký tự > đứng lẻ ngoài thẻ', () => {
    expect(stripHtmlTags('A > B <br/> C')).toBe('A > B   C');
  });
});
