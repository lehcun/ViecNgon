import { test, expect } from "@playwright/test";
import { setupCandidateSessionWithBaseMocks } from "../helpers/mockCandidateData";

const MOCK_MOMO_COMPANY = {
  id: "comp-momo",
  name: "MoMo",
  logo: null,
  location: "TP.HCM",
  website: "https://momo.vn",
  slug: "momo",
  description: "<p>Siêu ứng dụng thanh toán số 1 Việt Nam.</p>",
  benefits: "<ul><li>Lương tháng 13, thưởng hiệu suất</li></ul>",
  skills: ["React", "Next.js", "TypeScript"],
  aboutMe: "<p>Văn hóa sáng tạo và lấy người dùng làm trung tâm.</p>",
  city: "TP.HCM",
  companyModel: "Product",
  industry: "Fintech",
  size: "1000+ nhân viên",
  country: "Việt Nam",
  workingTime: "Thứ 2 - Thứ 6",
  otPolicy: "Không OT",
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
    await expect(page.getByRole("heading", { name: "MoMo" })).toBeVisible();
    await expect(
      page.getByText("1 việc làm đang tuyển dụng"),
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
