const STEPS = [
  {
    num: "01",
    title: "Tạo tài khoản",
    desc: "Đăng nhập vào hệ thống ViecNgon bằng Email, Google hoặc GitHub.",
  },
  {
    num: "02",
    title: "Hoàn thành 70% hồ sơ",
    desc: "Điền thông tin cá nhân, kỹ năng, kinh nghiệm. Hệ thống tự động tạo khung CV.",
  },
  {
    num: "03",
    title: "Tùy chỉnh giao diện",
    desc: "Chọn mẫu phù hợp với phong cách của bạn (Minimalist, Tech-focused...).",
  },
  {
    num: "04",
    title: "Tải & Ứng tuyển",
    desc: "Xuất file PDF chất lượng cao hoặc dùng trực tiếp link Portfolio để gửi nhà tuyển dụng.",
  },
];

export default function PortfolioSteps() {
  return (
    <section className="py-20 bg-primary-dark border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          Tạo Portfolio hoàn chỉnh với 4 bước
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, index) => (
            <div
              key={index}
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 hover:border-primary/50 transition-colors relative overflow-hidden group"
            >
              {/* Số mờ ở background */}
              <div className="absolute -top-6 -right-4 text-8xl font-black text-slate-800/50 group-hover:text-primary/10 transition-colors pointer-events-none">
                {step.num}
              </div>

              <div className="relative z-10">
                <div className="text-primary font-bold text-xl mb-4">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <button className="px-8 py-3.5 bg-primary text-white font-bold rounded-md hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all">
            Bắt đầu tạo Portfolio
          </button>
        </div>
      </div>
    </section>
  );
}
