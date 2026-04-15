import React from "react";
import TopBanner from "@/components/TopBanner";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import QuickLinks from "@/components/QuickLinks";
import TopEmployers from "@/components/TopEmployers";

export default function Home() {
  return (
    <main className="min-h-screen">
      <TopBanner />
      <Navbar />
      <HeroSection />
      <QuickLinks />
      <TopEmployers />
    </main>
  );
}
