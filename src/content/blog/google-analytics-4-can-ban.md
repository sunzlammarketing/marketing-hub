---
title: "Google Analytics 4 căn bản: Cài đặt và đọc đúng 5 báo cáo quan trọng"
description: "GA4 nhiều báo cáo đến mức choáng ngợp. Hướng dẫn cài đặt, thiết lập chuyển đổi và chỉ tập trung vào 5 báo cáo thực sự giúp bạn ra quyết định."
pubDate: 2026-07-01
category: "du-lieu-do-luong"
tags: ["ga4", "analytics", "do-luong", "website"]
readingTime: 8
---

Mở Google Analytics 4 lần đầu, phần lớn mọi người có chung cảm giác: quá nhiều menu, quá nhiều số, không biết nhìn vào đâu.

Tin tốt là bạn **không cần dùng hết**. Chỉ cần cài đúng và đọc 5 báo cáo, bạn đã trả lời được hầu hết câu hỏi quan trọng về website.

## Cài đặt trong 15 phút

**Bước 1 — Tạo tài khoản.** Vào `analytics.google.com`, tạo Property, chọn múi giờ và đơn vị tiền là **Việt Nam / VND** ngay từ đầu (sửa sau rất phiền).

**Bước 2 — Lấy mã đo lường.** Định dạng `G-XXXXXXX`.

**Bước 3 — Gắn vào website.**
- Website tự code: dán đoạn mã vào thẻ `<head>`
- WordPress: dùng plugin như Site Kit
- Shopify/Wix: có mục nhập sẵn mã GA4 trong phần cài đặt

**Bước 4 — Kiểm tra.** Vào **Báo cáo → Thời gian thực**, mở website trên điện thoại. Nếu thấy 1 người dùng đang hoạt động — đã chạy đúng.

**Bước 5 — Liên kết Search Console.** Trong Quản trị → Liên kết sản phẩm. Việc này giúp bạn xem dữ liệu SEO ngay trong GA4.

## Hiểu 3 khái niệm cốt lõi của GA4

GA4 khác hẳn phiên bản cũ ở chỗ mọi thứ đều là **sự kiện (event)**:

| Khái niệm | Nghĩa đơn giản |
|---|---|
| **Sự kiện** | Một hành động: xem trang, cuộn, bấm link, mua hàng |
| **Chuyển đổi** | Sự kiện bạn đánh dấu là quan trọng (đặt hàng, gửi form) |
| **Phiên** | Một lần khách vào và tương tác cho tới khi rời đi |

Việc quan trọng nhất khi mới cài: **đánh dấu chuyển đổi**. Không có bước này, GA4 chỉ cho bạn biết có bao nhiêu người ghé, chứ không biết bao nhiêu người mang lại giá trị.

Vào **Quản trị → Sự kiện**, bật nút "Đánh dấu là chuyển đổi" cho các sự kiện quan trọng của bạn (ví dụ: `purchase`, `generate_lead`, hoặc sự kiện bấm nút liên hệ).

## 5 báo cáo cần xem, và xem để làm gì

**1. Thu nạp lưu lượng truy cập** *(Acquisition → Traffic acquisition)*
Cho biết khách đến từ đâu: tìm kiếm tự nhiên, mạng xã hội, quảng cáo, truy cập trực tiếp.
→ **Dùng để**: biết kênh nào đáng đầu tư thêm.

**2. Trang và màn hình** *(Engagement → Pages and screens)*
Xếp hạng các trang theo lượt xem và thời gian tương tác.
→ **Dùng để**: biết nội dung nào hiệu quả để viết thêm chủ đề tương tự.

**3. Thời gian thực** *(Realtime)*
→ **Dùng để**: kiểm tra ngay sau khi đăng bài hoặc bật quảng cáo xem có traffic vào không.

**4. Nhân khẩu học & thiết bị** *(User attributes / Tech)*
→ **Dùng để**: nếu 80% khách dùng điện thoại mà web bạn khó dùng trên di động, đó là ưu tiên số một.

**5. Khám phá dạng phễu** *(Explore → Funnel exploration)*
Tự dựng phễu nhiều bước: xem sản phẩm → thêm giỏ → thanh toán → hoàn tất.
→ **Dùng để**: tìm chính xác bước nào khách rơi rụng nhiều nhất.

Báo cáo thứ 5 là thứ giá trị nhất nhưng ít người dùng — nó biến GA4 từ "bảng số liệu" thành công cụ chẩn đoán.

## 4 lỗi phổ biến khi dùng GA4

1. **Không lọc traffic nội bộ** — bạn và nhân viên tự vào web làm sai lệch số liệu. Hãy loại trừ IP nội bộ trong phần Quản trị.
2. **Không đánh dấu chuyển đổi** — dữ liệu đẹp nhưng vô dụng.
3. **So sánh sai kỳ** — so tháng 2 (28 ngày) với tháng 1 (31 ngày) rồi kết luận "giảm".
4. **Nhìn số liệu hằng ngày** — dao động ngày rất nhiễu. Nhìn theo tuần hoặc tháng mới thấy xu hướng thật.

## Thói quen 10 phút mỗi tuần

Mỗi thứ Hai, mở GA4 và trả lời đúng 3 câu:

1. Tuần qua khách đến chủ yếu từ kênh nào?
2. Nội dung nào được xem nhiều nhất?
3. Số chuyển đổi tăng hay giảm so với tuần trước?

Chỉ 10 phút, nhưng duy trì 3 tháng sẽ cho bạn cảm nhận về website tốt hơn bất kỳ khóa học nào.
