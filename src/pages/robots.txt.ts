// robots.txt: cho phép Google thu thập toàn bộ, trừ API và đường dẫn tải tài liệu. Kèm vị trí sitemap.
import type { APIRoute } from 'astro';
import { SITE_URL } from '../data/site';

export const GET: APIRoute = () =>
  new Response(`User-agent: *\nDisallow: /api/\nDisallow: /dl\n\nSitemap: ${SITE_URL}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
