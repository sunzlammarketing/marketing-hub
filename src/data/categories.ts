export interface Category {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
}

// Bộ chủ đề. Nút "Tất cả" là filter mặc định (không nằm trong danh sách này).
export const categories: Category[] = [
  {
    slug: 'nen-tang-chien-luoc',
    name: 'Nền tảng & Chiến lược',
    nameEn: 'Foundations & Strategy',
    description: 'Tư duy nền tảng, mô hình và chiến lược Marketing tổng thể.',
    descriptionEn: 'Core mindset, frameworks and overall marketing strategy.',
    icon: '🧭',
    color: '#4f46e5',
  },
  {
    slug: 'khach-hang',
    name: 'Khách hàng',
    nameEn: 'Customers',
    description: 'Nghiên cứu, thấu hiểu và chăm sóc khách hàng.',
    descriptionEn: 'Research, understand and nurture your customers.',
    icon: '👥',
    color: '#0891b2',
  },
  {
    slug: 'thuong-hieu',
    name: 'Thương hiệu',
    nameEn: 'Branding',
    description: 'Định vị, câu chuyện và bản sắc thương hiệu.',
    descriptionEn: 'Positioning, storytelling and brand identity.',
    icon: '⭐',
    color: '#ca8a04',
  },
  {
    slug: 'content-social',
    name: 'Content & Social',
    nameEn: 'Content & Social',
    description: 'Sáng tạo nội dung và phát triển kênh mạng xã hội.',
    descriptionEn: 'Content creation and growing social channels.',
    icon: '✍️',
    color: '#7c3aed',
  },
  {
    slug: 'seo-website',
    name: 'SEO & Website',
    nameEn: 'SEO & Website',
    description: 'Tối ưu tìm kiếm và xây dựng website hiệu quả.',
    descriptionEn: 'Search optimization and building effective websites.',
    icon: '🔍',
    color: '#2563eb',
  },
  {
    slug: 'digital',
    name: 'Digital',
    nameEn: 'Digital',
    description: 'Quảng cáo, email và các kênh digital trả phí.',
    descriptionEn: 'Ads, email and paid digital channels.',
    icon: '📣',
    color: '#dc2626',
  },
  {
    slug: 'growth',
    name: 'Growth',
    nameEn: 'Growth',
    description: 'Tăng trưởng, phễu và tối ưu chuyển đổi.',
    descriptionEn: 'Growth, funnels and conversion optimization.',
    icon: '📈',
    color: '#16a34a',
  },
  {
    slug: 'du-lieu-do-luong',
    name: 'Dữ liệu & Đo lường',
    nameEn: 'Data & Analytics',
    description: 'Phân tích số liệu, đo lường và ra quyết định.',
    descriptionEn: 'Analytics, measurement and data-driven decisions.',
    icon: '📊',
    color: '#ea580c',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
