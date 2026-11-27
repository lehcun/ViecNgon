export interface PortfolioTemplateItem {
  id: "truyen_thong" | "hien_dai" | "toi_gian";
  name: string;
  badge: string;
  levelFit: string;
  summary: string;
  highlights: string[];
  accentBg: string;
  accentText: string;
  sampleRole: string;
  sampleName: string;
  sampleSkills: string[];
}

export interface CvTipCategory {
  id: string; label: string; headline: string; description: string;
  goodExample: string; badExample: string; takeaway: string;
}

export interface PortfolioBlogPreview {
  id: string; category: string; readTime: string; dateLabel: string;
  title: string; excerpt: string; featured?: boolean;
  keyPoints: string[]; body: string[];
}

export interface PortfolioFaqItem { question: string; answer: string; }

export const PORTFOLIO_TEMPLATES: PortfolioTemplateItem[] = [
  {
    id: "truyen_thong",
    name: "Truyền thống",
    badge: "Chuẩn ATS",
    levelFit: "Fresher · Junior · Mid-level",
    summary:
      "Bố cục 1 cột mạch lạc, phân tầng rõ Kinh nghiệm — Kỹ năng — Học vấn giúp máy lọc ATS và HR đọc lướt trong 15 giây.",
    highlights: [
      "Tỷ lệ vượt vòng lọc ATS cao nhất",
      "Nhấn mạnh mốc thời gian và số liệu dự án",
      "Phù hợp ứng tuyển công ty Product & Enterprise",
    ],
    accentBg: "bg-primary",
    accentText: "text-primary",
    sampleRole: "Backend Engineer (Java / Spring)",
    sampleName: "Nguyễn Minh Khôi",
    sampleSkills: ["Java 21", "Spring Boot", "PostgreSQL", "Docker"],
  },
  {
    id: "hien_dai",
    name: "Hiện đại",
    badge: "Khuyên dùng",
    levelFit: "Mid · Senior · Fullstack",
    summary:
      "Cấu trúc 2 cột cân bằng với cột kỹ năng & chứng chỉ nổi bật bên trái, tạo điểm nhấn chuyên nghiệp cho kỹ sư nhiều dự án.",
    highlights: [
      "Hiển thị trực quan Tech Stack & liên kết GitHub",
      "Dễ gom nhóm 3–5 dự án nổi bật trong 1–2 trang",
      "Tối ưu trải nghiệm đọc trực tuyến lẫn in PDF",
    ],
    accentBg: "bg-info",
    accentText: "text-info-text",
    sampleRole: "Senior Fullstack Developer",
    sampleName: "Trần Hải Đăng",
    sampleSkills: ["Next.js", "NestJS", "TypeScript", "AWS"],
  },
  {
    id: "toi_gian",
    name: "Tối giản",
    badge: "Tinh gọn",
    levelFit: "Senior · Tech Lead · Architect",
    summary:
      "Phong cách Typography tối giản không thừa chi tiết, dồn toàn bộ sự chú ý vào kiến trúc hệ thống và tác động kinh doanh.",
    highlights: [
      "Khoảng trắng rộng, chuẩn gu Tech Lead & CTO",
      "Trình bày sắc nét thành tựu & quy mô hệ thống",
      "Hỗ trợ song ngữ Việt / Anh mạch lạc",
    ],
    accentBg: "bg-primary-dark",
    accentText: "text-text-primary",
    sampleRole: "Staff Software Engineer",
    sampleName: "Lê Quang Vinh",
    sampleSkills: ["System Design", "Go", "Kubernetes", "Kafka"],
  },
];

export const CV_TIP_CATEGORIES: CvTipCategory[] = [
  {
    id: "summary",
    label: "1. Tóm tắt bản thân",
    headline: "3 dòng đầu tiên quyết định HR có đọc tiếp hay không",
    description:
      "Thay vì viết chung chung về mục tiêu nghề nghiệp, hãy tóm tắt rõ số năm kinh nghiệm, thế mạnh kỹ thuật cốt lõi và loại hệ thống bạn từng xây dựng.",
    goodExample:
      "Senior Backend Engineer với 5 năm kinh nghiệm xây dựng hệ thống thanh toán chịu tải 2.000 req/s bằng NestJS, PostgreSQL và Redis. Tối ưu thời gian phản hồi API giảm 42%.",
    badExample:
      "Mong muốn tìm một môi trường năng động, chuyên nghiệp để học hỏi thêm nhiều kinh nghiệm mới và đóng góp cho sự phát triển của công ty.",
    takeaway:
      "Luôn gói gọn trong 2–3 câu: Vai trò + Số năm + Tech Stack chính + 1 kết quả định lượng.",
  },
  {
    id: "experience",
    label: "2. Kinh nghiệm & Số liệu",
    headline: "Viết theo công thức Hành động + Công nghệ + Kết quả đo được",
    description:
      "Nhà tuyển dụng IT không chỉ muốn biết bạn từng làm gì, mà muốn thấy mức độ phức tạp và giá trị thực tế bạn mang lại cho sản phẩm.",
    goodExample:
      "Thiết kế lại luồng tìm kiếm việc làm bằng Elasticsearch & caching Redis, rút ngắn thời gian truy vấn từ 1,4s xuống 180ms cho 50.000 người dùng hoạt động/tháng.",
    badExample:
      "Tham gia phát triển backend cho dự án web của công ty, sửa lỗi theo yêu cầu của khách hàng và hỗ trợ các thành viên trong nhóm.",
    takeaway:
      "Sắp xếp kinh nghiệm theo thứ tự thời gian ngược (mới nhất lên đầu) và gắn ít nhất 1 con số ở mỗi vị trí.",
  },
  {
    id: "skills",
    label: "3. Tech Stack theo JD",
    headline: "Phân nhóm kỹ năng rõ ràng thay vì liệt kê 30 từ khóa rời rạc",
    description:
      "Chia kỹ năng theo nhóm (Ngôn ngữ, Framework, Database, DevOps) và ưu tiên các từ khóa xuất hiện trực tiếp trong mô tả công việc (JD).",
    goodExample:
      "Backend: Node.js, NestJS, TypeScript · Database: SQL Server, Prisma, Redis · Infra: Docker, GitHub Actions, AWS EC2.",
    badExample:
      "HTML, CSS, JS, React, Vue, Angular, PHP, Java, C++, Python, Photoshop, Word, Excel, PowerPoint, Teamwork...",
    takeaway:
      "Bỏ thanh phần trăm tự chấm (ví dụ: React 80%) vì mang tính cảm tính — thay bằng phiên bản/ngữ cảnh sử dụng thực tế.",
  },
  {
    id: "projects",
    label: "4. Dự án Portfolio",
    headline: "Chứng minh năng lực thật qua kiến trúc và đường dẫn Demo/GitHub",
    description:
      "Đặc biệt quan trọng với Fresher, Junior và lập trình viên chuyển ngành: 2–3 dự án có repo sạch và link chạy thật giá trị hơn 10 dòng liệt kê lý thuyết.",
    goodExample:
      "ViecNgon Recruitment Platform (Fullstack — Next.js 16, NestJS, Gemini AI): Tích hợp bóc tách CV PDF tự động & chấm điểm AI Match Score. Kèm link Demo + GitHub.",
    badExample:
      "Đồ án tốt nghiệp website bán hàng làm bằng React và Node.js (không có mô tả kiến trúc, không có vai trò cụ thể, không có link xem).",
    takeaway:
      "Ghi rõ quy mô nhóm, vai trò cá nhân, bài toán kỹ thuật khó nhất bạn đã giải quyết và đính kèm link kiểm chứng.",
  },
];

export const CV_CHECKLIST_ITEMS = [
  "Độ dài chuẩn 1 trang (Fresher/Junior) hoặc tối đa 2 trang (Senior/Lead).",
  "Luôn xuất và gửi dưới định dạng PDF đặt tên rõ ràng: NguyenVanA_Backend_CV.pdf.",
  "Kiểm tra chính tả tên công nghệ (TypeScript, PostgreSQL, Next.js — không viết sai hoa/thường).",
  "Đảm bảo mọi đường dẫn GitHub, LinkedIn, Demo đều đang mở công khai.",
  "Không để ảnh đại diện quá nặng hoặc phông nền rối mắt khi dùng mẫu chuẩn ATS.",
  "Đồng bộ từ khóa kỹ năng trên CV khớp với yêu cầu cốt lõi trong JD trước khi nộp.",
];

export const PORTFOLIO_BLOG_POSTS: PortfolioBlogPreview[] = [
  {
    id: "cv-ats-guide",
    category: "Hướng dẫn CV IT",
    readTime: "6 phút đọc",
    dateLabel: "Cẩm nang nổi bật",
    featured: true,
    title:
      "Cách viết CV lập trình viên vượt qua vòng sàng lọc ATS & AI Match trong 60 giây",
    excerpt:
      "Phân tích cách hệ thống ATS và Technical Recruiter đọc một bản CV kỹ sư phần mềm, từ cấu trúc tiêu đề, mật độ từ khóa đến cách trình bày thành tựu kỹ thuật.",
    keyPoints: [
      "Giữ cấu trúc tiêu đề mục chuẩn (Kinh nghiệm, Kỹ năng, Học vấn, Dự án) để trình bóc tách CV nhận diện chính xác 100%.",
      "Ưu tiên động từ hành động mạnh: Kiến trúc, Tối ưu, Tự động hóa, Triển khai thay vì 'Tham gia làm'.",
      "Tránh đặt nội dung quan trọng vào ảnh chụp màn hình hoặc bảng lồng nhiều tầng gây lỗi đọc text.",
    ],
    body: [
      "Trong các đợt tuyển dụng kỹ sư IT tại doanh nghiệp công nghệ, một vị trí Senior hoặc Fullstack thường nhận hàng trăm hồ sơ chỉ trong vài ngày đầu. Nhà tuyển dụng thường dành dưới 60 giây cho lượt quét đầu tiên.",
      "Một bản CV chuẩn ATS cần kết hợp hai yếu tố: dễ phân tích tự động (font chữ rõ, bố cục 1–2 cột mạch lạc, từ khóa kỹ thuật chính xác) và dễ thuyết phục con người (có số liệu tác động cụ thể ở mỗi dự án).",
      "Khi sử dụng công cụ tạo CV trên ViecNgon, dữ liệu kỹ năng và kinh nghiệm của bạn được chuẩn hóa ngay từ cấu trúc hồ sơ, giúp điểm AI Match Score phản ánh trung thực năng lực thật khi ứng tuyển.",
    ],
  },
  {
    id: "github-portfolio-fresher",
    category: "Portfolio IT",
    readTime: "5 phút đọc",
    dateLabel: "Mẹo cho Fresher",
    title: "Tối ưu GitHub & Portfolio để Fresher IT nổi bật giữa hàng trăm ứng viên",
    excerpt:
      "Cách viết file README chuyên nghiệp, chọn 3 dự án ghim đầu trang và trình bày kiến trúc hệ thống khiến Tech Lead muốn gọi phỏng vấn ngay.",
    keyPoints: [
      "Ghim đúng 3–4 repository chất lượng nhất có README kèm ảnh giao diện và sơ đồ luồng dữ liệu.",
      "Đưa sẵn tài khoản demo hoặc video ngắn 60 giây để HR trải nghiệm mà không cần tự cài môi trường.",
      "Commit history sạch sẽ theo chuẩn Conventional Commits thể hiện tác phong làm việc chuyên nghiệp.",
    ],
    body: [
      "Khi chưa có nhiều năm kinh nghiệm thực chiến tại doanh nghiệp, Portfolio và GitHub chính là bằng chứng thuyết phục nhất về năng lực viết code và tư duy giải quyết vấn đề của bạn.",
      "Thay vì liệt kê hàng loạt bài tập nhỏ, hãy đầu tư hoàn thiện 2–3 dự án có tính ứng dụng thật, mô tả rõ bài toán bạn chọn giải quyết, đánh đổi công nghệ và những lỗi thực tế đã tự xử lý.",
    ],
  },
  {
    id: "ai-polish-cv",
    category: "Ứng dụng AI",
    readTime: "4 phút đọc",
    dateLabel: "Bí quyết AI",
    title: "Dùng AI bóc tách & trau chuốt CV IT mà không bị cảm giác 'văn mẫu'",
    excerpt:
      "Bí quyết kết hợp tính năng Nhập CV bằng AI của ViecNgon với số liệu thực tế của bản thân để tiết kiệm 80% thời gian chuẩn bị hồ sơ.",
    keyPoints: [
      "Dùng AI để chuẩn hóa cấu trúc và kiểm tra ngữ pháp/thuật ngữ chuyên ngành, không bịa đặt số liệu.",
      "Luôn rà soát lại các mốc thời gian và danh sách công nghệ sau khi bóc tách tự động từ PDF.",
      "Tùy biến đoạn tóm tắt đầu CV theo từng nhóm vị trí (Backend, Fullstack, DevOps) trước khi nộp.",
    ],
    body: [
      "AI giúp lập trình viên vượt qua rào cản khó nhất khi viết CV: biến các đầu việc kỹ thuật rời rạc thành câu chữ ngắn gọn, sắc nét và đúng ngôn ngữ của nhà tuyển dụng.",
      "Tuy nhiên, Tech Lead rất dễ nhận ra một bản CV hoàn toàn do AI bịa ra nếu thiếu ngữ cảnh thực tế. Hãy luôn giữ số liệu thật từ dự án bạn từng làm và sẵn sàng giải thích sâu mọi dòng ghi trên CV.",
    ],
  },
  {
    id: "system-design-interview",
    category: "Phỏng vấn IT",
    readTime: "7 phút đọc",
    dateLabel: "Thăng tiến Senior",
    title: "Chuẩn bị câu chuyện dự án trên CV cho vòng phỏng vấn Kỹ thuật & System Design",
    excerpt:
      "Mọi gạch đầu dòng trên CV đều có thể trở thành câu hỏi đào sâu từ Tech Lead. Cách chuẩn bị theo mô hình STAR + kiến trúc kỹ thuật.",
    keyPoints: [
      "Với mỗi dự án trên CV, chuẩn bị sẵn sơ đồ kiến trúc tổng quan và 1 nút thắt hiệu năng từng xử lý.",
      "Giải thích rõ lý do chọn công nghệ (trade-offs) thay vì chỉ nói 'vì team dùng sẵn'.",
      "Chuẩn bị 2–3 câu hỏi ngược lại cho Hiring Manager về quy trình code review và định hướng kỹ thuật.",
    ],
    body: [
      "CV tốt giúp bạn bước vào phòng phỏng vấn, nhưng sự nhất quán giữa những gì bạn viết trên CV và cách bạn phân tích trong buổi trao đổi mới quyết định lời mời nhận việc (Offer).",
      "Hãy xem mỗi gạch đầu dòng kinh nghiệm trên CV là một 'mỏ neo câu chuyện': sẵn sàng trình bày bối cảnh, giải pháp bạn đề xuất, kết quả đo lường và bài học rút ra nếu được làm lại.",
    ],
  },
];

export const PORTFOLIO_FAQS: PortfolioFaqItem[] = [
  {
    question: "Tạo CV và Portfolio IT trên ViecNgon có mất phí không?",
    answer:
      "Hoàn toàn miễn phí cho ứng viên. Bạn có thể xây dựng hồ sơ Hybrid CV, sử dụng tính năng Nhập CV bằng AI (PDF) và xuất file PDF từ cả 3 mẫu Truyền thống, Hiện đại, Tối giản mà không cần trả phí.",
  },
  {
    question: "Tôi đã có sẵn CV PDF thì có phải nhập lại từ đầu không?",
    answer:
      "Không cần. Sau khi đăng nhập và vào mục Hồ sơ CV (/cv-profile), bạn chỉ cần tải file CV PDF lên nút 'Nhập CV bằng AI' — hệ thống sẽ tự động bóc tách thông tin cá nhân, kinh nghiệm, học vấn, chứng chỉ và kỹ năng vào biểu mẫu để bạn rà soát và lưu lại.",
  },
  {
    question: "Mẫu CV của ViecNgon có thân thiện với hệ thống lọc ATS không?",
    answer:
      "Có. Cả 3 mẫu CV được thiết kế riêng cho ngành công nghệ với cấu trúc văn bản chuẩn, phân cấp tiêu đề rõ ràng, xuất PDF dạng vector text (có thể bôi đen/tìm kiếm được), giúp hệ thống ATS và AI Match Score đọc chính xác 100%.",
  },
  {
    question: "Tôi cần hoàn thiện bao nhiêu phần trăm hồ sơ để xuất CV PDF?",
    answer:
      "Hệ thống khuyến nghị hoàn thiện tối thiểu các thông tin cốt lõi (họ tên, chức danh, kỹ năng và kinh nghiệm/học vấn) để bản CV xuất ra đầy đủ và đạt độ tương thích cao nhất với các tin tuyển dụng IT.",
  },
  {
    question: "Mục Blog và Mẹo viết CV có được cập nhật thêm không?",
    answer:
      "Có. Hiện tại đây là bộ cẩm nang rút gọn minh họa các nguyên tắc cốt lõi dành cho kỹ sư IT; thư viện bài viết chuyên sâu và chuyên mục Blog đầy đủ đang được đội ngũ ViecNgon hoàn thiện trong các bản cập nhật tiếp theo.",
  },
];
