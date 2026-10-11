// Unit test module chấm SEO on-page (chạy: npm test). Dùng linkedom thay cho DOM của trình duyệt.
// Ví dụ lấy từ ebook: từ khoá "kem chống nắng cho da dầu".
import { describe, expect, it, beforeAll } from 'vitest';
import { DOMParser as LinkedomParser } from 'linkedom';
import { analyze, score, sanitizeHtml, CHECKLIST, type PageMeta, type CheckResult } from './index';
import { containsKeyword, removeDiacritics, slugify, countWords } from './text';

beforeAll(() => {
  // sanitizeHtml dùng DOMParser toàn cục như trên trình duyệt
  (globalThis as any).DOMParser = LinkedomParser;
});

const KW = 'kem chống nắng cho da dầu';
const GOOD_TITLE = 'Kem chống nắng cho da dầu: 7 tiêu chí chọn đúng | MyPhamABC';
const GOOD_META =
  'Da dầu, dễ nổi mụn? Bỏ túi 7 tiêu chí chọn kem chống nắng cho da dầu, kiềm dầu, không bết rít, kèm bảng so sánh SPF/PA. Xem ngay!';

const words = (n: number, w = 'chữ') => Array.from({ length: n }, () => w).join(' ');

/** Bài mẫu đạt chuẩn: 1 H1, 3 H2 chứa từ khoá, đoạn ngắn, danh sách, 3 link nội bộ, 1 link ngoài, ảnh chuẩn */
const GOOD_BODY = `
<h1>Cách chọn kem chống nắng cho da dầu: 7 tiêu chí bạn cần biết</h1>
<p>Da dầu nên chọn kem chống nắng cho da dầu dạng gel hoặc fluid, SPF 30–50, PA+++ trở lên và ghi rõ không gây bít tắc lỗ chân lông.</p>
<img src="/images/kem-chong-nang-dang-gel-cho-da-dau.webp" alt="Kem chống nắng cho da dầu dạng gel trên mu bàn tay" width="800" height="600">
<h2>Da dầu có cần kem chống nắng cho da dầu riêng không?</h2>
${Array.from({ length: 8 }, () => `<p>${words(60)}</p>`).join('')}
<ul><li>Kết cấu mỏng nhẹ</li><li>Kiềm dầu</li></ul>
<h2>7 tiêu chí chọn kem chống nắng</h2>
<h3>1. Kết cấu gel</h3>
<p>${words(50)} xem <a href="/blog/skincare-buoi-sang-cho-da-dau">quy trình skincare buổi sáng cho da dầu</a>.</p>
<h3>2. SPF 30–50</h3>
<p>${words(50)} đọc thêm <a href="https://myphamabc.vn/blog/spf-la-gi">chỉ số SPF là gì</a> và
<a href="/blog/pa-la-gi">chỉ số PA là gì</a>, nguồn <a href="https://www.who.int/uv" rel="noopener">WHO về tia UV</a>.</p>
<h2>Câu hỏi thường gặp</h2>
<p>${words(30)}</p>`;

function run(body: string, meta: Partial<PageMeta> = {}): Record<number, CheckResult> {
  const doc = new LinkedomParser().parseFromString(`<!doctype html><html><body>${body}</body></html>`, 'text/html') as unknown as Document;
  const m: PageMeta = {
    keyword: KW,
    title: GOOD_TITLE,
    metaDescription: GOOD_META,
    url: 'https://myphamabc.vn/kem-chong-nang-cho-da-dau',
    domain: 'myphamabc.vn',
    ...meta,
  };
  const results = analyze({ doc, meta: m, mode: 'paste' }, CHECKLIST);
  return Object.fromEntries(results.map((r) => [r.id, r]));
}

describe('xử lý tiếng Việt', () => {
  it('bỏ dấu, gồm cả đ', () => {
    expect(removeDiacritics('Đường đi dầu')).toBe('Duong di dau');
    expect(slugify(KW)).toBe('kem-chong-nang-cho-da-dau');
  });
  it('khớp từ khoá có dấu lẫn không dấu, không phân biệt hoa thường', () => {
    expect(containsKeyword('KEM CHỐNG NẮNG CHO DA DẦU tốt', KW)).toBe(true);
    expect(containsKeyword('kem chong nang cho da dau gia re', KW)).toBe(true);
    expect(containsKeyword('kem chống nắng cho da khô', KW)).toBe(false);
  });
  it('đếm chữ theo khoảng trắng', () => expect(countWords('  một  hai\nba ')).toBe(3));
});

describe('dữ liệu JSON', () => {
  it('đủ 30 mục, tổng điểm khớp max_points', () => {
    expect(CHECKLIST.items).toHaveLength(30);
    expect(CHECKLIST.items.reduce((a, i) => a + i.points, 0)).toBe(CHECKLIST.meta.scoring.max_points);
    expect(CHECKLIST.items.filter((i) => i.check_type === 'paste')).toHaveLength(11);
  });
});

describe('bài đạt chuẩn: mọi mục tự động Đạt', () => {
  const r = run(GOOD_BODY);
  for (const id of [4, 6, 7, 8, 11, 12, 14, 21, 23, 24]) {
    it(`mục ${id} = pass`, () => expect(r[id].status, r[id].measured + ' | ' + r[id].details.join(' | ')).toBe('pass'));
  }
  it('mục 15 không áp dụng với bài ngắn', () => expect(r[15].status).toBe('na'));
  it('mục ai/self/url ở chế độ dán = tự tick', () => {
    for (const id of [1, 2, 9, 13, 26, 30]) expect(r[id].status).toBe('manual');
    expect(r[2].aiSoon).toBe(true);
  });
});

describe('ca Chưa đạt từng mục', () => {
  it('mục 4: thiếu từ khoá ở hầu hết vị trí', () => {
    const r = run('<h1>Bài viết mới</h1><p>Nội dung không liên quan.</p>', { title: 'Bài viết mới', url: '?p=1832' });
    expect(r[4].status).toBe('fail');
  });
  it('mục 4: nhồi từ khoá bị hạ bậc', () => {
    const r = run(`<h1>${KW}</h1><h2>${KW}</h2><p>${KW} là ${KW} tốt nhất, ${KW} ${KW} ${KW}.</p><img src="/a-b-c.webp" alt="${KW}">`);
    expect(r[4].details.some((d) => d.includes('nhồi'))).toBe(true);
    expect(r[4].status).toBe('warn');
  });
  it('mục 6: title "Bài viết mới" quá ngắn, thiếu từ khoá', () => {
    expect(run(GOOD_BODY, { title: 'Bài viết mới' })[6].status).toBe('fail');
  });
  it('mục 6: title trống', () => expect(run(GOOD_BODY, { title: '' })[6].status).toBe('fail'));
  it('mục 7: meta trùng title', () => expect(run(GOOD_BODY, { metaDescription: GOOD_TITLE })[7].status).toBe('fail'));
  it('mục 7: meta trống', () => expect(run(GOOD_BODY, { metaDescription: '' })[7].status).toBe('fail'));
  it('mục 8: slug ?p=1832', () => expect(run(GOOD_BODY, { url: 'myphamabc.vn/?p=1832' })[8].status).toBe('fail'));
  it('mục 8: slug quá dài', () =>
    expect(run(GOOD_BODY, { url: 'myphamabc.vn/top-10-nhung-loai-kem-chong-nang-tot-nhat-cho-da-dau-nam-2026' })[8].status).toBe('fail'));
  it('mục 8: slug có dấu', () => expect(run(GOOD_BODY, { url: 'kem-chống-nắng' })[8].status).toBe('fail'));
  it('mục 11: 2 thẻ H1', () => expect(run(`<h1>${KW}</h1><h1>Khác</h1>`)[11].status).toBe('fail'));
  it('mục 11: không có H1 → dùng ô Title', () => {
    const r = run('<p>Không có heading</p>');
    expect(r[11].status).toBe('pass');
    expect(r[11].measured).toContain('ô Title');
  });
  it('mục 12: bài dài không H2, nhảy cấp H1→H4', () => {
    expect(run(`<h1>${KW}</h1><h4>Nhỏ</h4><p>${words(700)}</p>`)[12].status).toBe('fail');
  });
  it('mục 14: đoạn quá dài, không danh sách', () => {
    expect(run(`<h1>${KW}</h1><p>${words(300)}</p><p>${words(300)}</p><p>${words(300)}</p>`)[14].status).toBe('fail');
  });
  it('mục 15: bài dài không mục lục = fail, có mục lục = pass', () => {
    const long = Array.from({ length: 6 }, (_, i) => `<h2 id="p${i}">Phần ${i}</h2><p>${words(300)}</p>`).join('');
    expect(run(`<h1>${KW}</h1>${long}`)[15].status).toBe('fail');
    const toc = `<ul><li><a href="#p0">0</a></li><li><a href="#p1">1</a></li><li><a href="#p2">2</a></li></ul>`;
    expect(run(`<h1>${KW}</h1>${toc}${long}`)[15].status).toBe('pass');
  });
  it('mục 21: không có link nội bộ', () => expect(run(`<h1>${KW}</h1><p>Không link.</p>`)[21].status).toBe('fail'));
  it('mục 21: anchor "tại đây" bị hạ bậc', () => {
    const r = run(`<p><a href="/a">tại đây</a> <a href="/b">bài B</a> <a href="/c">bài C</a></p>`);
    expect(r[21].status).toBe('warn');
  });
  it('mục 23: không có link ra ngoài = Cần cải thiện', () => expect(run(`<p><a href="/a">a</a></p>`)[23].status).toBe('warn'));
  it('mục 24: ảnh thiếu alt, tên file IMG_', () => {
    const r = run(`<img src="/IMG_20261011.jpg"><img src="/DSC0001.png" alt="">`);
    expect(r[24].status).toBe('fail');
    expect(r[24].details).toHaveLength(2);
  });
  it('mục 24: không có ảnh = không áp dụng', () => expect(run('<p>a</p>')[24].status).toBe('na'));
});

describe('tính điểm', () => {
  it('bài chuẩn + tick hết = Xuất sắc', () => {
    const r = Object.values(run(GOOD_BODY));
    const all = new Set(CHECKLIST.items.map((i) => i.id));
    const s = score(r, CHECKLIST, all);
    expect(s.ratio).toBeGreaterThanOrEqual(0.9);
    expect(s.rating).toBe(CHECKLIST.meta.scoring.rating[0].label);
    expect(s.max).toBe(70); // mục 15 (1 điểm) không áp dụng
  });
  it('còn mục Bắt buộc fail → Chưa nên đăng', () => {
    const r = Object.values(run(GOOD_BODY, { title: '' }));
    const s = score(r, CHECKLIST, new Set(CHECKLIST.items.map((i) => i.id)));
    expect(s.blockedByMandatory).toBe(true);
    expect(s.urgent).toContain(6);
    expect(s.rating).toBe('Chưa nên đăng');
  });
  it('tick/bỏ tick làm điểm thay đổi', () => {
    const r = Object.values(run(GOOD_BODY));
    expect(score(r, CHECKLIST, new Set([1])).earned).toBeGreaterThan(score(r, CHECKLIST, new Set()).earned);
  });
});

describe('làm sạch HTML dán từ Google Docs', () => {
  it('giữ heading/link/ảnh, bỏ style, đổi span đậm thành strong', () => {
    const docs = `<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-abc">
<h1 dir="ltr" style="line-height:1.38"><span style="font-size:20pt;font-family:Arial">Tiêu đề</span></h1>
<p dir="ltr"><span style="font-weight:700">Đậm</span><span> thường </span><a href="https://x.vn/a" style="color:blue"><span>link</span></a></p>
<p><span><img src="https://lh3.googleusercontent.com/abc" width="300" height="200" style="margin:0"></span></p>
<script>alert(1)</script></b>`;
    const out = sanitizeHtml(docs, new LinkedomParser().parseFromString('<html><body></body></html>', 'text/html') as any);
    expect(out).toContain('<h1>Tiêu đề</h1>');
    expect(out).toContain('<strong>Đậm</strong>');
    expect(out).toContain('<a href="https://x.vn/a">link</a>');
    // thứ tự thuộc tính tuỳ trình phân tích → kiểm từng thuộc tính
    const img = out.match(/<img[^>]*>/)?.[0] ?? '';
    for (const attr of ['src="https://lh3.googleusercontent.com/abc"', 'width="300"', 'height="200"']) expect(img).toContain(attr);
    expect(out).not.toContain('style=');
    expect(out).not.toContain('script');
  });
});

// ================= Chế độ URL (Bước B) =================
import { robotsBlocks, normUrl } from './rules-url';
import type { UrlExtras } from './types';

const FINAL = 'https://myphamabc.vn/kem-chong-nang-cho-da-dau';
const GOOD_HEAD = `
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="canonical" href="${FINAL}">
<meta property="og:title" content="t"><meta property="og:description" content="d"><meta property="og:image" content="https://myphamabc.vn/og.jpg">
<meta name="author" content="Mây">
<meta property="article:published_time" content="2026-10-01"><meta property="article:modified_time" content="2026-10-10">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BlogPosting","headline":"Kem chống nắng","author":{"@type":"Person","name":"Mây","url":"https://myphamabc.vn/tac-gia/may"}}</script>`;
const GOOD_ARTICLE = `<article>${GOOD_BODY.replace('<img src="/images/kem-chong-nang-dang-gel-cho-da-dau.webp"', '<img src="/images/kem-chong-nang-dang-gel-cho-da-dau.webp" fetchpriority="high"')}</article>`;
const GOOD_EXTRAS: UrlExtras = {
  finalUrl: FINAL,
  status: 200,
  headers: {},
  robotsTxt: 'User-agent: *\nDisallow: /wp-admin/',
  sitemapHasUrl: true,
  pagespeed: { source: 'field', lcpMs: 2100, inpMs: 150, cls: 0.05 },
};

function runUrl(head: string, body: string, extras: Partial<UrlExtras> = {}): Record<number, CheckResult> {
  const doc = new LinkedomParser().parseFromString(`<!doctype html><html><head>${head}</head><body><header><a href="/">Logo</a></header>${body}<footer>f</footer></body></html>`, 'text/html') as unknown as Document;
  const meta: PageMeta = { keyword: KW, title: GOOD_TITLE, metaDescription: GOOD_META, url: FINAL, domain: '' };
  const results = analyze({ doc, meta, mode: 'url', extras: { ...GOOD_EXTRAS, ...extras } }, CHECKLIST);
  return Object.fromEntries(results.map((r) => [r.id, r]));
}

describe('chế độ URL: trang đạt chuẩn', () => {
  const r = runUrl(GOOD_HEAD, GOOD_ARTICLE);
  for (const id of [9, 10, 18, 19, 25, 26, 27, 28, 29, 4, 11, 21]) {
    it(`mục ${id} = pass`, () => expect(r[id].status, r[id].measured + ' | ' + r[id].details.join(' | ')).toBe('pass'));
  }
  it('mục self/ai vẫn là tự tick', () => expect(r[1].status).toBe('manual'));
});

describe('chế độ URL: ca Chưa đạt', () => {
  it('mục 9: không có canonical', () => expect(runUrl('', GOOD_ARTICLE)[9].status).toBe('fail'));
  it('mục 9: canonical trỏ URL khác = cần cải thiện', () =>
    expect(runUrl('<link rel="canonical" href="https://myphamabc.vn/khac">', GOOD_ARTICLE)[9].status).toBe('warn'));
  it('mục 9: so canonical bỏ utm và dấu / cuối', () => expect(normUrl(FINAL + '/?utm_source=fb')).toBe(normUrl(FINAL)));
  it('mục 10: thiếu 2 thẻ OG', () => expect(runUrl('<meta property="og:title" content="t">', GOOD_ARTICLE)[10].status).toBe('fail'));
  it('mục 18: không có tác giả', () => expect(runUrl('', GOOD_ARTICLE)[18].status).toBe('fail'));
  it('mục 18: chỉ có tên = cần cải thiện', () => expect(runUrl('<meta name="author" content="Mây">', GOOD_ARTICLE)[18].status).toBe('warn'));
  it('mục 18: dòng byline chỉ có ngày đăng không tính là tác giả', () =>
    expect(runUrl('', `<div class="byline"><span>July 21, 2026 · 7 min read</span></div>${GOOD_ARTICLE}`)[18].status).toBe('fail'));
  it('mục 18: byline có link tên tác giả = đạt', () =>
    expect(runUrl('', `<p class="byline">Bởi <a href="/tac-gia/may">Mây Nguyễn</a> · 12/10/2026</p>${GOOD_ARTICLE}`)[18].status).toBe('pass'));
  it('mục 19: không có ngày', () => expect(runUrl('', GOOD_ARTICLE)[19].status).toBe('fail'));
  it('mục 25: ảnh đầu bài lazy + nặng', () => {
    const body = `<article><p>a</p><img src="/a.jpg" loading="lazy"></article>`;
    expect(runUrl(GOOD_HEAD, body, { imageBytes: { 'https://myphamabc.vn/a.jpg': 900 * 1024 } })[25].status).toBe('fail');
  });
  it('mục 26: noindex', () => expect(runUrl(GOOD_HEAD + '<meta name="robots" content="noindex">', GOOD_ARTICLE)[26].status).toBe('fail'));
  it('mục 26: status 404', () => expect(runUrl(GOOD_HEAD, GOOD_ARTICLE, { status: 404 })[26].status).toBe('fail'));
  it('mục 26: robots.txt chặn', () =>
    expect(runUrl(GOOD_HEAD, GOOD_ARTICLE, { robotsTxt: 'User-agent: *\nDisallow: /kem' })[26].status).toBe('fail'));
  it('robots.txt: Allow dài hơn thắng Disallow', () => {
    expect(robotsBlocks('User-agent: *\nDisallow: /blog\nAllow: /blog/kem', '/blog/kem-a')).toBe(false);
    expect(robotsBlocks('User-agent: *\nDisallow: /', '/a')).toBe(true);
    expect(robotsBlocks('User-agent: Googlebot\nAllow: /\n\nUser-agent: *\nDisallow: /', '/a')).toBe(false);
  });
  it('mục 27: thiếu viewport', () => expect(runUrl('', GOOD_ARTICLE)[27].status).toBe('fail'));
  it('mục 28: 2 chỉ số kém', () =>
    expect(runUrl(GOOD_HEAD, GOOD_ARTICLE, { pagespeed: { source: 'lab', lcpMs: 4000, tbtMs: 600, cls: 0.02 } })[28].status).toBe('fail'));
  it('mục 28: PageSpeed lỗi → không tính điểm', () =>
    expect(runUrl(GOOD_HEAD, GOOD_ARTICLE, { pagespeed: null, pagespeedError: 'Hết thời gian' })[28].status).toBe('na'));
  it('mục 29: chỉ có Organization = cần cải thiện', () =>
    expect(runUrl('<script type="application/ld+json">{"@type":"Organization","name":"A"}</script>', GOOD_ARTICLE)[29].status).toBe('warn'));
  it('mục 29: JSON-LD lỗi cú pháp', () => expect(runUrl('<script type="application/ld+json">{oops</script>', GOOD_ARTICLE)[29].status).toBe('fail'));
  it('mục 11: H1 ở header theme + H1 bài = 2 H1', () =>
    expect(runUrl(GOOD_HEAD, `<header><h1>Logo</h1></header>${GOOD_ARTICLE}`)[11].status).toBe('fail'));
  it('mục 23: link ngoài lỗi 404', () =>
    expect(runUrl(GOOD_HEAD, GOOD_ARTICLE, { linkStatus: { 'https://www.who.int/uv': 404 } })[23].status).toBe('fail'));
});
