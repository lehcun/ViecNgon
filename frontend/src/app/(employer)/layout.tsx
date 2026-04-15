import React from "react";

export default function EmployerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      <main className="flex-1 overflow-y-auto p-8">
        {children}
        {/* Nội dung các trang như post-job, dashboard sẽ hiển thị ở đây */}
      </main>
    </div>
  );
}
