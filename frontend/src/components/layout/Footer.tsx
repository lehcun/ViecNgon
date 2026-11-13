import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import LogoViecNgon from "@/components/LogoViecNgon";

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Cột 1: Thương hiệu */}
          <div className="space-y-4">
            <LogoViecNgon logoTextColor="text-white" />
            <p className="text-sm text-slate-400 leading-relaxed">
              Nền tảng tuyển dụng IT thông minh kết nối kỹ sư công nghệ với các doanh nghiệp hàng đầu tại Việt Nam.
            </p>
          </div>

          {/* Cột 2: Dành cho Ứng viên */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Dành cho Ứng viên
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link href="/jobs" className="hover:text-white transition-colors">
                  Tìm việc làm IT
                </Link>
              </li>
              <li>
                <Link
                  href="/#top-companies"
                  className="hover:text-white transition-colors"
                >
                  Công ty công nghệ hàng đầu
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="hover:text-white transition-colors"
                >
                  Mẫu CV &amp; Portfolio IT
                </Link>
              </li>
              <li>
                <Link
                  href="/cv-profile"
                  className="hover:text-white transition-colors"
                >
                  Quản lý hồ sơ CV
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 3: Dành cho Nhà tuyển dụng */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Dành cho Nhà tuyển dụng
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <Link
                  href="/employer/login"
                  className="hover:text-white transition-colors"
                >
                  Đăng nhập Nhà tuyển dụng
                </Link>
              </li>
              <li>
                <Link
                  href="/post-job"
                  className="hover:text-white transition-colors"
                >
                  Đăng tin tuyển dụng IT
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-white transition-colors"
                >
                  Bảng giá gói dịch vụ
                </Link>
              </li>
              <li>
                <Link
                  href="/applications"
                  className="hover:text-white transition-colors"
                >
                  Sàng lọc ứng viên bằng AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Liên hệ & Hỗ trợ */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Liên hệ &amp; Hỗ trợ
            </h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-primary-disabled shrink-0 mt-0.5" />
                <span>Hà Nội · Đà Nẵng · TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-primary-disabled shrink-0" />
                <span>Hotline: 1900 1234</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-primary-disabled shrink-0" />
                <span>support@viecngon.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500">
          <p>© 2026 ViecNgon. Bảo lưu mọi quyền.</p>
          <p>Nền tảng Tuyển dụng IT thông minh tại Việt Nam</p>
        </div>
      </div>
    </footer>
  );
}
