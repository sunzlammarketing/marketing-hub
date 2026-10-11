// Địa chỉ CHÍNH THỨC của website — dùng cho canonical, og:url, og:image, sitemap, schema.
// Tên miền sunzlammarketing.com chưa bật nên tạm dùng địa chỉ Cloudflare Workers.
// Khi bật tên miền: đổi dòng dưới thành 'https://sunzlammarketing.com', build lại, rồi chuyển hướng 301
// toàn bộ workers.dev (và Vercel) về tên miền mới.
export const SITE_URL = 'https://sunzlammarketing.sunzlammarketing.workers.dev';

/** URL tuyệt đối, không có dấu "/" cuối (trừ trang chủ) — khớp cách Worker phục vụ (drop-trailing-slash) */
export const absolute = (path: string) => {
  const p = path.replace(/\/+$/, '') || '/';
  return SITE_URL + (p === '/' ? '/' : p);
};
