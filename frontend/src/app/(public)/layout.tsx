import Footer from "@/components/layout/Footer";
import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <div className="min-h-screen flex flex-col justify-between bg-surface-page overflow-x-hidden">
        <Navbar />
        <main className="flex-1 flex flex-col min-w-0 w-full">{children}</main>
        <Footer />
    </div >
  );
}
