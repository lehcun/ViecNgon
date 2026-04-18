import React from "react";
import CandidateNavbar from "@/components/candidate/CandidateNavbar";

export default function CandidateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <CandidateNavbar />

      <div className="flex-1 pt-8">{children}</div>
    </div>
  );
}
