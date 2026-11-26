import { test, expect } from "@playwright/test";
import { setupCandidateSessionWithBaseMocks } from "../helpers/mockCandidateData";
import {
  createMockAiAnalysis,
  createMockEmployerApplicationDetail,
  setupEmployerSessionWithBaseMocks,
} from "../helpers/mockEmployerAndAdminData";

const MOCK_MOMO_COMPANY = {
  id: "comp-momo",
  name: "MoMo",
  logo: null,
  location: "TP.HCM",
  website: "https://momo.vn",
  slug: "momo",
  description: "<p>Siêu ứng dụng thanh toán số hàng đầu Việt Nam.</p>",
  benefits: "<p>Lương tháng 13, thưởng hiệu suất.</p>",
  skills: ["React", "Next.js"],
  aboutMe: "<p>Đội ngũ kỹ sư trẻ năng động.</p>",
  country: "Việt Nam",
  city: "TP.HCM",
  companyModel: "Product",
  industry: "Fintech",
  size: "1,000+ nhân viên",
  workingTime: "Thứ 2 - Thứ 6",
  otPolicy: "Không OT",
  totalJobs: 1,
  activeJobs: [],
  averageRating: 4.8,
  totalReviews: 1,
  recommendRate: 100,
};

const MOCK_COMPANY_REVIEWS = [
  {
    id: "rev-1",
    rating: 5,
    diemLuongPhucLoi: 5,
    diemDaoTao: 5,
    diemQuanLy: 5,
    diemVanHoa: 5,
    diemVanPhong: 5,
    khuyenLamViec: true,
    coOtTot: true,
    tieuDe: "Môi trường kỹ thuật rất tốt",
    noiDung: "Đội ngũ senior giỏi, học hỏi nhanh.",
    noiDungUuDiem: "Lương thưởng cạnh tranh, đồng nghiệp thân thiện.",
    noiDungCaiThien: "Cần thêm không gian họp nhỏ.",
    trangThai: "DA_DUYET",
    biBaoCao: false,
    createdAt: "2026-11-18T08:00:00.000Z",
  },
];

test.describe("Sprint 2 - Module Đánh giá doanh nghiệp (DGDN)", () => {
  test("[DGDN] Xem tab Đánh giá công ty, kiểm tra validation rỗng và gửi đánh giá ẩn danh thành công", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page);

    let reviewPayload: Record<string, unknown> | null = null;
    let hasReviewed = false;

    await page.route("http://localhost:3001/company/momo", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_MOMO_COMPANY),
      }),
    );

    await page.route("http://localhost:3001/company/comp-momo/follow*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ isFollowing: false, followersCount: 12 }),
      }),
    );

    await page.route(
      "http://localhost:3001/reviews/company/comp-momo",
      async (route) => {
        if (route.request().method() === "POST") {
          reviewPayload = route.request().postDataJSON() as Record<
            string,
            unknown
          >;
          hasReviewed = true;
          return route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify({
              id: "rev-new-1",
              rating: 5,
              ...reviewPayload,
              trangThai: "CHO_DUYET",
              biBaoCao: false,
              createdAt: new Date().toISOString(),
            }),
          });
        }
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            reviews: MOCK_COMPANY_REVIEWS,
            myPendingReview: null,
            hasReviewed,
          }),
        });
      },
    );

    await page.goto("/company/momo");

    // Chuyển sang tab Đánh giá
    await page.getByRole("button", { name: /Đánh giá/i }).first().click();
    await expect(page.getByText("Môi trường kỹ thuật rất tốt")).toBeVisible();

    // Mở form viết đánh giá từ CTA (click sao thứ 5)
    await page.getByRole("button", { name: "Đánh giá 5 sao" }).click();
    await expect(
      page.getByRole("heading", { name: /Viết đánh giá cho MoMo/i }),
    ).toBeVisible();

    // FUNC-DGDN05: Để trống tiêu đề / nội dung -> báo lỗi
    await page.getByRole("button", { name: "Gửi đánh giá" }).click();
    await expect(
      page.getByText("Vui lòng nhập tiêu đề tóm tắt cho bài đánh giá."),
    ).toBeVisible();
    expect(reviewPayload).toBeNull();

    // FUNC-DGDN04: Nhập đầy đủ và gửi đánh giá thành công
    await page
      .locator('input[type="text"]')
      .first()
      .fill("Trải nghiệm phỏng vấn chuyên nghiệp");
    await page
      .locator("#comp-rev-pros")
      .fill("Quy trình rõ ràng, interviewer nhiệt tình.");
    await page.getByRole("button", { name: "Gửi đánh giá" }).click();

    await expect
      .poll(() => reviewPayload)
      .toMatchObject({
        tieuDe: "Trải nghiệm phỏng vấn chuyên nghiệp",
        noiDungUuDiem: "Quy trình rõ ràng, interviewer nhiệt tình.",
      });
    await expect(
      page.getByText(/Đã gửi đánh giá ẩn danh/i).first(),
    ).toBeVisible();
  });
});

test.describe("Sprint 2 - Module Đánh giá ứng viên (DGUV)", () => {
  test("[DGUV] Mở modal Đánh giá ứng viên sau phỏng vấn, kiểm tra validation và lưu phiếu đánh giá thành công", async ({
    page,
  }) => {
    await setupEmployerSessionWithBaseMocks(page);

    const detail = {
      ...createMockEmployerApplicationDetail(),
      status: "PHONG_VAN",
    };
    const evaluations: Record<string, unknown>[] = [];
    let evalPayload: Record<string, unknown> | null = null;

    await page.route(
      "http://localhost:3001/applications/employer/app-em-1",
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(detail),
        }),
    );

    await page.route(
      "http://localhost:3001/employer/applications/app-em-1/ai-analysis*",
      (route) =>
        route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(createMockAiAnalysis()),
        }),
    );

    await page.route(
      "http://localhost:3001/reviews/applications/app-em-1",
      async (route) => {
        if (route.request().method() === "POST") {
          evalPayload = route.request().postDataJSON() as Record<
            string,
            unknown
          >;
          const created = {
            id: "eval-1",
            evaluatorName: "Nguyễn Minh Tuấn",
            evaluatorRole: "Talent Acquisition Lead",
            rating: 4.3,
            ...evalPayload,
            createdAt: new Date().toISOString(),
          };
          evaluations.push(created);
          return route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify(created),
          });
        }
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(evaluations),
        });
      },
    );

    await page.goto("/applications/app-em-1");

    await expect(
      page.getByRole("heading", { name: /Đánh giá ứng viên \(0\)/i }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Thêm đánh giá/i }).click();
    await expect(
      page.getByRole("heading", { name: /Đánh giá ứng viên: Nguyễn Quang Ý/i }),
    ).toBeVisible();

    // Validation bỏ trống tiêu đề
    await page.getByRole("button", { name: "Lưu đánh giá" }).click();
    await expect(
      page.getByText("Vui lòng nhập tiêu đề tóm tắt đánh giá ứng viên."),
    ).toBeVisible();

    // Nhập đầy đủ & tick chia sẻ ứng viên
    await page
      .locator("#cand-eval-title")
      .fill("Chuyên môn vững, giao tiếp tốt");
    await page
      .locator("#cand-eval-content")
      .fill("Nắm chắc Next.js 16 và Prisma, phù hợp team Frontend.");
    await page
      .getByLabel(/Chia sẻ nhận xét này cho ứng viên xem/i)
      .check();
    await page.getByRole("button", { name: "Lưu đánh giá" }).click();

    await expect
      .poll(() => evalPayload)
      .toMatchObject({
        tieuDe: "Chuyên môn vững, giao tiếp tốt",
        chiaSeUngVien: true,
        ketQuaDanhGia: "DAT",
      });
    await expect(
      page.getByText(
        "Đã lưu phiếu đánh giá và gửi thông báo nhận xét tới ứng viên!",
      ),
    ).toBeVisible();
  });
});
