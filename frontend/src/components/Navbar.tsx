"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./candidate/ProfileDropDown";
import { useAuthStore } from "@/store/authStore";
import { useUser } from "@/hooks/auth/useUser";
import { useLogout } from "@/hooks/auth/useLogout";
import NotificationDropdown from "./NotificationDropdown";
import LogoViecNgon from "./LogoViecNgon";
import PublicEmployerDropdown from "./employer/PublicEmployerDropdown";
import { cn } from "@/lib/utils";

interface NavbarProps {
  variant?: "public" | "app";
}

const NAV_LINKS = [
  { label: "Việc làm IT", href: "/jobs" },
  { label: "Công ty IT", href: "/#top-companies" },
  { label: "Mẫu CV & Portfolio", href: "/portfolio" },
];

export default function Navbar({ variant = "public" }: NavbarProps) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { isCheckingAuth } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolidTheme = variant === "app" || isScrolled;
  const navBackground = isSolidTheme
    ? "bg-surface-card/95 backdrop-blur-md shadow-xs border-b border-border-default"
    : "bg-transparent border-b border-transparent";

  const textColor = isSolidTheme ? "text-text-secondary" : "text-slate-200";
  const hoverColor = isSolidTheme ? "hover:text-primary" : "hover:text-white";
  const logoTextColor = isSolidTheme ? "text-text-primary" : "text-white";
  const isEmployer = user?.role === "NHATUYENDUNG";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 h-16 transition-all duration-200",
        navBackground,
      )}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Trái: Logo + Menu điều hướng */}
        <div className="flex items-center gap-8 min-w-0">
          <LogoViecNgon logoTextColor={logoTextColor} />

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {NAV_LINKS.map((item) => {
              const active =
                item.href !== "/#top-companies" &&
                (pathname === item.href ||
                  pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "transition-colors whitespace-nowrap py-1",
                    active
                      ? isSolidTheme
                        ? "text-primary font-semibold"
                        : "text-white font-semibold"
                      : cn(textColor, hoverColor),
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Phải: Nhà tuyển dụng + Thông báo + Tài khoản */}
        <div className="flex items-center gap-3 sm:gap-4">
          {!isEmployer && (
            <Link
              href="/employer/login"
              className={cn(
                "hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap",
                isSolidTheme
                  ? "border-border-default text-text-secondary hover:text-primary hover:border-primary/40 hover:bg-primary-light/50"
                  : "border-white/25 text-slate-100 hover:bg-white/10",
              )}
            >
              Nhà tuyển dụng
            </Link>
          )}

          {isCheckingAuth ? (
            <div className="h-9 w-28 bg-surface-subtle animate-pulse rounded-lg" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              {!isEmployer && <NotificationDropdown />}
              {isEmployer ? (
                <PublicEmployerDropdown />
              ) : (
                <ProfileDropdown
                  user={user}
                  onLogout={logout}
                  isLoggingOut={isLoggingOut}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center justify-center h-9 px-4 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap",
                  isSolidTheme
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "bg-white text-primary hover:bg-primary-light",
                )}
              >
                Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
