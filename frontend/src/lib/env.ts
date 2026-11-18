const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL?.trim();

if (!RAW_API_URL && process.env.NODE_ENV === "production") {
  console.warn(
    "[ViecNgon] NEXT_PUBLIC_API_URL chưa được cấu hình cho môi trường production.",
  );
}

export const API_BASE_URL = (RAW_API_URL || "http://localhost:3001").replace(
  /\/+$/,
  "",
);
