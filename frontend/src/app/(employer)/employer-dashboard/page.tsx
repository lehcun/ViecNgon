"use client";

import EmployerMainContent from "@/components/employer/EmployerMainContent";
import { useRecruiterProfile } from "@/hooks/recruiter/useRecruiterProfile";
import { Loader2 } from "lucide-react";

export default function EmployerDashboard() {
  const { recruiterProfile, isLoading, isError } = useRecruiterProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (isError || !recruiterProfile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-rose-500 font-bold">
        Vui lòng đăng nhập với tài khoản HR.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="max-w mx-auto">
        <EmployerMainContent />
      </div>
    </div>
  );
}
