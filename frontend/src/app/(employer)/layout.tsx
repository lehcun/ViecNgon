import React from "react";
import EmployerNavbar from "@/components/employer/EmployerNavbar";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <EmployerNavbar />

      {/* Khu vực chứa nội dung Dashboard / Form / Setting */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
