import Navbar from "@/components/Navbar";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Navbar />
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
