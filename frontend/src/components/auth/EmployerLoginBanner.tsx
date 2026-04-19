/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

export default function EmployerLoginBanner() {
  return (
    <div className="hidden md:flex w-full h-full bg-primary-dark relative overflow-hidden items-center justify-center">
      {/* Nền Đồ họa Lượn sóng (Sử dụng các vòng tròn đồng tâm mờ) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
        <div className="w-200 h-200 border border-white/40 rounded-full absolute"></div>
        <div className="w-150 h-150 border border-white/30 rounded-full absolute -ml-20"></div>
        <div className="w-100 h-100 border border-white/20 rounded-full absolute -ml-40"></div>
        <div className="w-50 h-50 border border-white/20 rounded-full absolute -ml-60"></div>
      </div>

      {/* Khối Đồ họa trung tâm */}
      <div className="relative z-10 w-full max-w-lg h-125 flex items-center justify-center">
        {/* Vòng tròn Đỏ tía tạo điểm nhấn nền (Thay bằng Xanh Gradient) */}
        <div className="absolute w-80 h-80 bg-linear-to-br from-primary to-[#0f2a5c] rounded-full shadow-2xl"></div>

        {/* Ảnh nhân vật HR - Thay link ảnh này bằng ảnh thật của bạn sau */}
        <img
          src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
          alt="HR Manager"
          className="absolute bottom-10 w-64 h-auto object-contain drop-shadow-2xl z-10 rounded-b-full mask-image-gradient"
          style={{
            maskImage: "linear-gradient(to top, transparent, black 20%)",
            WebkitMaskImage: "linear-gradient(to top, transparent, black 20%)",
          }}
        />

        {/* Các Popup nổi lơ lửng (Mô phỏng giống ảnh) */}

        {/* Popup: Java Developer */}
        <div className="absolute top-20 left-0 bg-white rounded-lg shadow-xl p-3 w-48 z-20 animate-[bounce_4s_infinite]">
          <div className="absolute -top-3 -right-2 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-md flex items-center gap-1">
            🔥 SUPER HOT
          </div>
          <div className="w-12 h-2 bg-slate-200 rounded mb-2"></div>
          <p className="font-bold text-slate-800 text-sm mb-2">
            Java Developer
          </p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold">
              $
            </div>
            <div className="flex-1 h-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>

        {/* Popup: PHP Developer */}
        <div className="absolute top-48 -left-10 bg-white rounded-lg shadow-xl p-3 w-44 z-20 animate-[bounce_5s_infinite_reverse]">
          <div className="absolute -top-3 right-4 bg-orange-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-md">
            HOT
          </div>
          <div className="w-10 h-2 bg-slate-200 rounded mb-2"></div>
          <p className="font-bold text-slate-800 text-sm">NextJS Developer</p>
        </div>

        {/* Popup: Applicants List */}
        <div className="absolute bottom-10 right-0 bg-white rounded-xl shadow-2xl p-4 w-56 z-20 transition-transform hover:scale-105">
          <h3 className="font-bold text-slate-800 text-sm mb-4">Applicants</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                  <Image
                    src={`https://i.pravatar.cc/100?img=${item + 10}`}
                    alt="avatar"
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <div className="w-full h-2.5 bg-slate-300 rounded mb-1"></div>
                  <div className="w-2/3 h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mũi tên cong vẽ bằng SVG */}
        <svg
          className="absolute top-24 right-12 w-24 h-32 z-10"
          viewBox="0 0 100 100"
          fill="none"
        >
          <path
            d="M10,10 C50,10 90,40 80,90"
            stroke="white"
            strokeWidth="2"
            strokeDasharray="5,5"
            fill="transparent"
          />
          <polygon points="75,85 85,85 80,95" fill="white" />
        </svg>
      </div>
    </div>
  );
}
