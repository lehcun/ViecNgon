import React from "react";
import EmployerNavbar from "@/components/employer/EmployerNavbar";
import EmployerSidebar from "@/components/employer/EmployerSidebar";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar full width, cố định trên cùng */}
      <EmployerNavbar />

      <div className="flex flex-1 w-full">
        {/* Sidebar sát lề trái, cố định khi cuộn */}
        <aside className="w-65 bg-white border-r border-slate-200 hidden lg:block sticky top-16 h-[calc(100vh-64px)] overflow-y-auto z-10">
          <EmployerSidebar />
        </aside>

        {/* Khu vực chứa nội dung các trang (Dashboard, Form, Setting...) */}
        <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
