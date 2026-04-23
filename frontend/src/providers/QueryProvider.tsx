"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dùng useState để đảm bảo QueryClient chỉ được khởi tạo 1 lần duy nhất,
  // tránh bị render lại mất cache khi chuyển trang trong Next.js
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // Dữ liệu sẽ được coi là "tươi" trong 1 phút, không gọi lại API liên tục
            refetchOnWindowFocus: false, // Tắt tự động gọi lại API khi người dùng chuyển tab (tùy chọn)
            retry: 1, // Nếu API lỗi, chỉ gọi thử lại 1 lần
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} position="bottom" />
    </QueryClientProvider>
  );
}
