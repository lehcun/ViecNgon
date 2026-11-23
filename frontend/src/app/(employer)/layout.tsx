import React from "react";
import EmployerNavbar from "@/components/employer/EmployerNavbar";
import EmployerSidebar from "@/components/employer/EmployerSidebar";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen overflow-hidden bg-surface-page flex font-sans">
      <EmployerSidebar />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <EmployerNavbar />

        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
