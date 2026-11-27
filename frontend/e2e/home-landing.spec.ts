import { expect, test } from "@playwright/test";

test.describe("Homepage Floating Header & Performance Polish (/)", () => {
  test("Smoke & Floating Navbar: Morph thành pill khi cuộn và trở lại thanh phẳng ở đầu trang", async ({
    page,
  }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        name: /Tìm kiếm việc làm IT chất lượng tại Việt Nam/i,
      }),
    ).toBeVisible();
    await expect(page.locator("#top-companies")).toBeVisible();

    const headerInner = page.locator("header > div").first();
    await expect(headerInner).not.toHaveClass(/rounded-2xl/);

    await page.evaluate(() => window.scrollTo(0, 260));
    await expect(headerInner).toHaveClass(/rounded-2xl/);

    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(headerInner).not.toHaveClass(/rounded-2xl/);

    expect(pageErrors).toEqual([]);
  });

  test("Interaction: Gõ từ khóa và bấm Tìm kiếm điều hướng đúng sang /jobs và Navbar trên /jobs không floating", async ({
    page,
  }) => {
    await page.goto("/");
    await page
      .getByPlaceholder(/Tìm theo kỹ năng/i)
      .fill("ReactJS");
    await page.getByRole("button", { name: /Tìm kiếm/i }).click();
    await expect(page).toHaveURL(/\/jobs\?keyword=ReactJS/);

    await page.evaluate(() => window.scrollTo(0, 260));
    await expect(page.locator("header > div").first()).not.toHaveClass(
      /rounded-2xl/,
    );
  });

  test("Responsive: Không tràn ngang ở Desktop 1440px và Mobile 390px", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");
    const desktopOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(desktopOverflow).toBe(false);

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const mobileOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(mobileOverflow).toBe(false);
  });
});
