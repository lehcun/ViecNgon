import React, { useState } from "react";
import {
  Building2,
  Clock,
  DollarSign,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  PlayCircle,
} from "lucide-react";
import { JobDetailResponse } from "@viecngon/types";
import { getRelativeTime } from "@/utils/formatTime";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

const JobDetailMain = ({ job }: { job?: JobDetailResponse }) => {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(false);
  if (job === undefined) return <h2>loading...</h2>;

  const handleApply = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      router.push(`/job-it/${job.slug}/job_applications`);
    }
  };

  return (
    <>
      {/* Card 1: Header Job */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-2">
          {job.title}
        </h1>
        <p className="text-lg text-slate-600 font-medium mb-3">
          {job.company.name}
        </p>

        <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 w-max px-3 py-1.5 rounded-lg mb-6">
          <DollarSign size={18} /> {job.salaryDisplay}
        </div>

        {/* Nút Ứng tuyển & Lưu */}
        <div className="flex items-center gap-4 mb-8">
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-lg shadow-md shadow-primary/20 transition-all active:scale-95 text-lg"
          >
            Ứng tuyển ngay
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className={`w-14 h-14 flex items-center justify-center border-2 rounded-lg transition-colors ${isSaved ? "border-rose-500 text-rose-500 bg-rose-50" : "border-slate-200 text-slate-400 hover:border-rose-300 hover:text-rose-400"}`}
          >
            <Heart size={24} fill={isSaved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Video/Image Grid Giả lập */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          <div className="relative rounded-lg overflow-hidden h-40 bg-slate-800 cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
              alt="Office"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <PlayCircle
              size={40}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 group-hover:text-white group-hover:scale-110 transition-all"
            />
          </div>
          <div className="relative rounded-lg overflow-hidden h-40 bg-slate-800 cursor-pointer group">
            <img
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop"
              alt="Team"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <PlayCircle
              size={40}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 group-hover:text-white group-hover:scale-110 transition-all"
            />
          </div>
        </div>

        {/* Job Meta Info */}
        <div className="space-y-3 text-sm text-slate-600 mb-6">
          <p className="flex items-start gap-2">
            <MapPin size={18} className="mt-0.5 text-slate-400 shrink-0" />
            <a href="#" className="hover:text-primary transition-colors">
              {job.location}
              <ExternalLink size={14} className="inline mb-1" />
            </a>
          </p>
          <p className="flex items-center gap-2">
            <Building2 size={18} className="text-slate-400" /> {job.workModel}
          </p>
          <p className="flex items-center gap-2">
            <Clock size={18} className="text-slate-400" />
            {getRelativeTime(job.postedAt)}
          </p>
        </div>

        <div className="h-px bg-slate-100 my-6"></div>

        {/* Tags */}
        <div className="grid grid-cols-[100px_1fr] gap-4 items-center mb-4">
          <span className="text-sm font-semibold text-slate-700">Kỹ năng:</span>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 border border-slate-200 rounded-full text-xs font-medium text-slate-600 hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
          <span className="text-sm font-semibold text-slate-700">
            Lĩnh vực:
          </span>
          <span className="text-sm font-medium text-slate-600">
            Nghiên cứu & Phát triển (R&D)
          </span>
        </div>
      </div>

      {/* Card 2: 3 Lý do gia nhập */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4">
          Lý do để gia nhập công ty
        </h2>
        {/* Render HTML từ Tiptap bằng dangerouslySetInnerHTML */}
        <div
          className="prose prose-slate prose-li:marker:text-rose-500 max-w-none text-slate-700"
          dangerouslySetInnerHTML={{ __html: job.benefits || "" }}
        />
      </div>

      {/* Card 3: Chi tiết công việc (Mô tả) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100">
          Chi tiết công việc
        </h2>

        <div className="prose prose-slate max-w-none prose-p:text-slate-600 prose-li:text-slate-600">
          <h3 className="text-lg font-bold text-slate-800 mb-3">
            Get to know the Role:
          </h3>
          <p className="mb-4">
            We are looking for an Engineering Manager to lead our Core Transport
            team. You will be responsible for building high-performance systems
            that handle millions of requests per minute...
          </p>

          <h3 className="text-lg font-bold text-slate-800 mb-3 mt-6">
            The day-to-day activities:
          </h3>
          <ul className="list-disc pl-5 space-y-2 mb-6">
            <li>
              Lead, mentor, and grow a team of talented software engineers.
            </li>
            <li>Design and implement scalable microservices using Golang.</li>
            <li>
              Collaborate with Product Managers to define technical roadmaps.
            </li>
          </ul>

          <h3 className="text-lg font-bold text-slate-800 mb-3 mt-6">
            Life at Grab:
          </h3>
          <p className="mb-4">
            We care about your well-being at Grab, here are some of the global
            benefits we offer:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              We have your back with <strong>Term Life Insurance</strong> and
              comprehensive <strong>Medical Insurance</strong>.
            </li>
            <li>
              With <strong>GrabFlex</strong>, create a benefits package that
              suits your needs.
            </li>
          </ul>
        </div>
      </div>

      {/* Việc làm tương tự */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            Việc làm tương tự dành cho bạn
          </h2>
        </div>

        {/* Alert Đăng ký nhận việc */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shadow-sm">
          <span className="text-sm font-medium text-slate-600">
            {isAuthenticated
              ? `Nhận các việc làm tương tự qua email ${user?.email}`
              : "Đăng nhập để nhận việc làm qua email"}
          </span>
          <button
            disabled={!isAuthenticated}
            onClick={() => {}}
            className="whitespace-nowrap px-4 py-2 border-2 border-rose-500 text-rose-500 hover:bg-rose-50 font-bold rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            <Mail size={16} /> Nhận thông báo
          </button>
        </div>

        {/* Lưới Việc làm tương tự (2 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Card 1 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg">
              🔥 SUPER HOT
            </div>
            <div className="flex items-center gap-3 mb-3 mt-1">
              <div className="w-12 h-12 border border-slate-100 rounded bg-slate-50 flex items-center justify-center p-1">
                <img
                  src="https://ui-avatars.com/api/?name=OTS&background=fff&color=2563eb"
                  alt="Logo"
                  className="rounded"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 line-clamp-2">
                  Technical Architect (Golang/NodeJS)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  ONE Tech Stop Vietnam
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                Golang
              </span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                System Architecture
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold border-t border-slate-100 pt-3">
              <DollarSign size={16} /> 2,000 - 4,000 USD
            </div>
          </div>

          {/* Job Card 2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-primary hover:shadow-md transition-all cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-bl-lg">
              HOT
            </div>
            <div className="flex items-center gap-3 mb-3 mt-1">
              <div className="w-12 h-12 border border-slate-100 rounded bg-slate-50 flex items-center justify-center p-1">
                <img
                  src="https://ui-avatars.com/api/?name=VNG&background=fff&color=f97316"
                  alt="Logo"
                  className="rounded"
                />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 line-clamp-2">
                  Engineering Manager (Payment)
                </h3>
                <p className="text-xs text-slate-500 mt-1">VNG Corporation</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                Team Management
              </span>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] rounded font-medium">
                Java
              </span>
            </div>
            <div className="flex items-center gap-1 text-emerald-600 text-sm font-bold border-t border-slate-100 pt-3">
              <DollarSign size={16} /> Thương lượng
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobDetailMain;
