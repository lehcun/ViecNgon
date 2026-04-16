import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

export default function LoginBanner() {
  return (
    <div className="h-full w-full p-12 md:p-16 flex flex-col justify-center relative overflow-hidden bg-linear-to-br from-primary-dark via-primary to-primary-dark">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(#ffffff 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="absolute top-1/2 right-0 md:-right-10 -translate-y-1/2 opacity-10 text-white animate-pulse pointer-events-none">
        <FiChevronRight size={350} strokeWidth={0.5} />
        <FiChevronRight size={350} strokeWidth={0.5} className="-mt-48" />
        <FiChevronRight size={350} strokeWidth={0.5} className="-mt-48" />
      </div>

      <div className="relative z-10 text-center md:text-left">
        <div className="mb-10 inline-block">
          <Link href="/">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              ViecNgon
            </span>
          </Link>
        </div>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6">
          Tiếp lợi thế <br /> Nối thành công
        </h2>
        <p className="text-lg md:text-xl text-blue-100 max-w-lg mx-auto md:mx-0 font-light">
          Nền tảng kết nối việc làm IT thông minh, ứng dụng kiến trúc
          Microservices hiện đại hàng đầu Việt Nam.
        </p>
      </div>
    </div>
  );
}
