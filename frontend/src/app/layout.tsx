import { Metadata } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import { Be_Vietnam_Pro, Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "ViecNgon - Tìm kiếm việc làm IT ngon",
  description:
    "Hệ thống kết nối ứng viên và nhà tuyển dụng công nghệ hàng đầu.",
};

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  return (
    <html lang="vi" className={cn("font-sans", geist.variable)}>
      <body className={beVietnamPro.className}>
        <QueryProvider>
          <AuthProvider>
            <GoogleOAuthProvider clientId={clientId}>
              <main>{children}</main>
              <Toaster position="top-right" reverseOrder={false} />
            </GoogleOAuthProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
