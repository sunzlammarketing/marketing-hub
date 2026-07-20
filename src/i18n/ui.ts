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
    'nav.resources': 'Tài liệu miễn phí',
    'nav.tools': 'Công cụ',
    'nav.contact': 'Liên hệ',
    'nav.search': 'Tìm kiếm',
    'ui.theme': 'Đổi giao diện sáng/tối',
    'ui.language': 'Ngôn ngữ',

    // Trang chủ - Hero
    'home.badge': '📚 Kiến thức Marketing thực chiến',
    'home.hero.title':
      'Hiểu Marketing <span class="grad">đúng</span>,<br /> làm Marketing <span class="grad">hiệu quả</span>.',
    'home.hero.sub':
      'Kiến thức Marketing dễ hiểu, thực tế và có thể áp dụng xuyên suốt hành trình Marketing từ nghiên cứu thị trường, xây dựng chiến lược đến triển khai, đo lường và tối ưu hiệu quả.',
    'home.hero.cta1': 'Bắt đầu đọc →',
    'home.hero.cta2': 'Khám phá chủ đề',
    'home.stat.posts': 'Bài viết',
    'home.stat.topics': 'Chủ đề',
    'home.stat.free': 'Miễn phí',

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
    'footer.col.topics': 'Chủ đề',
    'footer.col.explore': 'Khám phá',
    'footer.allposts': 'Tất cả bài viết',
    'footer.categories': 'Danh mục chủ đề',
    'footer.search': 'Tìm kiếm',
    'footer.about': 'Giới thiệu',
    'footer.contact': 'Liên hệ',
    'footer.copyright': 'Nội dung mang tính tham khảo & học tập.',
    'footer.built': 'Xây dựng bằng Astro 🚀',

    // Trang Giới thiệu
    'about.badge': '👋 Về chúng tôi',
    'about.title': 'Chúng tôi tin marketing tốt <span class="grad">nên dễ học</span>',
    'about.lead':
      'Sunz Làm Marketing ra đời với một mục tiêu đơn giản: biến những kiến thức marketing tưởng chừng phức tạp thành thứ ai cũng có thể hiểu và áp dụng — dù bạn là chủ shop online, freelancer hay người mới vào nghề.',
    'about.val1.title': 'Thực chiến, không lý thuyết suông',
    'about.val1.text':
      'Mọi bài viết đều hướng tới việc áp dụng được ngay, kèm ví dụ và bước làm cụ thể.',
    'about.val2.title': 'Dành cho người Việt',
    'about.val2.text':
      'Nội dung viết bằng tiếng Việt, phù hợp với bối cảnh thị trường và nền tảng người Việt hay dùng.',
    'about.val3.title': 'Miễn phí & dễ tiếp cận',
    'about.val3.text':
      'Kiến thức nên được chia sẻ. Toàn bộ nội dung trên Sunz Làm Marketing đều miễn phí.',
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
      'Đồng hành cùng bạn từ chiến lược đến triển khai — chọn dịch vụ phù hợp với mục tiêu và giai đoạn của doanh nghiệp.',
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

    // Trang Tài liệu miễn phí
    'resources.badge': '📂 Tài liệu miễn phí',
    'resources.title': 'Tài liệu Marketing miễn phí',
    'resources.lead':
      'Tổng hợp ebook, checklist và template thực chiến — tải về và áp dụng ngay vào công việc của bạn.',
    'resources.d1.name': 'Ebook: Nhập môn Marketing cho người mới',
    'resources.d1.desc': 'Tổng quan các khái niệm và tư duy Marketing nền tảng, trình bày dễ hiểu cho người mới bắt đầu.',
    'resources.d1.type': 'PDF · 24 trang',
    'resources.d2.name': 'Checklist: 30 điểm tối ưu SEO on-page',
    'resources.d2.desc': 'Danh sách kiểm tra giúp bạn tối ưu từng bài viết chuẩn SEO trước khi xuất bản.',
    'resources.d2.type': 'PDF · 2 trang',
    'resources.d3.name': 'Template: Kế hoạch content 30 ngày',
    'resources.d3.desc': 'Mẫu lịch nội dung dựng sẵn cấu trúc, chỉ việc điền chủ đề và triển khai.',
    'resources.d3.type': 'Google Sheet',
    'resources.d4.name': 'Ebook: Cẩm nang chạy Facebook Ads',
    'resources.d4.desc': 'Hướng dẫn từ tạo chiến dịch đến tối ưu chi phí, kèm ví dụ thực tế dễ áp dụng.',
    'resources.d4.type': 'PDF · 32 trang',
    'resources.d5.name': 'Template: Phễu Marketing AARRR',
    'resources.d5.desc': 'Khung phễu giúp bạn vẽ và đo lường hành trình khách hàng qua 5 giai đoạn.',
    'resources.d5.type': 'Google Sheet',
    'resources.d6.name': 'Swipe file: 50 mẫu caption bán hàng',
    'resources.d6.desc': 'Bộ 50 mẫu caption theo nhiều công thức copywriting để bạn tham khảo và biến tấu.',
    'resources.d6.type': 'PDF',
    'resources.download': 'Tải xuống',

    // Trang Công cụ - Kiểm tra content quảng cáo
    'tools.title': 'Kiểm tra content quảng cáo',
    'tools.lead':
      'Dán nội dung quảng cáo của bạn để rà soát nhanh những từ ngữ dễ vi phạm chính sách Facebook và Luật Quảng cáo Việt Nam, kèm gợi ý sửa.',
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
    'tools.disclaimer':
      'Công cụ rà soát sơ bộ theo danh sách từ ngữ rủi ro thường gặp. Kết quả mang tính tham khảo, không thay thế tư vấn pháp lý hay quyết định duyệt của Facebook.',
    'tools.aiNote':
      'Sắp có: lớp phân tích bằng AI để hiểu ngữ cảnh cả bài, không chỉ dò từ khóa.',

    // Trang Liên hệ
    'contact.badge': '📬 Liên hệ',
    'contact.title': 'Kết nối với chúng tôi',
    'contact.lead':
      'Bạn có câu hỏi, góp ý, hoặc muốn hợp tác? Hãy gửi tin nhắn cho chúng tôi — chúng tôi luôn sẵn lòng lắng nghe và phản hồi sớm nhất có thể.',
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
    'chat.q.resources': 'Tài liệu miễn phí ở đâu?',
    'chat.q.contact': 'Làm sao để liên hệ?',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.blog': 'Articles',
    'nav.products': 'Services',
    'nav.resources': 'Free Resources',
    'nav.tools': 'Tools',
    'nav.contact': 'Contact',
    'nav.search': 'Search',
    'ui.theme': 'Toggle light/dark theme',
    'ui.language': 'Language',

    // Home - Hero
    'home.badge': '📚 Practical marketing knowledge',
    'home.hero.title':
      'Understand marketing <span class="grad">right</span>,<br /> do marketing <span class="grad">effectively</span>.',
    'home.hero.sub':
      'Marketing knowledge that is clear, practical and applicable across the entire journey — from market research and strategy to execution, measurement and optimization.',
    'home.hero.cta1': 'Start reading →',
    'home.hero.cta2': 'Explore topics',
    'home.stat.posts': 'Articles',
    'home.stat.topics': 'Topics',
    'home.stat.free': 'Free',

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
    'footer.col.topics': 'Topics',
    'footer.col.explore': 'Explore',
    'footer.allposts': 'All articles',
    'footer.categories': 'Topic categories',
    'footer.search': 'Search',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.copyright': 'Content is for reference and learning purposes.',
    'footer.built': 'Built with Astro 🚀',

    // About page
    'about.badge': '👋 About us',
    'about.title': 'We believe good marketing <span class="grad">should be easy to learn</span>',
    'about.lead':
      'Sunz Làm Marketing was born with a simple goal: to turn seemingly complex marketing knowledge into something anyone can understand and apply — whether you run an online shop, work as a freelancer, or are just starting out.',
    'about.val1.title': 'Practical, not just theory',
    'about.val1.text':
      'Every article aims to be immediately applicable, with concrete examples and steps.',
    'about.val2.title': 'Made for Vietnamese',
    'about.val2.text':
      'Written in Vietnamese, tailored to the local market and the platforms people here actually use.',
    'about.val3.title': 'Free & accessible',
    'about.val3.text':
      'Knowledge should be shared. All content on Sunz Làm Marketing is free.',
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
      'We support you from strategy to execution — pick the service that fits your goals and stage of growth.',
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

    // Free Resources page
    'resources.badge': '📂 Free Resources',
    'resources.title': 'Free Marketing Resources',
    'resources.lead':
      'A collection of practical ebooks, checklists and templates — download and apply them to your work right away.',
    'resources.d1.name': 'Ebook: Marketing Basics for Beginners',
    'resources.d1.desc': 'An overview of core marketing concepts and mindset, easy to grasp for beginners.',
    'resources.d1.type': 'PDF · 24 pages',
    'resources.d2.name': 'Checklist: 30 On-page SEO Optimizations',
    'resources.d2.desc': 'A checklist to optimize every article for SEO before you publish.',
    'resources.d2.type': 'PDF · 2 pages',
    'resources.d3.name': 'Template: 30-Day Content Plan',
    'resources.d3.desc': 'A content calendar template with the structure ready — just add your topics.',
    'resources.d3.type': 'Google Sheet',
    'resources.d4.name': 'Ebook: Facebook Ads Handbook',
    'resources.d4.desc': 'From setting up campaigns to optimizing cost, with real examples.',
    'resources.d4.type': 'PDF · 32 pages',
    'resources.d5.name': 'Template: AARRR Marketing Funnel',
    'resources.d5.desc': 'A funnel framework to map and measure the customer journey across 5 stages.',
    'resources.d5.type': 'Google Sheet',
    'resources.d6.name': 'Swipe file: 50 Sales Caption Examples',
    'resources.d6.desc': '50 caption examples across multiple copywriting formulas to reference and adapt.',
    'resources.d6.type': 'PDF',
    'resources.download': 'Download',

    // Tools page - Ad content checker
    'tools.title': 'Ad Content Checker',
    'tools.lead':
      'Paste your ad copy to quickly scan for wording that commonly breaches Facebook ad policies and Vietnamese advertising law, with suggested fixes.',
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
    'tools.disclaimer':
      'A preliminary scan based on commonly flagged wording. Results are for reference only and do not replace legal advice or Facebook’s review decision.',
    'tools.aiNote':
      'Coming soon: an AI layer that understands the context of the whole piece, not just keywords.',

    // Contact page
    'contact.badge': '📬 Contact',
    'contact.title': 'Get in touch with us',
    'contact.lead':
      'Have a question, feedback, or want to collaborate? Send us a message — we are always happy to listen and reply as soon as we can.',
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
    'chat.q.resources': 'Where are the free resources?',
    'chat.q.contact': 'How do I get in touch?',
  },
} as const;
