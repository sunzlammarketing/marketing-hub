// Chữ giao diện của công cụ kiểm tra SEO on-page — gom một chỗ để sau này dịch sang tiếng Anh.
// (Nội dung 30 điểm: src/data/seo-checklist-30.json. Câu đo được của từng mục: rules.ts.)
import type { Status } from './types';

export const T = {
  statusLabel: {
    pass: 'Đạt',
    warn: 'Cần cải thiện',
    fail: 'Chưa đạt',
    manual: 'Tự kiểm tra',
    na: 'Không áp dụng',
  } satisfies Record<Status, string>,
  manualChecked: 'Tôi đã kiểm tra',
  manualDone: 'Đã tự kiểm tra',
  aiSoon: 'Sắp có: chấm bằng AI',
  why: 'Vì sao',
  how: 'Cách làm',
  tools: 'Công cụ hỗ trợ',
  examples: { good: 'Đúng', bad: 'Sai', info: 'Ví dụ' },
  urgentTitle: 'Ưu tiên sửa ngay',
  urgentEmpty: 'Không còn mục Bắt buộc nào chưa đạt.',
  previewTitle: 'Xem trước trên Google',
  previewEmptyTitle: '(Chưa có title)',
  previewEmptyMeta: '(Chưa có meta description: Google sẽ tự lấy một đoạn trong bài)',
  copy: 'Sao chép báo cáo',
  copied: 'Đã sao chép ✓',
  print: 'In / Lưu PDF',
  points: 'điểm',
  blocked: 'Còn mục Bắt buộc chưa đạt nên xếp “Chưa nên đăng” dù tỷ lệ điểm cao.',
  needKeyword: 'Nhập từ khoá chính để chấm điểm.',
  needContent: 'Dán nội dung bài viết vào ô Nội dung.',
  reportTitle: 'BÁO CÁO KIỂM TRA SEO ON-PAGE (Sunz Làm Marketing)',
};
