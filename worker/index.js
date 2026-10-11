// Cloudflare Worker: phục vụ web tĩnh (Astro) + đường dẫn tải tài liệu có bảo vệ /dl?t=<token>
// + API công cụ kiểm tra SEO on-page /api/seo/* (worker/seo-api.js).
// - Mọi đường dẫn khác: trả file tĩnh như cũ (env.ASSETS).
// - /dl: chuyển token sang Apps Script (tools/google-sheet-orders.gs, hàm doGet). Apps Script kiểm tra
//   chữ ký + hạn + số lượt tải, đọc file RIÊNG TƯ trên Drive và trả về base64; Worker trả file để
//   trình duyệt tải xuống ngay. Người mua không bao giờ thấy link Drive.
// Không có bí mật nào ở đây: khoá ký token chỉ nằm trong Apps Script.
import { handleSeoApi } from './seo-api.js';

// Cùng URL với ORDER_SHEET_URL trong src/data/payment.ts
const APPS_SCRIPT =
  'https://script.google.com/macros/s/AKfycby6L7irtvK2zRWciRZIJ8f37BCWNqCJzgQPhhFrhLVehQfYxMwBmbR-jWLQn7CcMqkVsQ/exec';
const SUPPORT = 'https://m.me/sunzlammarketing';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/dl') return download(url);
    if (url.pathname.startsWith('/api/seo/')) return handleSeoApi(request, env, url);
    return env.ASSETS.fetch(request);
  },
};

async function download(url) {
  const token = url.searchParams.get('t') || '';
  if (!token || token.length > 2000) return page('Link tải không hợp lệ.', 400);

  let data;
  try {
    const res = await fetch(`${APPS_SCRIPT}?dl=${encodeURIComponent(token)}`, { redirect: 'follow' });
    data = await res.json();
  } catch {
    return page('Máy chủ tải đang bận, bạn thử lại sau ít phút nhé.', 502);
  }
  if (!data || !data.ok) return page(data?.error || 'Link tải không hợp lệ hoặc đã hết hạn.', 403);

  const bin = atob(data.b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const name = data.name || 'tai-lieu';
  const ascii = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^\w.\- ]/g, '_');
  return new Response(bytes, {
    headers: {
      'Content-Type': data.mime || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`,
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
}

function page(message, status) {
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Tải tài liệu · Sunz Làm Marketing</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a">
<div style="max-width:440px;margin:24px;padding:28px;border-radius:20px;background:#fff;border:1px solid #e2e8f0;text-align:center;box-shadow:0 20px 40px -24px rgba(15,23,42,.3)">
<img src="/logo-mark.png" width="48" height="48" alt="Sunz" style="margin-bottom:12px">
<h1 style="font-size:20px;margin:0 0 8px">Chưa tải được tài liệu</h1>
<p style="color:#475569;line-height:1.6;margin:0 0 18px">${esc(message)}</p>
<a href="${SUPPORT}" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:12px">Nhắn Sunz để được hỗ trợ</a>
</div></body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}
