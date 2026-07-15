export interface Category {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
}

export const categories: Category[] = [
  {
    slug: 'seo',
    name: 'SEO',
    nameEn: 'SEO',
    description: 'Tối ưu công cụ tìm kiếm, kéo traffic tự nhiên bền vững.',
    descriptionEn: 'Search engine optimization for sustainable organic traffic.',
    icon: '🔍',
    color: '#2563eb',
  },
  {
    slug: 'content',
    name: 'Content Marketing',
    nameEn: 'Content Marketing',
    description: 'Xây dựng nội dung thu hút và nuôi dưỡng khách hàng.',
    descriptionEn: 'Build engaging content that attracts and nurtures customers.',
    icon: '✍️',
    color: '#7c3aed',
  },
  {
    slug: 'ads',
    name: 'Quảng cáo (Ads)',
    nameEn: 'Advertising (Ads)',
    description: 'Facebook Ads, Google Ads và tối ưu chi phí chuyển đổi.',
    descriptionEn: 'Facebook Ads, Google Ads and cost-per-conversion optimization.',
    icon: '📣',
    color: '#dc2626',
  },
  {
    slug: 'social-media',
    name: 'Social Media',
    nameEn: 'Social Media',
    description: 'Phát triển thương hiệu trên các nền tảng mạng xã hội.',
    descriptionEn: 'Grow your brand across social media platforms.',
    icon: '💬',
    color: '#0891b2',
  },
  {
    slug: 'email',
    name: 'Email Marketing',
    nameEn: 'Email Marketing',
    description: 'Xây dựng phễu email, tự động hóa và tăng tỷ lệ mở.',
    descriptionEn: 'Build email funnels, automation and higher open rates.',
    icon: '✉️',
    color: '#ea580c',
  },
  {
    slug: 'branding',
    name: 'Thương hiệu',
    nameEn: 'Branding',
    description: 'Định vị thương hiệu, câu chuyện và bản sắc doanh nghiệp.',
    descriptionEn: 'Brand positioning, storytelling and business identity.',
    icon: '⭐',
    color: '#ca8a04',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
