import Image from "next/image";
import Link from "next/link";

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
    <Link
      href={`/employer/${employer.name}`}
      className="block group bg-white border border-slate-200 rounded-2xl p-6 flex-col items-center justify-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary cursor-pointer aspect-square"
    >
      <div
        className={`relative w-20 h-20 ${employer.color || "bg-slate-50"} rounded-xl p-3 flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}
      >
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
      <div className="mt-2 flex justify-center">
        <p className="text-primary font-semibold text-xs bg-primary-light border border-primary/20 px-3 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
          {employer.jobs} việc làm &rsaquo;
        </p>
      </div>
    </Link>
  );
}
