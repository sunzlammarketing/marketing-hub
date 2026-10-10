/**
 * Lưu đơn hàng từ web Sunz Làm Marketing vào Google Sheet.
 *
 * Cài đặt (1 lần):
 * 1. Tạo Google Sheet mới → Tiện ích mở rộng (Extensions) → Apps Script.
 * 2. Xoá code mẫu, dán toàn bộ file này vào, bấm Lưu.
 * 3. Triển khai (Deploy) → Tùy chọn triển khai mới (New deployment) → loại "Ứng dụng web" (Web app):
 *      - Thực thi dưới dạng (Execute as): Tôi (Me)
 *      - Người có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 *    → Triển khai → cấp quyền → copy "URL ứng dụng web" (dạng https://script.google.com/macros/s/.../exec).
 * 4. Dán URL đó vào ORDER_SHEET_URL trong src/data/payment.ts.
 *
 * Mỗi đơn là 1 dòng. Khi khách bấm "Tôi đã chuyển khoản", cột Trạng thái của đơn đó đổi thành "Khách báo đã CK".
 * Bạn tự đổi thành "Đã gửi file" sau khi gửi tài liệu.
 */

const SHEET_NAME = 'Đơn hàng';
const HEADERS = ['Thời gian', 'Mã đơn (nội dung CK)', 'Sản phẩm', 'Số tiền', 'Họ tên', 'SĐT / Zalo', 'Email', 'Trạng thái', 'Trang'];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#e0e7ff');
  }
  return sh;
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const d = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (d.website) return out_({ ok: false }); // bẫy bot (ô ẩn)
    const sh = getSheet_();
    const code = String(d.code || '').slice(0, 60);

    if (d.action === 'claim') {
      // Khách bấm "Tôi đã chuyển khoản" → cập nhật trạng thái đơn mới nhất có cùng mã
      const codes = sh.getRange(2, 2, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
      for (let i = codes.length - 1; i >= 0; i--) {
        if (codes[i][0] === code) {
          sh.getRange(i + 2, 8).setValue('Khách báo đã CK');
          break;
        }
      }
      return out_({ ok: true });
    }

    sh.appendRow([
      new Date(),
      code,
      String(d.product || '').slice(0, 200),
      Number(d.amount) || '',
      String(d.name || '').slice(0, 100),
      "'" + String(d.phone || '').slice(0, 20), // giữ số 0 đầu
      String(d.email || '').slice(0, 120),
      'Chờ thanh toán',
      String(d.page || '').slice(0, 200),
    ]);
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
