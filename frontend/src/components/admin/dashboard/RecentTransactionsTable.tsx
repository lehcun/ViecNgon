"use client";

import React from "react";
import { Receipt } from "lucide-react";
import { useAdminRecentTransactions } from "@/hooks/admin/useAdminDashboard";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  EmptyState,
  ErrorState,
  TableRowSkeleton,
} from "@/components/ui/StateViews";
import { formatDateTimeVN } from "@/lib/formatters";

export default function RecentTransactionsTable() {
  const {
    data: transactions = [],
    isLoading,
    isError,
    refetch,
  } = useAdminRecentTransactions();

  return (
    <div className="bg-surface-card rounded-xl border border-border-default p-6 shadow-xs h-full flex flex-col justify-between gap-4">
      <div>
        <h2 className="text-base font-bold text-text-primary">
          Giao dịch gần đây
        </h2>
        <p className="text-xs text-text-muted mt-0.5">
          Lịch sử thanh toán gói tuyển dụng & nâng cấp dịch vụ
        </p>
      </div>

      <div className="flex-1 overflow-x-auto">
        {isError ? (
          <ErrorState
            title="Không thể tải giao dịch gần đây"
            message="Vui lòng thử lại sau."
            onRetry={() => refetch()}
          />
        ) : !isLoading && transactions.length === 0 ? (
          <EmptyState
            icon={<Receipt size={24} />}
            title="Chưa có giao dịch nào"
            description="Lịch sử thanh toán từ nhà tuyển dụng sẽ hiển thị tại đây."
          />
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-default text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                <th className="py-3 pr-3">Mã giao dịch</th>
                <th className="py-3 px-3">Công ty</th>
                <th className="py-3 px-3">Gói dịch vụ</th>
                <th className="py-3 px-3 text-right">Số tiền</th>
                <th className="py-3 pl-3 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-default text-sm">
              {isLoading ? (
                <>
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                  <TableRowSkeleton cols={5} />
                </>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-surface-muted/70 transition-colors"
                  >
                    <td className="py-3.5 pr-3 whitespace-nowrap">
                      <span className="font-mono text-xs font-semibold text-text-primary">
                        {tx.transactionCode}
                      </span>
                      <div className="text-[11px] text-text-muted mt-0.5 tabular-nums">
                        {formatDateTimeVN(tx.paidAt)}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <CompanyLogo
                          src={tx.companyLogo}
                          name={tx.companyName}
                          size="sm"
                        />
                        <span className="font-medium text-text-primary truncate max-w-44">
                          {tx.companyName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-xs font-medium text-text-secondary">
                      {tx.packageName}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap text-right font-semibold text-text-primary tabular-nums">
                      {tx.formattedAmount}
                    </td>

                    <td className="py-3.5 pl-3 whitespace-nowrap text-right">
                      <StatusBadge status={tx.status} type="payment" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="pt-3 border-t border-border-default flex items-center justify-between text-xs text-text-muted">
        <span>Hiển thị {transactions.length} giao dịch gần nhất</span>
        <span>Đơn vị: VNĐ</span>
      </div>
    </div>
  );
}
