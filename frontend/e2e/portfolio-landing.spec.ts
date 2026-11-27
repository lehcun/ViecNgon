import { expect, test } from "@playwright/test";

test.describe("Portfolio & CV Templates Landing (/portfolio)", () => {
  test("Smoke: Trang /portfolio hiển thị đầy đủ 7 section, không có pageerror", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/portfolio");

    await expect(
      page.getByRole("heading", { name: /Tạo CV & Portfolio IT/i }),
    ).toBeVisible();
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("#templates")).toBeVisible();
    await expect(page.locator("#features")).toBeVisible();
    await expect(page.locator("#steps")).toBeVisible();
    await expect(page.locator("#tips")).toBeVisible();
    await expect(page.locator("#blog")).toBeVisible();
    await expect(page.locator("#faq")).toBeVisible();

    // Floating header morphs into pill when scrolling down
    await page.evaluate(() => window.scrollTo(0, 320));
    await expect(page.locator("header > div")).toHaveClass(/rounded-2xl/);

    expect(pageErrors).toEqual([]);
  });

  test("Interaction: Đổi mẫu CV ở Hero, chuyển tab Mẹo viết CV, mở/đóng Modal Blog và FAQ", async ({
    page,
  }) => {
    await page.goto("/portfolio");

    // 1. Hero interactive template switcher
    await page.getByRole("button", { name: /Mẫu Tối giản/i }).click();
    await expect(page.getByText("ViecNgon_CV_Tối giản.pdf")).toBeVisible();

    // 2. Tips section: switch tab 4 điểm vàng
    const tips = page.locator("#tips");
    await tips.scrollIntoViewIfNeeded();
    await tips.getByRole("button", { name: /2\. Kinh nghiệm & Số liệu/i }).click();
    await expect(
      tips.getByText(/Viết theo công thức Hành động/i),
    ).toBeVisible();

    // 3. Blog section: open modal preview & close via Escape
    const blog = page.locator("#blog");
    await blog.scrollIntoViewIfNeeded();
    await blog
      .getByRole("heading", {
        name: /Cách viết CV lập trình viên vượt qua vòng sàng lọc ATS/i,
      })
      .click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText("Điểm cốt lõi cần áp dụng"),
    ).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);

    // 4. FAQ Accordion toggle
    const faq = page.locator("#faq");
    await faq.scrollIntoViewIfNeeded();
    const secondQuestion = faq.getByRole("button", {
      name: /Tôi đã có sẵn CV PDF thì có phải nhập lại từ đầu không/i,
    });
    await secondQuestion.click();
    await expect(secondQuestion).toHaveAttribute("aria-expanded", "true");
    await expect(faq.getByText(/Nhập CV bằng AI/i)).toBeVisible();
  });

  test("Responsive: Không tràn ngang ở Desktop 1440px và Mobile 390px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/portfolio");
    const desktopOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(desktopOverflow).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/portfolio");
    const mobileOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(mobileOverflow).toBe(false);
  });
});
