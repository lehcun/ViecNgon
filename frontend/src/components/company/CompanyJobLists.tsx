import { getRelativeTime } from "@/utils/formatTime";
import { CompanyDetailResponse } from "@viecngon/types";
import { CheckCircle2, ChevronRight, Home, MapPin } from "lucide-react";
import Link from "next/link";

const CompanyJobLists = ({
  totalJobs,
  jobs,
}: {
  totalJobs?: number;
  jobs?: CompanyDetailResponse["activeJobs"];
}) => {
  //Sẽ css cho 2 cái này trong tương lai
  if (totalJobs === undefined || jobs === undefined) return <h2>Loading...</h2>;
  else if (totalJobs === 0)
    return <h2>Hiện công ty này không có công việc nào</h2>;
  return (
    <div>
      <div className="sticky top-24">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          {totalJobs} việc làm đang tuyển dụng
        </h2>

        <div className="space-y-4">
          {/* Card Việc Làm 1 */}
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job?.slug}`}
              className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-primary hover:shadow-lg transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                NEW FOR YOU
              </div>
              <p className="text-xs text-slate-500 mb-2">
                {getRelativeTime(job.postedAt)}
              </p>
              <h3 className="text-base font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                {job.title}
              </h3>

              <div className="mt-3 flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span className="font-semibold">{job.salaryDisplay}</span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <Home size={16} className="text-slate-400" />
                  {job.workModel}

                  <MapPin size={16} className="text-slate-400" />
                  {job.location}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-[11px] font-medium bg-primary-light text-primary border border-primary/20 px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <ul className="mt-4 space-y-1 text-sm text-slate-600 list-disc list-inside">
                {job.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </Link>
          ))}
        </div>

        <button className="w-full mt-4 py-3 text-primary font-bold hover:bg-primary-light rounded-lg transition flex items-center justify-center gap-1">
          Xem tất cả việc làm <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default CompanyJobLists;
