import React from "react";
import Navbar from "@/components/Navbar";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-page flex flex-col">
      <Navbar variant="app" />
      <div className="flex-1 pt-8 md:pt-10 px-4 md:px-6 pb-12 mt-16">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8">
          <CandidateSidebar />
          <div className="w-full lg:w-3/4 flex flex-col gap-6 min-w-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
