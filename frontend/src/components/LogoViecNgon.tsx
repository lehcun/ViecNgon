import Image from "next/image";
import Link from "next/link";
import React from "react";

interface LogoViecNgonProps {
  logoTextColor?: string;
  role?: "admin" | "employer" | "candidate" | string | null;
  href?: string; // Tùy chọn đổi link khi click vào logo (Mặc định là "/")
}

const LogoViecNgon = ({
  logoTextColor = "text-slate-900", // Mặc định là màu tối
  role,
  href = "/",
}: LogoViecNgonProps) => {
  const isLightLogo = logoTextColor.includes("text-white");

  // Hàm xử lý hiển thị chữ phụ (Subtitle) tùy theo Role
  const renderSubtitle = () => {
    if (role === "employer" || role === "NHATUYENDUNG") {
      return (
        <span className="text-[10px] font-black tracking-widest text-primary uppercase mt-0.5">
          Employer
        </span>
      );
    }
    if (role === "admin" || role === "ADMIN") {
      return (
        <span className="text-[10px] font-black tracking-widest text-rose-500 uppercase mt-0.5">
          Admin
        </span>
      );
    }
    // Khách vãng lai (Guest) hoặc Ứng viên (Candidate) thì không trả về gì cả
    return null;
  };

  return (
    <Link href={href} className="flex items-center gap-1.5 cursor-pointer">
      {/* Biểu tượng chữ V đồng bộ đổi trắng/đen theo màu chữ iecNgon */}
      <span className="relative w-9 h-9 shrink-0">
        <Image
          src="/logo-viecngon-dark.png"
          alt="Logo ViecNgon"
          width={36}
          height={36}
          priority
          className={`w-9 h-9 object-contain transition-opacity duration-300 ${
            isLightLogo ? "opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src="/logo-viecngon-white.png"
          alt=""
          aria-hidden="true"
          width={36}
          height={36}
          priority
          className={`w-9 h-9 object-contain absolute inset-0 transition-opacity duration-300 ${
            isLightLogo ? "opacity-100" : "opacity-0"
          }`}
        />
      </span>

      {/* Cụm Text (Chữ chính và Phụ đề) */}
      <div className="flex flex-col justify-center">
        {/* Chữ iecNgon (Kết hợp class leading-none để chữ phụ ép sát lên trên) */}
        <span
          className={`text-xl md:text-2xl font-extrabold leading-none transition-colors duration-300 ${logoTextColor}`}
        >
          iecNgon
        </span>

        {/* Chữ phụ (Employer / Admin) */}
        {renderSubtitle()}
      </div>
    </Link>
  );
};

export default LogoViecNgon;
