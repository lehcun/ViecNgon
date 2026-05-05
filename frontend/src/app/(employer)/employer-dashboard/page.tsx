"use client";

import EmployerMainContent from "@/components/employer/EmployerMainContent";
import EmployerSidebar from "@/components/employer/EmployerSidebar";
import { useRecruiterProfile } from "@/hooks/recruiter/useRecruiterProfile";

export default function EmployerDashboard() {
  const { recruiterProfile, isLoading, isError } = useRecruiterProfile();

  if (isLoading) return <div>Đang tải bảng điều khiển...</div>;
  if (isError || !recruiterProfile)
    return <div>Vui lòng đăng nhập với tài khoản HR.</div>;

  return (
    <main className="px-4 md:px-8 pb-24 pt-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ================= CỘT TRÁI (SIDEBAR) ================= */}
        <aside className="w-full lg:w-1/4 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
          <EmployerSidebar />
        </aside>

        {/* ================= CỘT PHẢI (NỘI DUNG) ================= */}
        <div className="w-full lg:w-3/4 flex flex-col gap-6">
          <EmployerMainContent />
        </div>
      </div>
    </main>
  );
}
