import type { Metadata } from "next";
import PortfolioFloatingHeader from "@/components/portfolio/PortfolioFloatingHeader";
import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioTemplatesShowcase from "@/components/portfolio/PortfolioTemplatesShowcase";
import PortfolioFeatures from "@/components/portfolio/PortfolioFeatures";
import PortfolioSteps from "@/components/portfolio/PortfolioSteps";
import PortfolioTipsSection from "@/components/portfolio/PortfolioTipsSection";
import PortfolioBlogSection from "@/components/portfolio/PortfolioBlogSection";
import PortfolioFaqCta from "@/components/portfolio/PortfolioFaqCta";
import { EmployerSmoothScroll } from "@/components/auth/employer-landing/EmployerMotionPrimitives";
import "@/components/auth/employer-landing/employer-motion.css";

export const metadata: Metadata = {
  title: "Mẫu CV & Portfolio IT Chuẩn ATS | ViecNgon",
  description:
    "Tạo CV & Portfolio IT chuẩn ATS miễn phí, nhập CV PDF bằng AI, tham khảo mẹo viết CV và cẩm nang phỏng vấn lập trình viên trên ViecNgon.",
};

export default function PortfolioLandingPage() {
  return (
    <div className="w-full flex-1 flex flex-col bg-primary-dark text-white selection:bg-primary selection:text-white">
      <EmployerSmoothScroll />
      <PortfolioFloatingHeader />
      <PortfolioHero />
      <PortfolioTemplatesShowcase />
      <PortfolioFeatures />
      <PortfolioSteps />
      <PortfolioTipsSection />
      <PortfolioBlogSection />
      <PortfolioFaqCta />
    </div>
  );
}
