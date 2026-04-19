// "use client";

// import React, { useState, useEffect } from "react";
// import { ChevronDown, MessageSquare, Bell } from "lucide-react";
// import Link from "next/link";
// import ProfileDropdown from "./candidate/ProfileDropDown";

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);

//   // Theo dõi sự kiện cuộn trang
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 20) {
//         setIsScrolled(true);
//       } else {
//         setIsScrolled(false);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // Các biến chứa class Tailwind thay đổi theo trạng thái cuộn
//   const navBackground = isScrolled
//     ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200 py-3"
//     : "bg-transparent border-b border-transparent py-5";

//   const textColor = isScrolled ? "text-slate-600" : "text-slate-300";
//   const hoverColor = isScrolled ? "hover:text-blue-600" : "hover:text-white";
//   const iconColor = isScrolled ? "text-slate-500" : "text-slate-300";

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${navBackground}`}
//     >
//       <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
//         <div className="flex items-center gap-8">
//           {/* Logo ViecNgon */}
//           <div className="text-2xl font-bold flex items-center gap-1 cursor-pointer">
//             <div className="bg-blue-600 rounded-full w-8 h-8 flex items-center justify-center text-white shadow-md">
//               V
//             </div>
//             <span className={isScrolled ? "text-slate-900" : "text-white"}>
//               iecNgon
//             </span>
//           </div>

//           {/* Navigation Links */}
//           <ul
//             className={`hidden md:flex items-center gap-6 text-sm font-medium ${textColor}`}
//           >
//             <li
//               className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
//             >
//               Việc Làm IT <ChevronDown size={14} />
//             </li>
//             <li
//               className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
//             >
//               Công ty IT <ChevronDown size={14} />
//             </li>
//             <li
//               className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
//             >
//               Blog <ChevronDown size={14} />
//             </li>
//             <li
//               className={`flex items-center gap-1 cursor-pointer transition ${hoverColor}`}
//             >
//               Story Hub{" "}
//               <span className="bg-blue-600 text-[10px] px-1 rounded font-bold text-white ml-1">
//                 MỚI
//               </span>
//             </li>
//           </ul>
//         </div>

//         {/* Right Actions */}
//         <div className="flex items-center gap-5 text-sm font-medium">
//           <div className={`hidden lg:flex items-center gap-4 ${textColor}`}>
//             <div
//               className={`cursor-pointer text-right transition ${hoverColor}`}
//             >
//               <div className="text-[11px] opacity-70">Tuyển dụng</div>
//               <div>Vị trí cao cấp</div>
//             </div>
//             <Link href={"/employer/login"}>
//               <div
//                 className={`cursor-pointer text-right border-l ${isScrolled ? "border-slate-300" : "border-slate-600"} pl-4 transition ${hoverColor}`}
//               >
//                 <div className="text-[11px] opacity-70">Dành cho</div>
//                 <div>Nhà Tuyển Dụng</div>
//               </div>
//             </Link>
//           </div>

//           <div className="flex items-center gap-4 ml-4">
//             <MessageSquare
//               size={20}
//               className={`cursor-pointer transition ${iconColor} ${hoverColor}`}
//             />
//             <Bell
//               size={20}
//               className={`cursor-pointer transition ${iconColor} ${hoverColor}`}
//             />
//             <div
//               className={`cursor-pointer flex items-center gap-2 transition ${isScrolled ? "text-slate-800" : "text-white"}`}
//             >
//               <ProfileDropdown />
//               <Link href={"/login"}>
//                 <span className="font-semibold hidden sm:block">Đăng Nhập</span>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { ChevronDown, MessageSquare, Bell } from "lucide-react";
import Link from "next/link";
import ProfileDropdown from "./candidate/ProfileDropDown";

interface NavbarProps {
  variant?: "public" | "app"; // 'public' cho trang ngoài, 'app' cho Dashboard
  isLoggedIn?: boolean; // Trạng thái đăng nhập
}

export default function Navbar({
  variant = "public",
  isLoggedIn = true,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Theo dõi sự kiện cuộn trang
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. BÍ QUYẾT Ở ĐÂY: Nếu là bản "app" HOẶC người dùng đã cuộn, thì ép dùng nền trắng (solid)
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
            {isLoggedIn && (
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
              </>
            )}

            {isLoggedIn ? (
              <ProfileDropdown />
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
