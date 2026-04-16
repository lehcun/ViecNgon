import { FiCode, FiThumbsUp } from "react-icons/fi"; // Cài react-icons nếu chưa có

export default function PortfolioFeatures() {
  return (
    <section className="py-24 bg-primary-dark relative">
      {/* Vệt sáng bên trái */}
      <div className="absolute left-0 top-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-20">
          Lí do nào dân IT nên dùng Portfolio ViecNgon?
        </h2>

        <div className="flex flex-col gap-20">
          {/* Tính năng 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 flex justify-center md:justify-end">
              <div className="w-40 h-40 bg-linear-to-br from-primary to-primary-dark rounded-2xl rotate-12 flex items-center justify-center shadow-xl shadow-primary/20 border border-primary/50">
                <FiCode className="text-6xl text-white -rotate-12" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">
                Dành riêng cho dân IT
              </h3>
              <p className="text-slate-400">
                Tạo Portfolio tiếng Việt & tiếng Anh chỉ trong vài bước, mẫu
                thiết kế làm nổi bật Tech Stack, GitHub/GitLab link và các
                Project thực tế.
              </p>
            </div>
          </div>

          {/* Tính năng 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="flex-1 flex justify-center md:justify-start">
              <div className="w-40 h-40 bg-linear-to-br from-emerald-500 to-emerald-900 rounded-2xl -rotate-12 flex items-center justify-center shadow-xl shadow-emerald-500/20 border border-emerald-500/50">
                <FiThumbsUp className="text-6xl text-white rotate-12" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-right">
              <h3 className="text-2xl font-bold text-white mb-4">
                Thiết kế đúng gu nhà tuyển dụng
              </h3>
              <p className="text-slate-400">
                Giao diện được thiết kế dựa trên phỏng vấn chuyên sâu với các
                Tech Lead & HR Manager, đảm bảo bố cục quét nhanh, chuẩn ATS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
