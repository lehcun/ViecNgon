import { Metadata } from "next";
import "./globals.css";
import { Be_Vietnam_Pro, Geist } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ViecNgon - Tìm kiếm việc làm IT ngon",
  description:
    "Hệ thống kết nối ứng viên và nhà tuyển dụng công nghệ hàng đầu.",
};

// Cấu hình font Be Vietnam Pro
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"], // Bắt buộc phải có "vietnamese" để hiển thị dấu chuẩn
  weight: ["400", "500", "600", "700"], // Các độ đậm nhạt bạn muốn dùng
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={cn("font-sans", geist.variable)}>
      <body className={beVietnamPro.className}>
        <QueryProvider>
          <AuthProvider>
            <main>{children}</main>
            <Toaster position="top-right" reverseOrder={false} />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
