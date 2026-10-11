// Quy tắc chấm từng mục, theo `auto_rule` trong src/data/seo-checklist-30.json.
// Mỗi hàm nhận dữ liệu đã trích (Ctx) và trả CheckResult. Chỗ quy tắc chưa rõ có ghi chú "Chọn:".
import type { AnalyzeInput, CheckResult, Checklist, ChecklistItem, Status } from './types';
import { extract, fileName, hostOf, linkKind, type Extracted } from './extract';
import {
  charLength,
  containsKeyword,
  containsKeywordPart,
  countKeyword,
  countWords,
  normalize,
  plain,
  removeDiacritics,
  slugify,
} from './text';

export interface Ctx extends AnalyzeInput {
  x: Extracted;
  kw: string;
}

/** Hạ 1 bậc: pass → warn → fail */
export const down = (s: Status): Status => (s === 'pass' ? 'warn' : s === 'warn' ? 'fail' : s);

const fmt = (n: number) => n.toLocaleString('vi-VN');
const quote = (s: string, max = 70) => `“${s.length > max ? s.slice(0, max - 1) + '…' : s}”`;

/** H1 dùng để chấm: H1 trong nội dung; chế độ dán mà không có H1 thì lấy ô Title (theo quy tắc mục 11) */
function effectiveH1(c: Ctx): { text: string; fromTitle: boolean } | null {
  if (c.x.h1s.length) return { text: c.x.h1s[0], fromTitle: false };
  if (c.mode === 'paste' && c.meta.title.trim()) return { text: c.meta.title.trim(), fromTitle: true };
  return null;
}

/** Slug = phần path cuối của URL/slug người dùng nhập (hoặc URL cuối ở chế độ URL) */
export function slugInfo(raw: string): { slug: string; query: string } {
  const t = raw.trim();
  if (!t) return { slug: '', query: '' };
  let path = t;
  let query = '';
  try {
    const u = new URL(/^[a-z]+:\/\//i.test(t) ? t : `https://x.invalid/${t.replace(/^\/+/, '')}`);
    path = decodeURIComponent(u.pathname);
    query = u.search;
  } catch {
    const [p, q = ''] = t.split('?');
    path = p;
    query = q ? `?${q}` : '';
  }
  const slug = path.replace(/\/+$/, '').split('/').pop() || '';
  return { slug: slug.replace(/\.(html?|php|aspx?)$/i, ''), query };
}

// ---------- Mục 4: từ khoá ở các vị trí quan trọng ----------
function r4(c: Ctx): CheckResult {
  const { kw, x } = c;
  const h1 = effectiveH1(c);
  const first100 = x.bodyText.split(/\s+/).slice(0, 100).join(' ');
  const { slug } = slugInfo(c.extras?.finalUrl || c.meta.url);
  const spots: [string, boolean][] = [
    ['Title', containsKeyword(c.meta.title, kw)],
    [h1?.fromTitle ? 'H1 (lấy từ ô Title)' : 'H1', !!h1 && containsKeyword(h1.text, kw)],
    ['URL/slug', !!slug && removeDiacritics(slug.toLowerCase()).includes(slugify(kw))],
    ['100 chữ đầu thân bài', containsKeyword(first100, kw)],
    ['Ít nhất 1 H2', x.headings.some((h) => h.level === 2 && containsKeyword(h.text, kw))],
    ['Alt của ít nhất 1 ảnh', x.images.some((i) => !!i.alt && containsKeyword(i.alt, kw))],
  ];
  const have = spots.filter(([, ok]) => ok).length;
  let status: Status = have >= 5 ? 'pass' : have >= 3 ? 'warn' : 'fail';
  const details = spots.map(([name, ok]) => `${ok ? '✓' : '✗'} ${name}`);
  // Nhồi từ khoá: số chữ thuộc cụm từ khoá / tổng số chữ > 3%
  const kwWords = countWords(plain(kw));
  const density = x.words ? (countKeyword(x.text, kw) * kwWords) / x.words : 0;
  if (density > 0.03) {
    status = down(status);
    details.push(`⚠ Cụm từ khoá chiếm ${(density * 100).toFixed(1)}% tổng số chữ (>3%): có dấu hiệu nhồi từ khoá.`);
  }
  return { id: 4, status, measured: `Có từ khoá ở ${have}/6 vị trí`, details };
}

// ---------- Mục 6: thẻ title ----------
function r6(c: Ctx): CheckResult {
  const t = c.meta.title.trim();
  if (!t) return { id: 6, status: 'fail', measured: 'Chưa có title', details: ['Nhập Title SEO để chấm mục này.'] };
  const len = charLength(t);
  let status: Status = len >= 30 && len <= 60 ? 'pass' : (len >= 61 && len <= 70) || (len >= 20 && len <= 29) ? 'warn' : 'fail';
  const details: string[] = [];
  const hasKw = containsKeyword(t, c.kw);
  if (!hasKw) {
    status = down(status);
    details.push('Title chưa chứa từ khoá chính.');
  } else {
    // Từ khoá nằm trong nửa đầu title
    const pos = ` ${plain(t)} `.indexOf(` ${plain(c.kw)} `);
    if (pos >= 0 && pos <= plain(t).length / 2) details.push('Tốt: từ khoá nằm ở nửa đầu title.');
    else details.push('Gợi ý: đưa từ khoá lên nửa đầu title.');
  }
  // Một từ lặp >2 lần (bỏ từ 1 ký tự và dấu ngăn cách)
  const counts = new Map<string, number>();
  for (const w of normalize(t).split(' ')) if (w.length > 1) counts.set(w, (counts.get(w) || 0) + 1);
  const rep = [...counts].filter(([, n]) => n > 2).map(([w, n]) => `“${w}” ×${n}`);
  if (rep.length) details.push(`⚠ Từ lặp nhiều lần: ${rep.join(', ')}.`);
  if (len < 30) details.push('Title hơi ngắn: thêm lợi ích, con số hoặc tên thương hiệu.');
  if (len > 60) details.push(`Google thường cắt title sau khoảng 60 ký tự: ${quote(t.slice(0, 60), 80)}`);
  return { id: 6, status, measured: `Title ${len} ký tự${hasKw ? ', chứa từ khoá' : ', thiếu từ khoá'}`, details };
}

// ---------- Mục 7: meta description ----------
function r7(c: Ctx): CheckResult {
  const d = c.meta.metaDescription.trim();
  if (!d) return { id: 7, status: 'fail', measured: 'Chưa có meta description', details: ['Nhập Meta description để chấm mục này.'] };
  const len = charLength(d);
  let status: Status =
    len >= 120 && len <= 160 ? 'pass' : (len >= 70 && len <= 119) || (len >= 161 && len <= 180) ? 'warn' : 'fail';
  const details: string[] = [];
  const hasKw = containsKeyword(d, c.kw);
  if (!hasKw) {
    status = down(status);
    details.push('Meta description chưa chứa từ khoá chính.');
  }
  if (normalize(d) === normalize(c.meta.title)) {
    status = 'fail';
    details.push('Meta description trùng y hệt title.');
  }
  if (len < 120) details.push('Hơi ngắn: thêm lợi ích chính và lời kêu gọi hành động.');
  if (len > 160) details.push('Hơi dài: Google có thể cắt bớt phần cuối.');
  return { id: 7, status, measured: `Meta description ${len} ký tự${hasKw ? ', chứa từ khoá' : ', thiếu từ khoá'}`, details };
}

// ---------- Mục 8: URL/slug ----------
function r8(c: Ctx): CheckResult {
  const raw = c.extras?.finalUrl || c.meta.url;
  const { slug, query } = slugInfo(raw);
  const suggest = slugify(c.kw);
  const tip = suggest ? `Gợi ý slug: ${suggest}` : '';
  if (!raw.trim()) return { id: 8, status: 'fail', measured: 'Chưa nhập URL/slug', details: [tip].filter(Boolean) };

  if (!slug) return { id: 8, status: 'fail', measured: 'URL chưa có slug (chỉ có tên miền)', details: [tip].filter(Boolean) };
  const isId = /(^|[?&])(p|id|page_id)=\d+/i.test(query) || /^\d+$/.test(slug);
  const accented = slug !== removeDiacritics(slug) || /[^\x00-\x7f]/.test(slug);
  const underscore = slug.includes('_');
  const space = /\s/.test(slug);
  const upper = slug !== slug.toLowerCase();
  const words = slug.split('-').filter(Boolean).length;
  const hasKw = !!suggest && removeDiacritics(slug.toLowerCase()).includes(suggest);

  const details: string[] = [];
  let status: Status = 'pass';
  if (isId) details.push('URL dạng mã số/ID (vd ?p=123), không mô tả nội dung.');
  if (accented) details.push('Slug có dấu tiếng Việt.');
  if (underscore) details.push('Slug dùng dấu gạch dưới “_”, nên dùng gạch ngang “-”.');
  if (space) details.push('Slug có khoảng trắng.');
  if (!isId && words > 8) details.push(`Slug dài ${words} từ (nên 3–6 từ).`);
  if (isId || accented || underscore || space || words > 8) status = 'fail';
  else {
    if (words >= 7) details.push(`Slug ${words} từ, hơi dài (nên 3–6 từ).`);
    if (words < 3) details.push(`Slug chỉ ${words} từ (nên 3–6 từ).`);
    if (upper) details.push('Slug có chữ hoa, nên viết thường toàn bộ.');
    if (!/^[a-zA-Z0-9-]+$/.test(slug)) details.push('Slug có ký tự ngoài a-z, 0-9 và “-”.');
    if (!hasKw) details.push('Slug chưa chứa từ khoá (bản không dấu).');
    if (words >= 7 || words < 3 || upper || !hasKw || !/^[a-zA-Z0-9-]+$/.test(slug)) status = 'warn';
  }
  if (status !== 'pass' && tip) details.push(tip);
  return {
    id: 8,
    status,
    measured: isId ? `URL dạng ID: ${quote(slug + query, 50)}` : `Slug “${slug}”: ${words} từ${hasKw ? ', chứa từ khoá' : ''}`,
    details,
  };
}

// ---------- Mục 11: một H1 ----------
function r11(c: Ctx): CheckResult {
  const { h1s } = c.x;
  if (h1s.length === 1) {
    const ok = containsKeyword(h1s[0], c.kw);
    return {
      id: 11,
      status: ok ? 'pass' : 'warn',
      measured: `1 H1${ok ? ', chứa từ khoá' : ', chưa chứa từ khoá'}`,
      details: [`H1: ${quote(h1s[0], 100)}`],
    };
  }
  if (h1s.length === 0 && c.mode === 'paste' && c.meta.title.trim()) {
    const ok = containsKeyword(c.meta.title, c.kw);
    return {
      id: 11,
      status: ok ? 'pass' : 'warn',
      measured: `Nội dung chưa có H1: dùng ô Title làm H1${ok ? ', chứa từ khoá' : ''}`,
      details: ['Khi đăng, đảm bảo theme hiển thị tên bài là H1 duy nhất.'],
    };
  }
  return {
    id: 11,
    status: 'fail',
    measured: h1s.length ? `${h1s.length} thẻ H1 (cần đúng 1)` : 'Không có H1',
    details: h1s.map((h, i) => `H1 #${i + 1}: ${quote(h, 90)}`),
  };
}

// ---------- Mục 12: H2–H3 phân cấp ----------
function r12(c: Ctx): CheckResult {
  const { headings, words } = c.x;
  const h2 = headings.filter((h) => h.level === 2);
  const misses: string[] = [];
  if (words > 600 && h2.length < 2) misses.push(`Bài ${fmt(words)} chữ nhưng chỉ có ${h2.length} H2 (cần ≥2).`);
  // Nhảy cấp: so với heading liền trước (bắt đầu từ cấp 1)
  let prev = 1;
  const jumps: string[] = [];
  for (const h of headings) {
    if (h.level > prev + 1) jumps.push(`H${prev} → H${h.level} ở ${quote(h.text, 50)}`);
    prev = h.level;
  }
  if (jumps.length) misses.push(`Nhảy cấp heading: ${jumps.slice(0, 3).join('; ')}${jumps.length > 3 ? '…' : ''}`);
  if (!h2.some((h) => containsKeywordPart(h.text, c.kw))) misses.push('Chưa có H2 nào chứa từ khoá hoặc một phần từ khoá.');
  const status: Status = misses.length === 0 ? 'pass' : misses.length === 1 ? 'warn' : 'fail';
  const outline = headings
    .filter((h) => h.level >= 2)
    .map((h) => `${'   '.repeat(Math.max(0, h.level - 2))}H${h.level} ${h.text}`);
  return {
    id: 12,
    status,
    measured: `${h2.length} H2, ${headings.filter((h) => h.level === 3).length} H3`,
    details: [...misses, ...(outline.length ? ['Dàn ý heading:', ...outline] : ['Bài chưa có heading H2/H3.'])],
  };
}

// ---------- Mục 14: dễ đọc ----------
function r14(c: Ctx): CheckResult {
  const counts = c.x.paragraphs.map(countWords).filter((n) => n > 0);
  const n = counts.length || 1;
  const avg = counts.reduce((a, b) => a + b, 0) / n;
  const long = counts.filter((w) => w > 100).length;
  const longPct = long / n;
  const misses: string[] = [];
  if (avg > 70) misses.push(`Đoạn văn trung bình ${Math.round(avg)} chữ (nên ≤70).`);
  if (longPct > 0.1) misses.push(`${long}/${counts.length} đoạn dài hơn 100 chữ (nên ≤10%).`);
  if (c.x.words > 800 && !c.x.hasListOrTable) misses.push('Bài trên 800 chữ nhưng chưa có danh sách (bullet/đánh số) hoặc bảng.');
  const status: Status = misses.length === 0 ? 'pass' : misses.length === 1 ? 'warn' : 'fail';
  return {
    id: 14,
    status,
    measured: `${counts.length} đoạn, trung bình ${Math.round(avg)} chữ/đoạn${c.x.hasListOrTable ? ', có danh sách/bảng' : ''}`,
    details: misses,
  };
}

// ---------- Mục 15: mục lục cho bài dài ----------
function r15(c: Ctx): CheckResult {
  const h2 = c.x.headings.filter((h) => h.level === 2).length;
  if (c.x.words <= 1500 && h2 < 5)
    return { id: 15, status: 'na', measured: `Bài ${fmt(c.x.words)} chữ, ${h2} H2: chưa cần mục lục`, details: [] };
  const root = c.x.root;
  const byName = Array.from(root.querySelectorAll('[class],[id]')).some((el) =>
    /toc|muc-luc|mucluc|table-of-contents/i.test(`${el.getAttribute('class') || ''} ${el.getAttribute('id') || ''}`),
  );
  const ids = new Set(c.x.headings.map((h) => h.id).filter(Boolean));
  const anchors = c.x.links.filter((l) => l.href.startsWith('#') && ids.has(decodeURIComponent(l.href.slice(1)))).length;
  const ok = byName || anchors >= 3;
  return {
    id: 15,
    status: ok ? 'pass' : 'fail',
    measured: ok ? 'Có mục lục' : `Bài ${fmt(c.x.words)} chữ, ${h2} H2 nhưng chưa có mục lục`,
    details: ok ? [] : ['Thêm mục lục có liên kết neo (#) tới từng H2, đặt ngay sau đoạn mở bài.'],
  };
}

// ---------- Mục 21: liên kết nội bộ ----------
const GENERIC_ANCHORS = ['tại đây', 'bấm vào đây', 'xem tại đây', 'xem thêm', 'click here', 'here', 'link', 'nhấn vào đây', 'click vào đây'];
function r21(c: Ctx): CheckResult {
  const domain = c.meta.domain || (c.extras ? hostOf(c.extras.finalUrl) : '');
  const internal = c.x.links.filter((l) => linkKind(l.href, domain) === 'internal');
  const n = internal.length;
  let status: Status = n >= 3 ? 'pass' : n >= 1 ? 'warn' : 'fail';
  const details: string[] = [];
  if (!domain) details.push('Chưa nhập tên miền: chỉ đếm được link tương đối (bắt đầu bằng “/”).');
  const generic = internal.filter((l) => {
    const t = normalize(l.text);
    return !t || GENERIC_ANCHORS.includes(t) || /^(https?:\/\/|www\.)/i.test(l.text.trim());
  });
  if (generic.length) {
    status = down(status);
    details.push(`Anchor text chung chung (${generic.length}): ${generic.slice(0, 5).map((l) => quote(l.text || l.href, 40)).join(', ')}`);
  }
  for (const l of internal.slice(0, 8)) details.push(`→ ${quote(l.text || '(không có chữ)', 50)} · ${l.href}`);
  return { id: 21, status, measured: `${n} link nội bộ`, details };
}

// ---------- Mục 23: liên kết ra ngoài ----------
function r23(c: Ctx): CheckResult {
  const domain = c.meta.domain || (c.extras ? hostOf(c.extras.finalUrl) : '');
  const ext = c.x.links.filter((l) => linkKind(l.href, domain) === 'external');
  const details = ext.slice(0, 20).map((l) => {
    const code = c.extras?.linkStatus?.[l.href];
    const st = code === undefined ? '' : code >= 400 || code === 0 ? ` · ❌ lỗi ${code || 'không kết nối'}` : ` · ${code}`;
    return `${l.href}${l.rel ? ` (rel="${l.rel}")` : ''}${st}`;
  });
  const broken = ext.filter((l) => {
    const code = c.extras?.linkStatus?.[l.href];
    return code !== undefined && (code >= 400 || code === 0);
  });
  let status: Status;
  let measured: string;
  if (broken.length) {
    status = 'fail';
    measured = `${ext.length} link ra ngoài, ${broken.length} link lỗi`;
  } else if (!ext.length) {
    status = 'warn';
    measured = 'Chưa có link ra ngoài';
    details.push('Gợi ý: dẫn link tới nguồn gốc số liệu, nghiên cứu, cơ quan chính thức.');
  } else {
    status = 'pass';
    measured = `${ext.length} link ra ngoài${c.mode === 'paste' ? ' (chế độ dán chưa kiểm link hỏng)' : ''}`;
  }
  details.push('Nhắc: link affiliate/tài trợ cần rel="sponsored" (công cụ không tự nhận biết được).');
  return { id: 23, status, measured, details };
}

// ---------- Mục 24: ảnh — tên file, alt ----------
const GENERIC_FILE = /^(img|image|dsc|dcim|screenshot|screen shot|ảnh|anh|photo|picture|untitled)[\s_-]?\d*|^\d+$/i;
function r24(c: Ctx): CheckResult {
  const imgs = c.x.images.filter((i) => i.src);
  if (!imgs.length) return { id: 24, status: 'na', measured: 'Bài không có ảnh', details: [] };
  const details: string[] = [];
  let bad = 0;
  imgs.forEach((img, i) => {
    const problems: string[] = [];
    const alt = (img.alt || '').trim();
    if (!alt) problems.push('thiếu alt');
    else if (charLength(alt) > 125) problems.push(`alt dài ${charLength(alt)} ký tự (>125)`);
    const file = fileName(img.src);
    const base = file.replace(/\.[a-z0-9]+$/i, '');
    const isData = img.src.startsWith('data:');
    if (!isData && base) {
      if (GENERIC_FILE.test(base)) problems.push(`tên file chung chung “${file}”`);
      else if (base !== removeDiacritics(base) || /\s|_|%20/.test(base)) problems.push(`tên file có dấu/khoảng trắng/“_”: “${file}”`);
    }
    if (problems.length) {
      bad++;
      details.push(`Ảnh ${i + 1}${isData ? '' : ` (${file.slice(0, 40)})`}: ${problems.join(', ')}`);
    }
  });
  const pct = bad / imgs.length;
  const status: Status = bad === 0 ? 'pass' : pct <= 0.25 ? 'warn' : 'fail';
  if (c.mode === 'paste' && imgs.some((i) => i.src.startsWith('data:') || /googleusercontent/.test(i.src)))
    details.push('Lưu ý: ảnh dán từ Google Docs chưa có tên file thật. Hãy đặt tên file mô tả khi tải ảnh lên website.');
  return { id: 24, status, measured: `${imgs.length} ảnh, ${bad} ảnh cần sửa`, details };
}

/** Các mục chấm tự động ở chế độ dán (check_type = "paste") */
export const PASTE_RULES: Record<number, (c: Ctx) => CheckResult> = {
  4: r4,
  6: r6,
  7: r7,
  8: r8,
  11: r11,
  12: r12,
  14: r14,
  15: r15,
  21: r21,
  23: r23,
  24: r24,
};

/** Các mục chỉ chấm ở chế độ URL (check_type = "url") — Bước B bổ sung */
export const URL_RULES: Record<number, (c: Ctx) => CheckResult> = {};

// ---------- Mục tự tick: lý do + thông tin tham khảo + nút hỗ trợ ----------
function manual(item: ChecklistItem, c: Ctx): CheckResult {
  const r: CheckResult = { id: item.id, status: 'manual', measured: '', details: [] };
  if (item.check_type === 'self') r.manualReason = 'Công cụ không đọc được việc này từ nội dung bài, bạn tự kiểm tra rồi tick.';
  if (item.check_type === 'ai') {
    r.manualReason = 'Cần hiểu nội dung như người đọc, công cụ chưa tự chấm được.';
    r.aiSoon = true;
  }
  if (item.check_type === 'url') r.manualReason = 'Cần tải trang thật để đo. Dùng chế độ “Nhập URL” để chấm tự động mục này.';

  const q = encodeURIComponent;
  const domain = hostOf(c.meta.domain || c.extras?.finalUrl || '');
  if (item.id === 1 && c.kw)
    r.links = [{ label: 'Kiểm tra trùng từ khoá trên Google', href: `https://www.google.com/search?q=${q(`${domain ? `site:${domain} ` : ''}"${c.kw}"`)}` }];
  if ((item.id === 2 || item.id === 3) && c.kw)
    r.links = [{ label: 'Xem kết quả Google cho từ khoá', href: `https://www.google.com/search?q=${q(c.kw)}` }];
  if (item.id === 22 && c.kw && domain)
    r.links = [{ label: 'Tìm bài cũ liên quan để chèn link', href: `https://www.google.com/search?q=${q(`site:${domain} ${c.kw}`)}` }];
  if (item.id === 30) r.links = [{ label: 'Mở Google Search Console', href: 'https://search.google.com/search-console' }];
  if (item.id === 13) {
    const first = c.x.paragraphs.find((p) => countWords(p) >= 5) || '';
    const w = countWords(first);
    r.measured = first ? `Đoạn mở bài ${w} chữ${containsKeyword(first, c.kw) ? ', có từ khoá' : ', chưa có từ khoá'} (khuyến nghị 40–60 chữ)` : 'Chưa tìm thấy đoạn mở bài';
  }
  if (item.id === 17) r.measured = `Bài ${fmt(c.x.words)} chữ (chỉ để tham khảo: độ dài không phải yếu tố xếp hạng)`;
  return r;
}

/** Chấm toàn bộ 30 mục theo chế độ hiện tại */
export function analyze(input: AnalyzeInput, checklist: Checklist): CheckResult[] {
  const c: Ctx = { ...input, x: extract(input.doc, input.mode), kw: input.meta.keyword.trim() };
  return checklist.items.map((item) => {
    const auto =
      item.check_type === 'paste' ? PASTE_RULES[item.id] : item.check_type === 'url' && input.mode === 'url' ? URL_RULES[item.id] : undefined;
    return auto ? auto(c) : manual(item, c);
  });
}
