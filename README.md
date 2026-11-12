# 🚀 ViecNgon – Nền Tảng Tuyển Dụng IT Thông Minh

**ViecNgon** là nền tảng kết nối ứng viên và nhà tuyển dụng ngành Công nghệ Thông tin (IT), tích hợp trí tuệ nhân tạo **Google Gemini AI** nhằm tự động hóa quy trình bóc tách CV (CV Parsing) và chấm điểm tương thích công việc (AI Match Scoring).

Hệ thống được phát triển theo mô hình **Monorepo (npm workspaces)** với kiến trúc hiện đại, phân tách rõ ràng giữa Frontend, Backend và Shared Types.

---

## 🛠️ Tech Stack & Kiến Trúc

### 1. Cấu Trúc Monorepo
```
viecngon/
├── backend/            # REST API Service xây dựng bằng NestJS 11 + Prisma ORM 6
├── frontend/           # Web Application xây dựng bằng Next.js 16 (App Router)
├── shared/types/       # Gói dùng chung @viecngon/types (Type-safe giữa FE & BE)
├── .agents/skills/     # Bộ quy chuẩn kỹ thuật & Skills cho AI Assistant (Đã gitignore)
├── AGENTS.md           # Hướng dẫn & Quy tắc kỹ thuật tối thượng của dự án
└── package.json        # Workspace Root quản lý phụ thuộc và scripts điều hành
```

### 2. Chi Tiết Công Nghệ

| Thành phần | Công nghệ chính | Tính năng nổi bật |
| :--- | :--- | :--- |
| **Backend** | **NestJS 11**, Prisma ORM 6, TypeScript | SQL Server (MSSQL), JWT Cookie Auth, Transactions, Decorators |
| **Frontend** | **Next.js 16**, React 19, Turbopack | App Router, Tailwind CSS, TanStack React Query v5, Zustand, Lucide Icons |
| **AI Engine** | **Google Gemini API** (`@google/genai`) | `gemini-3.8-flash`, Structured Outputs (JSON Schema), Auto-fallback model |
| **Lưu Trữ & Media** | **Cloudinary** | Lưu trữ CV PDF bảo mật và hình ảnh thương hiệu |
| **Dịch Vụ Mở Rộng**| **Nodemailer**, **Google Calendar API** | Gửi email thông báo, tạo phòng họp Google Meet tự động |

---

## ✨ Tính Năng Nổi Bật

### 👨‍💻 Dành Cho Ứng Viên (Candidate)
- **Tải CV để AI tự động điền hồ sơ (AI CV Parsing):** Đọc file PDF (Word/Canva/TopCV) và dùng Gemini AI bóc tách chính xác thông tin liên hệ, kinh nghiệm, học vấn, kỹ năng vào hồ sơ trong vài giây.
- **Xem trước độ phù hợp AI (AI Match Preview):** Hiển thị điểm số Match Score (0–100%) kèm danh sách Điểm mạnh và Điểm còn thiếu đối chiếu trực tiếp với bài đăng tuyển dụng trước khi nộp đơn.
- **Hồ sơ trực tuyến linh hoạt (Hybrid CV):** Quản lý đồng thời CV mẫu trực tuyến và danh sách các file PDF đính kèm.

### 🏢 Dành Cho Nhà Tuyển Dụng (Employer / HR)
- **Sàng lọc hồ sơ bằng AI (AI Candidate Screening):** Tự động phân tích ứng viên theo 4 trọng số: Kỹ năng cốt lõi (40%), Kinh nghiệm (30%), Học vấn/Bằng cấp (15%), Lĩnh vực chuyên môn (15%).
- **Quản lý tuyển dụng toàn diện:** Đăng tin tuyển dụng, theo dõi trạng thái đơn ứng tuyển (Chờ duyệt, Phỏng vấn, Nhận việc, Từ chối).
- **Đặt lịch phỏng vấn thông minh:** Tích hợp Google Calendar tạo link Google Meet và gửi email mời phỏng vấn tự động đến ứng viên.

### ⚡ Trải Nghiệm Người Dùng (UX/UI)
- **Skeleton Loading toàn diện:** Luôn hiển thị khung xương tải trang (`animate-pulse`) tương xứng với bố cục thật khi đang chờ dữ liệu, loại bỏ hiện tượng giật layout (CLS).
- **Phản hồi tức thì:** Tích hợp `react-hot-toast` và tối ưu hóa bộ nhớ đệm với TanStack React Query.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Môi Trường
- **Node.js:** phiên bản `18.x` hoặc `20.x+`
- **npm:** phiên bản `9.x+` (hỗ trợ npm workspaces)
- **Cơ sở dữ liệu:** Microsoft SQL Server (Local MSSQL Express hoặc Azure SQL Database)

### 1. Clone Mã Nguồn & Cài Đặt Dependencies
```bash
git clone https://github.com/your-username/viecngon.git
cd viecngon

# Cài đặt toàn bộ packages cho cả root, backend, frontend và shared/types
npm install
```

### 2. Cấu Hình Biến Môi Trường (.env)

#### Backend (`backend/.env`):
Tạo file `backend/.env` với các khóa sau:
```env
PORT=8080
DATABASE_URL="sqlserver://localhost:1433;database=ViecNgonDb;user=sa;password=YourPassword;encrypt=true;trustServerCertificate=true"

# JWT Authentication
JWT_SECRET=your_jwt_super_secret_key
JWT_EXPIRES_IN=7d

# Google Gemini AI
GEMINI_API_KEY=your_google_gemini_api_key
GEMINI_MODEL=gemini-3.8-flash

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Mailer (Nodemailer)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_email_app_password
MAIL_FROM="ViecNgon <no-reply@viecngon.vn>"
```

#### Frontend (`frontend/.env` hoặc `.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### 3. Đồng Bộ Database (Prisma ORM)
```bash
cd backend
npx prisma generate
npx prisma db push

# (Tùy chọn) Mở giao diện Prisma Studio trực quan
npx prisma studio
cd ..
```

### 4. Khởi Chạy Dự Án (Development Mode)
Tại thư mục gốc dự án:
```bash
# Chạy đồng thời cả Frontend và Backend
npm run dev

# Hoặc chỉ chạy Backend NestJS (Port 8080)
npm run dev:backend

# Hoặc chỉ chạy Frontend Next.js Turbopack (Port 3000)
npm run dev:frontend
```

---

## 📋 Các Lệnh Kiểm Tra & Build

```bash
# Build kiểm tra Backend
npm run build --workspace=backend

# Build kiểm tra Frontend
npm run build --workspace=frontend

# Kiểm tra kiểu TypeScript Frontend
npx tsc --noEmit -p frontend/tsconfig.json
```

---

## 📌 Quy Ước Đóng Góp & Phát Triển (Dành Cho Developers & AI)

Mọi đóng góp và phát triển tính năng mới bắt buộc phải đọc và tuân thủ tài liệu:
- **[AGENTS.md](./AGENTS.md):** Bản quy ước kỹ thuật tối thượng của dự án (Quy tắc Type-only trong `shared/types`, tránh lỗi `TS1272`, chuẩn hóa ngày `@db.Date` SQL Server, quy chuẩn Commit).
- **Quy trình 4 Phase:** Hạ tầng -> Database Transaction -> Nghiệp vụ nâng cao -> Frontend UI & Skeleton Loading.
- **Chuẩn commit:** Tuân thủ [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `chore:`).

---

## 📄 Bản Quyền (License)
Dự án được phát triển và sở hữu bởi đội ngũ **ViecNgon**. Mọi quyền được bảo lưu.
