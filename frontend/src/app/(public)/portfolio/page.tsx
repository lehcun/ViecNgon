import type { Metadata } from "next";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioFeatures from "@/components/portfolio/PortfolioFeatures";
import PortfolioSteps from "@/components/portfolio/PortfolioSteps";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Tạo Portfolio IT Chuẩn | ViecNgon",
  description:
    "Công cụ tạo Portfolio và CV chuyên nghiệp dành riêng cho lập trình viên.",
};

export default function PortfolioLandingPage() {
  return (
    <main className="min-h-screen bg-primary-dark selection:bg-primary selection:text-white">
      <Navbar />
      <PortfolioHero />
      <PortfolioFeatures />
      <PortfolioSteps />
    </main>
  );
}
