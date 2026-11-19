# Hướng dẫn Deploy Monorepo ViecNgon (Vercel + Docker + Cloudflare Tunnel + Custom Domain)

Tài liệu hướng dẫn từng bước triển khai **ViecNgon** theo **Phương án B**:

- **Frontend (Next.js 16):** Deploy trên **Vercel** với tên miền chính `https://<domain>` (VD: `https://viecngo.id.vn`).
- **Backend (NestJS 11 + Prisma):** Chạy **Docker Compose** tại máy cá nhân (hoặc dời lên VPS sau này) qua cổng `3001`.
- **Kết nối Internet bảo mật:** **Cloudflare Tunnel** (`cloudflared`) ánh xạ cố định `https://api.<domain>` $\rightarrow$ `http://backend:3001` (không cần mở port router, không cần IP tĩnh).

---

## Phần 1: Chuẩn bị Tên miền & Cloudflare DNS + Tunnel

1. **Mua tên miền** (gợi ý `.id.vn` tại Tenten / iNET / Pavietnam... chi phí thấp hoặc miễn phí năm đầu theo chương trình tên miền quốc gia).
2. **Đưa tên miền về Cloudflare (Miễn phí):**
   - Đăng nhập [Cloudflare Dashboard](https://dash.cloudflare.com) $\rightarrow$ **Add a site** $\rightarrow$ nhập `<domain>` $\rightarrow$ chọn gói **Free**.
   - Cloudflare sẽ cung cấp 2 **Nameserver** (dạng `*.ns.cloudflare.com`).
   - Quay lại trang quản trị nhà cung cấp nơi bạn mua tên miền $\rightarrow$ đổi Nameserver sang 2 giá trị của Cloudflare (chờ 5–30 phút để kích hoạt).
3. **Tạo Cloudflare Tunnel cố định cho Backend:**
   - Tại Cloudflare Dashboard, chọn **Zero Trust** (menu bên trái) $\rightarrow$ **Networks** $\rightarrow$ **Tunnels** $\rightarrow$ **Create a tunnel**.
   - Chọn connector loại **Cloudflared** $\rightarrow$ đặt tên (VD: `viecngon-backend`).
   - Sao chép giá trị `--token ...` (**Tunnel Token**, bắt đầu bằng `eyJ...`).
   - Chuyển sang tab **Public Hostname** $\rightarrow$ **Add a public hostname**:
     - **Subdomain:** `api`
     - **Domain:** `<domain>` (tạo thành `api.<domain>`)
     - **Service Type:** `HTTP`
     - **URL:** `backend:3001`
   - Bấm **Save hostname**.

---

## Phần 2: Cấu hình Backend Docker trên Máy (hoặc VPS)

### Trường hợp A: Dùng SQL Server đang chạy sẵn trên Windows

1. Mở **SQL Server Configuration Manager** $\rightarrow$ **SQL Server Network Configuration** $\rightarrow$ **Protocols for ...** $\rightarrow$ bật **TCP/IP = Enabled** $\rightarrow$ mở **IP Addresses** $\rightarrow$ mục **IPAll**, đặt `TCP Port = 1433` và restart service SQL Server.
2. Tại thư mục gốc dự án, tạo file `.env` (copy từ `.env.example`):
   ```env
   CLOUDFLARE_TUNNEL_TOKEN=<dán_token_của_bạn>
   ```
3. Tạo file `backend/.env.docker` (copy từ `backend/.env.example`), trỏ `DATABASE_URL` về `host.docker.internal:1433`:
   ```env
   DATABASE_URL="sqlserver://host.docker.internal:1433;database=viecngon;user=sa;password=<mat_khau_sa>;encrypt=true;trustServerCertificate=true"
   PRISMA_DB_PUSH=false
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=<tao_chuoi_bi_mat_64_ky_tu>
   FRONTEND_URL=https://<domain>
   CORS_ORIGINS=https://<domain>,https://www.<domain>
   COOKIE_SAME_SITE=lax
   COOKIE_DOMAIN=.<domain>
   ```
   \_(Bổ sung đầy đủ các khóa `GOOGLE\__`, `GEMINI*API_KEY`, `CLOUDINARY*_`, `MAIL\__`từ`backend/.env` hiện có của bạn.)\*
4. Khởi chạy Docker Backend + Cloudflare Tunnel:
   ```bash
   docker compose up -d --build
   ```

### Trường hợp B: Chạy kèm SQL Server trong Docker (máy mới / dời lên VPS Linux)

1. Điền thêm `MSSQL_SA_PASSWORD` vào file `.env` ở thư mục gốc.
2. Trong `backend/.env.docker`, đổi host trong `DATABASE_URL` từ `host.docker.internal` thành `sqlserver` và bật `PRISMA_DB_PUSH=true` ở lần khởi tạo DB đầu tiên (sau đó đặt lại `false`).
3. Khởi chạy đầy đủ cả DB:
   ```bash
   docker compose --profile with-db up -d --build
   ```

### Kiểm tra Backend & Tunnel hoạt động

- Local: mở `http://localhost:3001/health` $\rightarrow$ phải trả về `{"status":"ok","database":"up",...}`.
- Internet: mở `https://api.<domain>/health` $\rightarrow$ phải trả về cùng JSON trên với HTTPS hợp lệ.

---

## Phần 3: Deploy Frontend lên Vercel & Gắn Tên miền

1. Vào [Vercel Dashboard](https://vercel.com/new) $\rightarrow$ **Import Git Repository** chọn repo `viecngon` (nhánh `main`).
2. Cấu hình **Build & Development Settings**:
   - **Root Directory:** `frontend`
   - Vào **Settings $\rightarrow$ General $\rightarrow$ Root Directory**: bật tùy chọn **"Include files outside the root directory in the Build Step"** (bắt buộc để Vercel đọc được `shared/types/`).
   - **Build Command:** `npm run build` (hoặc giữ mặc định Next.js; chạy ở thư mục `frontend` vẫn nhận workspace).
3. Khai báo **Environment Variables** trước khi Deploy (hoặc Redeploy sau khi sửa):
   - `NEXT_PUBLIC_API_URL` = `https://api.<domain>`
   - `NEXT_PUBLIC_SITE_URL` = `https://<domain>`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = `<Google Client ID của bạn>`
4. Gắn **Custom Domain** cho Vercel:
   - Vào **Project Settings $\rightarrow$ Domains** $\rightarrow$ thêm `<domain>` (và `www.<domain>`).
   - Vercel sẽ hiển thị bản ghi DNS cần trỏ (thường là `A` trỏ tới `76.76.21.21` cho `<domain>`, và `CNAME` `cname.vercel-dns.com` cho `www`).
   - Quay lại **Cloudflare Dashboard $\rightarrow$ DNS $\rightarrow$ Records**, thêm các bản ghi theo đúng hướng dẫn của Vercel (**lưu ý: tắt Proxy đám mây xám `DNS only`** cho bản ghi trỏ về Vercel để tránh lỗi SSL redirect loop, hoặc cấu hình SSL mode **Full (Strict)**).

---

## Phần 4: Cập nhật Google OAuth Console

Nếu dùng tính năng **Đăng nhập bằng Google**:

1. Vào [Google Cloud Console](https://console.cloud.google.com/apis/credentials) $\rightarrow$ mở OAuth 2.0 Client ID đang dùng.
2. Trong mục **Authorized JavaScript origins**, thêm:
   - `https://<domain>`
   - `https://www.<domain>`
3. Nhấn **Save** (chờ ~5 phút để Google cập nhật).

---

## Phần 5: Vận hành Hàng ngày & Nâng cấp lên VPS sau này

- **Bật / tắt mỗi ngày trên máy cá nhân:**
  ```bash
  docker compose up -d          # Khởi động Backend + Tunnel
  docker compose logs -f backend # Xem log API trực tiếp
  docker compose down           # Tắt khi không dùng
  ```
- **Kiểm tra trạng thái:** `docker compose ps` (cột Status của `viecngon-backend` phải là `healthy`).
- **Dời 100% lên VPS 4GB RAM sau này (chạy 24/7):**
  1. Cài Docker + Docker Compose trên VPS.
  2. Sao lưu dữ liệu SQL Server từ máy (`.bak` hoặc script seed) và khôi phục vào volume `viecngon_mssql_data`.
  3. Clone repo lên VPS, copy `.env` và `backend/.env.docker`, tắt container trên máy cá nhân rồi chạy trên VPS:
     ```bash
     docker compose --profile with-db up -d --build
     ```
  4. Nhờ dùng cùng `CLOUDFLARE_TUNNEL_TOKEN`, URL `https://api.<domain>` tự động trỏ sang VPS mới mà **không cần chỉnh sửa hay redeploy Vercel**.
