import React from "react";
import EmployerNavbar from "@/components/employer/EmployerNavbar";
import EmployerSidebar from "@/components/employer/EmployerSidebar";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-page flex flex-col font-sans">
      <EmployerNavbar />

      <div className="flex flex-1 w-full">
        <aside className="w-64 bg-surface-card border-r border-border-default hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto z-10">
          <EmployerSidebar />
        </aside>

        <main className="flex-1 w-full overflow-x-hidden min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
