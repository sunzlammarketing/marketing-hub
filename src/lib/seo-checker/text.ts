// Xử lý chữ tiếng Việt: bỏ dấu (cả đ → d), chuẩn hoá, đếm chữ, so khớp từ khoá.

/** Bỏ dấu tiếng Việt, gồm cả đ/Đ → d/D */
export function removeDiacritics(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

/** Chữ thường, gộp khoảng trắng, bỏ dấu câu ở biên từ */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Bản không dấu, chữ thường */
export function plain(s: string): string {
  return removeDiacritics(normalize(s));
}

/** Đếm chữ theo khoảng trắng */
export function countWords(s: string): number {
  const t = s.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Số ký tự hiển thị (tính đúng ký tự có dấu ghép) */
export function charLength(s: string): number {
  return [...s.normalize('NFC')].length;
}

/**
 * Văn bản có chứa từ khoá không — không phân biệt hoa/thường, khớp cả có dấu lẫn không dấu.
 * Khớp theo ranh giới từ để "da dầu" không khớp nhầm trong "da dầuxx".
 */
export function containsKeyword(text: string, keyword: string): boolean {
  const kw = normalize(keyword);
  if (!kw) return false;
  const t = ` ${normalize(text)} `;
  if (t.includes(` ${kw} `)) return true;
  return ` ${plain(text)} `.includes(` ${plain(keyword)} `);
}

/** Số lần cụm từ khoá xuất hiện (so bản không dấu) */
export function countKeyword(text: string, keyword: string): number {
  const kw = plain(keyword);
  if (!kw) return 0;
  const t = ` ${plain(text)} `;
  let n = 0;
  let i = t.indexOf(` ${kw} `);
  while (i !== -1) {
    n++;
    i = t.indexOf(` ${kw} `, i + kw.length + 1);
  }
  return n;
}

/**
 * Văn bản chứa "một phần" từ khoá: có ít nhất một nửa số từ của từ khoá (làm tròn lên, tối thiểu 2 từ
 * nếu từ khoá có ≥2 từ). Dùng cho tiêu chí H2 ở mục 12.
 */
export function containsKeywordPart(text: string, keyword: string): boolean {
  if (containsKeyword(text, keyword)) return true;
  const words = plain(keyword).split(' ').filter(Boolean);
  if (!words.length) return false;
  const need = Math.max(Math.min(2, words.length), Math.ceil(words.length / 2));
  const have = new Set(plain(text).split(' '));
  return words.filter((w) => have.has(w)).length >= need;
}

/** Sinh slug chuẩn từ từ khoá: không dấu, chữ thường, gạch ngang */
export function slugify(s: string): string {
  return plain(s).replace(/\s+/g, '-');
}
