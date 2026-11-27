"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LogIn, ArrowRight } from "lucide-react";
import LogoViecNgon from "@/components/LogoViecNgon";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#why-viecngon", id: "why-viecngon", label: "Tổng quan" },
  { href: "#packages", id: "packages", label: "Bảng giá gói" },
  { href: "#features", id: "features", label: "Tiện ích AI" },
  { href: "#partners", id: "partners", label: "Khách hàng" },
];

export default function EmployerLandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 32);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const sections = NAV_LINKS.map((item) =>
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
            ? "max-w-6xl px-4 sm:px-6 rounded-2xl bg-surface-card/90 backdrop-blur-md border border-border-default shadow-md"
            : "max-w-full px-4 sm:px-6 lg:px-8 bg-linear-to-r from-primary-dark from-65% via-primary-active via-88% to-primary border-b border-white/10 shadow-sm",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-4 w-full",
            !isScrolled && "max-w-7xl mx-auto",
          )}
        >
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <LogoViecNgon
                logoTextColor={isScrolled ? "text-text-primary" : "text-white"}
                role="employer"
                href="/"
              />
              <span
                className={cn(
                  "hidden sm:inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-bold tracking-wider uppercase transition-colors duration-300",
                  isScrolled
                    ? "bg-primary-light border-primary-subtle text-primary"
                    : "bg-white/10 border-white/15 text-white",
                )}
              >
                Nhà tuyển dụng
              </span>
            </div>

            <nav
              aria-label="Điều hướng cổng Nhà tuyển dụng"
              className="hidden lg:flex items-center gap-1"
            >
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                      isScrolled
                        ? isActive
                          ? "bg-primary-light text-primary font-semibold"
                          : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
                        : isActive
                          ? "bg-white/15 text-white font-semibold"
                          : "text-white/80 hover:text-white hover:bg-white/10",
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
              href="/employer/login"
              className={cn(
                "inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-[0.98]",
                isScrolled
                  ? "border-border-default bg-surface-card hover:bg-surface-muted text-text-primary"
                  : "border-white/20 bg-white/5 hover:bg-white/15 text-white",
              )}
            >
              <LogIn size={15} />
              <span>Đăng nhập</span>
            </Link>

            <a
              href="#register-form"
              className={cn(
                "inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs active:scale-[0.98]",
                isScrolled
                  ? "bg-primary hover:bg-primary-hover text-white"
                  : "bg-surface-card hover:bg-surface-muted text-primary",
              )}
            >
              <span>Đăng ký ngay</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
