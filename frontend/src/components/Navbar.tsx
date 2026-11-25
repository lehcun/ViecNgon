"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfileDropdown from "./candidate/ProfileDropDown";
import { useAuthStore } from "@/store/authStore";
import { useUser } from "@/hooks/auth/useUser";
import { useLogout } from "@/hooks/auth/useLogout";
import NotificationDropdown from "./NotificationDropdown";
import { Clock, Headphones, LogOut } from "lucide-react";
import LogoViecNgon from "./LogoViecNgon";
import PublicEmployerDropdown from "./employer/PublicEmployerDropdown";
import PublicAdminDropdown from "./admin/PublicAdminDropdown";
import { cn } from "@/lib/utils";

interface NavbarProps {
  variant?: "public" | "app" | "dark";
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
  const { mutate: logoutPendingEmployer, isPending: isLoggingOutPending } =
    useLogout({ redirectTo: "/", replace: true });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLightHeader = variant === "app" || (variant === "public" && isScrolled);
  const navBackground =
    variant === "dark"
      ? "bg-primary-dark border-b border-white/10 shadow-xs"
      : isLightHeader
        ? "bg-surface-card/95 backdrop-blur-md shadow-xs border-b border-border-default"
        : "bg-transparent border-b border-transparent";

  const textColor = isLightHeader ? "text-text-secondary" : "text-slate-200";
  const hoverColor = isLightHeader ? "hover:text-primary" : "hover:text-white";
  const logoTextColor = isLightHeader ? "text-text-primary" : "text-white";
  const isEmployer = user?.role === "NHATUYENDUNG";
  const isPendingEmployer = isEmployer && user?.status === "CHUAKICHHOAT";
  const isAdmin = user?.role === "ADMIN";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-200",
        navBackground,
      )}
    >
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
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
                      ? isLightHeader
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

        {/* Phải: Nhà tuyển dụng (chỉ hiện với khách vãng lai) + Thông báo + Tài khoản */}
        <div className="flex items-center gap-3 sm:gap-4">
          {!isCheckingAuth && !isAuthenticated && (
            <Link
              href="/employer/login"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden sm:inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors whitespace-nowrap",
                isLightHeader
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
              {!isEmployer && !isAdmin && <NotificationDropdown />}
              {isAdmin ? (
                <PublicAdminDropdown />
              ) : isPendingEmployer ? (
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-warning-light text-warning-text border border-warning-border">
                    <Clock size={13} />
                    Chờ Admin kích hoạt
                  </span>
                  <button
                    type="button"
                    disabled={isLoggingOutPending}
                    onClick={() => logoutPendingEmployer()}
                    className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold bg-danger-soft text-danger-text border border-danger-border hover:bg-danger-light transition-colors disabled:opacity-50"
                  >
                    <LogOut size={14} />
                    <span>
                      {isLoggingOutPending ? "Đang thoát..." : "Đăng xuất"}
                    </span>
                  </button>
                </div>
              ) : isEmployer ? (
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
                  isLightHeader
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

      {/* Thanh thông báo trạng thái chờ Admin kích hoạt + Hỗ trợ dành riêng cho NTD chưa kích hoạt */}
      {isPendingEmployer && (
        <div className="bg-warning-soft border-t border-b border-warning-border text-warning-text">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Clock size={14} className="shrink-0" />
              <span>
                Tài khoản Nhà tuyển dụng{" "}
                <strong className="font-semibold">{user.email}</strong> đang chờ
                Quản trị viên kích hoạt. Trong thời gian chờ, bạn chỉ có thể
                duyệt trang như khách vãng lai.
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <a
                href="mailto:love@viecngon.vn?subject=H%E1%BB%97%20tr%E1%BB%A3%20k%C3%ADch%20ho%E1%BA%A1t%20t%C3%A0i%20kho%E1%BA%A3n%20Nh%C3%A0%20tuy%E1%BB%83n%20d%E1%BB%A5ng"
                className="inline-flex items-center gap-1.5 font-semibold text-warning-text hover:underline"
              >
                <Headphones size={13} />
                <span>Hỗ trợ: love@viecngon.vn · 1900 6868</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
