import { Briefcase, FileText, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

const LINKS = [
  {
    label: "Tìm việc thụ động",
    icon: <Briefcase size={20} />,
    href: "/tim-viec",
    tag: { label: "HOT", color: "bg-orange-500" },
  },
  {
    label: "Mẫu CV chuẩn IT",
    icon: <FileText size={20} />,
    href: "/portfolio",
  },
  {
    label: "Story Hub",
    icon: <Star size={20} />,
    href: "/story-hub",
    tag: { label: "MỚI", color: "bg-green-600" },
  },
  {
    label: "Review công ty",
    icon: <Star size={20} />,
    href: "/review-cong-ty",
  },
  {
    label: "Báo cáo lương IT",
    icon: <TrendingUp size={20} />,
    href: "/bao-cao-luong",
  },
];

export default function QuickLinks() {
  return (
    <section className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between md:justify-center gap-8 py-5 px-4 overflow-x-auto no-scrollbar whitespace-nowrap">
          {LINKS.map((item, index) => (
            <div key={index} className="flex items-center gap-8">
              <Link
                href={item.href}
                className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors"
              >
                <div className="bg-blue-50 p-2 rounded-full text-blue-600 group-hover:bg-blue-100 transition-colors">
                  {item.icon}
                </div>
                <span className="flex items-center gap-1.5">
                  {item.label}
                  {item.tag && (
                    <span
                      className={`${item.tag.color} text-white text-[10px] px-1 rounded`}
                    >
                      {item.tag.label}
                    </span>
                  )}
                </span>
              </Link>

              {/* Hiển thị vạch ngăn cách ngoại trừ mục cuối cùng */}
              {index !== LINKS.length - 1 && (
                <div className="w-px h-8 bg-gray-200 hidden md:block"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
