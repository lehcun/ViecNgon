import Link from "next/link";
import { Phone, Mail, Send } from "lucide-react";
import { FaYoutube, FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] text-slate-300 border-t border-slate-800 overflow-hidden mt-20">
      {/* Hiệu ứng ánh sáng và đường cong lượn sóng góc phải */}
      <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 pointer-events-none overflow-hidden">
        <div className="absolute right-[-10%] top-[-20%] w-200 h-200 rounded-full border border-primary/10 opacity-30"></div>
        <div className="absolute right-[-5%] top-[10%] w-150 h-150 rounded-full border border-primary/20 opacity-20"></div>
        <div className="absolute right-[5%] top-[30%] w-100 h-100 rounded-full border border-primary/30 opacity-10"></div>
        {/* Lớp phủ Gradient mờ */}
        <div className="absolute inset-0 bg-linear-to-l from-primary-dark/40 to-transparent mix-blend-screen"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Cột 1: Logo & Social (Chiếm 2 cột trên Desktop để logo rộng rãi) */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <div className="text-3xl font-extrabold flex items-center gap-1 cursor-pointer">
                <div className="bg-primary rounded-full w-9 h-9 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                  V
                </div>
                <span className="text-white tracking-tight">iecNgon</span>
              </div>
            </Link>
            <p className="text-xs font-bold text-slate-400 mb-8 tracking-[0.2em] uppercase">
              Tiếp lợi thế - Nối thành công
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm"
              >
                <FaFacebook className="text-blue-600" size={20} /> Facebook
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all shadow-sm"
              >
                <FaYoutube className="text-blue-600" size={20} /> Youtube
              </a>
            </div>
          </div>

          {/* Cột 2: Về ViecNgon */}
          <div>
            <h3 className="text-white font-bold mb-6 text-base">Về ViecNgon</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Trang Chủ
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Về ViecNgon.vn
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Dịch vụ gợi ý ứng viên
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Liên Hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="hover:text-primary transition-colors"
                >
                  Việc Làm IT
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Câu hỏi thường gặp
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Điều khoản chung */}
          <div>
            <h3 className="text-white font-bold mb-6 text-base">
              Điều khoản chung
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Chính sách quyền riêng tư
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Quy chế hoạt động
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Giải quyết khiếu nại
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Thoả thuận sử dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Thông cáo báo chí
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
            <h3 className="text-white font-bold mb-6 text-base">
              Liên hệ để đăng tin tuyển dụng tại:
            </h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-slate-500" />
                <span>Đà Nẵng: (+84) 236 388 8888</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-slate-500" />
                <span>Hồ Chí Minh: (+84) 977 460 519</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-slate-500" />
                <span>Hà Nội: (+84) 983 131 351</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-slate-500" />
                <span>Email: love@viecngon.vn</span>
              </li>
              <li className="flex items-center gap-3 mt-6">
                <Send size={16} className="text-slate-500" />
                <Link
                  href="/contact"
                  className="text-white hover:text-primary transition-colors"
                >
                  Gửi thông tin liên hệ
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dòng Copyright dưới cùng */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            Copyright © 2026 ViecNgon JSC <span className="mx-2">|</span> MST:
            0123456789
          </p>
          <p>
            Thiết kế & Phát triển bởi Nhóm 5 (Đạt, Huy, Ngọc Ý, Quang Ý, Cường)
          </p>
        </div>
      </div>
    </footer>
  );
}
