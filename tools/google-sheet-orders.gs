/**
 * Đơn hàng web Sunz Làm Marketing: lưu đơn vào Google Sheet + gửi email giao hàng.
 *
 * ── CÀI ĐẶT LẦN ĐẦU ─────────────────────────────────────────────────────────────
 * 1. Google Sheet → Tiện ích mở rộng → Apps Script → dán toàn bộ file này → Lưu.
 * 2. Triển khai → Tùy chọn triển khai mới → Ứng dụng web
 *      Thực thi dưới dạng: Tôi · Người có quyền truy cập: Bất kỳ ai → Triển khai.
 *    Copy URL /exec dán vào ORDER_SHEET_URL (src/data/payment.ts).
 *
 * ── BẬT GỬI EMAIL (làm 1 lần sau khi dán bản code này) ─────────────────────────
 * 3. Điền link tải vào PRODUCTS bên dưới (link Google Drive đã chia sẻ "Bất kỳ ai có đường liên kết").
 * 4. Trên thanh công cụ Apps Script chọn hàm  setup  → bấm Chạy → cấp quyền.
 *    (Tạo trình kích hoạt + danh sách trạng thái + menu "Sunz".)
 *    Không cần triển khai lại web app: phần lưu đơn vẫn dùng URL cũ.
 *
 * ── CÁCH DÙNG HẰNG NGÀY ─────────────────────────────────────────────────────────
 * Đối chiếu sao kê → ở cột "Trạng thái" chọn "Đã thanh toán"
 * → email giao hàng tự gửi cho khách, trạng thái đổi thành "Đã gửi email" + ghi giờ gửi.
 * Gửi lại: chọn dòng → menu Sunz → "Gửi lại email giao hàng cho dòng đang chọn".
 */

// ===== CẤU HÌNH =====
const SHEET_NAME = 'Đơn hàng';
const SITE = 'https://sunzlammarketing.sunzlammarketing.workers.dev';
const BRAND = 'Sunz Làm Marketing';
const SUPPORT = {
  messenger: 'https://m.me/sunzlammarketing',
  tiktok: 'https://www.tiktok.com/@sunz.lam.marketing',
  email: 'sunzlammarketing@gmail.com',
};

// Mã sản phẩm = chữ thứ 2 trong nội dung CK ("SUNZ <MÃ> <SĐT>").
// files: link tải (Drive). guide: link hướng dẫn. page: trang sản phẩm trên web.
const PRODUCTS = {
  SKILL50: {
    name: 'Skill viết content theo tình huống bán hàng',
    page: SITE + '/skill/viet-content-theo-tinh-huong-ban-hang',
    files: [
      { title: 'Bản cho Claude & Codex (.zip)', desc: 'Upload vào Claude: Customize › Skills › Upload a skill. Giữ nguyên tên file, không giải nén.', url: '' },
      { title: 'Bản cho ChatGPT & Gemini', desc: 'File .md + file Instructions dán sẵn, dùng qua ChatGPT Project hoặc Gemini Gem.', url: '' },
      { title: 'Hướng dẫn cài đặt (PDF)', desc: 'Các bước cài trên Claude, Codex, ChatGPT, Gemini.', url: '' },
    ],
  },
  KHC30N: { name: 'Template kế hoạch content 30 ngày', page: SITE + '/tai-lieu/ke-hoach-content-30-ngay', files: [{ title: 'Tải tài liệu', desc: '', url: '' }] },
  PMA: { name: 'Template phễu Marketing AARRR', page: SITE + '/tai-lieu/pheu-marketing-aarrr', files: [{ title: 'Tải tài liệu', desc: '', url: '' }] },
  CSOP: { name: 'Checklist 30 điểm tối ưu SEO on-page', page: SITE + '/tai-lieu/checklist-seo-on-page', files: [{ title: 'Tải tài liệu', desc: '', url: '' }] },
  NMM: { name: 'Ebook nhập môn Marketing cho người mới', page: SITE + '/tai-lieu/nhap-mon-marketing', files: [{ title: 'Tải tài liệu', desc: '', url: '' }] },
  CNFA: { name: 'Ebook cẩm nang chạy Facebook Ads', page: SITE + '/tai-lieu/cam-nang-facebook-ads', files: [{ title: 'Tải tài liệu', desc: '', url: '' }] },
  '50MCBH': { name: 'Swipe file 50 mẫu caption bán hàng', page: SITE + '/tai-lieu/50-mau-caption-ban-hang', files: [{ title: 'Tải tài liệu', desc: '', url: '' }] },
};

// Cột trong sheet (1 = A)
const COL = { time: 1, code: 2, product: 3, amount: 4, name: 5, phone: 6, email: 7, status: 8, page: 9, sentAt: 10 };
const HEADERS = ['Thời gian', 'Mã đơn (nội dung CK)', 'Sản phẩm', 'Số tiền', 'Họ tên', 'SĐT / Zalo', 'Email', 'Trạng thái', 'Trang', 'Đã gửi email lúc'];
const STATUS = { pending: 'Chờ thanh toán', claimed: 'Khách báo đã CK', paid: 'Đã thanh toán', sent: 'Đã gửi email', missing: 'Thiếu link tải', cancel: 'Huỷ' };

// ===== LƯU ĐƠN TỪ WEB =====
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
      // Khách bấm "Tôi đã chuyển khoản" → cập nhật đơn mới nhất cùng mã (nếu chưa xử lý)
      const codes = sh.getRange(2, COL.code, Math.max(sh.getLastRow() - 1, 1), 1).getValues();
      for (let i = codes.length - 1; i >= 0; i--) {
        if (codes[i][0] === code) {
          const cell = sh.getRange(i + 2, COL.status);
          if (cell.getValue() === STATUS.pending) cell.setValue(STATUS.claimed);
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
      STATUS.pending,
      String(d.page || '').slice(0, 200),
      '',
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

// ===== CÀI ĐẶT 1 LẦN =====
function setup() {
  const sh = getSheet_();
  // Tiêu đề cột mới (nếu sheet cũ chưa có)
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#e0e7ff');
  // Danh sách trạng thái chọn nhanh
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(Object.values(STATUS), true)
    .setAllowInvalid(true)
    .build();
  sh.getRange(2, COL.status, sh.getMaxRows() - 1, 1).setDataValidation(rule);
  // Trình kích hoạt khi sửa ô (cần quyền gửi email nên phải là installable trigger)
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onStatusEdit')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onStatusEdit').forSpreadsheet(ss).onEdit().create();
  SpreadsheetApp.getUi().alert('Đã bật gửi email giao hàng. Chọn "Đã thanh toán" ở cột Trạng thái để gửi.');
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Sunz')
    .addItem('Gửi lại email giao hàng cho dòng đang chọn', 'resendSelected')
    .addItem('Gửi email mẫu cho chính mình', 'sendTestToMe')
    .addToUi();
}

// ===== GỬI EMAIL KHI ĐỔI TRẠNG THÁI =====
function onStatusEdit(e) {
  const r = e.range;
  if (r.getSheet().getName() !== SHEET_NAME || r.getColumn() !== COL.status || r.getRow() < 2 || r.getNumRows() !== 1) return;
  if (String(e.value || r.getValue()) !== STATUS.paid) return;
  deliver_(r.getRow());
}

function resendSelected() {
  const sh = getSheet_();
  const row = sh.getActiveRange().getRow();
  if (row < 2) return SpreadsheetApp.getUi().alert('Chọn một dòng đơn hàng trước.');
  deliver_(row);
}

function deliver_(row) {
  const sh = getSheet_();
  const v = sh.getRange(row, 1, 1, HEADERS.length).getValues()[0];
  const order = {
    code: String(v[COL.code - 1]),
    productName: String(v[COL.product - 1]),
    amount: Number(v[COL.amount - 1]) || 0,
    name: String(v[COL.name - 1] || '').trim(),
    phone: String(v[COL.phone - 1]).replace(/^'/, ''),
    email: String(v[COL.email - 1] || '').trim(),
  };
  const statusCell = sh.getRange(row, COL.status);
  const pcode = order.code.split(/\s+/)[1] || '';
  const product = PRODUCTS[pcode];

  if (!order.email) return note_(statusCell, STATUS.paid, 'Đơn chưa có email khách.');
  if (!product || product.files.some((f) => !f.url)) {
    statusCell.setValue(STATUS.missing);
    return note_(statusCell, STATUS.missing, 'Chưa điền link tải cho mã "' + pcode + '" trong PRODUCTS (Apps Script).');
  }

  MailApp.sendEmail({
    to: order.email,
    subject: 'Thanh toán thành công · ' + product.name,
    name: BRAND,
    replyTo: SUPPORT.email,
    htmlBody: buildEmail_(order, product),
    body: plainText_(order, product),
  });
  statusCell.setValue(STATUS.sent).setNote('');
  sh.getRange(row, COL.sentAt).setValue(new Date());
}

function note_(cell, status, msg) {
  cell.setNote(msg);
  SpreadsheetApp.getActive().toast(msg, 'Chưa gửi được email', 8);
}

function sendTestToMe() {
  const me = Session.getActiveUser().getEmail() || SUPPORT.email;
  const product = PRODUCTS.SKILL50;
  const order = { code: 'SUNZ SKILL50 0900000000', productName: product.name, amount: 99000, name: 'Khách hàng mẫu', phone: '0900000000', email: me };
  MailApp.sendEmail({ to: me, subject: '[MẪU] Thanh toán thành công · ' + product.name, name: BRAND, htmlBody: buildEmail_(order, product), body: plainText_(order, product) });
  SpreadsheetApp.getActive().toast('Đã gửi email mẫu tới ' + me, 'Sunz', 5);
}

// ===== NỘI DUNG EMAIL (theo bố cục email giao hàng của Noti) =====
const esc_ = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const vnd_ = (n) => Number(n).toLocaleString('vi-VN') + ' ₫';

function buildEmail_(o, p) {
  const row = (k, v) =>
    '<tr><td style="padding:8px 0;color:#64748b;width:42%">' + k + '</td><td style="padding:8px 0;font-weight:700;color:#0f172a">' + v + '</td></tr>';
  const files = p.files
    .map(
      (f) =>
        '<div style="border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:0 0 12px">' +
        '<div style="font-weight:800;color:#0f172a;font-size:15px">' + esc_(f.title) + '</div>' +
        (f.desc ? '<div style="color:#64748b;font-size:13px;margin:4px 0 12px">' + esc_(f.desc) + '</div>' : '<div style="height:10px"></div>') +
        '<a href="' + esc_(f.url) + '" style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;font-weight:800;padding:10px 18px;border-radius:10px">Tải xuống →</a>' +
        '</div>'
    )
    .join('');
  return (
    '<div style="background:#f1f5f9;padding:24px 12px;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif">' +
    '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #e2e8f0">' +
    // Header
    '<div style="background:linear-gradient(135deg,#312e81,#4f46e5);padding:28px 28px 24px;color:#fff">' +
    '<img src="' + SITE + '/logo-mark.png" width="40" height="40" alt="Sunz" style="background:#fff;border-radius:10px;padding:4px;display:block;margin-bottom:14px">' +
    '<div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.8">Thanh toán thành công</div>' +
    '<div style="font-size:22px;font-weight:900;margin-top:6px;line-height:1.3">' + esc_(p.name) + '</div>' +
    '</div>' +
    // Xác nhận
    '<div style="padding:24px 28px 8px;text-align:center">' +
    '<div style="display:inline-block;width:52px;height:52px;line-height:52px;border-radius:50%;background:#d1fae5;color:#059669;font-size:28px;font-weight:900">✓</div>' +
    '<div style="font-size:18px;font-weight:900;color:#0f172a;margin-top:10px">Thanh toán đã được xác nhận!</div>' +
    '<div style="color:#64748b;margin-top:4px">Cảm ơn bạn đã tin tưởng ' + BRAND + '.</div>' +
    '</div>' +
    '<div style="padding:8px 28px 0;color:#334155;line-height:1.7">' +
    '<p>Xin chào <b>' + esc_(o.name || 'bạn') + '</b>,</p>' +
    '<p>Sunz đã nhận được thanh toán của bạn cho <b>' + esc_(p.name) + '</b>. Dưới đây là thông tin đơn hàng và link tải tài liệu.</p>' +
    '</div>' +
    // Thông tin đơn
    '<div style="margin:8px 28px 0;padding:6px 18px;background:#f8fafc;border-radius:14px">' +
    '<div style="font-weight:800;color:#0f172a;padding-top:12px">Thông tin đơn hàng</div>' +
    '<table style="width:100%;border-collapse:collapse;font-size:14px">' +
    row('Họ và tên', esc_(o.name || '—')) +
    row('Email', esc_(o.email)) +
    row('Số điện thoại', esc_(o.phone)) +
    row('Mã đơn', esc_(o.code)) +
    row('Số tiền', vnd_(o.amount)) +
    row('Trạng thái', '<span style="color:#059669">Đã thanh toán</span>') +
    '</table></div>' +
    '<p style="margin:16px 28px 0;padding:12px 14px;background:#fff7ed;border-radius:12px;color:#9a3412;font-size:13px"><b>Lưu ý:</b> Vui lòng lưu email này và đánh dấu quan trọng để tải lại khi cần nhé.</p>' +
    // Link tải
    '<div style="padding:22px 28px 4px"><div style="font-weight:900;color:#0f172a;font-size:16px;margin-bottom:12px">Link tải tài liệu</div>' + files + '</div>' +
    // Hướng dẫn & hỗ trợ
    '<div style="padding:4px 28px 8px;font-size:14px;line-height:2">' +
    '<div style="font-weight:900;color:#0f172a;font-size:16px">Tài liệu & hỗ trợ</div>' +
    '<a href="' + p.page + '" style="color:#4f46e5">Trang sản phẩm & hướng dẫn sử dụng →</a><br>' +
    '<a href="' + SUPPORT.messenger + '" style="color:#4f46e5">Cần hỗ trợ? Nhắn Sunz qua Messenger →</a><br>' +
    '<a href="' + SUPPORT.tiktok + '" style="color:#4f46e5">Theo dõi Sunz trên TikTok →</a>' +
    '</div>' +
    '<p style="padding:0 28px;color:#334155">Chúc bạn ứng dụng thành công!</p>' +
    // Footer
    '<div style="margin-top:18px;padding:18px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#94a3b8;font-size:12px;line-height:1.6">' +
    '<b style="color:#475569">' + BRAND + '</b> · <a href="' + SITE + '" style="color:#94a3b8">' + SITE.replace('https://', '') + '</a><br>' +
    '© 2026 ' + BRAND + '. Tài liệu dành riêng cho người mua. Nghiêm cấm sao chép, chia sẻ hoặc bán lại khi chưa được cho phép.' +
    '</div></div></div>'
  );
}

function plainText_(o, p) {
  return [
    'Thanh toán thành công · ' + p.name,
    '',
    'Xin chào ' + (o.name || 'bạn') + ',',
    'Sunz đã nhận được thanh toán của bạn cho ' + p.name + '.',
    '',
    'Mã đơn: ' + o.code,
    'Số tiền: ' + vnd_(o.amount),
    '',
    'Link tải:',
    ...p.files.map((f) => '- ' + f.title + ': ' + f.url),
    '',
    'Trang sản phẩm: ' + p.page,
    'Hỗ trợ: ' + SUPPORT.messenger,
    '',
    '© 2026 ' + BRAND,
  ].join('\n');
}
