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
  // Hàm xử lý hiển thị chữ phụ (Subtitle) tùy theo Role
  const renderSubtitle = () => {
    // Dựa vào DB TAIKHOAN.VaiTro của bạn, có thể so sánh thêm với "NHATUYENDUNG"
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
      {/* Biểu tượng chữ V */}
      <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white font-bold shadow-md shrink-0">
        V
      </div>

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
