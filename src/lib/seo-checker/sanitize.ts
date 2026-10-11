// Làm sạch HTML dán từ Google Docs / Word / web: giữ cấu trúc (heading, đoạn, danh sách, link, ảnh, bảng,
// in đậm/nghiêng), bỏ style, script, class và thuộc tính rác.
// Google Docs đánh dấu đậm/nghiêng bằng <span style="font-weight:700"> → đổi thành <strong>/<em>.

const KEEP = new Set([
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'BR', 'UL', 'OL', 'LI', 'A', 'IMG', 'STRONG', 'B', 'EM', 'I', 'U',
  'BLOCKQUOTE', 'TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'TH', 'TD', 'CAPTION', 'FIGURE', 'FIGCAPTION', 'HR', 'PRE',
  'CODE', 'NAV', 'SUB', 'SUP',
]);
const DROP = new Set(['SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'SVG', 'TEMPLATE']);
const ATTRS: Record<string, string[]> = {
  A: ['href', 'rel', 'title'],
  IMG: ['src', 'alt', 'width', 'height', 'loading'],
  TD: ['colspan', 'rowspan'],
  TH: ['colspan', 'rowspan'],
  OL: ['start'],
};
// div/section... có chứa khối con thì gỡ bỏ thẻ bao; chỉ chứa chữ thì đổi thành <p>
const BLOCK_CHILD = /^(H[1-6]|P|UL|OL|TABLE|BLOCKQUOTE|FIGURE|PRE|HR|DIV|SECTION|ARTICLE|NAV)$/;

export function sanitizeHtml(html: string, doc: Document = document): string {
  // Đoạn HTML không có <body> (vd dán từ tab "Dán HTML") → bọc lại để mọi trình phân tích đọc giống nhau
  const full = /<body[\s>]/i.test(html) ? html : `<!doctype html><html><body>${html}</body></html>`;
  const src = new DOMParser().parseFromString(full, 'text/html');
  const out = doc.createElement('div');
  for (const n of Array.from(src.body.childNodes)) cleanInto(n, out, doc);
  // Bỏ đoạn rỗng và <br> thừa ở cuối đoạn
  for (const p of Array.from(out.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6'))) {
    if (!p.textContent?.trim() && !p.querySelector('img')) p.remove();
  }
  return out.innerHTML;
}

function cleanInto(node: Node, parent: Element, doc: Document): void {
  if (node.nodeType === 3) {
    parent.appendChild(doc.createTextNode(node.nodeValue || ''));
    return;
  }
  if (node.nodeType !== 1) return; // bỏ comment (vd <!--StartFragment-->)
  const el = node as Element;
  const tag = el.tagName.toUpperCase();
  if (DROP.has(tag) || tag.includes(':')) return; // <o:p> của Word

  const style = (el.getAttribute('style') || '').toLowerCase();
  const children = () => Array.from(el.childNodes);

  // Google Docs bọc cả bài trong <b style="font-weight:normal" id="docs-internal-guid-...">
  if ((tag === 'B' || tag === 'STRONG') && /font-weight:\s*(normal|400)/.test(style)) {
    for (const c of children()) cleanInto(c, parent, doc);
    return;
  }

  if (!KEEP.has(tag)) {
    // span in đậm / in nghiêng kiểu Google Docs
    const bold = /font-weight:\s*(bold|[6-9]00)/.test(style);
    const italic = /font-style:\s*italic/.test(style);
    if (tag === 'SPAN' && (bold || italic)) {
      let target = parent;
      if (bold) target = target.appendChild(doc.createElement('strong'));
      if (italic) target = target.appendChild(doc.createElement('em'));
      for (const c of children()) cleanInto(c, target, doc);
      return;
    }
    const hasBlock = children().some((c) => c.nodeType === 1 && BLOCK_CHILD.test((c as Element).tagName.toUpperCase()));
    if (/^(DIV|SECTION|ARTICLE|MAIN|HEADER|FOOTER|ASIDE)$/.test(tag) && !hasBlock && el.textContent?.trim()) {
      const p = parent.appendChild(doc.createElement('p'));
      for (const c of children()) cleanInto(c, p, doc);
      return;
    }
    for (const c of children()) cleanInto(c, parent, doc); // gỡ thẻ bao, giữ nội dung
    return;
  }

  const clean = doc.createElement(tag.toLowerCase() === 'b' ? 'strong' : tag.toLowerCase() === 'i' ? 'em' : tag.toLowerCase());
  for (const name of ATTRS[tag] || []) {
    const v = el.getAttribute(name);
    if (v == null) continue;
    if ((name === 'href' || name === 'src') && /^\s*javascript:/i.test(v)) continue;
    clean.setAttribute(name, v);
  }
  // Giữ id (để nhận mục lục neo #id) và class chỉ khi là mục lục
  const id = el.getAttribute('id');
  if (id && !/^docs-internal-guid/.test(id)) clean.setAttribute('id', id);
  const cls = el.getAttribute('class') || '';
  if (/toc|muc-luc/i.test(cls)) clean.setAttribute('class', cls);

  parent.appendChild(clean);
  for (const c of children()) cleanInto(c, clean, doc);
}

/** Chữ thuần → HTML: mỗi dòng trống ngăn 1 đoạn */
export function textToHtml(text: string): string {
  const esc = (s: string) => s.replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch]!);
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${esc(block).replace(/\n/g, '<br>')}</p>`)
    .join('');
}
