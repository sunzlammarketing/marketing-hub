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
    'nav.products': 'Sản phẩm',
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
    'home.featured.sub': 'Bài viết mới nhất, đáng đọc nhất tuần này.',
    'home.recent.title': 'Bài viết mới nhất',
    'home.recent.sub': 'Cập nhật kiến thức marketing đều đặn mỗi tuần.',
    'home.viewall': 'Xem tất cả →',
    'home.cta.title': 'Đừng bỏ lỡ kiến thức mới',
    'home.cta.text':
      'Ghé thăm thường xuyên hoặc kết nối với chúng tôi để cập nhật những bài viết marketing mới nhất.',
    'home.cta.btn': 'Kết nối ngay →',

    // Footer
    'footer.tagline':
      'Nơi chia sẻ kiến thức Marketing thực chiến — từ SEO, Content đến Quảng cáo và Thương hiệu, dành cho người Việt.',
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

    // Trang Sản phẩm
    'products.badge': '🎓 Sản phẩm & Dịch vụ',
    'products.title': 'Sản phẩm & Dịch vụ',
    'products.lead':
      'Các sản phẩm và dịch vụ giúp bạn học và ứng dụng Marketing hiệu quả hơn. (Đây là nội dung mẫu — hãy thay bằng sản phẩm thật của bạn.)',
    'products.p1.name': 'Khóa học Marketing nền tảng',
    'products.p1.desc':
      'Lộ trình bài bản từ tư duy đến thực thi, phù hợp cho người mới bắt đầu.',
    'products.p1.price': 'Đang cập nhật',
    'products.p2.name': 'Dịch vụ tư vấn chiến lược',
    'products.p2.desc':
      'Đồng hành cùng doanh nghiệp xây dựng chiến lược Marketing phù hợp mục tiêu.',
    'products.p2.price': 'Liên hệ báo giá',
    'products.p3.name': 'Gói xây dựng thương hiệu',
    'products.p3.desc':
      'Định vị, bộ nhận diện và hệ thống nội dung nhất quán cho thương hiệu của bạn.',
    'products.p3.price': 'Liên hệ báo giá',
    'products.cta': 'Liên hệ tư vấn',
    'products.badge2': 'Nội dung mẫu',

    // Trang Liên hệ
    'contact.badge': '📬 Liên hệ',
    'contact.title': 'Kết nối với chúng tôi',
    'contact.lead':
      'Bạn có câu hỏi, góp ý, hoặc muốn hợp tác? Hãy gửi tin nhắn cho chúng tôi — chúng tôi luôn sẵn lòng lắng nghe và phản hồi sớm nhất có thể.',
    'contact.form.name': 'Họ và tên',
    'contact.form.name.ph': 'Nguyễn Văn A',
    'contact.form.email': 'Email',
    'contact.form.email.ph': 'ban@email.com',
    'contact.form.subject': 'Chủ đề',
    'contact.form.subject.ph': 'Tôi muốn hỏi về...',
    'contact.form.message': 'Nội dung',
    'contact.form.message.ph': 'Nhập nội dung tin nhắn của bạn...',
    'contact.form.submit': 'Gửi tin nhắn →',
    'contact.err.required': 'Vui lòng điền đầy đủ họ tên, email và nội dung.',
    'contact.err.email': 'Email không hợp lệ. Vui lòng kiểm tra lại.',
    'contact.ok': 'Cảm ơn bạn! Tin nhắn của bạn đã được ghi nhận (demo).',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.blog': 'Articles',
    'nav.products': 'Products',
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
    'home.featured.sub': 'The latest and most worth-reading article this week.',
    'home.recent.title': 'Latest articles',
    'home.recent.sub': 'Fresh marketing knowledge every week.',
    'home.viewall': 'View all →',
    'home.cta.title': "Don't miss new knowledge",
    'home.cta.text':
      'Visit often or connect with us to keep up with the latest marketing articles.',
    'home.cta.btn': 'Get in touch →',

    // Footer
    'footer.tagline':
      'A place to share practical marketing knowledge — from SEO and Content to Ads and Branding, made for Vietnamese learners.',
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

    // Products page
    'products.badge': '🎓 Products & Services',
    'products.title': 'Products & Services',
    'products.lead':
      'Products and services to help you learn and apply marketing more effectively. (This is sample content — replace it with your real offerings.)',
    'products.p1.name': 'Marketing Foundations Course',
    'products.p1.desc':
      'A structured path from mindset to execution, perfect for beginners.',
    'products.p1.price': 'Coming soon',
    'products.p2.name': 'Strategy Consulting',
    'products.p2.desc':
      'We partner with businesses to build a marketing strategy that fits their goals.',
    'products.p2.price': 'Contact for quote',
    'products.p3.name': 'Branding Package',
    'products.p3.desc':
      'Positioning, visual identity and a consistent content system for your brand.',
    'products.p3.price': 'Contact for quote',
    'products.cta': 'Contact us',
    'products.badge2': 'Sample content',

    // Contact page
    'contact.badge': '📬 Contact',
    'contact.title': 'Get in touch with us',
    'contact.lead':
      'Have a question, feedback, or want to collaborate? Send us a message — we are always happy to listen and reply as soon as we can.',
    'contact.form.name': 'Full name',
    'contact.form.name.ph': 'John Doe',
    'contact.form.email': 'Email',
    'contact.form.email.ph': 'you@email.com',
    'contact.form.subject': 'Subject',
    'contact.form.subject.ph': 'I would like to ask about...',
    'contact.form.message': 'Message',
    'contact.form.message.ph': 'Type your message here...',
    'contact.form.submit': 'Send message →',
    'contact.err.required': 'Please fill in your name, email and message.',
    'contact.err.email': 'Invalid email. Please check again.',
    'contact.ok': 'Thank you! Your message has been received (demo).',
  },
} as const;
