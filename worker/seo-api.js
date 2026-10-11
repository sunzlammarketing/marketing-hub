// API cho công cụ kiểm tra SEO on-page (chế độ Nhập URL). Worker chỉ TẢI dữ liệu; việc chấm điểm chạy
// trên trình duyệt (src/lib/seo-checker). Không lưu nội dung hay URL người dùng nhập.
//
//   POST /api/seo/fetch  { url }            → HTML trang + status + headers + robots.txt + sitemap   (tính lượt)
//   POST /api/seo/psi    { url }            → Core Web Vitals từ PageSpeed Insights (strategy=mobile)
//   POST /api/seo/links  { links, images, ogImage } → mã HTTP link ngoài, dung lượng ảnh, kích thước og:image
//
// Giới hạn: 10 lượt /api/seo/fetch mỗi IP mỗi giờ, đếm bằng KV (binding RATE_KV). Chưa gắn KV → không giới hạn.
// PageSpeed: secret PAGESPEED_API_KEY (không bao giờ gửi ra trình duyệt).

const UA = 'SunzSEOChecker/1.0 (+https://sunzlammarketing.sunzlammarketing.workers.dev/cong-cu/kiem-tra-seo-on-page)';
const PAGE_TIMEOUT = 10_000;
const MAX_REDIRECTS = 3;
const MAX_HTML = 3 * 1024 * 1024;
const RATE_LIMIT = 10; // lượt / IP / giờ

export async function handleSeoApi(request, env, url) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (request.method !== 'POST') return json({ error: 'Chỉ nhận POST.' }, 405);
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Dữ liệu gửi lên không hợp lệ.' }, 400);
  }
  // Cloudflare không cho Worker gọi vào chính địa chỉ của nó (lỗi 1042) → trang của chính web Sunz đọc thẳng
  // từ file đã build (env.ASSETS); website khác tải qua mạng như bình thường.
  const net = (u, init) => (new URL(u).host === url.host && env.ASSETS ? env.ASSETS.fetch(new Request(u, init)) : fetch(u, init));
  try {
    if (url.pathname === '/api/seo/fetch') return await apiFetch(request, env, body, net);
    if (url.pathname === '/api/seo/psi') return await apiPsi(env, body);
    if (url.pathname === '/api/seo/links') return await apiLinks(body, net);
  } catch (e) {
    return json({ error: 'Máy chủ gặp lỗi khi kiểm tra, bạn thử lại sau ít phút nhé.' }, 500);
  }
  return json({ error: 'Không tìm thấy.' }, 404);
}

// ---------------- /api/seo/fetch ----------------
async function apiFetch(request, env, body, net) {
  const target = checkUrl(body?.url);
  if (target.error) return json({ error: target.error }, 400);

  const limited = await rateLimit(request, env);
  if (limited) return json({ error: limited }, 429);

  let page;
  try {
    page = await fetchFollow(target.url, PAGE_TIMEOUT, MAX_HTML, net);
  } catch (e) {
    return json({ error: friendly(e) }, 502);
  }
  if (page.status === 404 || page.status === 410) {
    return json({ error: `Trang không tồn tại (mã ${page.status}). Kiểm tra lại đường dẫn bài viết.` }, 422);
  }
  if (page.status === 401) return json({ error: 'Trang yêu cầu đăng nhập nên công cụ không đọc được. Hãy dùng chế độ “Dán nội dung”.' }, 422);
  if (page.status === 403 || page.status === 429 || page.status === 503) {
    return json({ error: `Website từ chối cho công cụ đọc trang (mã ${page.status}). Trang có thể đang chặn bot hoặc tường lửa. Hãy dùng chế độ “Dán nội dung”.` }, 422);
  }
  if (page.status >= 500) return json({ error: `Website đang lỗi (mã ${page.status}). Thử lại sau ít phút nhé.` }, 422);
  if (!/html|xml/i.test(page.headers['content-type'] || '')) {
    return json({ error: `URL này không phải trang web (loại nội dung: ${page.headers['content-type'] || 'không rõ'}).` }, 422);
  }

  const origin = new URL(page.finalUrl).origin;
  const [robotsTxt, sitemapHasUrl] = await Promise.all([fetchText(`${origin}/robots.txt`, 5000, 512 * 1024, net), sitemapHas(origin, page.finalUrl, net)]);

  return json({
    finalUrl: page.finalUrl,
    status: page.status,
    headers: page.headers,
    html: page.text,
    truncated: page.truncated,
    robotsTxt,
    sitemapHasUrl,
  });
}

// ---------------- /api/seo/psi ----------------
async function apiPsi(env, body) {
  const target = checkUrl(body?.url);
  if (target.error) return json({ error: target.error }, 400);
  // Chỉ lấy các nhóm cần dùng để phản hồi gọn hơn. Google không nhận đường dẫn tới từng audit
  // (tên có dấu gạch ngang như largest-contentful-paint → lỗi 400) nên lấy cả nhóm audits.
  const fields = 'loadingExperience/metrics,lighthouseResult/categories/performance/score,lighthouseResult/audits';
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', target.url);
  api.searchParams.set('strategy', 'mobile');
  api.searchParams.set('category', 'performance');
  api.searchParams.set('fields', fields);
  if (env.PAGESPEED_API_KEY) api.searchParams.set('key', env.PAGESPEED_API_KEY);

  let data;
  try {
    const res = await fetchTimeout(api.href, {}, 60_000);
    data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || `PageSpeed lỗi ${res.status}`);
  } catch (e) {
    const why = String(e?.message || '') === 'TIMEOUT' ? 'quá 60 giây' : String(e?.message || '').slice(0, 120);
    return json({
      pagespeed: null,
      pagespeedError: `PageSpeed Insights không đo được trang này${why ? ` (${why})` : ''}. Các mục khác vẫn được chấm bình thường.`,
    });
  }
  const m = data.loadingExperience?.metrics || {};
  const field = m.LARGEST_CONTENTFUL_PAINT_MS && m.CUMULATIVE_LAYOUT_SHIFT_SCORE;
  const a = data.lighthouseResult?.audits || {};
  const pagespeed = field
    ? {
        source: 'field',
        lcpMs: m.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
        inpMs: m.INTERACTION_TO_NEXT_PAINT?.percentile,
        cls: m.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile != null ? m.CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile / 100 : undefined,
      }
    : {
        source: 'lab',
        lcpMs: a['largest-contentful-paint']?.numericValue,
        tbtMs: a['total-blocking-time']?.numericValue,
        cls: a['cumulative-layout-shift']?.numericValue,
      };
  pagespeed.performanceScore = data.lighthouseResult?.categories?.performance?.score;
  return json({ pagespeed });
}

// ---------------- /api/seo/links ----------------
async function apiLinks(body, net) {
  const links = (Array.isArray(body?.links) ? body.links : []).slice(0, 20);
  const images = (Array.isArray(body?.images) ? body.images : []).slice(0, 20);
  const linkStatus = {};
  const imageBytes = {};
  await Promise.all([
    ...links.map(async (u) => {
      if (checkUrl(u).error) return;
      linkStatus[u] = await probe(u, net);
    }),
    ...images.map(async (u) => {
      if (checkUrl(u).error) return;
      const n = await contentLength(u, net);
      if (n) imageBytes[u] = n;
    }),
  ]);
  let ogImageSize = null;
  if (body?.ogImage && !checkUrl(body.ogImage).error) ogImageSize = await imageSize(body.ogImage, net);
  return json({ linkStatus, imageBytes, ogImageSize });
}

// ---------------- Bảo mật URL (chống SSRF) ----------------
function checkUrl(raw) {
  let u;
  try {
    u = new URL(String(raw || '').trim());
  } catch {
    return { error: 'URL không hợp lệ. Hãy nhập đầy đủ, ví dụ https://tenmien.vn/bai-viet' };
  }
  if (!/^https?:$/.test(u.protocol)) return { error: 'Chỉ kiểm tra được địa chỉ http:// hoặc https://' };
  if (u.username || u.password) return { error: 'URL không được chứa tên đăng nhập/mật khẩu.' };
  if (isPrivateHost(u.hostname)) return { error: 'Không kiểm tra được địa chỉ nội bộ (localhost, IP mạng riêng).' };
  return { url: u.href };
}

function isPrivateHost(host) {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '');
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal') || !h.includes('.') && !h.includes(':')) return true;
  // IPv6
  if (h.includes(':')) return h === '::1' || h === '::' || /^f[cd]/.test(h) || /^fe80/.test(h) || /^::ffff:/.test(h);
  // IPv4 (kể cả dạng số thập phân/hex viết tắt → chặn luôn cho chắc)
  if (/^[0-9.]+$/.test(h) || /^0x/i.test(h)) {
    const p = h.split('.').map(Number);
    if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
    const [a, b] = p;
    return a === 10 || a === 127 || a === 0 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 169 && b === 254) || (a === 100 && b >= 64 && b <= 127) || a >= 224;
  }
  return false;
}

// ---------------- Tải trang: tự theo redirect (tối đa 3), kiểm từng điểm đến ----------------
async function fetchFollow(start, timeout, maxBytes, net) {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetchTimeout(current, { redirect: 'manual', headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' } }, timeout, net);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
      if (hop === MAX_REDIRECTS) throw new Error('TOO_MANY_REDIRECTS');
      const next = new URL(res.headers.get('location'), current).href;
      const ok = checkUrl(next);
      if (ok.error) throw new Error('BAD_REDIRECT');
      current = ok.url;
      continue;
    }
    const headers = {};
    for (const k of ['content-type', 'x-robots-tag', 'content-length', 'last-modified', 'cache-control', 'server']) {
      const v = res.headers.get(k);
      if (v) headers[k] = v;
    }
    const { text, truncated } = await readLimited(res, maxBytes);
    return { finalUrl: current, status: res.status, headers, text, truncated };
  }
  throw new Error('TOO_MANY_REDIRECTS');
}

async function fetchTimeout(url, init, ms, net = fetch) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort('TIMEOUT'), ms);
  try {
    return await net(url, { ...init, signal: ctrl.signal });
  } catch (e) {
    throw new Error(ctrl.signal.aborted ? 'TIMEOUT' : 'NETWORK');
  } finally {
    clearTimeout(t);
  }
}

async function readLimited(res, maxBytes) {
  if (!res.body) return { text: '', truncated: false };
  const reader = res.body.getReader();
  const chunks = [];
  let size = 0;
  let truncated = false;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > maxBytes) {
      chunks.push(value.slice(0, value.byteLength - (size - maxBytes)));
      truncated = true;
      await reader.cancel();
      break;
    }
    chunks.push(value);
  }
  const all = new Uint8Array(chunks.reduce((n, c) => n + c.byteLength, 0));
  let o = 0;
  for (const c of chunks) all.set(c, o), (o += c.byteLength);
  return { text: new TextDecoder().decode(all), truncated };
}

async function fetchText(url, ms, maxBytes, net) {
  try {
    const res = await fetchTimeout(url, { headers: { 'User-Agent': UA } }, ms, net);
    if (!res.ok) return null;
    return (await readLimited(res, maxBytes)).text;
  } catch {
    return null;
  }
}

/** URL có trong sitemap không: thử /sitemap.xml, /sitemap_index.xml, /sitemap-index.xml (mở tối đa 3 sitemap con) */
async function sitemapHas(origin, finalUrl, net) {
  const variants = new Set();
  const u = new URL(finalUrl);
  const path = u.pathname.replace(/\/+$/, '');
  for (const host of [u.host, u.host.startsWith('www.') ? u.host.slice(4) : `www.${u.host}`])
    for (const p of [path, path + '/']) variants.add(`${u.protocol}//${host}${p || '/'}`);
  const has = (xml) => [...variants].some((v) => xml.includes(`<loc>${v}</loc>`) || xml.includes(`<loc><![CDATA[${v}]]></loc>`));

  for (const name of ['/sitemap.xml', '/sitemap_index.xml', '/sitemap-index.xml']) {
    const xml = await fetchText(origin + name, 5000, 3 * 1024 * 1024, net);
    if (!xml || !xml.includes('<loc>')) continue;
    if (has(xml)) return true;
    if (xml.includes('<sitemapindex')) {
      const children = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?([^<\]]+)/g)].map((m) => m[1].trim()).slice(0, 3);
      for (const child of children) {
        if (checkUrl(child).error) continue;
        const cx = await fetchText(child, 5000, 3 * 1024 * 1024, net);
        if (cx && has(cx)) return true;
      }
    }
    return false;
  }
  return false; // không có sitemap
}

// ---------------- Kiểm link / ảnh ----------------
async function probe(url, net) {
  try {
    let res = await fetchTimeout(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': UA } }, 5000, net);
    // Nhiều website không hỗ trợ HEAD → thử GET
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetchTimeout(url, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': UA } }, 5000, net);
      res.body?.cancel();
    }
    return res.status;
  } catch {
    return 0;
  }
}

async function contentLength(url, net) {
  try {
    const res = await fetchTimeout(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': UA } }, 5000, net);
    const n = Number(res.headers.get('content-length')) || 0;
    if (n) return n;
    // Không có content-length (vd gửi dạng chunked) → hỏi 1 byte đầu, đọc tổng dung lượng từ Content-Range
    const r2 = await fetchTimeout(url, { redirect: 'follow', headers: { 'User-Agent': UA, Range: 'bytes=0-0' } }, 5000, net);
    r2.body?.cancel();
    const total = (r2.headers.get('content-range') || '').split('/')[1];
    return Number(total) || Number(r2.headers.get('content-length')) || 0;
  } catch {
    return 0;
  }
}

/** Đọc kích thước ảnh từ phần đầu file (PNG, JPEG, GIF, WebP) — chỉ tải tối đa 128 KB */
async function imageSize(url, net) {
  try {
    const res = await fetchTimeout(url, { headers: { 'User-Agent': UA, Range: 'bytes=0-131071' } }, 5000, net);
    if (!res.ok && res.status !== 206) return null;
    const buf = new Uint8Array(await readBytes(res, 131072));
    return parseSize(buf);
  } catch {
    return null;
  }
}

async function readBytes(res, max) {
  const reader = res.body.getReader();
  const out = new Uint8Array(max);
  let n = 0;
  while (n < max) {
    const { done, value } = await reader.read();
    if (done) break;
    const take = Math.min(value.byteLength, max - n);
    out.set(value.subarray(0, take), n);
    n += take;
  }
  reader.cancel().catch(() => {});
  return out.subarray(0, n);
}

function parseSize(b) {
  const u16 = (i) => (b[i] << 8) | b[i + 1];
  const u32 = (i) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
  // PNG
  if (b[0] === 0x89 && b[1] === 0x50) return { width: u32(16), height: u32(20) };
  // GIF
  if (b[0] === 0x47 && b[1] === 0x49) return { width: b[6] | (b[7] << 8), height: b[8] | (b[9] << 8) };
  // WebP
  if (b[0] === 0x52 && b[8] === 0x57) {
    const tag = String.fromCharCode(b[12], b[13], b[14], b[15]);
    if (tag === 'VP8X') return { width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
    if (tag === 'VP8 ') return { width: (b[26] | (b[27] << 8)) & 0x3fff, height: (b[28] | (b[29] << 8)) & 0x3fff };
    if (tag === 'VP8L') {
      const v = b[21] | (b[22] << 8) | (b[23] << 16) | (b[24] << 24);
      return { width: 1 + (v & 0x3fff), height: 1 + ((v >> 14) & 0x3fff) };
    }
  }
  // JPEG: tìm khung SOF
  if (b[0] === 0xff && b[1] === 0xd8) {
    let i = 2;
    while (i + 9 < b.length) {
      if (b[i] !== 0xff) return null;
      const marker = b[i + 1];
      const len = u16(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return { width: u16(i + 7), height: u16(i + 5) };
      i += 2 + len;
    }
  }
  return null;
}

// ---------------- Giới hạn lượt bằng KV ----------------
async function rateLimit(request, env) {
  if (!env.RATE_KV) return null; // chưa gắn KV → không giới hạn
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';
  const hour = Math.floor(Date.now() / 3_600_000);
  const key = `seo:${ip}:${hour}`;
  try {
    const used = Number(await env.RATE_KV.get(key)) || 0;
    if (used >= RATE_LIMIT) {
      const mins = 60 - new Date().getUTCMinutes();
      return `Bạn đã dùng hết ${RATE_LIMIT} lượt kiểm tra URL trong giờ này. Thử lại sau khoảng ${mins} phút, hoặc dùng chế độ “Dán nội dung” (không giới hạn).`;
    }
    await env.RATE_KV.put(key, String(used + 1), { expirationTtl: 3700 });
  } catch {
    // KV quá hạn mức ghi miễn phí hoặc lỗi → vẫn cho chạy
  }
  return null;
}

// ---------------- Tiện ích ----------------
function friendly(e) {
  const m = String(e?.message || e);
  if (m === 'TIMEOUT') return 'Trang phản hồi quá 10 giây nên công cụ dừng lại. Hãy thử lại, hoặc dùng chế độ “Dán nội dung”.';
  if (m === 'TOO_MANY_REDIRECTS') return 'Trang chuyển hướng quá 3 lần. Hãy nhập URL cuối cùng của bài viết.';
  if (m === 'BAD_REDIRECT') return 'Trang chuyển hướng tới một địa chỉ không được phép kiểm tra.';
  return 'Không kết nối được tới trang này. Kiểm tra lại URL (trang có tồn tại không?) hoặc website đang chặn bot.';
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' },
  });
}
