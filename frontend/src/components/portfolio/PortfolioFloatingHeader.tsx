"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import LogoViecNgon from "@/components/LogoViecNgon";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

const PORTFOLIO_NAV_LINKS = [
  { href: "#templates", id: "templates", label: "Mẫu CV" },
  { href: "#features", id: "features", label: "Tính năng AI" },
  { href: "#steps", id: "steps", label: "Quy trình" },
  { href: "#tips", id: "tips", label: "Mẹo viết CV" },
  { href: "#blog", id: "blog", label: "Blog IT" },
  { href: "#faq", id: "faq", label: "FAQ" },
];

export default function PortfolioFloatingHeader() {
  const { isAuthenticated } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const primaryHref = isAuthenticated ? "/cv-template" : "/register";

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const sections = PORTFOLIO_NAV_LINKS.map((item) =>
      document.getElementById(item.id),
    ).filter((el): el is HTMLElement => Boolean(el));

    if (sections.length === 0 || typeof IntersectionObserver === "undefined") {
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveSection(visible[0].target.id);
        }
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] },
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        isScrolled ? "py-2.5 px-3 sm:px-6" : "py-0 px-0",
      )}
    >
      <div
        className={cn(
          "mx-auto h-16 flex items-center justify-between gap-4 transition-all duration-300",
          isScrolled
            ? "max-w-6xl px-4 sm:px-6 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 shadow-2xl shadow-black/40"
            : "max-w-full px-4 sm:px-6 lg:px-8 bg-primary-dark/95 backdrop-blur-md border-b border-white/10",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-4 w-full",
            !isScrolled && "max-w-7xl mx-auto",
          )}
        >
          <div className="flex items-center gap-6">
            <LogoViecNgon logoTextColor="text-white" href="/" />

            <nav
              aria-label="Điều hướng trang Mẫu CV & Portfolio"
              className="hidden lg:flex items-center gap-1"
            >
              {PORTFOLIO_NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap",
                      isActive
                        ? "bg-primary/20 text-blue-300 font-semibold border border-primary/30"
                        : "text-slate-300 hover:text-white hover:bg-white/8 border border-transparent",
                    )}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/12 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98]"
            >
              <Briefcase size={14} />
              <span className="hidden sm:inline">Tìm việc IT</span>
              <span className="sm:hidden">Việc IT</span>
            </Link>

            <Link
              href={primaryHref}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-sm shadow-primary/30 transition-all duration-200 active:scale-[0.98]"
            >
              <span>Tạo CV ngay</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
