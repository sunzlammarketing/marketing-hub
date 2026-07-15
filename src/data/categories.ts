export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    slug: 'seo',
    name: 'SEO',
    description: 'Tối ưu công cụ tìm kiếm, kéo traffic tự nhiên bền vững.',
    icon: '🔍',
    color: '#2563eb',
  },
  {
    slug: 'content',
    name: 'Content Marketing',
    description: 'Xây dựng nội dung thu hút và nuôi dưỡng khách hàng.',
    icon: '✍️',
    color: '#7c3aed',
  },
  {
    slug: 'ads',
    name: 'Quảng cáo (Ads)',
    description: 'Facebook Ads, Google Ads và tối ưu chi phí chuyển đổi.',
    icon: '📣',
    color: '#dc2626',
  },
  {
    slug: 'social-media',
    name: 'Social Media',
    description: 'Phát triển thương hiệu trên các nền tảng mạng xã hội.',
    icon: '💬',
    color: '#0891b2',
  },
  {
    slug: 'email',
    name: 'Email Marketing',
    description: 'Xây dựng phễu email, tự động hóa và tăng tỷ lệ mở.',
    icon: '✉️',
    color: '#ea580c',
  },
  {
    slug: 'branding',
    name: 'Thương hiệu',
    description: 'Định vị thương hiệu, câu chuyện và bản sắc doanh nghiệp.',
    icon: '⭐',
    color: '#ca8a04',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
