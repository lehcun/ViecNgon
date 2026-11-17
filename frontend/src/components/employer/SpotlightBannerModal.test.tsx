import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SpotlightBannerModal from "./SpotlightBannerModal";

const saveBannerMock = vi.fn();

vi.mock("@/hooks/recruiter/useSpotlightBanner", () => ({
  useSpotlightBanner: () => ({
    config: {
      hasDiamondAccess: true,
      companyId: "ct-1",
      companyName: "ViecNgon Diamond",
      slug: "viecngon-diamond",
      logo: null,
      defaultCity: "Hà Nội",
      defaultTagline: "AI Platform",
      bannerCoverUrl: "",
      bannerCity: "Hà Nội",
      bannerTagline: "AI Platform",
      bannerBadgeText: "TOP HIRING",
      selectedJobIds: ["j-1"],
      availableJobs: [
        { id: "j-1", title: "Senior NestJS", slug: "senior-nestjs", city: "Hà Nội" },
      ],
      activeJobsCount: 1,
    },
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    saveBanner: saveBannerMock,
    isSaving: false,
    uploadCover: vi.fn(),
    isUploadingCover: false,
  }),
}));

describe("SpotlightBannerModal", () => {
  it("render form cấu hình banner và đóng bằng nút đóng", () => {
    const onClose = vi.fn();
    render(<SpotlightBannerModal isOpen={true} onClose={onClose} />);

    expect(screen.getByLabelText(/Ảnh nền cột trái Banner/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole("button", { name: "Đóng cửa sổ" })[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
