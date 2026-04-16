import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuickLinks from "@/components/QuickLinks";
import TopEmployers from "@/components/TopEmployers";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <QuickLinks />
      <TopEmployers />
      <Footer />
    </main>
  );
}
