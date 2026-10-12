// Từ điển song ngữ cho giao diện + các trang chính.
// Bài viết (blog) hiện chưa dịch — sẽ bổ sung sau.
// Cách dùng ở template: thêm data-i18n="key" (đổi text) hoặc
// data-i18n-html="key" (đổi HTML), data-i18n-ph="key" (đổi placeholder).

export const languages = {
  vi: 'Tiếng Việt',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'vi';

export const ui = {
  vi: {
    // Điều hướng
    'nav.home': 'Trang chủ',
    'nav.about': 'Giới thiệu',
    'nav.blog': 'Bài viết',
    'nav.products': 'Dịch vụ',
    'nav.resources': 'Tài liệu',
    'nav.skills': 'Skill AI',
    'nav.tools': 'Công cụ',
    'nav.contact': 'Liên hệ',
    'nav.search': 'Tìm kiếm',
    'ui.theme': 'Đổi giao diện sáng/tối',
    'ui.language': 'Ngôn ngữ',

    // Trang chủ - Hero
    'home.badge': '📚 Kiến thức Marketing thực chiến',
    'home.hero.title':
      '<span class="hero-kicker"><b class="t-blue hx" style="--i:0">Sunz Làm Marketing</b> <span class="t-coral hx" style="--i:1">giúp bạn</span></span><span class="t-coral hx" style="--i:2">Hiểu Marketing</span> <span class="t-blue hx hero-mark" style="--i:3">đúng,</span><br /> <span class="t-coral hx" style="--i:4">làm Marketing</span> <span class="t-blue hx hero-mark" style="--i:5">hiệu quả.</span>',
    'home.hero.sub':
  'Chia sẻ kiến thức, tài liệu và công cụ Marketing thực tiễn, dễ hiểu,<br />áp dụng được ngay.',
    'home.hero.cta1': 'Kho tài liệu Marketing thực tiễn',
    'home.hero.cta2': 'Sunz Làm Marketing là ai?',
    'home.stat.posts': 'Bài viết',
    'home.stat.topics': 'Chủ đề',

    // Trang chủ - Mục "Sunz Làm Marketing là ai?"
    'home.me.label': 'Sunz Làm Marketing là ai?',
    'home.me.title':
      'Chào bạn, mình làm Marketing và thích <span class="hl">chia sẻ lại</span> những gì đã học.',
    'home.me.p1':
      'Marketing có quá nhiều thứ để học. Nhưng phần lớn kiến thức ngoài kia hoặc quá hàn lâm, hoặc chỉ là những "mẹo" rời rạc thiếu nền tảng — khiến người mới không biết nên bắt đầu từ đâu.',
    'home.me.p2':
      'Sunz Làm Marketing ra đời để lấp khoảng trống đó. Đây là nơi mình gom lại kiến thức, tài liệu và công cụ đã dùng trong công việc, sắp xếp có hệ thống từ căn bản đến nâng cao, rồi chia sẻ lại để bạn áp dụng được ngay vào công việc.',
    'home.me.p3':
      'Mình không hứa hẹn "làm giàu sau một đêm". Chỉ có kiến thức nền tảng vững chắc, ví dụ thực tế, và những thứ bạn áp dụng được ngay vào công việc của mình.',
    'home.me.closing':
      'Cùng nhau chuẩn bị hành trang thật tốt trước khi bước ra thương trường nhé!',
    'home.me.cta': 'Tìm hiểu thêm về Sunz →',
    'home.me.bio': 'Chia sẻ kiến thức, tài liệu & công cụ Marketing thực tiễn',

    // Trang chủ - các mục
    'home.cat.title': 'Khám phá theo chủ đề',
    'home.cat.sub': 'Chọn lĩnh vực bạn quan tâm và đào sâu vào những bài viết chất lượng.',
    'home.featured.title': 'Bài viết nổi bật',
    'home.featured.sub': 'Những bài viết mới nhất, đáng đọc nhất tuần này.',
    'home.recent.title': 'Bài viết mới nhất',
    'home.recent.sub': 'Cập nhật kiến thức marketing đều đặn mỗi tuần.',
    'home.viewall': 'Xem tất cả →',
    'home.cta.title': 'Đừng bỏ lỡ kiến thức mới',
    'home.cta.text':
      'Ghé thăm thường xuyên hoặc kết nối với chúng tôi để cập nhật những bài viết marketing mới nhất.',
    'home.cta.btn': 'Kết nối ngay →',

    // Footer
    'footer.tagline':
      'Nơi chia sẻ kiến thức Marketing dễ hiểu, thực tế và có thể áp dụng ngay.',
    'footer.follow': 'Theo dõi Sunz',

    // Trang Giới thiệu
    'about.hero.title': 'Về Sunz Làm Marketing',
    'about.stat': 'bài viết',
    'about.short.label': 'Giới thiệu ngắn gọn',
    'about.short.copy': 'Copy giới thiệu',
    'about.short.text':
      'Sunz Làm Marketing là nơi chia sẻ kiến thức, tài liệu và công cụ Marketing thực chiến cho người Việt — sắp xếp có hệ thống từ căn bản đến nâng cao, kèm ví dụ thực tế, áp dụng được ngay.',
    'about.principle.label': 'Nguyên tắc',
    'about.res.title': 'Tài nguyên thương hiệu, bấm để copy link',
    'about.res.logo': 'Logo Sunz',
    'about.res.web': 'Website',
    'about.res.email': 'Email hợp tác',
    'about.res.copy': 'Copy link',
    'about.posts.title': 'Bài viết mới nhất',
    'about.copied': 'Đã copy',
    'about.badge': '👋 Về chúng tôi',
    'about.title': 'Chúng tôi tin marketing tốt <span class="hl">nên dễ học</span>',
    'about.lead':
      'Sunz Làm Marketing ra đời với một mục tiêu đơn giản: biến những kiến thức marketing tưởng chừng phức tạp thành thứ ai cũng có thể hiểu và áp dụng — dù bạn là chủ shop online, freelancer hay người mới vào nghề.',
    'about.val1.title': 'Thực chiến, không lý thuyết suông',
    'about.val1.text':
      'Mọi bài viết đều hướng tới việc áp dụng được ngay, kèm ví dụ và bước làm cụ thể.',
    'about.val2.title': 'Dành cho người Việt',
    'about.val2.text':
      'Nội dung viết bằng tiếng Việt, phù hợp với bối cảnh thị trường và nền tảng người Việt hay dùng.',
    'about.val3.title': 'Dễ tiếp cận',
    'about.val3.text':
      'Kiến thức nên được chia sẻ. Bài viết và công cụ trên Sunz Làm Marketing đều miễn phí; tài liệu chuyên sâu có giá vừa phải để ai cũng sở hữu được.',
    'about.val4.title': 'Cập nhật liên tục',
    'about.val4.text':
      'Marketing thay đổi từng ngày. Chúng tôi cập nhật kiến thức mới để bạn không tụt lại.',
    'about.story.title': 'Câu chuyện của chúng tôi',
    'about.story.p1':
      'Có quá nhiều kiến thức marketing ngoài kia, nhưng phần lớn hoặc quá hàn lâm, hoặc chỉ là những "mẹo" rời rạc thiếu nền tảng. Người mới bắt đầu thường bối rối không biết học từ đâu.',
    'about.story.p2':
      'Chúng tôi tạo ra Sunz Làm Marketing để lấp khoảng trống đó — một nơi trình bày kiến thức có hệ thống, đi từ căn bản đến nâng cao, luôn kèm ví dụ thực tế và có thể áp dụng ngay. Không hứa hẹn "làm giàu sau một đêm", chỉ có những kiến thức nền tảng vững chắc giúp bạn đi đường dài.',
    'about.story.quote':
      '"Marketing không phải là nghệ thuật bán thứ bạn làm ra, mà là nghệ thuật tạo ra thứ khách hàng thật sự cần."',
    'about.story.cta1': 'Khám phá bài viết →',
    'about.story.cta2': 'Liên hệ với chúng tôi',

    // Trang Dịch vụ
    'products.badge': '🎓 Dịch vụ Marketing',
    'products.title': 'Dịch vụ Marketing',
    'products.lead':
      'Đồng hành cùng doanh nghiệp từ chiến lược đến triển khai.',
    'products.p1.name': 'Tư vấn chiến lược Marketing',
    'products.p1.desc':
      'Phân tích thị trường, định vị và xây dựng lộ trình Marketing tổng thể bám sát mục tiêu kinh doanh.',
    'products.p1.price': 'Liên hệ báo giá',
    'products.p2.name': 'Content & Social Media',
    'products.p2.desc':
      'Lên kế hoạch nội dung, sản xuất bài đăng và phát triển kênh mạng xã hội đều đặn, đúng tông thương hiệu.',
    'products.p2.price': 'Theo gói tháng',
    'products.p3.name': 'SEO & Tối ưu Website',
    'products.p3.desc':
      'Nghiên cứu từ khóa, tối ưu on-page và kỹ thuật để cải thiện thứ hạng, kéo traffic tự nhiên bền vững.',
    'products.p3.price': 'Liên hệ báo giá',
    'products.p4.name': 'Quảng cáo Digital (Ads)',
    'products.p4.desc':
      'Thiết lập và tối ưu Facebook Ads, Google Ads nhằm giảm chi phí mỗi chuyển đổi và tăng doanh thu.',
    'products.p4.price': 'Theo ngân sách',
    'products.p5.name': 'Xây dựng thương hiệu',
    'products.p5.desc':
      'Định vị, bộ nhận diện và hệ thống thông điệp nhất quán giúp thương hiệu ghi dấu trong tâm trí khách hàng.',
    'products.p5.price': 'Theo dự án',
    'products.p6.name': 'Đào tạo & Coaching Marketing',
    'products.p6.desc':
      'Kèm 1-1 hoặc đào tạo đội nhóm về tư duy và kỹ năng Marketing thực chiến, áp dụng được ngay.',
    'products.p6.price': 'Theo buổi / khóa',
    'products.cta': 'Liên hệ tư vấn',

    // Trang Tài liệu
    'resources.title': 'Tài liệu Marketing',
    'resources.lead':
      'Template, ebook và checklist thực chiến — mua về là dùng được ngay.',

    // Trang Công cụ - Kiểm tra content quảng cáo
    'tools.title': 'Kiểm tra content quảng cáo',
    'tools.lead':
      'Rà soát từ ngữ dễ vi phạm chính sách Facebook & Luật Quảng cáo, kèm gợi ý sửa.',
    'tools.input.label': 'Nội dung quảng cáo',
    'tools.input.ph':
      'Dán toàn bộ nội dung bài quảng cáo vào đây, gồm cả câu kêu gọi hành động (Mua ngay, Inbox tư vấn...)',
    'tools.opt.vn': 'Kiểm tra thêm theo Luật Quảng cáo Việt Nam',
    'tools.btn': 'Kiểm tra ngay',
    'tools.empty': 'Bạn hãy dán nội dung quảng cáo vào ô bên trên trước nhé.',
    'tools.result.title': 'Kết quả rà soát',
    'tools.riskLabel': 'Mức rủi ro',
    'tools.risk.high': 'Cao',
    'tools.risk.medium': 'Trung bình',
    'tools.risk.low': 'Thấp',
    'tools.risk.none': 'Không phát hiện',
    'tools.sev.high': 'Nghiêm trọng',
    'tools.sev.medium': 'Cần lưu ý',
    'tools.sev.low': 'Nên cân nhắc',
    'tools.foundOne': 'điểm cần xem lại',
    'tools.pass':
      '✅ Không phát hiện từ ngữ rủi ro phổ biến nào. Lưu ý đây chỉ là rà soát sơ bộ — hãy đọc lại tổng thể trước khi chạy quảng cáo.',
    'tools.fixLabel': 'Gợi ý sửa',
    'tools.matched': 'Phát hiện',
    'tools.checkLabel': 'Kiểm tra',
    'tools.issueLabel': 'Lỗi vi phạm',
    'tools.urgent': 'Cần sửa trước khi chạy quảng cáo',
    'tools.disclaimer':
      'Công cụ rà soát sơ bộ theo danh sách từ ngữ rủi ro thường gặp. Kết quả mang tính tham khảo, không thay thế tư vấn pháp lý hay quyết định duyệt của Facebook.',
    'tools.aiNote':
      'Sắp có: lớp phân tích bằng AI để hiểu ngữ cảnh cả bài, không chỉ dò từ khóa.',

    // Trang Liên hệ
    'contact.badge': '📬 Liên hệ',
    'contact.title': 'Kết nối với chúng tôi',
    'contact.lead':
      'Câu hỏi, góp ý hay hợp tác — nhắn cho Sunz nhé!',
    'contact.form.name': 'Họ và tên',
    'contact.form.name.ph': 'Nguyễn Văn A',
    'contact.form.email': 'Email',
    'contact.form.email.ph': 'ban@email.com',
    'contact.form.phone': 'Số điện thoại',
    'contact.form.phone.ph': 'Số điện thoại của bạn',
    'contact.form.message': 'Nội dung',
    'contact.form.message.ph': 'Nhập nội dung tin nhắn của bạn...',
    'contact.form.submit': 'Gửi tin nhắn →',
    'contact.err.required': 'Vui lòng điền đầy đủ họ tên, email và nội dung.',
    'contact.err.email': 'Email không hợp lệ. Vui lòng kiểm tra lại.',
    'contact.sending': 'Đang gửi...',
    'contact.ok': 'Cảm ơn bạn! Sunz sẽ sớm liên hệ lại với bạn!',
    'contact.err.send': 'Gửi thất bại. Vui lòng thử lại hoặc email trực tiếp cho chúng tôi.',
    'contact.notready': 'Form chưa được cấu hình. Vui lòng liên hệ qua email bên trái.',

    // Chatbot
    'chat.title': 'Trợ lý Marketing',
    'chat.subtitle': 'Thường trả lời ngay lập tức',
    'chat.greeting':
      'Xin chào 👋 Mình là trợ lý của Sunz Làm Marketing. Chọn nhanh một câu hỏi bên dưới, hoặc nhập câu hỏi của bạn nhé!',
    'chat.placeholder': 'Nhập câu hỏi của bạn...',
    'chat.open': 'Mở trợ lý tư vấn',
    'chat.close': 'Đóng',
    'chat.send': 'Gửi',
    'chat.q.topics': 'Website có những chủ đề gì?',
    'chat.q.services': 'Dịch vụ gồm những gì?',
    'chat.q.resources': 'Tài liệu Marketing ở đâu?',
    'chat.q.contact': 'Làm sao để liên hệ?',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.blog': 'Articles',
    'nav.products': 'Services',
    'nav.resources': 'Resources',
    'nav.skills': 'AI Skills',
    'nav.tools': 'Tools',
    'nav.contact': 'Contact',
    'nav.search': 'Search',
    'ui.theme': 'Toggle light/dark theme',
    'ui.language': 'Language',

    // Home - Hero
    'home.badge': '📚 Practical marketing knowledge',
    'home.hero.title':
      '<span class="hero-kicker"><b class="t-blue hx" style="--i:0">Sunz Làm Marketing</b> <span class="t-coral hx" style="--i:1">helps you</span></span><span class="hero-main-en"><span class="t-coral hx" style="--i:2">Understand marketing</span> <span class="t-blue hx hero-mark" style="--i:3">right,</span><br /> <span class="t-coral hx" style="--i:4">do marketing</span> <span class="t-blue hx hero-mark" style="--i:5">effectively.</span></span>',
    'home.hero.sub':
      'Clear, practical marketing you can apply today.',
    'home.hero.cta1': 'Practical marketing resource hub',
    'home.hero.cta2': 'Who is Sunz Làm Marketing?',
    'home.stat.posts': 'Articles',
    'home.stat.topics': 'Topics',

    // Home - "Who is Sunz Làm Marketing?" section
    'home.me.label': 'Who is Sunz Làm Marketing?',
    'home.me.title':
      'Hi, I work in Marketing and love <span class="hl">sharing back</span> what I have learned.',
    'home.me.p1':
      'There is so much to learn in marketing. But most knowledge out there is either too academic or just scattered "tips" with no foundation — leaving beginners unsure where to start.',
    'home.me.p2':
      'Sunz Làm Marketing was born to fill that gap. This is where I gather the knowledge, resources and tools I actually use at work, organize them from basics to advanced, and share them so you can apply them at work right away.',
    'home.me.p3':
      'No "get rich overnight" promises here. Just solid fundamentals, real examples, and things you can apply to your work right away.',
    'home.me.closing':
      "Let's pack the right gear together before stepping into the market!",
    'home.me.cta': 'More about Sunz →',
    'home.me.bio': 'Sharing practical marketing knowledge, resources & tools',

    // Home - sections
    'home.cat.title': 'Explore by topic',
    'home.cat.sub': 'Pick the area you care about and dive into quality articles.',
    'home.featured.title': 'Featured article',
    'home.featured.sub': 'The latest and most worth-reading articles this week.',
    'home.recent.title': 'Latest articles',
    'home.recent.sub': 'Fresh marketing knowledge every week.',
    'home.viewall': 'View all →',
    'home.cta.title': "Don't miss new knowledge",
    'home.cta.text':
      'Visit often or connect with us to keep up with the latest marketing articles.',
    'home.cta.btn': 'Get in touch →',

    // Footer
    'footer.tagline':
      'A place to share marketing knowledge that is clear, practical and ready to apply.',
    'footer.follow': 'Follow Sunz',

    // About page
    'about.hero.title': 'About Sunz Làm Marketing',
    'about.stat': 'articles',
    'about.short.label': 'Short bio',
    'about.short.copy': 'Copy bio',
    'about.short.text':
      'Sunz Làm Marketing shares practical marketing knowledge, resources and tools for Vietnamese marketers — organized from basics to advanced, with real examples you can apply right away.',
    'about.principle.label': 'Principle',
    'about.res.title': 'Brand resources, click to copy link',
    'about.res.logo': 'Sunz logo',
    'about.res.web': 'Website',
    'about.res.email': 'Partnership email',
    'about.res.copy': 'Copy link',
    'about.posts.title': 'Latest articles',
    'about.copied': 'Copied',
    'about.badge': '👋 About us',
    'about.title': 'We believe good marketing <span class="hl">should be easy to learn</span>',
    'about.lead':
      'Sunz Làm Marketing was born with a simple goal: to turn seemingly complex marketing knowledge into something anyone can understand and apply — whether you run an online shop, work as a freelancer, or are just starting out.',
    'about.val1.title': 'Practical, not just theory',
    'about.val1.text':
      'Every article aims to be immediately applicable, with concrete examples and steps.',
    'about.val2.title': 'Made for Vietnamese',
    'about.val2.text':
      'Written in Vietnamese, tailored to the local market and the platforms people here actually use.',
    'about.val3.title': 'Accessible',
    'about.val3.text':
      'Knowledge should be shared. All articles and tools on Sunz Làm Marketing are free; in-depth resources are priced so anyone can afford them.',
    'about.val4.title': 'Always up to date',
    'about.val4.text':
      'Marketing changes every day. We keep updating so you never fall behind.',
    'about.story.title': 'Our story',
    'about.story.p1':
      'There is a flood of marketing content out there, but most of it is either too academic or just scattered "tips" without foundation. Beginners often feel lost about where to start.',
    'about.story.p2':
      'We created Sunz Làm Marketing to fill that gap — a place that presents knowledge systematically, from basics to advanced, always with real examples you can apply right away. No "get rich overnight" promises, just solid fundamentals for the long run.',
    'about.story.quote':
      '"Marketing is not the art of selling what you make, but the art of creating what customers truly need."',
    'about.story.cta1': 'Explore articles →',
    'about.story.cta2': 'Get in touch',

    // Services page
    'products.badge': '🎓 Marketing Services',
    'products.title': 'Marketing Services',
    'products.lead':
      'Your partner from strategy to execution.',
    'products.p1.name': 'Marketing Strategy Consulting',
    'products.p1.desc':
      'Market analysis, positioning and a full marketing roadmap aligned with your business goals.',
    'products.p1.price': 'Contact for quote',
    'products.p2.name': 'Content & Social Media',
    'products.p2.desc':
      'Content planning, post production and steady social channel growth, on-brand and consistent.',
    'products.p2.price': 'Monthly plan',
    'products.p3.name': 'SEO & Website Optimization',
    'products.p3.desc':
      'Keyword research, on-page and technical optimization to improve rankings and drive organic traffic.',
    'products.p3.price': 'Contact for quote',
    'products.p4.name': 'Digital Advertising (Ads)',
    'products.p4.desc':
      'Set up and optimize Facebook and Google Ads to lower cost per conversion and grow revenue.',
    'products.p4.price': 'Based on budget',
    'products.p5.name': 'Branding',
    'products.p5.desc':
      'Positioning, visual identity and a consistent message system that makes your brand memorable.',
    'products.p5.price': 'Per project',
    'products.p6.name': 'Training & Coaching',
    'products.p6.desc':
      '1-on-1 coaching or team training on practical marketing mindset and skills you can apply right away.',
    'products.p6.price': 'Per session / course',
    'products.cta': 'Contact us',

    // Resources page
    'resources.title': 'Marketing Resources',
    'resources.lead':
      'Practical templates, ebooks and checklists — ready to use right away.',

    // Tools page - Ad content checker
    'tools.title': 'Ad Content Checker',
    'tools.lead':
      'Scan ad copy for wording that breaks Facebook policy & ad law, with fixes.',
    'tools.input.label': 'Ad content',
    'tools.input.ph':
      'Paste your full ad copy here, including the call to action (Buy now, Message us...)',
    'tools.opt.vn': 'Also check against Vietnamese advertising law',
    'tools.btn': 'Check now',
    'tools.empty': 'Please paste your ad content into the box above first.',
    'tools.result.title': 'Scan results',
    'tools.riskLabel': 'Risk level',
    'tools.risk.high': 'High',
    'tools.risk.medium': 'Medium',
    'tools.risk.low': 'Low',
    'tools.risk.none': 'None found',
    'tools.sev.high': 'Serious',
    'tools.sev.medium': 'Needs attention',
    'tools.sev.low': 'Worth reviewing',
    'tools.foundOne': 'point(s) to review',
    'tools.pass':
      '✅ No common risky wording detected. Note this is only a preliminary scan — read the whole piece again before running the ad.',
    'tools.fixLabel': 'Suggested fix',
    'tools.matched': 'Found',
    'tools.checkLabel': 'Check',
    'tools.issueLabel': 'Violation',
    'tools.urgent': 'Fix before running your ads',
    'tools.disclaimer':
      'A preliminary scan based on commonly flagged wording. Results are for reference only and do not replace legal advice or Facebook’s review decision.',
    'tools.aiNote':
      'Coming soon: an AI layer that understands the context of the whole piece, not just keywords.',

    // Contact page
    'contact.badge': '📬 Contact',
    'contact.title': 'Get in touch with us',
    'contact.lead':
      'Questions, feedback or partnerships — message Sunz!',
    'contact.form.name': 'Full name',
    'contact.form.name.ph': 'John Doe',
    'contact.form.email': 'Email',
    'contact.form.email.ph': 'you@email.com',
    'contact.form.phone': 'Phone number',
    'contact.form.phone.ph': 'Your phone number',
    'contact.form.message': 'Message',
    'contact.form.message.ph': 'Type your message here...',
    'contact.form.submit': 'Send message →',
    'contact.err.required': 'Please fill in your name, email and message.',
    'contact.err.email': 'Invalid email. Please check again.',
    'contact.sending': 'Sending...',
    'contact.ok': 'Thank you! Sunz will get back to you soon!',
    'contact.err.send': 'Failed to send. Please try again or email us directly.',
    'contact.notready': 'The form is not configured yet. Please reach us via the email on the left.',

    // Chatbot
    'chat.title': 'Marketing Assistant',
    'chat.subtitle': 'Usually replies instantly',
    'chat.greeting':
      "Hi 👋 I'm the Sunz Làm Marketing assistant. Pick a quick question below, or type your own!",
    'chat.placeholder': 'Type your question...',
    'chat.open': 'Open the assistant',
    'chat.close': 'Close',
    'chat.send': 'Send',
    'chat.q.topics': 'What topics does the site cover?',
    'chat.q.services': 'What services do you offer?',
    'chat.q.resources': 'Where are the marketing resources?',
    'chat.q.contact': 'How do I get in touch?',
  },
} as const;
