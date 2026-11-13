import { Briefcase, Building2, FileText, Laptop, Sparkles } from "lucide-react";
import Link from "next/link";

const QUICK_LINKS = [
  {
    label: "Tất cả việc làm IT",
    href: "/jobs",
    icon: <Briefcase size={18} />,
  },
  {
    label: "Việc làm Remote",
    href: "/jobs?hinhThucLamViec=Remote",
    icon: <Laptop size={18} />,
  },
  {
    label: "Nhập CV bằng AI",
    href: "/cv-profile",
    icon: <Sparkles size={18} />,
    badge: "AI",
  },
  {
    label: "Mẫu CV chuẩn IT",
    href: "/portfolio",
    icon: <FileText size={18} />,
  },
  {
    label: "Công ty hàng đầu",
    href: "/#top-companies",
    icon: <Building2 size={18} />,
  },
];

export default function QuickLinks() {
  return (
    <section className="bg-surface-card border-b border-border-default">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-start md:justify-center gap-4 sm:gap-6 py-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary-light/60 font-medium text-sm transition-colors shrink-0"
            >
              <span className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                {item.icon}
              </span>
              <span>{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-ai-light text-ai border border-ai-border">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
