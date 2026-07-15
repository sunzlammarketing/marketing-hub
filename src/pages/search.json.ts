import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getCategory } from '../data/categories';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const data = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((p) => {
      const cat = getCategory(p.data.category);
      return {
        slug: p.slug,
        title: p.data.title,
        description: p.data.description,
        category: p.data.category,
        categoryName: cat?.name ?? p.data.category,
        categoryIcon: cat?.icon ?? '📄',
        tags: p.data.tags,
        pubDate: p.data.pubDate.toISOString(),
        readingTime: p.data.readingTime ?? null,
      };
    });

  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
};
