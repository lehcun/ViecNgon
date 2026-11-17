/**
 * Loại bỏ thẻ HTML theo thuật toán tuyến tính O(n) để tránh regex backtracking (ReDoS).
 */
export function stripHtmlTags(input: string, replacement = ' '): string {
  let result = '';
  let insideTag = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === '<') {
      insideTag = true;
      continue;
    }
    if (ch === '>' && insideTag) {
      insideTag = false;
      result += replacement;
      continue;
    }
    if (!insideTag) {
      result += ch;
    }
  }

  return result;
}
