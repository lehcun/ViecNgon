import CandidateMain from "@/components/candidate/CandidateMain";
import CandidateSidebar from "@/components/candidate/CandidateSidebar";

export default function CandidateDashboard() {
  return (
    <main className="px-4 md:px-8 pb-12">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ==================== CỘT TRÁI (SIDEBAR REUSABLE) ==================== */}
        <CandidateSidebar />

        {/* ==================== CỘT PHẢI (MAIN CONTENT) ==================== */}
        <CandidateMain />
      </div>
    </main>
  );
}
