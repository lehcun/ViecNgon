import { test, expect } from "@playwright/test";
import { setupCandidateSessionWithBaseMocks } from "../helpers/mockCandidateData";

const MOCK_MOMO_COMPANY = {
  id: "comp-momo",
  name: "MoMo",
  logo: null,
  location: "Số 8 Hoàng Văn Thái, Quận 7, TP.HCM",
  citiesDisplay: "Hà Nội - TP.HCM",
  website: "https://momo.vn",
  slug: "momo",
  description: "<p>Siêu ứng dụng thanh toán số 1 Việt Nam.</p>",
  benefits: "<ul><li>Lương tháng 13, thưởng hiệu suất</li></ul>",
  skills: ["React", "Next.js", "TypeScript"],
  aboutMe: "<p>Văn hóa sáng tạo và lấy người dùng làm trung tâm.</p>",
  city: "TP.HCM",
  companyModel: "Sản phẩm",
  industry: "Fintech",
  size: "1000+ nhân viên",
  country: "Việt Nam",
  workingTime: "Thứ 2 - Thứ 6",
  otPolicy: "Không có OT",
  awards: [
    "Công ty IT tốt nhất Việt Nam 2026",
    "Công ty IT tốt nhất Việt Nam 2025",
  ],
  sectionImages: {
    introImages: [],
    cultureImages: [],
  },
  branches: [
    {
      id: "br-hcm",
      city: "TP.HCM",
      address: "Số 8 Hoàng Văn Thái, Quận 7, TP.HCM",
      mapUrl: null,
      lat: 10.7295,
      lng: 106.7218,
      isHeadquarters: true,
    },
    {
      id: "br-hn",
      city: "Hà Nội",
      address: "Tòa nhà Hoàng Thành, Hai Bà Trưng, Hà Nội",
      mapUrl: null,
      lat: 21.0124,
      lng: 105.8492,
      isHeadquarters: false,
    },
  ],
  reviewSummary: {
    averageRating: 4.8,
    recommendPercent: 97,
    totalReviews: 14,
    latestReview: {
      id: "rv-1",
      title: "Employee benefit is really good.",
      content: "Môi trường năng động.",
      pros: "Lương thưởng tốt",
      cons: null,
      rating: 5,
      recommend: true,
      createdAt: "2026-11-05T00:00:00.000Z",
    },
  },
  reviews: [
    {
      id: "rv-1",
      title: "Employee benefit is really good.",
      content: "Môi trường năng động.",
      pros: "Lương thưởng tốt",
      cons: null,
      rating: 5,
      recommend: true,
      createdAt: "2026-11-05T00:00:00.000Z",
    },
  ],
  totalPosts: 1,
  posts: [
    {
      id: "post-1",
      title: "Hành trình chuyển đổi kiến trúc Microservices tại MoMo",
      coverUrl: null,
      content: "Chia sẻ kinh nghiệm mở rộng hệ thống thanh toán.",
      publishedAt: "2026-11-10T00:00:00.000Z",
    },
  ],
  followerCount: 25,
  totalJobs: 1,
  activeJobs: [
    {
      id: "job-momo-1",
      title: "Senior React/Next.js Engineer (Super App)",
      slug: "senior-react-nextjs-engineer-super-app",
      salaryDisplay: "40 - 60 triệu",
      location: "TP.HCM",
      postedAt: new Date().toISOString(),
      skills: ["React", "Next.js", "TypeScript"],
      benefits: "Bảo hiểm cao cấp",
      workModel: "Hybrid",
    },
  ],
};

const MOCK_SEARCH_JOBS = [
  {
    id: "job-nextjs-dn",
    slug: "nextjs-developer",
    title: "NEXTJS DEVELOPER",
    salaryDisplay: "20 - 30 triệu",
    level: "Middle",
    workModel: "Hybrid",
    location: "Đà Nẵng",
    skills: ["Next.js", "React", "TypeScript"],
    postedAt: new Date().toISOString(),
    company: {
      name: "MoMo",
      slug: "momo",
      logo: null,
    },
    description: "<p>Xây dựng ứng dụng web hiệu năng cao với Next.js.</p>",
    requirements: "<p>2+ năm kinh nghiệm React/Next.js.</p>",
    benefits: "<p>Thưởng dự án hàng quý.</p>",
  },
  {
    id: "job-java-hn",
    slug: "java-spring-boot-engineer",
    title: "Java Spring Boot Engineer",
    salaryDisplay: "25 - 40 triệu",
    level: "Senior",
    workModel: "Tại văn phòng",
    location: "Hà Nội",
    skills: ["Java", "Spring Boot", "SQL Server"],
    postedAt: new Date().toISOString(),
    company: {
      name: "FPT Software",
      slug: "fpt-software",
      logo: null,
    },
    description: "<p>Phát triển microservice cho hệ thống ngân hàng số.</p>",
  },
];

test.describe("Sprint 1 - Module Xem thông tin công ty (TTCT)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("http://localhost:3001/auth/me", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: "{}" }),
    );
    await page.route("http://localhost:3001/company/top", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          {
            id: "comp-momo",
            name: "MoMo",
            logo: null,
            location: "TP.HCM",
            slug: "momo",
            jobs: 1,
          },
        ]),
      }),
    );
    await page.route("http://localhost:3001/company/momo", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_MOMO_COMPANY),
      }),
    );
  });

  test("[GUI-TTCT01, GUI-TTCT04, GUI-TTCT05 & FUNC-TTCT01] Hiển thị banner, thông tin chung, giải thưởng và việc làm của MoMo", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /MoMo/i }).first().click();

    await expect(page).toHaveURL(/\/company\/momo$/);

    // GUI-TTCT01: Banner MoMo
    await expect(
      page.getByRole("heading", { name: "MoMo", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("1 việc làm đang tuyển dụng").first(),
    ).toBeVisible();

    // GUI-TTCT04: Thông tin chung & Giải thưởng
    await expect(
      page.getByRole("heading", { name: "Thông tin chung" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /Giải thưởng/i }),
    ).toBeVisible();

    // GUI-TTCT05: Card việc làm & Link Xem tất cả việc làm
    await expect(
      page.getByRole("heading", { name: /1 việc làm đang tuyển/i }),
    ).toBeVisible();
    await expect(
      page.getByText("Senior React/Next.js Engineer (Super App)"),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Xem tất cả việc làm/i }),
    ).toBeVisible();
  });

  test("[FUNC-TTCT05 & FUNC-TTCT06] Nhấn thẻ việc làm chuyển đến chi tiết job và nhấn Xem tất cả việc làm chuyển về /jobs", async ({
    page,
  }) => {
    await page.route(
      "http://localhost:3001/job/senior-react-nextjs-engineer-super-app",
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            ...MOCK_SEARCH_JOBS[0],
            id: "job-momo-1",
            slug: "senior-react-nextjs-engineer-super-app",
            title: "Senior React/Next.js Engineer (Super App)",
          }),
        }),
    );
    await page.route(
      "http://localhost:3001/job/senior-react-nextjs-engineer-super-app/related",
      (route) =>
        route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await page.route("http://localhost:3001/company/featured-banners", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await page.route("http://localhost:3001/jobs?*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          total: 0,
          page: 1,
          totalPages: 1,
          meta: { total: 0, page: 1, limit: 10, totalPages: 1 },
        }),
      }),
    );

    await page.goto("/company/momo");

    // FUNC-TTCT05
    await page
      .getByRole("link", { name: /Senior React\/Next\.js Engineer \(Super App\)/i })
      .click();
    await expect(page).toHaveURL(/\/jobs\/senior-react-nextjs-engineer-super-app/);

    // FUNC-TTCT06
    await page.goto("/company/momo");
    await page.getByRole("link", { name: /Xem tất cả việc làm/i }).click();
    await expect(page).toHaveURL(/\/jobs$/);
  });

  test("[GUI-TTCT07] Hiển thị 4 Tabs, thành phố ghép trên Banner, Bản đồ chi nhánh Open in Maps và cột phải khi 0 việc làm", async ({
    page,
  }) => {
    await page.route("http://localhost:3001/company/naver-vietnam", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...MOCK_MOMO_COMPANY,
          id: "comp-naver",
          name: "NAVER VIETNAM",
          slug: "naver-vietnam",
          totalJobs: 0,
          activeJobs: [],
        }),
      }),
    );

    await page.goto("/company/naver-vietnam");

    await expect(page.getByText("Hà Nội - TP.HCM")).toBeVisible();
    const openMapsLinks = page.getByRole("link", { name: /Open in Maps/i });
    await expect(openMapsLinks).toHaveCount(1);
    await expect(openMapsLinks.first()).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=10.7295,106.7218",
    );
    await expect(page.getByText("10.7295, 106.7218")).toHaveCount(0);
    await expect(page.getByText(/Đang xem:/i)).toHaveCount(0);
    await expect(page.locator(".leaflet-container")).toBeVisible();
    await expect(page.locator(".leaflet-tile").first()).toHaveAttribute(
      "src",
      /https:\/\/(tile\.openstreetmap\.org|server\.arcgisonline\.com)\//,
    );
    await expect(
      page.locator('.leaflet-tile[src*="cartocdn.com"]'),
    ).toHaveCount(0);

    // Chọn chi nhánh Hà Nội cập nhật nút Open in Maps sang tọa độ Hà Nội
    await page.getByText("Tòa nhà Hoàng Thành, Hai Bà Trưng, Hà Nội").click();
    await expect(openMapsLinks.first()).toHaveAttribute(
      "href",
      "https://www.google.com/maps?q=21.0124,105.8492",
    );

    // Khi 0 việc làm: cột phải hiển thị Đánh giá mới nhất & Theo dõi nhận email
    await expect(
      page.getByRole("heading", { name: "Đánh giá mới nhất" }),
    ).toBeVisible();
    await expect(
      page.getByText("Employee benefit is really good."),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /Nhận thông báo việc làm qua email từ/i,
      }),
    ).toBeVisible();

    // Chuyển qua tab Đánh giá & Bài viết
    await page.getByRole("button", { name: /Đánh giá\s*14/i }).click();
    await expect(
      page.getByRole("heading", { name: /Đánh giá từ nhân viên/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Bài viết\s*1/i }).click();
    await expect(
      page.getByText("Hành trình chuyển đổi kiến trúc Microservices tại MoMo"),
    ).toBeVisible();
  });

  test("[GUI-TTCT08] Carousel việc làm bên phải và Tab Việc làm hiển thị Ribbon, Highlights & Lưu việc này", async ({
    page,
  }) => {
    await page.route("http://localhost:3001/company/money-forward", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          ...MOCK_MOMO_COMPANY,
          id: "comp-mf",
          name: "Money Forward Vietnam",
          slug: "money-forward",
          totalJobs: 2,
          activeJobs: [
            {
              id: "job-mf-1",
              title: "Solution Architect (Digital Banking)",
              slug: "solution-architect-mf",
              salaryDisplay: "50 - 75 triệu",
              location: "TP.HCM",
              postedAt: new Date().toISOString(),
              skills: ["Software Architecture", "Spring Boot", "Java"],
              benefits: "Hybrid working; Macbook Pro; 17 days off",
              highlights: [
                "Hybrid working; Flexible time; Macbook Pro",
                "L&D programs; 17 days off",
              ],
              workModel: "Linh hoạt",
              level: "Kiến trúc sư Phần mềm",
              priorityLevel: 3,
              promotionBadge: "SUPER_HOT",
            },
            {
              id: "job-mf-2",
              title: "Chief Information Security Officer",
              slug: "ciso-mf",
              salaryDisplay: "Thỏa thuận",
              location: "TP.HCM - Hà Nội",
              postedAt: new Date().toISOString(),
              skills: ["Cybersecurity", "DevSecOps"],
              benefits: "Macbook Pro; 17 days off",
              highlights: ["Macbook Pro", "17 days off"],
              workModel: "Linh hoạt",
              level: "Cấp điều hành",
              priorityLevel: 2,
              promotionBadge: "HOT",
            },
          ],
        }),
      }),
    );

    await page.goto("/company/money-forward");

    // Carousel cột phải: hiện 2 việc làm đang tuyển dụng và job đầu tiên
    await expect(
      page.getByRole("heading", { name: /2 việc làm đang tuyển dụng/i }),
    ).toBeVisible();
    await expect(
      page.getByText("Solution Architect (Digital Banking)"),
    ).toBeVisible();

    // Bấm nút chuyển tiếp sang job thứ 2
    await page.getByRole("button", { name: "Việc làm tiếp theo" }).click();
    await expect(
      page.getByText("Chief Information Security Officer"),
    ).toBeVisible();

    // Cột phải cũng hiển thị Đánh giá mới nhất & Theo dõi
    await expect(
      page.getByRole("heading", { name: "Đánh giá mới nhất" }),
    ).toBeVisible();

    // Chuyển sang Tab Việc làm
    await page.getByRole("button", { name: /^Việc làm\s*2$/i }).click();
    await expect(page.getByText("SUPER HOT")).toBeVisible();
    await expect(
      page.getByText("Hybrid working; Flexible time; Macbook Pro"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Lưu việc này" }).first().click();
    await expect(page.getByRole("button", { name: "Đã lưu" })).toBeVisible();
  });
});

test.describe("Sprint 1 - Module Tra cứu việc làm (TCVL)", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("http://localhost:3001/company/featured-banners", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );

    await page.route("http://localhost:3001/jobs?*", (route) => {
      const url = new URL(route.request().url());
      const keyword = (url.searchParams.get("keyword") || "").toLowerCase();
      const city = url.searchParams.get("thanhPho") || "";
      const workModel = url.searchParams.get("hinhThucLamViec") || "";
      const salaryRange = url.searchParams.get("salaryRange") || "";

      const filtered = MOCK_SEARCH_JOBS.filter((job) => {
        if (
          keyword &&
          !job.title.toLowerCase().includes(keyword) &&
          !job.skills.some((s) => s.toLowerCase().includes(keyword))
        ) {
          return false;
        }
        if (city && job.location !== city) return false;
        if (workModel && job.workModel !== workModel) return false;
        if (salaryRange === "20_30" && job.id !== "job-nextjs-dn") return false;
        return true;
      });

      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: filtered,
          total: filtered.length,
          page: 1,
          totalPages: 1,
          meta: { total: filtered.length, page: 1, limit: 10, totalPages: 1 },
        }),
      });
    });
  });

  test("[GUI-TCVL01..GUI-TCVL05 & FUNC-TCVL01] Kiểm tra giao diện trang tra cứu việc làm và điều hướng từ Navbar", async ({
    page,
  }) => {
    await page.route("http://localhost:3001/auth/me", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: "{}" }),
    );
    await page.route("http://localhost:3001/company/top", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );

    // FUNC-TCVL01: Từ trang chủ chọn "Việc làm IT"
    await page.goto("/");
    await page.getByRole("link", { name: "Việc làm IT" }).first().click();
    await expect(page).toHaveURL(/\/jobs$/);

    // GUI-TCVL01..05
    const keywordInput = page.getByPlaceholder(
      /Nhập từ khóa theo kỹ năng, chức vụ, công ty/i,
    );
    const cityDropdown = page.getByLabel("Chọn thành phố");
    const searchBtn = page.getByRole("button", { name: "Tìm kiếm" });
    const filterBtn = page.getByRole("button", { name: /Bộ lọc/i });
    const applyBtn = page.getByRole("link", { name: /Ứng tuyển ngay/i });

    await expect(keywordInput).toBeVisible();
    await expect(keywordInput).toBeEnabled();
    await expect(cityDropdown).toBeVisible();
    await expect(cityDropdown).toBeEnabled();
    await expect(searchBtn).toBeVisible();
    await expect(searchBtn).toBeEnabled();
    await expect(filterBtn).toBeVisible();
    await expect(filterBtn).toBeEnabled();
    await expect(applyBtn).toBeVisible();
  });

  test("[FUNC-TCVL02, FUNC-TCVL03, FUNC-TCVL04, FUNC-TCVL05] Tìm kiếm từ khóa, lọc Đà Nẵng, chọn thẻ job và trạng thái không tìm thấy", async ({
    page,
  }) => {
    await page.route("http://localhost:3001/auth/me", (route) =>
      route.fulfill({ status: 401, contentType: "application/json", body: "{}" }),
    );

    await page.goto("/jobs");

    // FUNC-TCVL04: Click chọn thẻ công việc thứ 2 bên trái -> khung bên phải cập nhật
    const secondCard = page
      .locator("article")
      .filter({ hasText: "Java Spring Boot Engineer" });
    await secondCard.click();
    await expect(
      page.getByRole("link", { name: "Java Spring Boot Engineer" }).nth(1),
    ).toBeVisible();

    // FUNC-TCVL02: Tìm kiếm theo từ khóa "NextJS"
    await page
      .getByPlaceholder(/Nhập từ khóa theo kỹ năng, chức vụ, công ty/i)
      .fill("NextJS");
    await page.getByRole("button", { name: "Tìm kiếm" }).click();
    await expect(page).toHaveURL(/keyword=NextJS/);
    await expect(
      page.locator("article").filter({ hasText: "NEXTJS DEVELOPER" }),
    ).toBeVisible();

    // FUNC-TCVL03: Lọc theo thành phố Đà Nẵng, hình thức Hybrid và mức lương 20-30 triệu
    await page.getByLabel("Chọn thành phố").selectOption("Đà Nẵng");
    await page.getByRole("button", { name: "Tìm kiếm" }).click();
    await expect(page).toHaveURL(/thanhPho=%C4%90%C3%A0\+N%E1%BA%B5ng|thanhPho=Đà/);
    await page.getByLabel("Hình thức làm việc").selectOption("Hybrid");
    await expect(page).toHaveURL(/hinhThucLamViec=Hybrid/);
    await page.getByLabel("Mức lương").selectOption("20_30");
    await expect(page).toHaveURL(/salaryRange=20_30/);
    await expect(
      page.locator("article").filter({ hasText: "NEXTJS DEVELOPER" }),
    ).toBeVisible();

    // FUNC-TCVL05: Tìm kiếm từ khóa không tồn tại "xyz123"
    await page
      .getByPlaceholder(/Nhập từ khóa theo kỹ năng, chức vụ, công ty/i)
      .fill("xyz123");
    await page.getByRole("button", { name: "Tìm kiếm" }).click();
    await expect(
      page.getByRole("heading", { name: "Không tìm thấy việc làm phù hợp" }),
    ).toBeVisible();
  });

  test("[FUNC-TCVL06] Đã đăng nhập nhấn Ứng tuyển ngay chuyển sang trang nộp đơn ứng tuyển", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page);
    await page.route("http://localhost:3001/job/nextjs-developer", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_SEARCH_JOBS[0]),
      }),
    );

    await page.goto("/jobs?keyword=NextJS");
    await expect(
      page.locator("article").filter({ hasText: "NEXTJS DEVELOPER" }),
    ).toBeVisible();

    await page.getByRole("link", { name: /Ứng tuyển ngay/i }).click();
    await expect(page).toHaveURL(/\/job-it\/nextjs-developer\/job_applications/);
  });
});
