import { test, expect } from "@playwright/test";
import {
  createMockAppliedJobs,
  createMockCandidateProfile,
  setupCandidateSessionWithBaseMocks,
} from "../helpers/mockCandidateData";

const MOCK_JOB_DETAIL = {
  id: "job-201",
  slug: "nextjs-developer",
  title: "NEXTJS DEVELOPER",
  description: "<p>Phát triển ứng dụng Next.js 16 &amp; TypeScript.</p>",
  requirements: "<p>Kinh nghiệm 2+ năm React/Next.js.</p>",
  benefits: "<p>Lương tháng 13, bảo hiểm cao cấp.</p>",
  salaryMin: 25000000,
  salaryMax: 35000000,
  salaryDisplay: "25 - 35 triệu",
  experience: 2,
  level: "Middle",
  location: "Đà Nẵng",
  type: "Full-time",
  workModel: "Hybrid",
  postedAt: new Date().toISOString(),
  deadline: null,
  updatedAt: new Date().toISOString(),
  views: 120,
  status: "ACTIVE",
  skills: ["Next.js", "React", "TypeScript"],
  isApplied: false,
  applicationStatus: null,
  company: {
    id: "comp-momo",
    name: "MoMo",
    logo: null,
    slug: "momo",
    companyModel: "Product",
    industry: "Fintech",
    size: "1000+ nhân viên",
    country: "Việt Nam",
    workingTime: "Thứ 2 - Thứ 6",
    otPolicy: "Không OT",
    website: "https://momo.vn",
  },
};

test.describe("Sprint 1 - Module Ứng tuyển việc làm (UTVL)", () => {
  test("[GUI-UTVL01..GUI-UTVL05 & FUNC-UTVL01] Hiển thị đầy đủ các thành phần trên trang Ứng tuyển việc làm", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page);
    await page.route("**/job/nextjs-developer", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_JOB_DETAIL),
      }),
    );

    await page.goto("/job-it/nextjs-developer/job_applications");

    // FUNC-UTVL01: Tiêu đề công việc + Thông tin liên hệ
    await expect(
      page.getByRole("heading", { name: /NEXTJS DEVELOPER tại MoMo/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Thông tin liên hệ" }),
    ).toBeVisible();

    // GUI-UTVL01 & GUI-UTVL02: 2 Radio options
    const existingRadio = page.locator('input[type="radio"][value="existing"]');
    const newRadio = page.locator('input[type="radio"][value="new"]');
    await expect(existingRadio).toBeVisible();
    await expect(existingRadio).toBeEnabled();
    await expect(existingRadio).toBeChecked();
    await expect(newRadio).toBeVisible();
    await expect(newRadio).toBeEnabled();

    // GUI-UTVL03: Thông tin liên hệ hiển thị từ hồ sơ
    await expect(page.getByText("Nguyễn Quang Ý")).toBeVisible();
    await expect(page.getByText("0905123456")).toBeVisible();

    // GUI-UTVL04: Textarea Thư giới thiệu / Lời nhắn
    const coverLetterBox = page.getByPlaceholder(/Tóm tắt ngắn gọn kỹ năng/i);
    await expect(coverLetterBox).toBeVisible();
    await expect(coverLetterBox).toBeEnabled();

    // GUI-UTVL05: Nút Nộp đơn ứng tuyển
    const submitBtn = page.getByRole("button", { name: "Nộp đơn ứng tuyển" });
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toBeEnabled();
  });

  test("[FUNC-UTVL02 & FUNC-UTVL06] Xem trước file CV hiện tại và nộp đơn bằng CV hiện tại thành công", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page);
    await page.route("**/job/nextjs-developer", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_JOB_DETAIL),
      }),
    );

    let applicationPayload: Record<string, unknown> | null = null;
    await page.route("**/candidate/applications", async (route) => {
      applicationPayload = route.request().postDataJSON() as Record<
        string,
        unknown
      >;
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "app-new", status: "CHO_DUYET" }),
      });
    });

    await page.goto("/job-it/nextjs-developer/job_applications");

    // FUNC-UTVL06: Nhấn vào tên file CV hiện tại mở tab xem trước
    await page.context().route("https://cdn.viecngon.vn/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<html><body>Mock CV PDF</body></html>",
      }),
    );
    const popupPromise = page.waitForEvent("popup");
    await page.getByRole("button", { name: "CV_Nguyen_Quang_Y.pdf" }).click();
    const popup = await popupPromise;
    expect(popup.url()).toContain("nguyen-quang-y.pdf");
    await popup.close();

    // FUNC-UTVL02: Nhập lời nhắn và nộp đơn bằng CV hiện tại
    await page
      .getByPlaceholder(/Tóm tắt ngắn gọn kỹ năng/i)
      .fill("Tôi có 2 năm kinh nghiệm Next.js và TypeScript.");
    await page.getByRole("button", { name: "Nộp đơn ứng tuyển" }).click();

    await expect
      .poll(() => applicationPayload)
      .toMatchObject({
        maCongViec: "job-201",
        maCvFile: "cv-file-1",
        fileCvUrl: "https://cdn.viecngon.vn/cv/nguyen-quang-y.pdf",
        coverLetter: "Tôi có 2 năm kinh nghiệm Next.js và TypeScript.",
      });
    await expect(page.getByText("Nộp đơn ứng tuyển thành công!")).toBeVisible();
    await expect(page).toHaveURL(/\/my-jobs\/applied/, { timeout: 15000 });
  });

  test("[FUNC-UTVL03, FUNC-UTVL04 & FUNC-UTVL05] Chọn liên kết CV khác: kiểm tra validation trống/sai URL và nộp thành công", async ({
    page,
  }) => {
    const profileNoCv = createMockCandidateProfile({
      cvUrl: null,
      defaultCvFileId: null,
      defaultCvFile: null,
    });
    await setupCandidateSessionWithBaseMocks(page, { profile: profileNoCv });
    await page.route("**/job/nextjs-developer", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_JOB_DETAIL),
      }),
    );

    let applicationPayload: Record<string, unknown> | null = null;
    await page.route("**/candidate/applications", async (route) => {
      applicationPayload = route.request().postDataJSON() as Record<
        string,
        unknown
      >;
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: "app-new-url", status: "CHO_DUYET" }),
      });
    });

    await page.goto("/job-it/nextjs-developer/job_applications");

    const urlInput = page.getByPlaceholder(
      /https:\/\/drive\.google\.com\/\.\.\. hoặc đường dẫn CV/i,
    );
    const submitBtn = page.getByRole("button", { name: "Nộp đơn ứng tuyển" });

    // FUNC-UTVL04: Chưa nhập liên kết CV -> bị chặn bởi required, không gọi API
    await submitBtn.click();
    const isValueMissing = await urlInput.evaluate(
      (el: HTMLInputElement) => el.validity.valueMissing,
    );
    expect(isValueMissing).toBe(true);
    expect(applicationPayload).toBeNull();

    // FUNC-UTVL05: Nhập sai định dạng URL -> bị chặn bởi type="url"
    await urlInput.fill("khong-phai-link-hop-le");
    await submitBtn.click();
    const isTypeMismatch = await urlInput.evaluate(
      (el: HTMLInputElement) => el.validity.typeMismatch,
    );
    expect(isTypeMismatch).toBe(true);
    expect(applicationPayload).toBeNull();

    // FUNC-UTVL03: Nhập liên kết CV hợp lệ -> nộp đơn thành công
    await urlInput.fill("https://drive.google.com/file/d/cv-quang-y/view");
    await submitBtn.click();
    await expect
      .poll(() => applicationPayload)
      .toMatchObject({
        maCongViec: "job-201",
        fileCvUrl: "https://drive.google.com/file/d/cv-quang-y/view",
      });
    await expect(page.getByText("Nộp đơn ứng tuyển thành công!")).toBeVisible();
  });
});

test.describe("Sprint 1 - Module Xem lịch sử ứng tuyển (LSUT) & Xem lịch phỏng vấn (XLPV)", () => {
  test("[GUI-LSUT01..GUI-LSUT05 & FUNC-LSUT01..FUNC-LSUT05] Hiển thị danh sách, sắp xếp, chuyển tab và điều hướng chi tiết job", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page);

    await page.goto("/my-jobs/applied");

    // GUI-LSUT01 & FUNC-LSUT01: Tiêu đề và danh sách đơn ứng tuyển
    await expect(
      page.getByRole("heading", { name: "Việc làm của tôi" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Đã ứng tuyển/i }),
    ).toBeVisible();

    const cards = page.locator("article");
    await expect(cards).toHaveCount(2);
    await expect(cards.nth(0)).toContainText("NEXTJS DEVELOPER");
    await expect(cards.nth(1)).toContainText("Senior React Engineer");

    // GUI-LSUT03 & FUNC-LSUT03: Sắp xếp danh sách đơn ứng tuyển theo cũ nhất
    const sortSelect = page.locator("select");
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption("oldest");
    await expect(cards.nth(0)).toContainText("Senior React Engineer");
    await expect(cards.nth(1)).toContainText("NEXTJS DEVELOPER");

    // GUI-LSUT05 & FUNC-LSUT02: Mở rộng tiến trình xử lý đơn
    const firstCard = page
      .locator("article")
      .filter({ hasText: "NEXTJS DEVELOPER" });
    await firstCard.getByRole("button", { name: /Xem tiến trình/i }).click();
    await expect(firstCard.getByText("Quy trình xử lý hồ sơ")).toBeVisible();
    await expect(firstCard.getByText("3. Phỏng vấn")).toBeVisible();
    await expect(firstCard.getByText("Đã đặt lịch")).toBeVisible();

    // FUNC-LSUT05: Chuyển tab "Việc làm đã lưu" và "Đã xem gần đây"
    await page.getByRole("button", { name: /Việc làm đã lưu/i }).click();
    await expect(
      page.getByRole("heading", { name: "Chưa có việc làm đã lưu" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /Đã xem gần đây/i }).click();
    await expect(
      page.getByRole("heading", { name: "Chưa có việc làm đã xem gần đây" }),
    ).toBeVisible();

    // FUNC-LSUT04: Quay lại tab Đã ứng tuyển & nhấn tiêu đề công việc để xem chi tiết
    await page.route("**/job/nextjs-developer", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(MOCK_JOB_DETAIL),
      }),
    );
    await page.route("**/job/nextjs-developer/related", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: "[]" }),
    );
    await page.getByRole("button", { name: /Đã ứng tuyển/i }).click();
    await page.getByRole("link", { name: "NEXTJS DEVELOPER" }).click();
    await expect(page).toHaveURL(/\/jobs\/nextjs-developer$/);
  });

  test("[FUNC-LSUT06] Hiển thị EmptyState khi chưa có đơn ứng tuyển nào", async ({
    page,
  }) => {
    await setupCandidateSessionWithBaseMocks(page, { appliedJobs: [] });

    await page.goto("/my-jobs/applied");
    await expect(
      page.getByRole("heading", { name: "Bạn chưa ứng tuyển công việc nào" }),
    ).toBeVisible();
  });

  test("[GUI-XLPV01..GUI-XLPV04 & FUNC-XLPV01..FUNC-XLPV03, FUNC-XLPV06] Xem lịch hẹn phỏng vấn, sao chép link, mở Meet và thu gọn/mở rộng", async ({
    page,
    context,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await setupCandidateSessionWithBaseMocks(page, {
      appliedJobs: createMockAppliedJobs(),
    });

    await page.goto("/my-jobs/applied");

    const interviewJobCard = page
      .locator("article")
      .filter({ hasText: "NEXTJS DEVELOPER" });

    // Mở rộng khung tiến trình & lịch phỏng vấn
    await interviewJobCard
      .getByRole("button", { name: /Xem tiến trình/i })
      .click();

    // GUI-XLPV01 & FUNC-XLPV01: Thông tin lịch hẹn phỏng vấn trực tuyến
    await expect(
      interviewJobCard.getByRole("heading", {
        name: "Lịch hẹn phỏng vấn trực tuyến",
      }),
    ).toBeVisible();
    await expect(interviewJobCard.getByText("Google Meet").first()).toBeVisible();
    await expect(interviewJobCard.getByText("meet.google.com")).toBeVisible();
    await expect(
      interviewJobCard.getByText("Bộ phận Tuyển dụng MoMo"),
    ).toBeVisible();

    // GUI-XLPV03 & FUNC-XLPV03: Sao chép link Google Meet
    const copyBtn = interviewJobCard.getByRole("button", {
      name: /Sao chép link/i,
    });
    await expect(copyBtn).toBeEnabled();
    await copyBtn.click();
    await expect(
      page.getByText("Đã sao chép liên kết phòng họp!"),
    ).toBeVisible();
    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe("https://meet.google.com/viecngon-interview");

    // GUI-XLPV04 & FUNC-XLPV02: Nút Mở Google Meet dẫn đúng link phòng họp
    const meetLink = interviewJobCard.getByRole("link", {
      name: /Mở Google Meet/i,
    });
    await expect(meetLink).toBeVisible();
    await expect(meetLink).toHaveAttribute(
      "href",
      "https://meet.google.com/viecngon-interview",
    );
    await expect(meetLink).toHaveAttribute("target", "_blank");

    // FUNC-XLPV06: Thu gọn khung thông tin phỏng vấn
    await interviewJobCard.getByRole("button", { name: /Thu gọn/i }).click();
    await expect(
      interviewJobCard.getByRole("heading", {
        name: "Lịch hẹn phỏng vấn trực tuyến",
      }),
    ).toBeHidden();
  });
});
