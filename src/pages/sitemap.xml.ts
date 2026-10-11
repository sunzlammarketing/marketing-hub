// Sitemap cho Google: liệt kê mọi trang công khai. Địa chỉ gốc lấy từ src/data/site.ts.
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absolute } from '../data/site';
import { categories } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { SKILLS } from '../data/skills';
import { POLICIES } from '../data/legal';

const STATIC = ['/', '/gioi-thieu', '/tai-lieu', '/skill', '/san-pham', '/blog', '/chu-de', '/cong-cu',
  '/cong-cu/kiem-tra-seo-on-page', '/cong-cu/kiem-tra-content-quang-cao', '/lien-he'];

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const urls: { loc: string; lastmod?: string }[] = [
    ...STATIC.map((p) => ({ loc: absolute(p) })),
    ...posts.map((p) => ({ loc: absolute(`/blog/${p.slug}`), lastmod: p.data.pubDate.toISOString().slice(0, 10) })),
    ...categories.map((c) => ({ loc: absolute(`/chu-de/${c.slug}`) })),
    ...PRODUCTS.map((p) => ({ loc: absolute(`/tai-lieu/${p.slug}`) })),
    ...SKILLS.map((s) => ({ loc: absolute(`/skill/${s.slug}`) })),
    ...POLICIES.map((p) => ({ loc: absolute(`/chinh-sach/${p.slug}`) })),
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls.map((u) => `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`).join('\n') +
    '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
