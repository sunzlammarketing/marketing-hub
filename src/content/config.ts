import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Ngày cập nhật nội dung (chỉ điền khi đã sửa nội dung thật, không đổi ngày cho “có vẻ mới”)
    updatedDate: z.coerce.date().optional(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    readingTime: z.number().optional(),
    cover: z.string().optional(),
    // Ngôn ngữ bài viết. Bản tiếng Anh đặt trong thư mục src/content/blog/en/
    lang: z.enum(['vi', 'en']).default('vi'),
  }),
});

export const collections = { blog };
