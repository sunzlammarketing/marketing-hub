// Tài khoản NHẬN tiền cho thanh toán chuyển khoản VietQR (hiển thị công khai trên web).
// bin: mã ngân hàng theo chuẩn NAPAS/VietQR (Sacombank = 970403).
// Ảnh QR lấy từ img.vietqr.io (xem PaymentModal.astro).
export const BANK = {
  name: 'Sacombank',
  bin: '970403',
  account: '040100308489',
  holder: 'LE VAN DUNG',
};


// Link Web App của Google Apps Script để lưu đơn hàng vào Google Sheet (xem tools/google-sheet-orders.gs).
// Để trống → không lưu, thanh toán QR vẫn hoạt động bình thường.
export const ORDER_SHEET_URL =
  'https://script.google.com/macros/s/AKfycby6L7irtvK2zRWciRZIJ8f37BCWNqCJzgQPhhFrhLVehQfYxMwBmbR-jWLQn7CcMqkVsQ/exec';
