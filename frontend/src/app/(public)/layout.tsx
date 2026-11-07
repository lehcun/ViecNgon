import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen flex flex-col justify-between bg-slate-50">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
    </div >
  );
}
