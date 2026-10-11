/**
 * Đơn hàng web Sunz Làm Marketing: lưu đơn vào Google Sheet + gửi email giao hàng
 * + phục vụ link tải có bảo vệ (hết hạn, giới hạn lượt tải, file Drive để riêng tư).
 *
 * ── CÀI ĐẶT ─────────────────────────────────────────────────────────────────────
 * 1. Google Sheet → Tiện ích mở rộng → Apps Script → dán toàn bộ file này → Lưu.
 * 2. Điền fileId (ID trong link Drive) cho từng file ở PRODUCTS bên dưới.
 *    File hoặc THƯ MỤC đều được (thư mục sẽ tự nén .zip khi tải).
 * 3. Chọn hàm  authorize  → Chạy → cấp quyền (đọc Drive). Nhật ký liệt kê tên file là đúng.
 * 4. Chọn hàm  setup  → Chạy (tạo trình kích hoạt, menu "Sunz", cột Lượt tải, khoá ký link).
 * 5. Triển khai → Quản lý các bản triển khai → ✏️ → Phiên bản mới → Triển khai (giữ nguyên URL).
 * 6. Sau khi thử tải OK: đổi chia sẻ các file/thư mục trên Drive về "Bị hạn chế".
 *
 * ── HẰNG NGÀY ───────────────────────────────────────────────────────────────────
 * Đối chiếu sao kê → cột "Trạng thái" chọn "Đã thanh toán" → email giao hàng tự gửi.
 * Menu Sunz › "Gửi lại email…" = gửi link mới cho dòng đang chọn (đặt lại lượt tải).
 */

// ===== CẤU HÌNH =====
const SHEET_NAME = 'Đơn hàng';
const SITE = 'https://sunzlammarketing.sunzlammarketing.workers.dev';
const BRAND = 'Sunz Làm Marketing';
const LINK_DAYS = 30; // link tải dùng được bao nhiêu ngày
const MAX_DOWNLOADS = 15; // tổng lượt tải tối đa cho mỗi đơn (mọi file cộng lại)
const SUPPORT = {
  messenger: 'https://m.me/sunzlammarketing',
  tiktok: 'https://www.tiktok.com/@sunz.lam.marketing',
  email: 'sunzlammarketing@gmail.com',
};

// Mã sản phẩm = chữ thứ 2 trong nội dung CK ("SUNZ <MÃ> <SĐT>").
// files[].fileId: ID file/thư mục Drive (phần giữa /d/ … /view hoặc sau /folders/).
const PRODUCTS = {
  SKILL50: {
    name: 'Skill viết content theo tình huống bán hàng',
    page: SITE + '/skill/viet-content-theo-tinh-huong-ban-hang',
    files: [
      { label: 'Claude & Codex', desc: 'File .zip để upload vào Claude (Customize › Skills › Upload a skill) hoặc chép vào Codex. Giữ nguyên tên file, không giải nén.', button: 'Tải bản Claude & Codex', fileId: '' },
      { label: 'ChatGPT & Gemini', desc: 'File .md + file Instructions dán sẵn, dùng qua ChatGPT Project hoặc Gemini Gem.', button: 'Tải bản ChatGPT & Gemini', fileId: '' },
      { label: 'Hướng dẫn cài đặt', desc: 'PDF các bước cài trên Claude, Codex, ChatGPT, Gemini.', button: 'Tải hướng dẫn (PDF)', fileId: '' },
    ],
  },
  KHC30N: { name: 'Template kế hoạch content 30 ngày', page: SITE + '/tai-lieu/ke-hoach-content-30-ngay', files: [{ label: 'Tài liệu', desc: '', button: 'Tải tài liệu', fileId: '' }] },
  PMA: { name: 'Template phễu Marketing AARRR', page: SITE + '/tai-lieu/pheu-marketing-aarrr', files: [{ label: 'Tài liệu', desc: '', button: 'Tải tài liệu', fileId: '' }] },
  CSOP: {
    name: 'Checklist 30 điểm tối ưu SEO on-page',
    page: SITE + '/tai-lieu/checklist-seo-on-page',
    files: [
      { label: 'Ebook PDF', desc: 'Ebook 17 trang: 30 điểm, ví dụ đúng/sai, checklist in nhanh.', button: 'Tải ebook (PDF)', fileId: '' },
      { label: 'Template chấm điểm', desc: 'File Excel: mở bằng Google Trang tính để chấm điểm tự động cho 10 bài.', button: 'Tải template (Excel)', fileId: '' },
    ],
  },
  NMM: { name: 'Ebook nhập môn Marketing cho người mới', page: SITE + '/tai-lieu/nhap-mon-marketing', files: [{ label: 'Tài liệu', desc: '', button: 'Tải tài liệu', fileId: '' }] },
  CNFA: { name: 'Ebook cẩm nang chạy Facebook Ads', page: SITE + '/tai-lieu/cam-nang-facebook-ads', files: [{ label: 'Tài liệu', desc: '', button: 'Tải tài liệu', fileId: '' }] },
  EB50CT: { name: 'Ebook 50 công thức viết content theo tình huống bán hàng', page: SITE + '/tai-lieu/ebook-50-cong-thuc-viet-content', files: [{ label: 'Ebook PDF', desc: 'Ebook 32 trang: 50 công thức, khung mẫu, ví dụ và checklist pháp lý.', button: 'Tải ebook (PDF)', fileId: '' }] },
};

// Cột trong sheet (1 = A)
const COL = { time: 1, code: 2, product: 3, amount: 4, name: 5, phone: 6, email: 7, status: 8, page: 9, sentAt: 10, downloads: 11 };
const HEADERS = ['Thời gian', 'Mã đơn (nội dung CK)', 'Sản phẩm', 'Số tiền', 'Họ tên', 'SĐT / Zalo', 'Email', 'Trạng thái', 'Trang', 'Đã gửi email lúc', 'Lượt tải'];
const STATUS = { pending: 'Chờ thanh toán', claimed: 'Khách báo đã CK', paid: 'Đã thanh toán', sent: 'Đã gửi email', missing: 'Thiếu file tải', cancel: 'Huỷ' };

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
      const row = findRow_(code);
      if (row) {
        const cell = sh.getRange(row, COL.status);
        if (cell.getValue() === STATUS.pending) cell.setValue(STATUS.claimed);
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
      0,
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

// Dòng mới nhất có mã đơn này (0 nếu không có)
function findRow_(code) {
  const sh = getSheet_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return 0;
  const codes = sh.getRange(2, COL.code, n, 1).getValues();
  for (let i = codes.length - 1; i >= 0; i--) if (codes[i][0] === code) return i + 2;
  return 0;
}

// ===== LINK TẢI CÓ BẢO VỆ =====
// Token = base64(payload) + "." + HMAC-SHA256(payload, khoá bí mật lưu trong Script Properties)
function secret_() {
  const props = PropertiesService.getScriptProperties();
  let s = props.getProperty('DL_SECRET');
  if (!s) {
    s = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty('DL_SECRET', s);
  }
  return s;
}
function sign_(p64) {
  return Utilities.base64EncodeWebSafe(Utilities.computeHmacSha256Signature(p64, secret_())).replace(/=+$/, '');
}
function makeToken_(code, pcode, index) {
  const payload = JSON.stringify({ o: code, k: pcode, i: index, e: Date.now() + LINK_DAYS * 864e5 });
  const p64 = Utilities.base64EncodeWebSafe(payload).replace(/=+$/, '');
  return p64 + '.' + sign_(p64);
}
function downloadUrl_(code, pcode, index) {
  return SITE + '/dl?t=' + makeToken_(code, pcode, index);
}

// Cloudflare Worker gọi: ?dl=<token> → trả file (base64) nếu token hợp lệ
function doGet(e) {
  const t = (e && e.parameter && e.parameter.dl) || '';
  if (!t) return out_({ ok: false, error: 'Thiếu mã tải.' });
  try {
    const parts = t.split('.');
    if (parts.length !== 2 || parts[1] !== sign_(parts[0])) return out_({ ok: false, error: 'Link tải không hợp lệ.' });
    const pad = parts[0] + '==='.slice((parts[0].length + 3) % 4);
    const d = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(pad)).getDataAsString());
    if (Date.now() > d.e) return out_({ ok: false, error: 'Link tải đã hết hạn. Nhắn Sunz để được gửi link mới nhé.' });
    const product = PRODUCTS[d.k];
    const f = product && product.files[d.i];
    if (!f || !f.fileId) return out_({ ok: false, error: 'Không tìm thấy tài liệu.' });

    // Đếm lượt tải theo đơn
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const row = findRow_(d.o);
      if (row) {
        const cell = getSheet_().getRange(row, COL.downloads);
        const used = Number(cell.getValue()) || 0;
        if (used >= MAX_DOWNLOADS) return out_({ ok: false, error: 'Đơn hàng đã dùng hết lượt tải. Nhắn Sunz để được hỗ trợ nhé.' });
        cell.setValue(used + 1);
      }
    } finally {
      lock.releaseLock();
    }

    const blob = fileBlob_(f.fileId);
    return out_({ ok: true, name: blob.getName(), mime: blob.getContentType(), b64: Utilities.base64Encode(blob.getBytes()) });
  } catch (err) {
    return out_({ ok: false, error: 'Không đọc được tài liệu, vui lòng nhắn Sunz.' });
  }
}

// File → nội dung file; thư mục → nén .zip các file bên trong.
// Lưu ý: DriveApp.getFileById(<ID thư mục>) KHÔNG báo lỗi mà trả "file" rỗng → phải kiểm tra loại.
function fileBlob_(id) {
  const item = DriveApp.getFileById(id);
  if (item.getMimeType() === MimeType.FOLDER) {
    const folder = DriveApp.getFolderById(id);
    const blobs = [];
    const it = folder.getFiles();
    while (it.hasNext()) blobs.push(it.next().getBlob());
    if (!blobs.length) throw new Error('Thư mục trống');
    return Utilities.zip(blobs, folder.getName() + '.zip');
  }
  const blob = item.getBlob();
  if (!blob.getBytes().length) throw new Error('File rỗng');
  return blob;
}

// Chạy 1 lần để cấp quyền Drive + kiểm tra fileId đúng chưa
function authorize() {
  Object.keys(PRODUCTS).forEach((k) =>
    PRODUCTS[k].files.forEach((f) => {
      if (!f.fileId) return;
      const b = fileBlob_(f.fileId);
      Logger.log(k + ' › ' + f.label + ' → ' + b.getName() + ' (' + Math.round(b.getBytes().length / 1024) + ' KB)');
    })
  );
}

// ===== CÀI ĐẶT 1 LẦN =====
function setup() {
  const sh = getSheet_();
  sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold').setBackground('#e0e7ff');
  const rule = SpreadsheetApp.newDataValidation().requireValueInList(Object.values(STATUS), true).setAllowInvalid(true).build();
  sh.getRange(2, COL.status, sh.getMaxRows() - 1, 1).setDataValidation(rule);
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onStatusEdit')
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('onStatusEdit').forSpreadsheet(ss).onEdit().create();
  secret_();
  SpreadsheetApp.getUi().alert('Đã bật gửi email giao hàng + link tải có bảo vệ. Chọn "Đã thanh toán" ở cột Trạng thái để gửi.');
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
  const row = getSheet_().getActiveRange().getRow();
  if (row < 2) return SpreadsheetApp.getUi().alert('Chọn một dòng đơn hàng trước.');
  deliver_(row);
}

function deliver_(row) {
  const sh = getSheet_();
  const v = sh.getRange(row, 1, 1, HEADERS.length).getValues()[0];
  const order = {
    code: String(v[COL.code - 1]),
    amount: Number(v[COL.amount - 1]) || 0,
    name: String(v[COL.name - 1] || '').trim(),
    phone: String(v[COL.phone - 1]).replace(/^'/, ''),
    email: String(v[COL.email - 1] || '').trim(),
  };
  const statusCell = sh.getRange(row, COL.status);
  const pcode = order.code.split(/\s+/)[1] || '';
  const product = PRODUCTS[pcode];

  if (!order.email) return note_(statusCell, 'Đơn chưa có email khách.');
  if (!product || product.files.some((f) => !f.fileId)) {
    statusCell.setValue(STATUS.missing);
    return note_(statusCell, 'Chưa điền fileId cho mã "' + pcode + '" trong PRODUCTS (Apps Script).');
  }
  const links = product.files.map((f, i) => downloadUrl_(order.code, pcode, i));
  MailApp.sendEmail({
    to: order.email,
    subject: 'Thanh toán thành công · ' + product.name,
    name: BRAND,
    replyTo: SUPPORT.email,
    htmlBody: buildEmail_(order, product, links),
    body: plainText_(order, product, links),
  });
  statusCell.setValue(STATUS.sent).setNote('');
  sh.getRange(row, COL.sentAt).setValue(new Date());
  sh.getRange(row, COL.downloads).setValue(0); // link mới → đặt lại lượt tải
}

function note_(cell, msg) {
  cell.setNote(msg);
  SpreadsheetApp.getActive().toast(msg, 'Chưa gửi được email', 8);
}

function sendTestToMe() {
  const me = Session.getActiveUser().getEmail() || SUPPORT.email;
  const product = PRODUCTS.SKILL50;
  const order = { code: 'SUNZ SKILL50 0900000000', amount: 99000, name: 'Khách hàng mẫu', phone: '0900000000', email: me };
  const links = product.files.map((f, i) => downloadUrl_(order.code, 'SKILL50', i));
  MailApp.sendEmail({ to: me, subject: '[MẪU] Thanh toán thành công · ' + product.name, name: BRAND, htmlBody: buildEmail_(order, product, links), body: plainText_(order, product, links) });
  SpreadsheetApp.getActive().toast('Đã gửi email mẫu tới ' + me, 'Sunz', 5);
}

// ===== NỘI DUNG EMAIL (phong cách email giao hàng Noti) =====
const esc_ = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const vnd_ = (n) => Number(n).toLocaleString('vi-VN') + ' ₫';
// Màu cho từng khối tải (xoay vòng): nền nhạt · màu nhãn · nút gradient + màu dự phòng
// Chỉ dùng 2 màu thương hiệu: xanh tím logo #403bd3 · cam san hô logo #ff7759
const THEMES = [
  { bg: '#eeedfc', label: '#403bd3', from: '#6f6af0', to: '#403bd3' }, // xanh tím
  { bg: '#fff3ef', label: '#e2553b', from: '#ffa184', to: '#e8573a' }, // cam
  { bg: '#f6f2fb', label: '#403bd3', from: '#403bd3', to: '#ff7759' }, // xanh tím → cam
  { bg: '#eeedfc', label: '#2e2a9e', from: '#5d58e6', to: '#2e2a9e' }, // xanh tím đậm
];
const pill_ = (text, color, bg) =>
  '<span style="display:inline-block;padding:6px 14px;border-radius:999px;background:' + bg + ';color:' + color + ';font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase">' + text + '</span>';

function buildEmail_(o, p, links) {
  const F = 'font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif';
  const row = (k, v, last) =>
    '<tr><td style="padding:14px 0;color:#64748b;font-size:14px;' + (last ? '' : 'border-bottom:1px solid #e2e8f0') + '">' + k + '</td>' +
    '<td style="padding:14px 0;text-align:right;font-weight:700;color:#0f172a;font-size:14px;' + (last ? '' : 'border-bottom:1px solid #e2e8f0') + '">' + v + '</td></tr>';
  const files = p.files
    .map((f, i) => {
      const t = THEMES[i % THEMES.length];
      return (
        '<div style="background:' + t.bg + ';border-radius:18px;padding:26px 22px;margin:0 0 14px;text-align:center">' +
        '<div style="color:' + t.label + ';font-size:13px;font-weight:800;letter-spacing:.1em;text-transform:uppercase">' + esc_(f.label) + '</div>' +
        (f.desc ? '<div style="color:#475569;font-size:14px;line-height:1.6;margin:8px 0 0">' + esc_(f.desc) + '</div>' : '') +
        '<a href="' + esc_(links[i]) + '" style="display:inline-block;margin-top:18px;padding:14px 30px;border-radius:999px;background:' + t.to + ';background-image:linear-gradient(135deg,' + t.from + ',' + t.to + ');color:#fff;text-decoration:none;font-weight:800;font-size:15px">' + esc_(f.button) + ' →</a>' +
        '</div>'
      );
    })
    .join('');
  return (
    '<div style="background:#f1f0fb;padding:24px 10px;' + F + '">' +
    '<div style="max-width:600px;margin:0 auto;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 20px 40px -24px rgba(15,23,42,.35)">' +
    // Header gradient
    '<div style="background:#403bd3;background-image:linear-gradient(135deg,#2e2a9e,#403bd3 55%,#5d58e6);padding:34px 24px 30px;text-align:center;color:#fff">' +
    '<img src="' + SITE + '/logo-mark.png" width="44" height="44" alt="Sunz" style="background:#fff;border-radius:12px;padding:5px;margin:0 auto 14px;display:block">' +
    '<div style="font-size:26px;font-weight:900;line-height:1.25">Thanh toán thành công</div>' +
    '<div style="font-size:14px;opacity:.9;margin-top:6px">' + esc_(p.name) + '</div>' +
    '</div>' +
    '<div style="padding:26px 26px 8px">' +
    // Hộp xác nhận
    '<div style="background:#fff3ef;border-radius:18px;padding:26px 20px;text-align:center">' +
    '<div style="width:60px;height:60px;line-height:60px;margin:0 auto;border-radius:50%;background:#ff7759;background-image:linear-gradient(135deg,#ffa184,#ff7759 55%,#e8573a);color:#fff;font-size:30px;font-weight:900">✓</div>' +
    '<div style="color:#e2553b;font-size:20px;font-weight:900;margin-top:14px">Thanh toán đã được xác nhận!</div>' +
    '<div style="color:#64748b;font-size:14px;margin-top:4px">Cảm ơn bạn đã tin tưởng ' + BRAND + '.</div>' +
    '</div>' +
    // Lời chào
    '<p style="font-size:17px;color:#0f172a;margin:24px 0 6px">Xin chào <b style="color:#403bd3">' + esc_(o.name || 'bạn') + '</b>,</p>' +
    '<p style="font-size:15px;color:#334155;line-height:1.7;margin:0 0 20px">Sunz đã nhận được thanh toán của bạn cho <b>' + esc_(p.name) + '</b>. Dưới đây là thông tin đăng ký và link tải tài liệu.</p>' +
    // Thông tin đăng ký
    pill_('Thông tin đăng ký', '#403bd3', '#eeedfc') +
    '<div style="background:#f8fafc;border-radius:18px;padding:6px 20px;margin:12px 0 0">' +
    '<table style="width:100%;border-collapse:collapse">' +
    row('Họ và tên', esc_(o.name || '—')) +
    row('Email', '<a href="mailto:' + esc_(o.email) + '" style="color:#403bd3">' + esc_(o.email) + '</a>') +
    row('Số điện thoại', esc_(o.phone)) +
    row('Mã đơn', esc_(o.code)) +
    row('Số tiền', '<span style="color:#403bd3">' + vnd_(o.amount) + '</span>') +
    row('Trạng thái', '<span style="display:inline-block;padding:5px 12px;border-radius:999px;background:#fff3ef;color:#e2553b;border:1px solid #ffd3c6">Đã thanh toán</span>', true) +
    '</table></div>' +
    // Lưu ý
    '<div style="background:#eeedfc;border-radius:14px;padding:14px 16px;margin:16px 0 0;color:#2e2a9e;font-size:14px;line-height:1.6">' +
    '<b>Lưu ý:</b> Vui lòng lưu email này và đánh dấu quan trọng để tải lại khi cần. Link tải dành riêng cho bạn, dùng trong ' + LINK_DAYS + ' ngày, vui lòng không chia sẻ.' +
    '</div>' +
    // Link tải
    '<div style="margin:26px 0 12px">' + pill_('Link tải tài liệu', '#403bd3', '#eeedfc') + '</div>' +
    files +
    '<p style="text-align:center;color:#64748b;font-size:13px;margin:4px 0 22px">Bấm nút là file tự tải về máy.</p>' +
    // Hỗ trợ
    pill_('Tài liệu & hỗ trợ', '#e2553b', '#fff3ef') +
    '<div style="font-size:15px;line-height:2.1;margin:10px 0 18px">' +
    '<a href="' + p.page + '" style="color:#403bd3;text-decoration:none">Trang sản phẩm & hướng dẫn sử dụng →</a><br>' +
    '<a href="' + SUPPORT.messenger + '" style="color:#403bd3;text-decoration:none">Cần hỗ trợ? Nhắn Sunz qua Messenger →</a><br>' +
    '<a href="' + SUPPORT.tiktok + '" style="color:#403bd3;text-decoration:none">Theo dõi Sunz trên TikTok →</a>' +
    '</div>' +
    '<p style="font-size:15px;color:#334155;margin:0 0 24px">Chúc bạn ứng dụng thành công! 💜</p>' +
    '</div>' +
    // Footer
    '<div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 26px;text-align:center;color:#94a3b8;font-size:12px;line-height:1.7">' +
    '<b style="color:#475569;font-size:14px">' + BRAND + '</b><br>' +
    '<a href="' + SITE + '" style="color:#94a3b8">' + SITE.replace('https://', '') + '</a><br>' +
    '© 2026 ' + BRAND + '. Tài liệu dành riêng cho người mua. Nghiêm cấm sao chép, chia sẻ hoặc bán lại khi chưa được cho phép.' +
    '</div></div></div>'
  );
}

function plainText_(o, p, links) {
  return [
    'Thanh toán thành công · ' + p.name,
    '',
    'Xin chào ' + (o.name || 'bạn') + ',',
    'Sunz đã nhận được thanh toán của bạn cho ' + p.name + '.',
    '',
    'Mã đơn: ' + o.code,
    'Số tiền: ' + vnd_(o.amount),
    '',
    'Link tải (dành riêng cho bạn, dùng trong ' + LINK_DAYS + ' ngày):',
    ...p.files.map((f, i) => '- ' + f.button + ': ' + links[i]),
    '',
    'Trang sản phẩm: ' + p.page,
    'Hỗ trợ: ' + SUPPORT.messenger,
    '',
    '© 2026 ' + BRAND,
  ].join('\n');
}
