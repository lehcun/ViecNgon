import React from "react";
import Navbar from "@/components/Navbar";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Nav bar o tren cung */}
      <Navbar variant="app" />
      <div className="flex-1 pt-8 md:pt-10 px-4 md:px-8 pb-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Cột trái: Sidebar (Chiếm 1/4) */}
          <CandidateSidebar />

          {/* Cột phải: Nội dung động (Chiếm 3/4) */}
          <div className="w-full lg:w-3/4 flex flex-col gap-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
