// Trích dữ liệu từ Document: vùng nội dung chính, heading, đoạn văn, link, ảnh, thẻ meta.
// Chỉ dùng API DOM chuẩn (childNodes, querySelectorAll...) để chạy được cả trên trình duyệt
// lẫn linkedom (test / server sau này).
import type { Mode } from './types';
import { countWords } from './text';

const BLOCK = new Set([
  'ADDRESS', 'ARTICLE', 'ASIDE', 'BLOCKQUOTE', 'BR', 'DD', 'DIV', 'DL', 'DT', 'FIGCAPTION', 'FIGURE',
  'FOOTER', 'FORM', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'HEADER', 'HR', 'LI', 'MAIN', 'NAV', 'OL',
  'P', 'PRE', 'SECTION', 'TABLE', 'TD', 'TH', 'TR', 'UL',
]);
const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'IFRAME']);

/** Văn bản của một phần tử, có khoảng trắng giữa các khối (textContent dính chữ các khối lại với nhau) */
export function blockText(node: Node, exclude?: (el: Element) => boolean): string {
  const out: string[] = [];
  const walk = (n: Node) => {
    if (n.nodeType === 3) {
      out.push(n.nodeValue || '');
      return;
    }
    if (n.nodeType !== 1) return;
    const el = n as Element;
    if (SKIP.has(el.tagName) || (exclude && exclude(el))) return;
    const block = BLOCK.has(el.tagName);
    if (block) out.push(' ');
    for (const c of Array.from(el.childNodes)) walk(c);
    if (block) out.push(' ');
  };
  walk(node);
  return out.join('').replace(/\s+/g, ' ').trim();
}

/**
 * Vùng nội dung chính.
 * - Chế độ dán: toàn bộ nội dung người dùng dán.
 * - Chế độ URL: <article> (lấy cái nhiều chữ nhất) → <main> → body trừ header/footer/nav/aside.
 *   (Quy tắc tự chọn vì brief không nêu; báo cho chủ web.)
 */
export function contentRoot(doc: Document, mode: Mode): Element {
  const body = doc.body || doc.documentElement;
  if (mode === 'paste') return body;
  const articles = Array.from(doc.querySelectorAll('article'));
  if (articles.length) {
    return articles.reduce((a, b) => (countWords(blockText(b)) > countWords(blockText(a)) ? b : a));
  }
  const main = doc.querySelector('main');
  if (main) return main;
  return body;
}

/** Phần tử thuộc khung trang (menu, đầu/chân trang) — bỏ qua khi đọc nội dung chính ở chế độ URL */
export const isChrome = (el: Element) => ['HEADER', 'FOOTER', 'NAV', 'ASIDE'].includes(el.tagName);

export interface Heading {
  level: number;
  text: string;
  id: string;
}
export interface Link {
  href: string;
  text: string;
  rel: string;
}
export interface Img {
  src: string;
  alt: string | null;
  width: string | null;
  height: string | null;
  loading: string | null;
}

export interface Extracted {
  root: Element;
  headings: Heading[];
  h1s: string[];
  paragraphs: string[];
  /** Toàn bộ chữ nội dung chính */
  text: string;
  /** Chữ thân bài (không gồm H1) — dùng cho "100 chữ đầu" */
  bodyText: string;
  words: number;
  links: Link[];
  images: Img[];
  hasListOrTable: boolean;
}

export function extract(doc: Document, mode: Mode): Extracted {
  const root = contentRoot(doc, mode);
  const inChrome = (el: Element) => {
    if (mode === 'paste' || root.tagName !== 'BODY') return false;
    for (let p: Element | null = el; p && p !== root; p = p.parentElement) if (isChrome(p)) return true;
    return false;
  };
  const all = <T extends Element>(sel: string) =>
    Array.from(root.querySelectorAll(sel)).filter((el) => !inChrome(el)) as T[];

  const headings: Heading[] = all('h1,h2,h3,h4,h5,h6')
    .map((h) => ({ level: Number(h.tagName[1]), text: blockText(h), id: h.getAttribute('id') || '' }))
    .filter((h) => h.text);
  const h1s = headings.filter((h) => h.level === 1).map((h) => h.text);

  // Đoạn văn: <p> có chữ. Không có <p> nào (vd dán chữ thuần) → coi mỗi khối chữ là 1 đoạn.
  let paragraphs = all('p').map((p) => blockText(p)).filter(Boolean);
  const excludeChrome = mode === 'url' && root.tagName === 'BODY' ? isChrome : undefined;
  const text = blockText(root, excludeChrome);
  if (!paragraphs.length && text) paragraphs = [text];

  const bodyText = blockText(root, (el) => el.tagName === 'H1' || (excludeChrome ? excludeChrome(el) : false));

  const links: Link[] = all<HTMLAnchorElement>('a[href]').map((a) => ({
    href: (a.getAttribute('href') || '').trim(),
    text: blockText(a) || (a.querySelector('img')?.getAttribute('alt') ?? ''),
    rel: (a.getAttribute('rel') || '').toLowerCase(),
  }));

  const images: Img[] = all<HTMLImageElement>('img').map((img) => ({
    src: img.getAttribute('src') || img.getAttribute('data-src') || '',
    alt: img.hasAttribute('alt') ? img.getAttribute('alt') : null,
    width: img.getAttribute('width'),
    height: img.getAttribute('height'),
    loading: img.getAttribute('loading'),
  }));

  return {
    root,
    headings,
    h1s,
    paragraphs,
    text,
    bodyText,
    words: countWords(text),
    links,
    images,
    hasListOrTable: all('ul,ol,table').length > 0,
  };
}

/** Tên miền chuẩn hoá: bỏ giao thức, www, đường dẫn */
export function hostOf(s: string): string {
  const t = s.trim().toLowerCase();
  if (!t) return '';
  try {
    const u = new URL(/^[a-z]+:\/\//.test(t) ? t : `https://${t}`);
    return u.hostname.replace(/^www\./, '');
  } catch {
    return t.replace(/^www\./, '').split('/')[0];
  }
}

export type LinkKind = 'internal' | 'external' | 'other';

/** Phân loại link: nội bộ (tương đối hoặc cùng tên miền) / ra ngoài / khác (#, mailto, tel, javascript) */
export function linkKind(href: string, domain: string): LinkKind {
  const h = href.trim();
  if (!h || h.startsWith('#') || /^(mailto|tel|javascript|data):/i.test(h)) return 'other';
  if (/^https?:\/\//i.test(h) || h.startsWith('//')) {
    const host = hostOf(h.startsWith('//') ? `https:${h}` : h);
    const d = hostOf(domain);
    return d && (host === d || host.endsWith(`.${d}`)) ? 'internal' : 'external';
  }
  if (/^[a-z][a-z0-9+.-]*:/i.test(h)) return 'other';
  return 'internal'; // đường dẫn tương đối
}

/** Tên file của ảnh từ src (bỏ query, giải mã %xx) */
export function fileName(src: string): string {
  const clean = src.split(/[?#]/)[0];
  const last = clean.split('/').pop() || '';
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}
