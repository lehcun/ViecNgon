# 🚀 ViecNgon – Nền Tảng Tuyển Dụng IT

Nền tảng tuyển dụng IT thông minh tích hợp **Google Gemini AI** (bóc tách CV tự động & tính điểm tương thích công việc).

## 🛠️ Tech Stack

- **Backend:** NestJS 11, Prisma ORM 6, SQL Server, Cloudinary, Nodemailer.
- **Frontend:** Next.js 16 (App Router + Turbopack), Tailwind CSS, TanStack React Query v5, Zustand.
- **AI Engine:** Google Gemini API (`@google/genai` - `gemini-3.8-flash`).
- **Monorepo:** npm workspaces (`backend/`, `frontend/`, `shared/types/`).

---

## ⚡ Bắt Đầu Nhanh

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường (`.env`)
- **Backend (`backend/.env`):**
  ```env
  PORT=8080
  DATABASE_URL="sqlserver://localhost:1433;database=ViecNgonDb;user=sa;password=YourPassword;encrypt=true;trustServerCertificate=true"
  JWT_SECRET=your_jwt_secret
  GEMINI_API_KEY=your_gemini_api_key
  GEMINI_MODEL=gemini-3.8-flash
  CLOUDINARY_CLOUD_NAME=your_cloud_name
  CLOUDINARY_API_KEY=your_api_key
  CLOUDINARY_API_SECRET=your_api_secret
  ```
- **Frontend (`frontend/.env`):**
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8080
  ```

### 3. Đồng bộ Database
```bash
cd backend
npx prisma generate
npx prisma db push
cd ..
```

### 4. Chạy ứng dụng (Dev)
```bash
npm run dev              # Chạy cả Frontend (3000) và Backend (8080)
# hoặc chạy riêng:
npm run dev:backend      # Chỉ Backend
npm run dev:frontend     # Chỉ Frontend
```

---

## 📋 Lệnh Thường Dùng

```bash
npm run build --workspace=backend      # Build kiểm tra Backend
npm run build --workspace=frontend     # Build kiểm tra Frontend
npx tsc --noEmit -p frontend/tsconfig.json # Type-check Frontend
```

---

## 📖 Quy Ước Phát Triển
Chi tiết về quy chuẩn code, quy trình 4 Phase và hướng dẫn dành cho AI xem tại **[AGENTS.md](./AGENTS.md)**.
