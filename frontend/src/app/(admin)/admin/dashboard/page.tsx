import React from "react";
import { Zap, ShieldCheck, Download, Calendar } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Overview
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, System Admin
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening across your recruitment platform today.
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200/90 rounded-lg text-xs font-medium text-slate-700 shadow-2xs self-start md:self-auto">
          <Calendar size={15} className="text-slate-400" />
          <span>Nov 1 – Nov 30, 2026</span>
        </div>
      </div>

      {/* 2. Quick Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
        >
          <Zap size={14} className="fill-white" />
          <span>Approve Pending Jobs (8)</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
        >
          <ShieldCheck size={14} className="text-slate-500" />
          <span>Verify Companies (5)</span>
        </button>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
        >
          <Download size={14} className="text-slate-500" />
          <span>Export Monthly Report</span>
        </button>
      </div>

      {/* 3. Phase 1 Foundation Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs text-center">
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold ring-8 ring-emerald-50/50">
            ✓
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            Phase 1: Nền móng & Bảo mật RBAC đã hoàn tất
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            Khung giao diện Quản trị viên (Sidebar, Header, Security Guard, Middleware) đã hoạt động sẵn sàng.
            Chúng ta sẽ tiếp tục kết nối các API số liệu thống kê ở Phase 2!
          </p>
        </div>
      </div>
    </div>
  );
}

