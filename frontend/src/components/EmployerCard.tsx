import Image from "next/image";

interface EmployerProps {
  employer: {
    name: string;
    logo: string;
    jobs: number;
    color: string;
  };
}

export default function EmployerCard({ employer }: EmployerProps) {
  return (
    <div className="group bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 cursor-pointer aspect-square">
      <div
        className={`relative w-20 h-20 ${employer.color} rounded-xl p-3 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
      >
        {/* Thay thế img bằng Image của Next.js */}
        <Image
          src={employer.logo}
          alt={employer.name}
          width={64}
          height={64}
          className="object-contain w-full h-full"
        />
      </div>
      <h3 className="font-bold text-slate-800 text-sm line-clamp-1">
        {employer.name}
      </h3>
      <p className="text-blue-600 font-semibold text-xs mt-2 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-colors">
        {employer.jobs} việc làm &rsaquo;
      </p>
    </div>
  );
}
