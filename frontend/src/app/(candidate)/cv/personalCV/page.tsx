import CandidatePersonCVContent from "@/components/candidate/CandidatePersonCVContent";

export default function ManageCVPage() {
  return (
    <main className="px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        <CandidatePersonCVContent />
      </div>
    </main>
  );
}
