import type { Metadata } from "next";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFeatures from "@/components/portfolio/PortfolioFeatures";
import PortfolioSteps from "@/components/portfolio/PortfolioSteps";

export const metadata: Metadata = {
  title: "Tạo Portfolio IT Chuẩn | ViecNgon",
  description:
    "Công cụ tạo Portfolio và CV chuyên nghiệp dành riêng cho lập trình viên.",
};

export default function PortfolioLandingPage() {
  return (
    <div className="w-full flex-1 flex flex-col bg-primary-dark selection:bg-primary selection:text-white pt-20">
      <PortfolioHero />
      <PortfolioFeatures />
      <PortfolioSteps />
    </div>
  );
}
