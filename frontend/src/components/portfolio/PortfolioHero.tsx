import Link from "next/link";

export default function PortfolioHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-primary-dark flex flex-col items-center text-center px-6">
      {/* Hiệu ứng ánh sáng xanh tỏa ra ở giữa màn hình */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Xây dựng mẫu{" "}
          <span className="relative inline-block px-4 py-1 border-2 border-primary rounded-xl text-primary-light">
            Portfolio IT
            <span className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-primary bg-primary-dark"></span>
            <span className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-primary bg-primary-dark"></span>
          </span>{" "}
          từ ViecNgon <br /> chuẩn gu nhà tuyển dụng IT
        </h1>

        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
          90% hồ sơ bị bỏ qua sớm vì trình bày chưa đúng cách. Dùng ngay hệ
          thống tạo Portfolio được tinh chỉnh riêng cho dân IT để xuất hiện
          chuyên nghiệp nhất.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary text-white font-bold rounded-md hover:bg-primary-hover shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
          >
            Tạo Portfolio ngay
          </Link>
          <Link
            href="#templates"
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-slate-500 text-white font-bold rounded-md hover:border-primary hover:text-primary transition-all"
          >
            Xem mẫu Portfolio
          </Link>
        </div>
      </div>

      {/* Mô phỏng hình ảnh 3 mẫu CV xếp chồng lên nhau */}
      <div className="relative z-10 mt-20 flex justify-center items-end h-100 w-full max-w-5xl">
        <div className="absolute left-10 md:left-24 bottom-10 w-48 md:w-64 h-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl -rotate-12 opacity-80 overflow-hidden hidden sm:block">
          {/* Giả lập giao diện CV */}
          <div className="w-full h-full bg-linear-to-bbg-linear-to-b from-slate-700 to-slate-900 p-4">
            <div className="w-10 h-10 bg-slate-600 rounded-full mb-4"></div>
            <div className="w-3/4 h-3 bg-slate-600 rounded mb-2"></div>
            <div className="w-1/2 h-2 bg-slate-600 rounded mb-6"></div>
          </div>
        </div>

        <div className="absolute right-10 md:right-24 bottom-10 w-48 md:w-64 h-80 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl rotate-12 opacity-80 overflow-hidden hidden sm:block">
          <div className="w-full h-full bg-linear-to-b from-slate-700 to-slate-900 p-4"></div>
        </div>

        <div className="relative z-20 w-64 md:w-80 h-96 bg-white rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary overflow-hidden">
          {/* CV Chính giữa nổi bật */}
          <div className="w-full h-20 bg-primary/10 border-b border-slate-100 flex items-center px-4 gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
            <div>
              <div className="w-24 h-3 bg-slate-800 rounded mb-2"></div>
              <div className="w-16 h-2 bg-slate-400 rounded"></div>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="w-full h-2 bg-slate-200 rounded"></div>
            <div className="w-5/6 h-2 bg-slate-200 rounded"></div>
            <div className="w-full h-2 bg-slate-200 rounded mt-4"></div>
            <div className="w-4/5 h-2 bg-slate-200 rounded"></div>
          </div>
          {/* Huy hiệu gợi ý */}
          <div className="absolute top-4 -right-5 bg-emerald-500 text-white text-[10px] font-bold px-8 py-1 rotate-45 shadow-md">
            Khuyên dùng
          </div>
        </div>
      </div>
    </section>
  );
}
