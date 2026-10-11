// Quy tắc các mục check_type = "url" (chỉ chấm ở chế độ Nhập URL): 9, 10, 18, 19, 25, 26, 27, 28, 29.
// Dữ liệu ngoài HTML (status, headers, robots.txt, PageSpeed, dung lượng ảnh) lấy từ c.extras do Worker trả về.
import type { CheckResult, Status } from './types';
import type { Ctx } from './rules';
import { fileName } from './extract';

const attr = (doc: Document, sel: string, name = 'content') => doc.querySelector(sel)?.getAttribute(name)?.trim() || '';

/** URL tuyệt đối từ href tương đối */
export function absUrl(href: string, base: string): string {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

/** Chuẩn hoá URL để so canonical: bỏ #, tham số utm_*, dấu / cuối, www, chữ hoa ở tên miền */
export function normUrl(u: string): string {
  try {
    const x = new URL(u);
    x.hash = '';
    for (const k of [...x.searchParams.keys()]) if (/^utm_/i.test(k)) x.searchParams.delete(k);
    const path = x.pathname.replace(/\/+$/, '') || '/';
    return `${x.protocol}//${x.hostname.replace(/^www\./, '').toLowerCase()}${path}${x.search}`;
  } catch {
    return u.trim().replace(/\/+$/, '');
  }
}

/** Đọc mọi khối JSON-LD: danh sách object (đã bung @graph và mảng) + số khối lỗi cú pháp */
export function readJsonLd(doc: Document): { nodes: any[]; errors: number } {
  const nodes: any[] = [];
  let errors = 0;
  const push = (v: any) => {
    if (Array.isArray(v)) v.forEach(push);
    else if (v && typeof v === 'object') {
      nodes.push(v);
      if (Array.isArray(v['@graph'])) v['@graph'].forEach(push);
    }
  };
  for (const s of Array.from(doc.querySelectorAll('script[type="application/ld+json"]'))) {
    try {
      push(JSON.parse(s.textContent || ''));
    } catch {
      errors++;
    }
  }
  return { nodes, errors };
}
const typesOf = (n: any): string[] => (Array.isArray(n['@type']) ? n['@type'] : n['@type'] ? [n['@type']] : []).map(String);
const ARTICLE = ['Article', 'BlogPosting', 'NewsArticle', 'TechArticle', 'Report'];

// ---------- Mục 9: canonical ----------
function r9(c: Ctx): CheckResult {
  const final = c.extras!.finalUrl;
  const raw = attr(c.doc, 'link[rel="canonical"]', 'href');
  if (!raw) return { id: 9, status: 'fail', measured: 'Không có thẻ canonical', details: ['Thêm <link rel="canonical" href="URL tuyệt đối của bài">.'] };
  const isAbs = /^https?:\/\//i.test(raw);
  const target = absUrl(raw, final);
  const same = normUrl(target) === normUrl(final);
  const details = [`Canonical: ${raw}`];
  if (!isAbs) details.push('Canonical đang là đường dẫn tương đối, nên dùng URL tuyệt đối (có https://).');
  if (!same) details.push(`Trỏ về URL khác với URL đang kiểm tra (${final}).`);
  return {
    id: 9,
    status: same && isAbs ? 'pass' : 'warn',
    measured: same ? (isAbs ? 'Canonical tự trỏ về chính URL này' : 'Canonical tương đối, trỏ về chính URL này') : 'Canonical trỏ về URL khác',
    details,
  };
}

// ---------- Mục 10: Open Graph ----------
function r10(c: Ctx): CheckResult {
  const tags = ['og:title', 'og:description', 'og:image'];
  const missing = tags.filter((t) => !attr(c.doc, `meta[property="${t}"]`) && !attr(c.doc, `meta[name="${t}"]`));
  const status: Status = missing.length === 0 ? 'pass' : missing.length === 1 ? 'warn' : 'fail';
  const details = missing.length ? [`Thiếu: ${missing.join(', ')}`] : [];
  const size = c.extras?.ogImageSize;
  if (size) details.push(`Ảnh chia sẻ ${size.width}×${size.height} px${size.width >= 1200 && size.height >= 600 ? '' : ' (khuyến nghị 1200×630)'}`);
  return { id: 10, status, measured: missing.length ? `Thiếu ${missing.length}/3 thẻ Open Graph` : 'Đủ og:title, og:description, og:image', details };
}

// ---------- Mục 18: tác giả ----------
function r18(c: Ctx): CheckResult {
  const doc = c.doc;
  let name = attr(doc, 'meta[name="author"]');
  let link = attr(doc, 'a[rel~="author"], link[rel~="author"]', 'href');
  const { nodes } = readJsonLd(doc);
  for (const n of nodes) {
    const a = Array.isArray(n.author) ? n.author[0] : n.author;
    if (!a) continue;
    if (typeof a === 'string') name ||= a;
    else {
      name ||= a.name || '';
      link ||= a.url || (typeof a['@id'] === 'string' && /^https?:/.test(a['@id']) ? a['@id'] : '');
    }
  }
  // Phần tử tác giả trên trang. Chọn: class "author" lấy chữ làm tên; class "byline" chỉ tính khi bên trong có
  // link (thường là link tên tác giả) — tránh nhận nhầm dòng "ngày đăng · phút đọc" là tên tác giả.
  const looksLikeDate = (t: string) => /\d{1,4}[\/.\-]\d{1,2}|\b(19|20)\d{2}\b|phút đọc|min read/i.test(t);
  for (const el of Array.from(doc.querySelectorAll('[rel~="author"], [class*="author"], [class*="byline"]'))) {
    const isByline = !/author/i.test(el.getAttribute('class') || '') && !/author/i.test(el.getAttribute('rel') || '');
    const a = el.tagName === 'A' ? el : el.querySelector('a[href]');
    const text = ((isByline ? a?.textContent : el.textContent) || '').replace(/\s+/g, ' ').trim();
    if (!text || text.length > 60 || looksLikeDate(text)) continue;
    name ||= text;
    link ||= a?.getAttribute('href') || '';
    if (name && link) break;
  }
  const status: Status = name && link ? 'pass' : name ? 'warn' : 'fail';
  return {
    id: 18,
    status,
    measured: name ? `Tác giả: ${name}${link ? ' (có link trang tác giả)' : ' (chưa có link trang tác giả)'}` : 'Không tìm thấy tác giả',
    details: link ? [`Trang tác giả: ${absUrl(link, c.extras!.finalUrl)}`] : [],
  };
}

// ---------- Mục 19: ngày đăng & cập nhật ----------
function r19(c: Ctx): CheckResult {
  const doc = c.doc;
  let pub = attr(doc, 'meta[property="article:published_time"]') || attr(doc, 'meta[itemprop="datePublished"]');
  let mod = attr(doc, 'meta[property="article:modified_time"]') || attr(doc, 'meta[itemprop="dateModified"]');
  for (const n of readJsonLd(doc).nodes) {
    pub ||= n.datePublished || '';
    mod ||= n.dateModified || '';
  }
  // Chọn: thẻ <time> đầu tiên = ngày đăng; có ≥2 ngày khác nhau thì coi ngày sau là ngày cập nhật
  const times = [...new Set(Array.from(doc.querySelectorAll('time[datetime]')).map((t) => t.getAttribute('datetime') || ''))].filter(Boolean);
  pub ||= times[0] || '';
  if (!mod && times.length > 1) mod = times[1];
  const status: Status = pub && mod ? 'pass' : pub || mod ? 'warn' : 'fail';
  const details = [pub && `Ngày đăng: ${pub}`, mod && `Ngày cập nhật: ${mod}`].filter(Boolean) as string[];
  return {
    id: 19,
    status,
    measured: status === 'pass' ? 'Có ngày đăng và ngày cập nhật' : status === 'warn' ? `Chỉ có ${pub ? 'ngày đăng' : 'ngày cập nhật'}` : 'Không tìm thấy ngày đăng/cập nhật',
    details,
  };
}

// ---------- Mục 25: ảnh nhẹ, tải nhanh ----------
function r25(c: Ctx): CheckResult {
  const imgs = c.x.images.filter((i) => i.src && !i.src.startsWith('data:'));
  if (!imgs.length) return { id: 25, status: 'na', measured: 'Bài không có ảnh', details: [] };
  // Chọn cách gộp: lỗi NẶNG = ảnh đầu bài bị lazy-load hoặc ảnh >200 KB; lỗi NHẸ = jpg/png, thiếu width/height, ảnh sau không lazy.
  let heavy = 0;
  let light = 0;
  const details: string[] = [];
  imgs.forEach((img, i) => {
    const src = absUrl(img.src, c.extras!.finalUrl);
    const name = fileName(src).slice(0, 40);
    const ext = (name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase();
    const bytes = c.extras?.imageBytes?.[src];
    const hv: string[] = [];
    const lt: string[] = [];
    if (i === 0 && img.loading === 'lazy') hv.push('ảnh đầu bài không nên lazy-load');
    if (bytes && bytes > 200 * 1024) hv.push(`nặng ${Math.round(bytes / 1024)} KB`);
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) lt.push(`định dạng ${ext.toUpperCase()} (nên WebP/AVIF)`);
    if (!img.width || !img.height) lt.push('thiếu width/height');
    if (i > 0 && img.loading !== 'lazy') lt.push('nên thêm loading="lazy"');
    if (hv.length) heavy++;
    else if (lt.length) light++;
    if (hv.length || lt.length) details.push(`Ảnh ${i + 1} (${name}): ${[...hv, ...lt].join(', ')}`);
  });
  const status: Status = heavy === 0 ? (light / imgs.length > 0.5 ? 'warn' : 'pass') : heavy / imgs.length <= 0.25 ? 'warn' : 'fail';
  return { id: 25, status, measured: `${imgs.length} ảnh: ${heavy} lỗi nặng, ${light} cần tối ưu thêm`, details };
}

/** robots.txt có chặn path này với Googlebot (hoặc *) không — luật khớp dài nhất, Allow thắng khi bằng nhau */
export function robotsBlocks(robots: string, path: string): boolean {
  const groups: { agents: string[]; rules: { allow: boolean; pat: string }[] }[] = [];
  let cur: (typeof groups)[number] | null = null;
  let lastWasAgent = false;
  for (const line of robots.split(/\r?\n/)) {
    const m = line.replace(/#.*/, '').trim().match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase();
    const val = m[2].trim();
    if (key === 'user-agent') {
      if (!cur || !lastWasAgent) groups.push((cur = { agents: [], rules: [] }));
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (cur && (key === 'allow' || key === 'disallow') && val) cur.rules.push({ allow: key === 'allow', pat: val });
    }
  }
  const group = groups.find((g) => g.agents.some((a) => a.includes('googlebot'))) || groups.find((g) => g.agents.includes('*'));
  if (!group) return false;
  let best: { allow: boolean; len: number } | null = null;
  for (const r of group.rules) {
    const re = new RegExp('^' + r.pat.replace(/[.+?^{}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*').replace(/\\\$$|\$$/, '$'));
    if (re.test(path) && (!best || r.pat.length > best.len || (r.pat.length === best.len && r.allow))) best = { allow: r.allow, len: r.pat.length };
  }
  return !!best && !best.allow;
}

// ---------- Mục 26: được phép lập chỉ mục ----------
function r26(c: Ctx): CheckResult {
  const e = c.extras!;
  const fail: string[] = [];
  const warn: string[] = [];
  if (e.status !== 200) fail.push(`Mã phản hồi ${e.status} (cần 200).`);
  const robotsMeta = `${attr(c.doc, 'meta[name="robots"]')} ${attr(c.doc, 'meta[name="googlebot"]')}`.toLowerCase();
  if (robotsMeta.includes('noindex')) fail.push('Có thẻ meta robots “noindex”.');
  if ((e.headers['x-robots-tag'] || '').toLowerCase().includes('noindex')) fail.push('Header X-Robots-Tag có “noindex”.');
  let path = '/';
  try {
    const u = new URL(e.finalUrl);
    path = u.pathname + u.search;
    if (u.protocol !== 'https:') warn.push('Trang chưa dùng HTTPS.');
  } catch {}
  if (e.robotsTxt && robotsBlocks(e.robotsTxt, path)) fail.push('robots.txt đang chặn (Disallow) đường dẫn này.');
  if (e.sitemapHasUrl === false) warn.push('Không thấy URL trong sitemap.xml (hoặc website chưa có sitemap).');
  const status: Status = fail.length ? 'fail' : warn.length ? 'warn' : 'pass';
  return {
    id: 26,
    status,
    measured: fail.length ? 'Google có thể không lập chỉ mục trang này' : `Mã ${e.status}, không bị chặn lập chỉ mục`,
    details: [...fail, ...warn],
  };
}

// ---------- Mục 27: thân thiện điện thoại ----------
function r27(c: Ctx): CheckResult {
  const vp = attr(c.doc, 'meta[name="viewport"]');
  const ok = /width\s*=\s*device-width/i.test(vp);
  const details = vp ? [`viewport: ${vp}`] : ['Thiếu <meta name="viewport" content="width=device-width, initial-scale=1">.'];
  const perf = c.extras?.pagespeed?.performanceScore;
  if (perf != null) details.push(`Điểm hiệu năng PageSpeed (di động): ${Math.round(perf * 100)}/100`);
  return { id: 27, status: ok ? 'pass' : 'fail', measured: ok ? 'Có meta viewport responsive' : 'Thiếu meta viewport responsive', details };
}

// ---------- Mục 28: Core Web Vitals ----------
function r28(c: Ctx): CheckResult {
  const e = c.extras!;
  const p = e.pagespeed;
  if (!p) {
    const pending = e.pagespeed === undefined && !e.pagespeedError;
    return {
      id: 28,
      status: 'na',
      measured: pending ? 'Đang đo bằng PageSpeed Insights…' : 'Không đo được (không tính điểm mục này)',
      details: e.pagespeedError ? [e.pagespeedError] : [],
    };
  }
  const bad: string[] = [];
  const parts: string[] = [];
  if (p.lcpMs != null) {
    parts.push(`LCP ${(p.lcpMs / 1000).toFixed(1).replace('.', ',')} s`);
    if (p.lcpMs > 2500) bad.push('LCP > 2,5 s');
  }
  const inter = p.source === 'field' ? p.inpMs : p.tbtMs;
  if (inter != null) {
    parts.push(`${p.source === 'field' ? 'INP' : 'TBT'} ${Math.round(inter)} ms`);
    if (inter > 200) bad.push(`${p.source === 'field' ? 'INP' : 'TBT'} > 200 ms`);
  }
  if (p.cls != null) {
    parts.push(`CLS ${p.cls.toFixed(2).replace('.', ',')}`);
    if (p.cls > 0.1) bad.push('CLS > 0,1');
  }
  const status: Status = bad.length === 0 ? 'pass' : bad.length === 1 ? 'warn' : 'fail';
  const details = [p.source === 'field' ? 'Dữ liệu người dùng thật (Chrome UX Report).' : 'Số đo mô phỏng (trang chưa đủ lượt truy cập để có dữ liệu thật; TBT thay cho INP).'];
  if (bad.length) details.push(`Chưa tốt: ${bad.join(', ')}`);
  return { id: 28, status, measured: parts.join(' · ') || 'Không có số liệu', details };
}

// ---------- Mục 29: schema ----------
function r29(c: Ctx): CheckResult {
  const { nodes, errors } = readJsonLd(c.doc);
  const types = [...new Set(nodes.flatMap(typesOf))];
  const details: string[] = [];
  if (types.length) details.push(`Tìm thấy: ${types.join(', ')}`);
  if (errors) details.push(`${errors} khối JSON-LD lỗi cú pháp.`);
  if (types.some((t) => t === 'FAQPage' || t === 'HowTo')) details.push('Lưu ý: Google đã ngừng hiển thị kết quả đặc biệt cho FAQPage/HowTo.');
  const good = nodes.some(
    (n) => (typesOf(n).some((t) => ARTICLE.includes(t)) && n.headline) || (typesOf(n).includes('Product') && n.name),
  );
  const status: Status = errors ? 'fail' : good ? 'pass' : types.length ? 'warn' : 'fail';
  return {
    id: 29,
    status,
    measured: good ? 'Có schema Article/Product hợp lệ' : types.length ? 'Chỉ có schema khác, chưa có Article/Product' : 'Không có dữ liệu có cấu trúc',
    details,
  };
}

export const URL_RULES: Record<number, (c: Ctx) => CheckResult> = {
  9: r9,
  10: r10,
  18: r18,
  19: r19,
  25: r25,
  26: r26,
  27: r27,
  28: r28,
  29: r29,
};
