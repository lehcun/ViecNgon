import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createQueryWrapper } from "@/test/query-wrapper";
import FeaturedEmployerBanner from "./FeaturedEmployerBanner";

describe("FeaturedEmployerBanner", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
  });

  it("hiển thị banner công ty nổi bật với tagline đã stripHtml tuyến tính", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            {
              companyId: "ct-1",
              companyName: "ViecNgon Diamond",
              slug: "viecngon-diamond",
              logo: null,
              city: "Hà Nội",
              tagline: "<p>Fintech &amp; <b>AI</b>&nbsp;2026</p>",
              badgeText: "TOP HIRING",
              coverUrl: null,
              activeJobsCount: 3,
              featuredJobs: [
                { id: "j-1", title: "Senior NestJS", slug: "senior-nestjs" },
              ],
            },
          ]),
          { status: 200 },
        ),
      ),
    );

    render(<FeaturedEmployerBanner />, {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(screen.getByText("ViecNgon Diamond")).toBeInTheDocument();
    });
    expect(screen.getByText("Fintech & AI 2026")).toBeInTheDocument();
  });
});
