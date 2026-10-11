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
  // Giá mở bán có hạn: trong khoảng from → until bán promo.price, kèm dòng "Giá chính thức" = price
  // (KHÔNG gạch giá, không nhãn %: tránh rủi ro giảm giá >50% theo TT 39/2025/TT-BCT).
  // Hết hạn web tự quay về price (cả hiển thị lẫn số tiền QR). Thời gian theo giờ VN (+07:00).
  promo?: { price: number; from: string; until: string };
  cta?: { vi: string; en: string }; // chữ trên nút mua (mặc định "Mua ngay")
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
    slug: 'ebook-50-cong-thuc-viet-content',
    code: 'EB50CT',
    icon: '✍️',
    color: '#403bd3',
    type: { vi: 'PDF · 32 trang', en: 'PDF · 32 pages' },
    tag: EBOOK,
    image: '/products/ebook-50-cong-thuc/cover.jpg',
    name: {
      vi: 'Ebook 50 công thức viết content theo tình huống bán hàng',
      en: 'Ebook: 50 content formulas for real sales situations',
    },
    desc: {
      vi: 'Gặp tình huống nào, mở đúng công thức đó. 50 công thức chia theo 10 nhóm tình huống bán hàng, mỗi công thức có khung điền sẵn, ví dụ thực tế và mẹo dùng, kèm soát pháp lý quảng cáo.',
      en: 'Find your situation, open the matching formula. 50 formulas in 10 sales-situation groups, each with a fill-in template, a real example and tips, plus a Vietnamese ad-law check.',
    },
    price: 49000,
    originalPrice: 89000,
    intro: {
      vi: 'Phần lớn caption không bán được vì viết sai tình huống: khách hỏi giá rồi im mà vẫn đăng bài giới thiệu, cần doanh số gấp mà lại kể chuyện thương hiệu. Ebook này bắt đầu từ vấn đề bạn đang gặp. Tra bảng "Chọn mẫu theo tình huống", lấy 3 công thức gợi ý, điền bảng biến (sản phẩm, khách hàng, nỗi đau, lợi ích, bằng chứng, ưu đãi) một lần rồi dùng lại cho cả 50 mẫu. Mỗi công thức gồm các bước của khung, "Dùng khi", khung mẫu có [biến] tô màu, ví dụ minh họa hoàn chỉnh cho nhiều ngành (F&B, mỹ phẩm, thời trang, gia dụng, khóa học) và mẹo tránh rủi ro pháp lý, rủi ro uy tín. Cuối sách có checklist 8 điểm trước khi bấm đăng và tóm tắt quy định quảng cáo mới nhất (Luật Quảng cáo sửa đổi 2026, Thông tư 39/2025/TT-BCT).',
      en: 'Most captions fail because they fit the wrong situation: posting a brand intro when customers ask the price and go silent, or telling a brand story when you need sales this week. This ebook starts from your problem. Look up the "Pick by situation" table, take the 3 suggested formulas, fill in your variables once (product, customer, pain, benefit, proof, offer) and reuse them across all 50. Each formula has its steps, "Use when", a fill-in template with highlighted [variables], a complete example across industries (F&B, cosmetics, fashion, home goods, courses) and tips to avoid legal and reputation risks. It ends with an 8-point pre-publish checklist and a summary of the latest Vietnamese ad rules.',
    },
    includes: {
      vi: [
        'Ebook PDF 32 trang, bản 10/2026',
        '50 công thức chia 10 nhóm: kinh điển (AIDA, PAS, BAB, FAB, 4P), kể chuyện, bằng chứng xã hội, ưu đãi & khẩn cấp, ra mắt sản phẩm, giáo dục, tương tác, xử lý phản đối, chăm sóc khách cũ, caption theo nền tảng',
        '50 khung mẫu có [biến] điền sẵn + 50 ví dụ minh họa hoàn chỉnh',
        'Bảng tra "Chọn mẫu theo tình huống": 8 vấn đề bán hàng phổ biến, mỗi vấn đề 4 công thức nên thử',
        'Bảng biến điền một lần, dùng lại cho cả 50 mẫu',
        'Format riêng cho TikTok, Instagram, Shopee/Lazada/TikTok Shop, Zalo OA, thông báo livestream',
        'Checklist 8 điểm trước khi đăng + lưu ý pháp lý quảng cáo VN',
      ],
      en: [
        '32-page PDF ebook, October 2026 edition',
        '50 formulas in 10 groups: classics (AIDA, PAS, BAB, FAB, 4P), storytelling, social proof, offers & urgency, launches, education, engagement, objection handling, repeat customers, platform-specific captions',
        '50 fill-in templates with [variables] + 50 complete examples',
        '"Pick by situation" table: 8 common sales problems, 4 formulas to try for each',
        'A variables sheet you fill once and reuse for all 50 templates',
        'Formats for TikTok, Instagram, Shopee/Lazada/TikTok Shop, Zalo OA and livestream announcements',
        '8-point pre-publish checklist + Vietnamese ad-law notes',
      ],
    },
    forWho: {
      vi: [
        'Chủ shop online, người bán hàng tự viết content mỗi ngày',
        'Người làm content, marketer cần nhiều góc viết để A/B test',
        'Khách hỏi nhiều mà ít chốt, cần câu trả lời cho "Sao đắt vậy?", "Có hiệu quả thật không?"',
        'Sắp chạy sale, ra mắt sản phẩm, livestream hoặc muốn gọi khách cũ quay lại',
        'Muốn AI viết luôn theo bộ công thức này: xem thêm Skill viết content theo tình huống bán hàng',
      ],
      en: [
        'Online shop owners who write their own content every day',
        'Content creators and marketers who need many angles to A/B test',
        'Sellers who get lots of questions but few orders, and need answers to "Why so expensive?" or "Does it really work?"',
        'Anyone planning a sale, a launch, a livestream or a win-back campaign',
        'Want AI to write with these formulas for you? See the Sales-situation content writing skill',
      ],
    },
    gallery: [
      '/products/ebook-50-cong-thuc/trang-2.jpg',
      '/products/ebook-50-cong-thuc/trang-3.jpg',
      '/products/ebook-50-cong-thuc/trang-6.jpg',
      '/products/ebook-50-cong-thuc/trang-31.jpg',
    ],
  },
];

export const MESSENGER = 'https://m.me/sunzlammarketing';
// Mã sản phẩm cho nội dung chuyển khoản: chữ đầu mỗi cụm của slug, giữ nguyên số (vd ke-hoach-content-30-ngay → KHC30N)
export const productCode = (p: Product) =>
  (p.code || p.slug.split('-').map((w) => (/^\d+$/.test(w) ? w : w[0])).join('')).toUpperCase().slice(0, 8);
export const productUrl = (p: Product) => `/tai-lieu/${p.slug}`;
export const buyHref = (p: Product) =>
  p.buyUrl || `${MESSENGER}?text=${encodeURIComponent(`Xin chào Sunz, mình muốn mua sản phẩm: ${p.name.vi}`)}`;
// Giá đang áp dụng tại thời điểm `at` (mặc định lúc build)
export const effectivePrice = (p: Product, at = Date.now()) => {
  const promoOn = p.promo && at >= Date.parse(p.promo.from) && at <= Date.parse(p.promo.until);
  const price = promoOn ? p.promo!.price : p.price;
  // Giá mở bán không hiển thị dạng giảm giá; chỉ originalPrice mới gạch ngang
  const old = promoOn ? null : p.originalPrice;
  const off = price != null && old && old > price ? Math.round((1 - price / old) * 100) : null;
  return { price, old: off ? old! : null, off, promo: promoOn ? p.promo! : null };
};
// Ngày (dd-mm, giờ VN) — dùng cho nhãn "đến hết 20-10" / "từ 21-10"
export const vnDay = (iso: string, plusMs = 0) =>
  new Date(Date.parse(iso) + plusMs).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' });
export const formatVnd = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
