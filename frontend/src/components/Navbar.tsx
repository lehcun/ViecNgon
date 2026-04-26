"use client";

import { useState, useEffect } from "react";
import { ChevronDown, MessageSquare, Bell } from "lucide-react";
import Link from "next/link";
import ProfileDropdown from "./candidate/ProfileDropDown";
import { useAuthStore } from "@/store/authStore";
import { useUser } from "@/hooks/auth/useUser";

interface NavbarProps {
  variant?: "public" | "app"; // 'public' cho trang ngoài, 'app' cho Dashboard
}

export default function Navbar({ variant = "public" }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  const { isAuthenticated, user } = useAuthStore();

  // Goi hook kiểm tra user (Tự động chạy ngầm khi component render)
  const { isCheckingAuth } = useUser();
  console.log("isAuthenticated", isAuthenticated);
  console.log("isCheckingAuth", isCheckingAuth);
  console.log("user", user);

  // 3. Gọi hook đăng xuất
  // const { mutate: logout, isPending: isLoggingOut } = useLogout();

  // Theo dõi sự kiện cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Nếu là bản "app" HOẶC người dùng đã cuộn, thì ép dùng nền trắng (solid)
  const isSolidTheme = variant === "app" || isScrolled;

  // 3. Sử dụng isSolidTheme để quyết định màu sắc thay vì isScrolled
  const navBackground = isSolidTheme
    ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3"
    : "bg-transparent border-b border-transparent py-5";

  const textColor = isSolidTheme ? "text-slate-600" : "text-slate-300";
  const hoverColor = isSolidTheme ? "hover:text-primary" : "hover:text-white";
  const iconColor = isSolidTheme ? "text-slate-500" : "text-slate-300";
  const logoTextColor = isSolidTheme ? "text-slate-900" : "text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${navBackground}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          {/* Logo ViecNgon */}
          <Link
            href="/"
            className="text-2xl font-bold flex items-center gap-1 cursor-pointer"
          >
            <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md">
              V
            </div>
            <span className={logoTextColor}>iecNgon</span>
          </Link>

          {/* Navigation Links */}
          <ul
            className={`hidden md:flex items-center gap-6 text-sm font-medium ${textColor}`}
          >
            <li
              className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
            >
              Việc Làm IT <ChevronDown size={14} />
            </li>
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

        {/* Right Actions */}
        <div className="flex items-center gap-5 text-sm font-medium">
          <div className={`hidden lg:flex items-center gap-4 ${textColor}`}>
            <div
              className={`cursor-pointer text-right transition ${hoverColor}`}
            >
              <div className="text-[11px] opacity-70">Tuyển dụng</div>
              <div>Vị trí cao cấp</div>
            </div>
            <Link href="/employer/login">
              <div
                className={`cursor-pointer text-right border-l ${isSolidTheme ? "border-slate-300" : "border-slate-600"} pl-4 transition ${hoverColor}`}
              >
                <div className="text-[11px] opacity-70">Dành cho</div>
                <div>Nhà Tuyển Dụng</div>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4 ml-4">
            {isCheckingAuth ? (
              // Trạng thái 1: Đang gọi API kiểm tra token -> Hiển thị khung Loading (Skeleton)
              <div className="h-9 w-24 bg-slate-200 animate-pulse rounded-lg"></div>
            ) : isAuthenticated && user ? (
              // Trạng thái 2: Đã đăng nhập thành công
              <>
                <MessageSquare
                  size={20}
                  className={`cursor-pointer transition ${iconColor} ${hoverColor}`}
                />
                <Bell
                  size={20}
                  className={`cursor-pointer transition ${iconColor} ${hoverColor}`}
                />
                <div className="h-6 w-px bg-slate-300 hidden sm:block mx-1"></div>

                {/* Hiển thị thông tin User và Nút đăng xuất */}
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${textColor}`}>
                    {/* Cắt lấy phần tên trước @gmail.com để hiển thị cho gọn */}
                    Chào, {user.email.split("@")[0]}
                  </span>
                  <button
                    // onClick={() => logout()}
                    // disabled={isLoggingOut}
                    className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                      isSolidTheme
                        ? "text-red-600 hover:bg-red-50"
                        : "text-red-400 hover:bg-white/10"
                    } disabled:opacity-50`}
                  >
                    {/* {isLoggingOut ? "Đang thoát..." : "Đăng xuất"} */}
                  </button>
                </div>

                {/* Nếu bạn vẫn muốn dùng ProfileDropdown, bạn có thể truyền user và logout vào nó: */}
                {/* <ProfileDropdown
                  user={user}
                  onLogout={logout}
                  isLoggingOut={isLoggingOut}
                /> */}
              </>
            ) : (
              // Trạng thái 3: Chưa đăng nhập -> Hiện nút Đăng Nhập
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
