import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Navbar />
      <body className="bg-slate-50 min-h-full flex flex-col">{children}</body>
      <Footer />
    </html>
  );
}
