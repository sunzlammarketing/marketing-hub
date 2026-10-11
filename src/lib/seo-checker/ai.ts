// GIAI ĐOẠN 2 (chưa làm): chấm 6 mục check_type = "ai" (2, 5, 13, 16, 17, 20) bằng Claude API.
// Chỉ khai báo kiểu để giao diện và server sau này dùng chung. Chưa có code gọi API.
//
// Luồng dự kiến:
// 1. Người dùng bấm "Chấm chuyên sâu bằng AI" → nhập email để mở khoá.
// 2. Trình duyệt gửi AiCheckRequest tới Worker (POST /api/seo/ai). Worker giữ API key, giới hạn lượt/ngày.
// 3. Worker trả AiCheckResponse; giao diện thay kết quả "manual" của các mục AI bằng kết quả này.
import type { CheckResult } from './types';

export const AI_ITEM_IDS = [2, 5, 13, 16, 17, 20] as const;
export type AiItemId = (typeof AI_ITEM_IDS)[number];

export interface AiCheckRequest {
  email: string;
  keyword: string;
  title: string;
  /** Nội dung bài dạng chữ (đã cắt gọn, giới hạn độ dài ở server) */
  text: string;
  /** Dàn ý heading để AI hiểu cấu trúc */
  outline: string[];
  items: AiItemId[];
}

export interface AiCheckResponse {
  results: (CheckResult & { id: AiItemId })[];
  /** Số lượt chấm AI còn lại hôm nay */
  remainingToday: number;
}
