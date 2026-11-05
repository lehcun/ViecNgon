/**
 * =====================================================================
 * PRESET TEMPLATES FOR JOB POSTING (MẪU NỘI DUNG GỢI Ý SOẠN TIN TUYỂN DỤNG)
 * ---------------------------------------------------------------------
 * Cung cấp các khung nội dung HTML chuẩn đẹp dành cho Rich Text Editor:
 * - Mô tả công việc (Job Description)
 * - Yêu cầu công việc (Job Requirements)
 * - Quyền lợi & Phúc lợi (Job Benefits)
 * =====================================================================
 */

export interface JobTemplate {
  id: string;
  title: string;
  roleBadge: string;
  description: string;
  content: string; // HTML format
}

// ---------------------------------------------------------------------
// 1. MẪU MÔ TẢ CÔNG VIỆC (JOB DESCRIPTION)
// ---------------------------------------------------------------------
export const JOB_DESCRIPTION_TEMPLATES: JobTemplate[] = [
  {
    id: "desc-fullstack",
    title: "Lập trình viên Fullstack (React / Node.js)",
    roleBadge: "Fullstack",
    description: "Phù hợp cho các vị trí phát triển Web Application đa nền tảng hiện đại.",
    content: `
<p><strong>Vị trí tuyển dụng:</strong> Lập trình viên Fullstack (ReactJS / NodeJS)</p>
<p>Chúng tôi đang tìm kiếm những kỹ sư tài năng tham gia phát triển và vận hành hệ thống phần mềm quy mô lớn, phục vụ hàng triệu người dùng.</p>
<p><strong>Nhiệm vụ trọng tâm:</strong></p>
<ul>
  <li>Tham gia trực tiếp vào toàn bộ vòng đời phát triển phần mềm (SDLC): Phân tích thiết kế, phát triển, kiểm thử và triển khai.</li>
  <li>Xây dựng các giao diện web trực quan, hiện đại, tối ưu hiệu năng và trải nghiệm người dùng (UX/UI) bằng <strong>React.js / Next.js</strong>.</li>
  <li>Thiết kế và phát triển RESTful APIs, Microservices bằng <strong>Node.js (NestJS / Express)</strong> có độ trễ thấp và khả năng mở rộng cao.</li>
  <li>Tối ưu hóa truy vấn cơ sở dữ liệu (PostgreSQL / SQL Server / MongoDB), giải quyết bài toán tải lớn (High Concurrency).</li>
  <li>Phối hợp chặt chẽ với UI/UX Designer, Product Owner và QA để mang lại sản phẩm phần mềm chất lượng cao nhất.</li>
  <li>Tham gia Code Review, chuẩn hóa Coding Conventions và cải thiện kiến trúc hệ thống.</li>
</ul>
    `.trim(),
  },
  {
    id: "desc-backend",
    title: "Kỹ sư Backend (Node.js / Java / Go / Microservices)",
    roleBadge: "Backend",
    description: "Tập trung vào kiến trúc hệ thống phân tán, xử lý dữ liệu lớn và API.",
    content: `
<p><strong>Vị trí tuyển dụng:</strong> Backend Software Engineer</p>
<p>Chịu trách nhiệm kiến trúc, phát triển và bảo trì hạ tầng Backend và dịch vụ dữ liệu lõi của doanh nghiệp.</p>
<p><strong>Trách nhiệm chính:</strong></p>
<ul>
  <li>Thiết kế và triển khai kiến trúc <strong>Microservices</strong> với tính sẵn sàng cao (High Availability, 99.99% Uptime).</li>
  <li>Xây dựng và tối ưu hệ thống API bảo mật, hỗ trợ kết nối với các hệ sinh thái bên thứ ba (Third-party integrations).</li>
  <li>Quản lý, tối ưu hóa cơ sở dữ liệu quan hệ và phi quan hệ (SQL Server, PostgreSQL, Redis, Elasticsearch).</li>
  <li>Xây dựng cơ chế Message Broker (Kafka, RabbitMQ) để xử lý các tác vụ bất đồng bộ (Asynchronous tasks).</li>
  <li>Giám sát hiệu năng hệ thống (APM, Logging, Metrics), kịp thời xử lý các sự cố kỹ thuật và phòng chống tấn công bảo mật.</li>
</ul>
    `.trim(),
  },
  {
    id: "desc-frontend",
    title: "Kỹ sư Frontend (React / Next.js / TypeScript)",
    roleBadge: "Frontend",
    description: "Tối ưu hóa UI/UX, Single Page Application, Web Performance và SEO.",
    content: `
<p><strong>Vị trí tuyển dụng:</strong> Frontend Engineer (React / Next.js)</p>
<p>Bạn sẽ là người trực tiếp kiến tạo những trải nghiệm số mượt mà, ấn tượng và truyền cảm hứng cho người dùng.</p>
<p><strong>Nhiệm vụ chính:</strong></p>
<ul>
  <li>Chuyển đổi các bản thiết kế từ Figma thành các Web Component chuẩn Pixel-perfect, Responsive đa màn hình.</li>
  <li>Tối ưu hóa Core Web Vitals, tốc độ tải trang, SEO và khả năng tiếp cận (Accessibility - a11y).</li>
  <li>Quản lý trạng thái ứng dụng hiệu quả với <strong>React Query (TanStack Query)</strong>, Zustand hoặc Redux Toolkit.</li>
  <li>Tích hợp mượt mà với Backend APIs, xử lý tốt các trạng thái mạng (Loading, Error, Offline state).</li>
  <li>Xây dựng Design System dùng chung (Atomic Design, Tailwind CSS, Shadcn UI).</li>
</ul>
    `.trim(),
  },
  {
    id: "desc-qa-qc",
    title: "Chuyên viên Đảm bảo chất lượng (QA / QC / Tester)",
    roleBadge: "QA/QC",
    description: "Thực hiện kiểm thử Manual & Automation để đảm bảo tiêu chuẩn phần mềm cao nhất.",
    content: `
<p><strong>Vị trí tuyển dụng:</strong> QA / QC Engineer (Manual & Automation)</p>
<p>Đảm bảo từng tính năng phát hành đều đạt chuẩn chất lượng xuất sắc trước khi tới tay khách hàng.</p>
<p><strong>Nhiệm vụ chính:</strong></p>
<ul>
  <li>Nghiên cứu tài liệu yêu cầu (BRD, SRS), thiết kế Test Plan, Test Cases và Ma trận kiểm thử (Traceability Matrix).</li>
  <li>Thực hiện kiểm thử chức năng (Functional Testing), kiểm thử tích hợp (Integration), kiểm thử hồi quy (Regression Testing).</li>
  <li>Phát triển các kịch bản kiểm thử tự động (Automation Testing) với <strong>Cypress, Playwright hoặc Selenium</strong>.</li>
  <li>Phát hiện, ghi nhận và theo dõi vòng đời của lỗi (Bug Life Cycle) trên Jira / Linear.</li>
  <li>Phối hợp cùng Dev Team phân tích nguyên nhân gốc rễ (Root Cause Analysis) để không lặp lại lỗi.</li>
</ul>
    `.trim(),
  },
  {
    id: "desc-mobile",
    title: "Lập trình viên Mobile (React Native / Flutter)",
    roleBadge: "Mobile",
    description: "Phát triển ứng dụng di động đa nền tảng iOS & Android.",
    content: `
<p><strong>Vị trí tuyển dụng:</strong> Mobile Developer (React Native / Flutter)</p>
<p>Trực tiếp phát triển ứng dụng di động trọng điểm của công ty phục vụ hàng triệu người dùng trên App Store & Google Play.</p>
<p><strong>Nhiệm vụ chính:</strong></p>
<ul>
  <li>Phát triển và bảo trì ứng dụng di động hiệu năng cao bằng <strong>React Native hoặc Flutter</strong>.</li>
  <li>Tích hợp các Native Modules, Hardware APIs (Camera, GPS, Bluetooth, Push Notifications).</li>
  <li>Tối ưu bộ nhớ, thời lượng pin và đảm bảo ứng dụng chạy mượt mà ở mức 60FPS.</li>
  <li>Đóng gói, cấu hình CI/CD và quản lý quy trình phát hành ứng dụng lên Apple App Store và Google Play Store.</li>
</ul>
    `.trim(),
  },
];

// ---------------------------------------------------------------------
// 2. MẪU YÊU CẦU CÔNG VIỆC (JOB REQUIREMENTS)
// ---------------------------------------------------------------------
export const JOB_REQUIREMENT_TEMPLATES: JobTemplate[] = [
  {
    id: "req-fresher-junior",
    title: "Yêu cầu cho Fresher / Junior (0 - 2 năm kinh nghiệm)",
    roleBadge: "Junior/Fresher",
    description: "Tập trung nền tảng tư duy lập trình vững chắc, ham học hỏi và thái độ tốt.",
    content: `
<p><strong>Yêu cầu chuyên môn:</strong></p>
<ul>
  <li>Tốt nghiệp Cao đẳng / Đại học chuyên ngành Công nghệ thông tin, Khoa học máy tính hoặc các ngành liên quan.</li>
  <li>Có từ <strong>6 tháng - 2 năm</strong> kinh nghiệm thực chiến với ngôn ngữ lập trình chính (JavaScript / TypeScript / C# / Java).</li>
  <li>Nắm vững kiến thức nền tảng: Cấu trúc dữ liệu và giải thuật, Lập trình hướng đối tượng (OOP), Mô hình MVC.</li>
  <li>Hiểu biết cơ bản về cơ sở dữ liệu quan hệ (SQL) và cách viết câu truy vấn cơ bản.</li>
  <li>Sử dụng thành thạo Git cho việc quản lý mã nguồn (Commit, Branching, Pull Request).</li>
</ul>
<p><strong>Yêu cầu kỹ năng mềm & Thái độ:</strong></p>
<ul>
  <li>Tinh thần chủ động (Proactive), ham học hỏi công nghệ mới và cầu tiến trong công việc.</li>
  <li>Khả năng đọc hiểu tài liệu kỹ thuật chuyên ngành bằng Tiếng Anh.</li>
  <li>Kỹ năng giao tiếp và làm việc nhóm tốt, tôn trọng tiến độ công việc được giao.</li>
</ul>
    `.trim(),
  },
  {
    id: "req-senior-lead",
    title: "Yêu cầu cho Senior Engineer (3 - 5+ năm kinh nghiệm)",
    roleBadge: "Senior/Lead",
    description: "Kinh nghiệm kiến trúc sâu, tối ưu hiệu năng và khả năng dẫn dắt kỹ thuật.",
    content: `
<p><strong>Yêu cầu chuyên môn:</strong></p>
<ul>
  <li>Có từ <strong>3 - 5+ năm</strong> kinh nghiệm làm việc thực tế ở vị trí tương đương.</li>
  <li>Thành thạo sâu sắc về kiến trúc phần mềm (Clean Architecture, Domain-Driven Design, Microservices).</li>
  <li>Kinh nghiệm sâu rộng về tối ưu hiệu năng (Caching strategies, Database Indexing, Query Optimization, Memory Leaks).</li>
  <li>Thành thạo Docker, quy trình CI/CD (GitHub Actions / GitLab CI) và làm việc với Cloud (AWS / GCP / Azure).</li>
  <li>Có tư duy viết Unit Test, Integration Test và tôn trọng nguyên tắc Clean Code.</li>
</ul>
<p><strong>Kỹ năng lãnh đạo & Giải quyết vấn đề:</strong></p>
<ul>
  <li>Khả năng phân tích bài toán nghiệp vụ phức tạp, đưa ra giải pháp kỹ thuật tối ưu và bảo vệ giải pháp.</li>
  <li>Kinh nghiệm dẫn dắt (Mentorship), Review code và đào tạo các kỹ sư cấp dưới.</li>
  <li>Kỹ năng giao tiếp Tiếng Anh tốt (tương đương TOEIC 650+ hoặc IELTS 6.0+), có thể làm việc trực tiếp với khách hàng/đối tác quốc tế.</li>
</ul>
    `.trim(),
  },
  {
    id: "req-soft-skills",
    title: "Yêu cầu Tiêu chuẩn Agile, Kỹ năng mềm & Tiếng Anh",
    roleBadge: "Agile & English",
    description: "Bộ yêu cầu toàn diện về phương pháp làm việc Agile/Scrum và ngoại ngữ.",
    content: `
<p><strong>Kỹ năng làm việc chuyên nghiệp:</strong></p>
<ul>
  <li>Đã có kinh nghiệm làm việc theo mô hình <strong>Agile / Scrum</strong> (Sprint Planning, Daily Standup, Retrospective).</li>
  <li>Khả năng giải quyết vấn đề (Problem-solving) độc lập và tư duy logic phản biện sắc bén.</li>
  <li>Kỹ năng quản lý thời gian xuất sắc, khả năng đa nhiệm và chịu được áp lực tiến độ (Deadline-driven).</li>
  <li>Kỹ năng thuyết trình và trình bày giải pháp kỹ thuật rõ ràng, mạch lạc trước đội ngũ.</li>
</ul>
<p><strong>Ngoại ngữ:</strong></p>
<ul>
  <li>Giao tiếp Tiếng Anh trôi chảy trong công việc (Đọc tài liệu, viết email, báo cáo và tham gia họp kỹ thuật).</li>
  <li>Ưu tiên ứng viên biết thêm tiếng Nhật (JLPT N3 trở lên) hoặc tiếng Hàn là một lợi thế lớn.</li>
</ul>
    `.trim(),
  },
];

// ---------------------------------------------------------------------
// 3. MẪU QUYỀN LỢI & PHÚC LỢI (JOB BENEFITS)
// ---------------------------------------------------------------------
export const JOB_BENEFIT_TEMPLATES: JobTemplate[] = [
  {
    id: "ben-tech-standard",
    title: "Gói Đãi ngộ IT Chuẩn (Lương 13, Cấp Macbook, Thưởng KPI)",
    roleBadge: "Tiêu chuẩn IT",
    description: "Khung phúc lợi tài chính và thiết bị làm việc chuẩn mực cho kỹ sư công nghệ.",
    content: `
<p><strong>Thu nhập & Tài chính:</strong></p>
<ul>
  <li>Mức lương hấp dẫn, cạnh tranh tương xứng theo năng lực và kinh nghiệm.</li>
  <li>Lương tháng 13 cố định + Thưởng hiệu quả kinh doanh cuối năm (Thưởng dự án, KPI từ 1 - 3 tháng lương).</li>
  <li>Xét tăng lương định kỳ 1 - 2 lần/năm dựa trên đánh giá hiệu suất minh bạch.</li>
  <li>Trợ cấp ăn trưa, gửi xe miễn phí, phụ cấp điện thoại và công tác phí đầy đủ.</li>
</ul>
<p><strong>Trang thiết bị & Cơ sở vật chất:</strong></p>
<ul>
  <li>Cung cấp <strong>Macbook Pro M-series</strong> đời mới hoặc PC cấu hình cao cùng màn hình phụ 27 inch 4K.</li>
  <li>Văn phòng làm việc hiện đại hạng A, khu vực Pantry đồ ăn nhẹ, trà, cà phê cao cấp miễn phí mỗi ngày.</li>
</ul>
    `.trim(),
  },
  {
    id: "ben-wellness-health",
    title: "Chăm sóc Sức khỏe & Đời sống (Bảo hiểm Premium, Du lịch)",
    roleBadge: "Sức khỏe & Đời sống",
    description: "Tập trung chế độ bảo vệ sức khỏe toàn diện và tinh thần cho nhân viên và gia đình.",
    content: `
<p><strong>Chăm sóc Sức khỏe Toàn diện:</strong></p>
<ul>
  <li>Đóng đầy đủ 100% các chế độ BHXH, BHYT, BHTN trên mức lương thực nhận theo quy định pháp luật.</li>
  <li>Gói <strong>Bảo hiểm sức khỏe cao cấp (Bảo Việt / PTI / PVI)</strong> dành cho nhân viên và gói ưu đãi cho người thân.</li>
  <li>Khám sức khỏe tổng quát định kỳ hàng năm tại các bệnh viện quốc tế uy tín (Vinmec, FV, Hoàn Mỹ).</li>
  <li>Thẻ tập Gym / Yoga hoặc câu lạc bộ thể thao công ty (Bóng đá, Cầu lông, Chạy bộ).</li>
</ul>
<p><strong>Đời sống & Hoạt động gắn kết:</strong></p>
<ul>
  <li>Du lịch nghỉ dưỡng hàng năm (Company Trip 4-5 sao trong hoặc ngoài nước).</li>
  <li>Hoạt động Team Building định kỳ hàng quý, Happy Hour chiều thứ 6 hàng tuần.</li>
  <li>Quà tặng sinh nhật, hiếu hỉ, thưởng các ngày lễ Tết và quà Tết thiếu nhi cho con em CBNV.</li>
</ul>
    `.trim(),
  },
  {
    id: "ben-flexible-growth",
    title: "Môi trường Linh hoạt (WFH/Hybrid & Tài trợ Học tập)",
    roleBadge: "Hybrid & Phát triển",
    description: "Tối đa sự tự chủ, linh hoạt giờ giấc và hỗ trợ đào tạo nâng cao trình độ.",
    content: `
<p><strong>Thời gian & Không gian làm việc linh hoạt:</strong></p>
<ul>
  <li>Thời gian làm việc từ Thứ 2 đến Thứ 6 (Nghỉ trọn vẹn Thứ 7 & Chủ Nhật).</li>
  <li>Chính sách làm việc linh hoạt (<strong>Hybrid / WFH 1-2 ngày/tuần</strong>) cân bằng giữa công việc và cuộc sống.</li>
  <li>Giờ làm việc linh hoạt (Flexible working hours, Core hours 09:30 - 16:30).</li>
  <li>14 - 16 ngày phép năm có hưởng nguyên lương (tăng thêm ngày phép theo thâm niên).</li>
</ul>
<p><strong>Đào tạo & Phát triển lộ trình sự nghiệp:</strong></p>
<ul>
  <li>Ngân sách tài trợ thi chứng chỉ chuyên môn quốc tế (AWS, GCP, CKA, PMP, Scrum Master).</li>
  <li>Các buổi Tech Talk, Workshop nội bộ chia sẻ kiến thức chuyên sâu hàng tuần.</li>
  <li>Lộ trình thăng tiến rõ ràng theo 2 nhánh: <strong>Technical Specialist (Kỹ sư chuyên gia)</strong> hoặc <strong>Management (Quản lý)</strong>.</li>
</ul>
    `.trim(),
  },
  {
    id: "ben-all-in-one",
    title: "Gói Phúc lợi Toàn diện Cao cấp (Full Package Tier-1)",
    roleBadge: "Toàn diện VIP",
    description: "Bộ phúc lợi trọn gói kết hợp tài chính, thiết bị, sức khỏe và chế độ làm việc tối tân.",
    content: `
<p><strong>Chính sách đãi ngộ xứng tầm:</strong></p>
<ul>
  <li>Mức lương cạnh tranh, không giới hạn theo năng lực + Gói quyền chọn mua cổ phiếu thưởng (ESOP) cho nhân sự chủ chốt.</li>
  <li>Lương tháng 13 + Thưởng KPI năm (Tổng thu nhập 14 - 16 tháng lương/năm).</li>
  <li>Cấp Macbook Pro M-series + Màn hình phụ Dell UltraSharp 4K.</li>
  <li>Bảo hiểm sức khỏe cao cấp 24/7 (nội trú, ngoại trú, nha khoa) cho nhân viên và hỗ trợ người thân.</li>
  <li>Thời gian làm việc Thứ 2 - Thứ 6, áp dụng cơ chế <strong>Hybrid linh hoạt</strong>.</li>
  <li>15 ngày phép năm + Nghỉ lễ Giáng sinh và các ngày đặc biệt.</li>
  <li>Company Trip nghỉ dưỡng 5 sao, Team Building, Happy Hour và tài trợ 100% học phí thi chứng chỉ quốc tế.</li>
</ul>
    `.trim(),
  },
];

