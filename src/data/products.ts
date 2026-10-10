// Sản phẩm trang Tài liệu (/tai-lieu). Thêm/sửa sản phẩm tại đây.
// - price: số tiền VND (vd 49000). Để null nếu chưa có giá → hiện "Liên hệ".
// - image: ảnh xem trước (bỏ vào public/products/, vd '/products/ke-hoach.jpg', tỉ lệ 4:3).
//   Để trống thì tự vẽ ảnh bìa theo màu + icon.
// - buyUrl: link mua riêng (Zalo, Shopee...). Để trống → mở Messenger fanpage kèm tin nhắn soạn sẵn.
export interface Product {
  slug: string;
  icon: string;
  color: string;
  type: { vi: string; en: string };
  tag: { vi: string; en: string };
  name: { vi: string; en: string };
  desc: { vi: string; en: string };
  price: number | null;
  originalPrice?: number; // giá gốc (gạch ngang) — chỉ hiện khi lớn hơn price
  image?: string;
  buyUrl?: string;
  code?: string; // mã ngắn trong nội dung chuyển khoản (không dấu). Bỏ trống → tự tạo từ slug
  // Trang chi tiết (/tai-lieu/<slug>) — tuỳ chọn, có thì hiện:
  intro?: { vi: string; en: string };       // đoạn giới thiệu dài
  includes?: { vi: string[]; en: string[] }; // "Bạn nhận được gì"
  forWho?: { vi: string[]; en: string[] };   // "Phù hợp với ai"
  gallery?: string[];                        // ảnh chụp thêm (public/products/...)
}

const TEMPLATE = { vi: 'Template - Tài liệu Marketing', en: 'Template - Marketing Resource' };
const EBOOK = { vi: 'Ebook - Tài liệu Marketing', en: 'Ebook - Marketing Resource' };
const CHECKLIST = { vi: 'Checklist - Tài liệu Marketing', en: 'Checklist - Marketing Resource' };

export const PRODUCTS: Product[] = [
  {
    slug: 'ke-hoach-content-30-ngay',
    icon: '🗓️',
    color: '#4f46e5',
    type: { vi: 'Google Sheet', en: 'Google Sheet' },
    tag: TEMPLATE,
    name: { vi: 'Template kế hoạch content 30 ngày', en: '30-day content plan template' },
    desc: {
      vi: 'Mẫu lịch nội dung dựng sẵn cấu trúc, chỉ việc điền chủ đề và triển khai.',
      en: 'A content calendar template with the structure ready — just add your topics.',
    },
    price: 49000,
    originalPrice: 99000,
  },
  {
    slug: 'pheu-marketing-aarrr',
    icon: '🔻',
    color: '#16a34a',
    type: { vi: 'Google Sheet', en: 'Google Sheet' },
    tag: TEMPLATE,
    name: { vi: 'Template phễu Marketing AARRR', en: 'AARRR marketing funnel template' },
    desc: {
      vi: 'Khung phễu giúp bạn vẽ và đo lường hành trình khách hàng qua 5 giai đoạn.',
      en: 'A funnel framework to map and measure the customer journey across 5 stages.',
    },
    price: 49000,
    originalPrice: 99000,
  },
  {
    slug: 'checklist-seo-on-page',
    icon: '✅',
    color: '#2563eb',
    type: { vi: 'PDF · 2 trang', en: 'PDF · 2 pages' },
    tag: CHECKLIST,
    name: { vi: 'Checklist 30 điểm tối ưu SEO on-page', en: '30-point on-page SEO checklist' },
    desc: {
      vi: 'Danh sách kiểm tra giúp bạn tối ưu từng bài viết chuẩn SEO trước khi xuất bản.',
      en: 'A checklist to optimize every article for SEO before you publish.',
    },
    price: 49000,
    originalPrice: 99000,
  },
  {
    slug: 'nhap-mon-marketing',
    icon: '📘',
    color: '#7c3aed',
    type: { vi: 'PDF · 24 trang', en: 'PDF · 24 pages' },
    tag: EBOOK,
    name: { vi: 'Ebook nhập môn Marketing cho người mới', en: 'Marketing basics ebook for beginners' },
    desc: {
      vi: 'Tổng quan các khái niệm và tư duy Marketing nền tảng, trình bày dễ hiểu cho người mới bắt đầu.',
      en: 'An overview of core marketing concepts and mindset, easy to grasp for beginners.',
    },
    price: 49000,
    originalPrice: 99000,
  },
  {
    slug: 'cam-nang-facebook-ads',
    icon: '📣',
    color: '#dc2626',
    type: { vi: 'PDF · 32 trang', en: 'PDF · 32 pages' },
    tag: EBOOK,
    name: { vi: 'Ebook cẩm nang chạy Facebook Ads', en: 'Facebook Ads handbook ebook' },
    desc: {
      vi: 'Hướng dẫn từ tạo chiến dịch đến tối ưu chi phí, kèm ví dụ thực tế dễ áp dụng.',
      en: 'From creating campaigns to cutting costs, with practical examples.',
    },
    price: 49000,
    originalPrice: 99000,
  },
  {
    slug: '50-mau-caption-ban-hang',
    icon: '✍️',
    color: '#ea580c',
    type: { vi: 'PDF', en: 'PDF' },
    tag: TEMPLATE,
    name: { vi: 'Swipe file 50 mẫu caption bán hàng', en: 'Swipe file: 50 sales captions' },
    desc: {
      vi: 'Bộ 50 mẫu caption theo nhiều công thức copywriting để bạn tham khảo và biến tấu.',
      en: '50 captions across copywriting formulas to reference and adapt.',
    },
    price: 49000,
    originalPrice: 99000,
  },
];

export const MESSENGER = 'https://m.me/sunzlammarketing';
// Mã sản phẩm cho nội dung chuyển khoản: chữ đầu mỗi cụm của slug, giữ nguyên số (vd ke-hoach-content-30-ngay → KHC30N)
export const productCode = (p: Product) =>
  (p.code || p.slug.split('-').map((w) => (/^\d+$/.test(w) ? w : w[0])).join('')).toUpperCase().slice(0, 8);
export const productUrl = (p: Product) => `/tai-lieu/${p.slug}`;
export const buyHref = (p: Product) =>
  p.buyUrl || `${MESSENGER}?text=${encodeURIComponent(`Xin chào Sunz, mình muốn mua sản phẩm: ${p.name.vi}`)}`;
// % giảm so với giá gốc (null nếu không có giảm giá)
export const discountPct = (p: Product) =>
  p.price != null && p.originalPrice && p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100)
    : null;
export const formatVnd = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
