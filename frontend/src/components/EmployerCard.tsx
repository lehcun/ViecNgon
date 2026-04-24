import Image from "next/image";
import Link from "next/link";

interface EmployerProps {
  employer: {
    name: string;
    logo: string;
    jobs: number;
    location: string;
    skills?: string[];
  };
}

export default function EmployerCard({ employer }: EmployerProps) {
  return (
    <Link
      href={`/employer/${employer.name}`}
      className="group block w-full max-w-sm bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
    >
      {/* --- PHẦN TOP: NỘI DUNG CHÍNH & BACKGROUND TRÒN --- */}
      <div className="relative pt-10 pb-8 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Background viền tròn đồng tâm (Concentric Circles) y như hình */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 transition-transform duration-700 group-hover:scale-105"
          style={{
            // Tạo các vòng tròn tỏa ra từ giữa phần nửa trên của card
            backgroundImage:
              "repeating-radial-gradient(circle at center 35%, transparent 0, transparent 15px, #cbd5e1 16px)",
            // Làm mờ dần họa tiết về phía dưới để chữ không bị rối
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 10%, transparent 80%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,1) 10%, transparent 80%)",
          }}
        ></div>

        {/* Khối Logo (Box đỏ) nổi bật với Drop Shadow 3D */}
        <div
          className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-2xl shadow-[0_12px_30px_rgba(0,0,0,0.15)] flex items-center justify-center p-5 mb-6 transition-transform duration-300 group-hover:-translate-y-1`}
        >
          <Image
            src={employer.logo}
            alt={employer.name}
            width={90}
            height={90}
            className="object-contain w-full h-full"
          />
        </div>

        {/* Tên Công ty */}
        <h3 className="relative z-10 font-extrabold text-slate-900 text-lg sm:text-xl mb-4 line-clamp-1">
          {employer.name}
        </h3>

        {/* Danh sách Kỹ năng (Tags) */}
        {/* <div className="relative z-10 flex flex-wrap justify-center gap-2 max-w-xs">
          {employer.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-xs sm:text-sm font-semibold rounded-full shadow-sm"
            >
              {skill}
            </span>
          ))}
        </div> */}
      </div>

      {/* --- PHẦN BOTTOM: FOOTER --- */}
      <div className="bg-[#f8fafc] border-t border-slate-100 px-6 py-4 flex items-center justify-between">
        <span className="text-sm text-slate-700 font-medium truncate pr-4">
          {employer.location}
        </span>

        <div className="flex items-center gap-2 shrink-0 text-slate-900 font-semibold text-sm">
          {/* Chấm trạng thái màu xanh có viền (Live indicator) */}
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50"></span>
            {/* Chấm xanh bên trong được bọc lớp viền mờ */}
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-emerald-100 box-content"></span>
          </span>
          {employer.jobs} Việc làm
          <span className="text-slate-400 group-hover:text-emerald-500 transition-colors">
            ›
          </span>
        </div>
      </div>
    </Link>
  );
}
