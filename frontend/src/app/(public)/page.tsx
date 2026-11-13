import HeroSection from "@/components/HeroSection";
import QuickLinks from "@/components/QuickLinks";
import TopEmployers from "@/components/TopCompany";

export default function Home() {
  return (
      <div className="w-full min-w-0 flex-1 flex flex-col">
        <HeroSection />
        <QuickLinks />
        <TopEmployers />
    </div >
  );
}
