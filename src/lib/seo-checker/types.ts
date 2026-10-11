// Kiểu dữ liệu dùng chung cho công cụ kiểm tra SEO on-page 30 điểm.
// Nội dung 30 điểm nằm ở src/data/seo-checklist-30.json — code chỉ đọc, không viết cứng.

export type Priority = 'Bắt buộc' | 'Quan trọng' | 'Nên có';
export type CheckType = 'paste' | 'url' | 'ai' | 'self';
export type Status = 'pass' | 'warn' | 'fail' | 'na' | 'manual';
export type Mode = 'paste' | 'url';

export interface ChecklistItem {
  id: number;
  group: string;
  title: string;
  short: string;
  priority: Priority;
  points: number;
  check_type: CheckType;
  auto_rule: string;
  why: string;
  how: string[];
  examples: { kind: 'good' | 'bad' | 'info'; text: string }[];
  tools: string;
}

export interface Checklist {
  meta: {
    title: string;
    scoring: {
      points_by_priority: Record<Priority, number>;
      max_points: number;
      status_factor: Record<string, number | null>;
      rating: { min: number; label: string }[];
    };
  };
  groups: { key: string; name: string; intro: string }[];
  items: ChecklistItem[];
}

/** Kết quả chấm 1 mục. `manual` = người dùng tự tick (mục ai/self, hoặc url khi đang ở chế độ dán). */
export interface CheckResult {
  id: number;
  status: Status;
  /** Số liệu đo được, 1 dòng ngắn (vd "Title 58 ký tự, chứa từ khoá") */
  measured: string;
  /** Chi tiết: danh sách vị trí thiếu, ảnh lỗi, dàn ý heading... */
  details: string[];
  /** Lý do công cụ không tự chấm (với mục manual) */
  manualReason?: string;
  /** Mục `ai`: sẽ chấm bằng AI ở giai đoạn 2 */
  aiSoon?: boolean;
  /** Nút hỗ trợ tự kiểm tra (mở Google, Search Console...) */
  links?: { label: string; href: string }[];
}

/** Thông tin người dùng nhập ngoài nội dung bài */
export interface PageMeta {
  keyword: string;
  title: string;
  metaDescription: string;
  /** URL đầy đủ hoặc chỉ slug */
  url: string;
  /** Tên miền website, để nhận diện link nội bộ (vd sunzlammarketing.com) */
  domain: string;
}

/** Dữ liệu chỉ có ở chế độ URL (Worker trả về). Bước B mới dùng. */
export interface UrlExtras {
  finalUrl: string;
  status: number;
  headers: Record<string, string>;
  robotsTxt?: string | null;
  sitemapHasUrl?: boolean | null;
  /** Kết quả kiểm link ngoài: href → mã HTTP (0 = không kết nối được) */
  linkStatus?: Record<string, number>;
  /** Dung lượng ảnh (byte) theo src */
  imageBytes?: Record<string, number>;
  /** og:image kích thước (nếu đo được) */
  ogImageSize?: { width: number; height: number } | null;
  pagespeed?: PageSpeedSummary | null;
  pagespeedError?: string | null;
}

export interface PageSpeedSummary {
  /** 'field' = dữ liệu người dùng thật (CrUX), 'lab' = số đo mô phỏng */
  source: 'field' | 'lab';
  lcpMs?: number;
  inpMs?: number;
  tbtMs?: number;
  cls?: number;
  performanceScore?: number;
}

export interface AnalyzeInput {
  doc: Document;
  meta: PageMeta;
  mode: Mode;
  extras?: UrlExtras;
}

export interface ScoreSummary {
  earned: number;
  max: number;
  ratio: number;
  rating: string;
  /** Còn mục Bắt buộc ở trạng thái fail → buộc xếp "Chưa nên đăng" */
  blockedByMandatory: boolean;
  counts: { pass: number; warn: number; fail: number; manual: number; na: number };
  /** Mục Bắt buộc đang fail — "Ưu tiên sửa ngay" */
  urgent: number[];
}
