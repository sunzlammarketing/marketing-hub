# Marketing Hub 🚀

Trang web chia sẻ kiến thức Marketing thực chiến cho người Việt, xây dựng bằng [Astro](https://astro.build).

## Tính năng

- 🏠 **Trang chủ** với hero, danh mục chủ đề, bài nổi bật và bài mới nhất
- 📝 **Blog** viết bằng Markdown (Content Collections) + trang chi tiết bài
- 🗂 **Phân loại theo chủ đề**: SEO, Content, Ads, Social Media, Email, Thương hiệu
- 🔍 **Tìm kiếm** phía client (hỗ trợ bỏ dấu tiếng Việt)
- 👋 Trang **Giới thiệu** và **Liên hệ** (form có kiểm tra dữ liệu)
- 🌗 Tự động **sáng/tối** theo hệ điều hành, responsive trên mọi thiết bị

## Cài đặt & chạy

```bash
npm install       # cài dependencies
npm run dev       # chạy server phát triển tại http://localhost:4321
npm run build     # build ra thư mục dist/
npm run preview   # xem thử bản build
```

## Cấu trúc thư mục

```
src/
├── components/     # Header, Footer, PostCard
├── content/
│   ├── config.ts   # schema của bài viết
│   └── blog/       # các bài viết .md — THÊM BÀI MỚI Ở ĐÂY
├── data/
│   └── categories.ts   # danh sách chủ đề
├── layouts/        # BaseLayout, PostLayout
├── pages/          # các trang & route
│   ├── index.astro        # trang chủ
│   ├── blog/              # danh sách + chi tiết bài
│   ├── chu-de/            # danh mục & từng chủ đề
│   ├── tim-kiem.astro     # trang tìm kiếm
│   ├── search.json.ts     # endpoint dữ liệu cho tìm kiếm
│   ├── gioi-thieu.astro
│   └── lien-he.astro
└── styles/global.css      # hệ thống màu & typography
```

## Viết bài mới

Tạo file `.md` mới trong `src/content/blog/`, ví dụ `bai-viet-moi.md`:

```markdown
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn hiển thị ở thẻ và SEO."
pubDate: 2026-07-15
category: "seo"        # slug lấy từ src/data/categories.ts
tags: ["tag1", "tag2"]
author: "Tên tác giả"
readingTime: 6
---

Nội dung bài viết bằng **Markdown**...
```

Bài viết sẽ tự động xuất hiện trên trang chủ, trang blog, đúng chủ đề và trong tìm kiếm.

## Thêm / sửa chủ đề

Chỉnh sửa file `src/data/categories.ts` — thêm object mới với `slug`, `name`, `description`, `icon`, `color`.

## Ghi chú

- Form liên hệ hiện là **demo** (chưa gửi thật). Khi triển khai, nối vào dịch vụ như Formspree, hoặc một API backend.
- Đổi domain thật trong `astro.config.mjs` (trường `site`) để tối ưu SEO.
