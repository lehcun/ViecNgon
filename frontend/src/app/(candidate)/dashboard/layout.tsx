import React from "react";
import Navbar from "@/components/Navbar";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar variant="app" isLoggedIn={true} />

      <div className="flex-1 lg:pt-24 pt-20">{children}</div>
    </div>
  );
}
