"use client";

import { useState, useEffect } from "react";
import { ChevronDown, MessageSquare } from "lucide-react";
import Link from "next/link";
import ProfileDropdown from "./candidate/ProfileDropDown";
import { useAuthStore } from "@/store/authStore";
import { useUser } from "@/hooks/auth/useUser";
import { useLogout } from "@/hooks/auth/useLogout";
import NotificationDropdown from "./NotificationDropdown";
import LogoViecNgon from "./LogoViecNgon";
import PublicEmployerDropdown from "./employer/PublicEmployerDropdown";

interface NavbarProps {
  variant?: "public" | "app";
}

export default function Navbar({ variant = "public" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { isCheckingAuth } = useUser();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolidTheme = variant === "app" || isScrolled;
  const navBackground = isSolidTheme
    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3"
    : "bg-transparent border-b border-transparent py-5";

  const textColor = isSolidTheme ? "text-slate-600" : "text-slate-300";
  const hoverColor = isSolidTheme ? "hover:text-primary" : "hover:text-white";
  const iconColor = isSolidTheme ? "text-slate-500" : "text-slate-300";
  const logoTextColor = isSolidTheme ? "text-slate-900" : "text-white";

  // Xác định người dùng có phải là Nhà tuyển dụng hay không dựa vào role
  const isEmployer = user?.role === "NHATUYENDUNG";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${navBackground}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <LogoViecNgon logoTextColor={logoTextColor} />

          <ul
            className={`hidden md:flex items-center gap-6 text-sm font-medium ${textColor}`}
          >
            <Link href={"/job-it"}>
              <li
                className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
              >
                Việc Làm IT <ChevronDown size={14} />
              </li>
            </Link>
            <li
              className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
            >
              Công ty IT <ChevronDown size={14} />
            </li>
            <li
              className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
            >
              Blog <ChevronDown size={14} />
            </li>
            <li
              className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
            >
              Story Hub{" "}
              <span className="bg-primary text-[10px] px-1 rounded font-bold text-white ml-1">
                MỚI
              </span>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-5 text-sm font-medium">
          <div className={`hidden lg:flex items-center gap-4 ${textColor}`}>
            <div
              className={`cursor-pointer text-right transition ${hoverColor}`}
            >
              <div className="text-[11px] opacity-70">Tuyển dụng</div>
              <div>Vị trí cao cấp</div>
            </div>

            {/* Ẩn nút "Dành cho Nhà Tuyển Dụng" nếu đã đăng nhập bằng tài khoản HR */}
            {!isEmployer && (
              <Link href="/employer/login">
                <div
                  className={`cursor-pointer text-right border-l ${isSolidTheme ? "border-slate-300" : "border-slate-600"} pl-4 transition ${hoverColor}`}
                >
                  <div className="text-[11px] opacity-70">Dành cho</div>
                  <div>Nhà Tuyển Dụng</div>
                </div>
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4 ml-4">
            {isCheckingAuth ? (
              <div className="h-9 w-24 bg-slate-200 animate-pulse rounded-lg"></div>
            ) : isAuthenticated && user ? (
              <>
                {/* Ẩn Message, Notification và dải phân cách nếu là Nhà tuyển dụng */}
                {!isEmployer && (
                  <>
                    <MessageSquare
                      size={20}
                      className={`cursor-pointer transition ${iconColor} ${hoverColor}`}
                    />
                    <NotificationDropdown />
                    <div className="h-6 w-px bg-slate-300 hidden sm:block mx-1"></div>
                  </>
                )}

                {/* Phân luồng Dropdown Profile tương ứng với Role */}
                {isEmployer ? (
                  <PublicEmployerDropdown />
                ) : (
                  <ProfileDropdown
                    user={user}
                    onLogout={logout}
                    isLoggingOut={isLoggingOut}
                  />
                )}
              </>
            ) : (
              <Link
                href="/login"
                className={`flex items-center gap-2 cursor-pointer transition ${isSolidTheme ? "text-slate-800" : "text-white"} ${hoverColor}`}
              >
                <span className="font-semibold border border-current px-4 py-2 rounded-lg hover:bg-white/10">
                  Đăng Nhập
                </span>
              </Link>
            )}

            <div>
              <label className="text-gray-500">EN</label>{" "}
              <label className="text-white">|</label>{" "}
              <label className="text-white">VI</label>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
