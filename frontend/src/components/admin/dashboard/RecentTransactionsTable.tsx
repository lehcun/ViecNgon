"use client";

import React from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, ArrowRight, ReceiptText } from "lucide-react";
import { useAdminRecentTransactions } from "@/hooks/admin/useAdminDashboard";

function formatShortDate(dateVal: string | Date): string {
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "Recent";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentTransactionsTable() {
  const { data, isLoading, isError, refetch } = useAdminRecentTransactions();

  // 1. Skeleton Loading State
  if (isLoading && !data) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs animate-pulse space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-52 bg-slate-200 rounded" />
          <div className="h-4 w-32 bg-slate-100 rounded" />
        </div>
        <div className="h-3.5 w-64 bg-slate-100 rounded" />
        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-12 w-full bg-slate-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-6 shadow-2xs flex flex-col items-center justify-center min-h-72 text-center gap-3">
        <AlertCircle size={26} className="text-rose-500" />
        <p className="text-sm font-semibold text-slate-800">
          Không thể tải lịch sử giao dịch gần đây
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
        >
          <RefreshCw size={14} />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }

  const transactions = data || [];

  return (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between h-full">
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 mb-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Recent Payment Transactions
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest service package payments across the platform.
                </p>
              </div>
              <Link
                href="/admin/packages"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0"
              >
                <span>View all transactions</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* Empty State */}
            {transactions.length === 0 ? (
              <div className="py-12 text-center border border-dashed border-slate-200 rounded-xl">
                <ReceiptText size={28} className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium text-slate-500">
                  Chưa có giao dịch mua gói dịch vụ nào.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="pb-3 pr-4">Transaction</th>
                      <th className="pb-3 px-4">Company</th>
                      <th className="pb-3 px-4">Package</th>
                      <th className="pb-3 px-4">Amount</th>
                      <th className="pb-3 pl-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {transactions.map((tx) => (
                      <tr
                        key={tx.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3.5 pr-4">
                          <div className="font-bold text-slate-800">
                            {tx.transactionCode}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {formatShortDate(tx.paidAt)}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-700">
                          {tx.companyName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {tx.packageName}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {tx.formattedAmount}
                        </td>
                        <td className="py-3.5 pl-4 text-right">
                          {tx.status === "PAID" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Paid
                            </span>
                          )}
                          {tx.status === "PENDING" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-semibold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                              Pending
                            </span>
                          )}
                          {tx.status === "FAILED" && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 font-semibold text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              Failed
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
            <div className="mt-auto pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>Showing the latest {transactions.length} transactions</span>
              <span>Currency: VNĐ</span>
            </div>
          </div>
          );
}

