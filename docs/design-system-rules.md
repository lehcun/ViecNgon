# Design System Rule – ViecNgon

Tài liệu này quy định **nguyên tắc thiết kế giao diện (UI/UX Design System)** cho nền tảng tuyển dụng IT thông minh **ViecNgon** (Next.js 16 App Router + Tailwind CSS v4 + shadcn/ui + Lucide Icons). Mục đích là để mọi màn hình được thiết kế và lập trình **đồng nhất về màu sắc, kiểu chữ, khoảng cách, component, trạng thái tải (Skeleton) và cách hiển thị dữ liệu**, khắc phục triệt để tình trạng mỗi trang một kiểu.

> Phạm vi áp dụng: Toàn bộ các khu vực của hệ thống ViecNgon, bao gồm cả **Public Portal** (Trang chủ, Tìm việc IT, Chi tiết việc làm, Chi tiết công ty), **Ứng viên (`UNGVIEN`)**, **Nhà tuyển dụng (`NHATUYENDUNG`)** và **Quản trị viên (`ADMIN`)**.

---

## 1. Mục tiêu

- **Nhất quán tuyệt đối:** Các màn hình từ Public, Candidate Dashboard, Employer Portal đến Admin Dashboard sử dụng chung một ngôn ngữ thiết kế.
- **Token-first (Thiết kế gắn với Code):** Mọi giá trị màu sắc, typography, spacing, bo góc, đổ bóng đều ánh xạ trực tiếp từ CSS variables trong `frontend/src/app/globals.css` — không dùng giá trị tự do (magic numbers / hex tùy tiện).
- **Chuẩn hóa định dạng dữ liệu IT:** Mức lương, số năm kinh nghiệm, ngày tháng, điểm AI Match Score, trạng thái đơn ứng tuyển hiển thị đồng bộ ở mọi nơi.
- **Trải nghiệm mượt mà, không giật layout (Zero CLS):** Mọi trạng thái đang tải phải có Skeleton Loading tương xứng bố cục thật theo quy chuẩn `.agents/skills/ui-skeleton-loading/SKILL.md`.
- **Dễ review & mở rộng:** Có checklist rõ ràng trước khi chốt UI hoặc merge PR Frontend.

---

## 2. Nguyên tắc chung

1. **Không dùng giá trị tự do:** Mọi màu, cỡ chữ, khoảng cách, bo góc, đổ bóng đều lấy từ Design Tokens ở Mục 3.
2. **Tái sử dụng component:** Nếu component đã tồn tại trong `frontend/src/components/` (ví dụ `JobCard`, `AiMatchBadge`, `RichTextEditor`, `MetricCardGrid`), bắt buộc dùng lại, không tự viết bản sao.
3. **Một hành động chính trên mỗi màn hình/khối:** Mỗi màn hình hoặc card chỉ có **1 nút Primary** nổi bật nhất (ví dụ: `"Ứng tuyển ngay"`, `"Đăng tin tuyển dụng"`, `"Lưu thay đổi"`). Các hành động phụ dùng Secondary hoặc Ghost.
4. **Đủ 5 trạng thái giao diện:** Mọi màn hình/danh sách phải xử lý đầy đủ:
   - **Normal** (có dữ liệu)
   - **Loading** (Skeleton tương xứng bố cục thật, không trắng trang, không spinner toàn màn hình)
   - **Empty** (minh họa + giải thích ngắn + CTA rõ ràng)
   - **Error** (thông báo rõ nguyên nhân + nút `"Thử lại"`)
   - **Success** (toast phản hồi trực quan qua `react-hot-toast`)
5. **Ngôn ngữ giao diện là tiếng Việt có dấu**, câu ngắn gọn, đúng thuật ngữ chuyên ngành tuyển dụng IT (Mục 6.3).
6. **Không lạm dụng màu sắc lòe loẹt:** Nền trang luôn sáng sạch (`#F8FAFC`), card nền trắng (`#FFFFFF`) có viền mảnh tinh tế (`#E2E8F0`), nhường sự nổi bật cho màu thương hiệu Xanh Dương (`#2563EB`) và dữ liệu quan trọng.

---

## 3. Design Tokens

### 3.1. Màu sắc (Giữ nguyên bộ màu chủ đạo ViecNgon)

Bộ màu thương hiệu **ViecNgon (Cobalt Blue & Deep Slate)** — kế thừa trực tiếp từ `frontend/src/app/globals.css`:

| Token | CSS Variable / Tailwind | Giá trị | Dùng cho | Tương phản với chữ trắng |
| --- | --- | --- | --- | --- |
| `color-primary-600` | `--color-primary` / `bg-primary` | `#2563EB` | Nút chính (Default), link nhấn mạnh, tab đang chọn, icon thương hiệu | 5,17:1 (Đạt AA) |
| `color-primary-700` | `--color-primary-hover` | `#1D4ED8` | Nút chính khi Hover | 6,70:1 (Đạt AA) |
| `color-primary-800` | `--color-primary-active` | `#1E40AF` | Nút chính khi Active (nhấn giữ) | 8,72:1 (Đạt AAA) |
| `color-primary-disabled` | `--color-primary-disabled` | `#93C5FD` | Nút chính khi Disabled (kèm `opacity-60 cursor-not-allowed`) | Không yêu cầu |
| `color-primary-50` | `--color-primary-light` | `#EFF6FF` | Nền nhấn nhạt, mục sidebar đang chọn, tag kỹ năng nổi bật, khối AI Highlight | (chữ `#2563EB` trên nền này: 4,76:1) |
| `color-primary-dark` | `--color-primary-dark` | `#0F172A` | Chữ tiêu đề chính, Header tối (nếu dùng ở Hero/Banner), Sidebar Admin/Employer | 17,85:1 |

**Màu trạng thái (Semantic Colors):**

| Token | Giá trị | Nền nhạt (`-50`) | Dùng cho |
| --- | --- | --- | --- |
| `color-success-600` | `#16A34A` | `#DCFCE7` | Thành công, `"Đang tuyển"`, `"Phù hợp"`, AI Match ≥ 80%, thanh toán thành công |
| `color-warning-600` | `#D97706` (`#F59E0B` icon) | `#FEF3C7` | Cảnh báo, `"Chờ duyệt"`, `"Phỏng vấn"`, AI Match 50–79% |
| `color-danger-600` | `#DC2626` | `#FEE2E2` | Lỗi validate, `"Từ chối"`, `"Hết hạn"`, nút Xóa, AI Match < 50% |
| `color-info-600` | `#0284C7` | `#E0F2FE` | Trạng thái trung tính tích cực như `"Đã xem hồ sơ"`, thông tin hướng dẫn |

**Màu trung tính (Neutral Slate Scale):**

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `color-neutral-900` | `#0F172A` | Tiêu đề, chữ chính, con số metric |
| `color-neutral-700` | `#334155` | Nội dung bài viết, mô tả công việc (JD), label form |
| `color-neutral-500` | `#64748B` | Chữ phụ, metadata (ngày đăng, địa điểm, lượt xem) |
| `color-neutral-400` | `#94A3B8` | Placeholder, icon phụ, chữ bị vô hiệu |
| `color-neutral-200` | `#E2E8F0` | Viền card, viền ô nhập (`border-slate-200`), đường kẻ phân cách |
| `color-neutral-100` | `#F1F5F9` | Nền chip kỹ năng, nền skeleton, nền hover nhẹ của hàng bảng/menu |
| `color-neutral-50` | `#F8FAFC` | Nền trang tổng thể (App Background) |
| `color-white` | `#FFFFFF` | Nền card, modal, form, topbar, sidebar sáng |

**Trạng thái nút chính (Primary Button):**

| Trạng thái | Khi nào xảy ra | Giá trị |
| --- | --- | --- |
| Default | Bình thường, chưa tương tác | `#2563EB` (`bg-primary`) |
| Hover | Di chuột vào nút | `#1D4ED8` (`hover:bg-primary-hover`) |
| Active | Đang nhấn giữ chuột | `#1E40AF` (`active:bg-blue-800`) |
| Focus | Điều hướng bằng phím Tab | `ring-2 ring-blue-600 ring-offset-2` |
| Disabled | Nút bị vô hiệu hóa / đang submit | `#93C5FD` (`opacity-60 cursor-not-allowed`) |

**Quy tắc dùng màu:**
- Không tự ý đưa thêm màu neon (tím rực, hồng cánh sen, cam chói) vào giao diện chính ngoài hệ thống token trên.
- Không dùng màu làm cách **duy nhất** để truyền đạt trạng thái: Badge trạng thái luôn kèm nhãn chữ (và icon nếu cần).
- Màu chữ trên nền luôn đạt độ tương phản tối thiểu **4.5:1** (chuẩn WCAG AA).
- Mức lương trên thẻ việc làm dùng màu `color-success-600` (`#16A34A`) hoặc `color-primary-600` (`#2563EB`) in đậm; **tuyệt đối không dùng màu đỏ** cho lương.
- Không đặt nút Danger nền đỏ đặc cạnh nút Primary nền xanh đặc ở trong card/danh sách; nút Xóa trong danh sách dùng chữ đỏ + icon thùng rác trên nền trong suốt hoặc `bg-red-50`.

---

### 3.2. Typography

- Font chính: **Be Vietnam Pro** (tối ưu dấu tiếng Việt, đã cấu hình trong `frontend/src/app/layout.tsx`). Font dự phòng: `Geist, system-ui, -apple-system, sans-serif`.
- Dữ liệu số lượng, lương, bảng thống kê, mã giao dịch dùng `tabular-nums` để các cột số thẳng hàng.

| Token | Cỡ / Line-height | Độ đậm | Class Tailwind gợi ý | Dùng cho |
| --- | --- | --- | --- | --- |
| `text-h1` | `30px–32px / 40px` | `700` (Bold) | `text-3xl font-bold tracking-tight` | Tiêu đề trang, Hero Headline |
| `text-h2` | `24px / 32px` | `600` (Semibold) | `text-2xl font-semibold tracking-tight` | Tiêu đề khu vực (Section Header) |
| `text-h3` | `18px–20px / 28px` | `600` (Semibold) | `text-lg font-semibold` | Tiêu đề Card, Tiêu đề Modal, Tên Job chi tiết |
| `text-body-lg` | `16px / 24px` | `400–500` | `text-base` | Nội dung JD, mô tả chính, giá trị trong form |
| `text-body` | `14px / 20px` | `400` (Regular) | `text-sm` | Nội dung bảng, mô tả card, menu điều hướng |
| `text-label` | `14px / 20px` | `500` (Medium) | `text-sm font-medium` | Label của ô nhập, tiêu đề cột bảng |
| `text-caption` | `12px / 16px` | `400–500` | `text-xs` | Thời gian đăng, badge nhỏ, ghi chú lỗi |

- Không viết HOA toàn bộ câu tiêu đề dài; chỉ dùng `uppercase` cho nhãn nhóm ngắn ở Sidebar hoặc Overline nhỏ (`text-[11px] tracking-wider`).

---

### 3.3. Khoảng cách (Spacing)

Sử dụng hệ lưới **4px** chuẩn Tailwind (`1 unit = 4px`). Các khoảng cách chuẩn được phép dùng: `4 (1)`, `8 (2)`, `12 (3)`, `16 (4)`, `20 (5)`, `24 (6)`, `32 (8)`, `40 (10)`, `48 (12)`, `64 (16)`.

- Khoảng cách giữa `label` và ô nhập: `6px–8px` (`mb-1.5` hoặc `gap-2`).
- Khoảng cách giữa các trường trong cùng nhóm form: `16px` (`space-y-4`).
- Khoảng cách giữa các nhóm/phần khác nhau trong form: `24px` (`space-y-6`).
- Padding bên trong Card nhỏ/vừa: `16px–20px` (`p-4` hoặc `p-5`).
- Padding bên trong Khối nội dung lớn / Modal: `24px` (`p-6`).
- Khoảng cách giữa các Card trong lưới: `16px` (dense list) hoặc `24px` (`gap-4` / `gap-6`).

---

### 3.4. Bo góc và Đổ bóng

| Token | Giá trị | Tailwind | Dùng cho |
| --- | --- | --- | --- |
| `radius-sm` | `6px` | `rounded-md` | Tag kỹ năng, checkbox, badge nhỏ |
| `radius-md` | `8px` | `rounded-lg` | Nút bấm tiêu chuẩn, ô nhập liệu, dropdown item, alert |
| `radius-lg` | `12px` | `rounded-xl` | Card việc làm, Card công ty, khối nội dung Dashboard |
| `radius-xl` | `16px` | `rounded-2xl` | Modal, Banner lớn, Card nổi bật |
| `radius-full` | `9999px` | `rounded-full` | Chip lọc, avatar, pill badge trạng thái, nút CTA đặc biệt |
| `shadow-none` | `none` + viền `1px solid #E2E8F0` | `border border-slate-200` | Card mặc định trên nền xám nhạt (ưu tiên viền mảnh thay vì bóng nặng) |
| `shadow-sm` | `0 1px 2px rgba(15, 23, 42, 0.05)` | `shadow-sm` | Card tương tác nhẹ, nút nổi |
| `shadow-md` | `0 4px 12px rgba(15, 23, 42, 0.08)` | `shadow-md` | Card khi hover (`hover:shadow-md hover:border-blue-300`), Dropdown menu |
| `shadow-lg` | `0 16px 40px rgba(15, 23, 42, 0.14)` | `shadow-lg` | Modal, Drawer, Popover |

> **Quy tắc tách khối:** ViecNgon ưu tiên **nền trắng (`#FFFFFF`) + viền mảnh `border-slate-200` (`#E2E8F0`)** trên nền trang `#F8FAFC`. Chỉ thêm `shadow-md` khi hover vào thẻ có thể click. Không lạm dụng đổ bóng đậm gây nặng giao diện.

---

### 3.5. Lưới và Breakpoint (Responsive Web)

- Khung thiết kế chuẩn: **Desktop 1440px**, container nội dung tối đa **`1280px` (`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`)**, lưới **12 cột**, gutter `24px` (`gap-6`).
- Breakpoints (theo Tailwind CSS):
  - Mobile: `< 640px` (1 cột)
  - Tablet: `640px – 1023px` (`sm` / `md`, 2 cột)
  - Laptop: `1024px – 1279px` (`lg`, 2–3 cột hoặc bố cục 2 cột chính-phụ)
  - Desktop: `≥ 1280px` (`xl`, 3 cột hoặc Master-Detail split view)
- Mọi layout phải co giãn linh hoạt (`w-full`, `min-w-0` trong flex/grid để tránh tràn ngang do chuỗi dài như email, slug, link Meet).

---

## 4. Layout (Bố cục theo khu vực)

### 4.1. Khu vực Public & Ứng viên (Không thuộc Dashboard)

- **Header (`Navbar`):** Cao `64px–72px` (`h-16` hoặc `h-[72px]`), nền trắng (`bg-white/95 backdrop-blur border-b border-slate-200`), dính trên cùng (`sticky top-0 z-40`).
  - **Trái:** Logo ViecNgon + Menu điều hướng tối đa 4–5 mục: `Việc làm IT`, `Công ty IT`, `Mẫu CV / Portfolio` (ngắn gọn, không nhồi nhét).
  - **Phải:** Chuông thông báo (khi đã đăng nhập, có chấm đỏ số lượng chưa đọc) + Nút chuyển nhanh cho Nhà tuyển dụng (`"Nhà tuyển dụng"` / `"Đăng tin"`) + Khung tài khoản (Avatar + Tên + Dropdown Menu `260px` gồm: Tổng quan, Hồ sơ CV, Việc làm đã ứng tuyển, Cài đặt, Đăng xuất).
- **Trang chủ (`/`):**
  - Hero Search Banner gọn gàng: Tiêu đề rõ giá trị (`text-h1`), thanh tìm kiếm hợp nhất (Từ khóa kỹ năng/chức danh + Thành phố + Nút `"Tìm kiếm"` Primary `#2563EB`), bên dưới là 4–6 Quick Skill Tags (`ReactJS`, `Java`, `Node.js`, `Python`, `AWS`, `Tester`).
  - Khối **Công ty công nghệ hàng đầu (`TopCompany`)**: Lưới 3–4 cột card công ty gọn gàng, logo chuẩn khung vuông `56×56px` nền trắng có viền mảnh `border-slate-200`, hiển thị tên công ty, mô hình (`Product`/`Outsource`), thành phố và số việc đang tuyển.
  - Khối **Việc làm IT nổi bật**: Lưới 2–3 cột `JobCard` đồng bộ chiều cao (`h-full flex flex-col justify-between`).
- **Trang Tìm việc IT (`/jobs` & `/job-it`):**
  - Thanh tìm kiếm + bộ lọc chip ngang (Cấp bậc, Hình thức làm việc, Thành phố, Mức lương).
  - Hỗ trợ bố cục **Master-Detail** trên Desktop (danh sách Job Card bên trái ~40%, khung xem nhanh chi tiết `JobDetailPreviewPane` dính bên phải ~60%) hoặc lưới 2 cột + Filter Sidebar.
- **Trang Chi tiết Công việc (`/job-it/[slug]`):**
  - Bố cục 2 cột (tỉ lệ `8/4` trên lưới 12 cột): Cột trái hiển thị Header Job (Tên vị trí, Công ty, Mức lương, Địa điểm, Hình thức, Nút `"Ứng tuyển ngay"` Primary) + Nội dung Rich Text HTML (`prose prose-slate max-w-none` cho `moTa`, `yeuCauCongViec`, `phucLoi`); Cột phải cố định (`sticky top-24`) hiển thị `CompanyInfoAside` (Thông tin chung công ty, chi nhánh, nút `"Theo dõi"`).
- **Footer:** Nền `slate-900` (`#0F172A`) hoặc nền trắng có viền trên `border-slate-200`; 4 cột (Giới thiệu ViecNgon, Dành cho Ứng viên, Dành cho Nhà tuyển dụng, Liên hệ & Hỗ trợ) + dòng bản quyền ở đáy.

### 4.2. Khu vực Dashboard Ứng viên (`(candidate)/(dashboard_layout)`)

- Bố cục **Sidebar trái (`260px`) + Vùng nội dung chính**:
  - Sidebar nền trắng, viền phải `border-slate-200`. Mục đang active dùng nền `bg-blue-50` (`#EFF6FF`), chữ và icon `text-blue-600` (`#2563EB`), bo góc `rounded-lg`, font `font-medium`.
  - Mobile/Tablet `< 1024px`: Sidebar thu gọn thành Drawer trượt từ trái.
- **Trang Hồ sơ Hybrid CV (`/cv-profile`, `/cv/personalCV`):**
  - Chia các section rõ ràng: Thông tin cá nhân, Giới thiệu bản thân, Kỹ năng chuyên môn, Kinh nghiệm làm việc, Học vấn, Chứng chỉ, Ngoại ngữ, Dự án Portfolio, File CV PDF đính kèm.
  - Nút **"Nhập CV bằng AI (PDF)"** đặt nổi bật ở đầu trang Hồ sơ (`bg-blue-50 border border-blue-200 text-blue-700`) mở `AiCvUploadModal`.

### 4.3. Khu vực Nhà tuyển dụng (`(employer)`) & Quản trị viên (`(admin)`)

- **Sidebar trái (`240px–256px`):** Nền trắng (hoặc Slate tối `#0F172A` cho Admin nếu phân biệt vai trò), cố định bên trái trên Desktop. Mục menu phân nhóm rõ ràng:
  - Employer: `Tổng quan`, `Quản lý tin tuyển dụng`, `Đăng tin mới`, `Hồ sơ ứng viên`, `Hồ sơ công ty`, `Chiến dịch & Gói dịch vụ`.
  - Admin: `Tổng quan hệ thống`, `Quản lý người dùng`, `Kiểm duyệt việc làm`, `Gói dịch vụ & Doanh thu`.
- **Topbar (`64px`):** Tên trang / Breadcrumb bên trái; Chuông thông báo + Avatar & Menu tài khoản bên phải.
- **Vùng nội dung chính:** Nền `#F8FAFC`, padding `24px` (`p-6`). Thứ tự chuẩn từ trên xuống:
  1. Page Header (`text-h1`/`text-h2` + mô tả ngắn 1 dòng + nút CTA Primary bên phải).
  2. Hàng thẻ chỉ số `MetricCardGrid` (tối đa 4 card trên 1 hàng Desktop `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4`).
  3. Thanh công cụ lọc/tìm kiếm.
  4. Bảng dữ liệu hoặc danh sách Card.
- **Màn Chi tiết Đơn ứng tuyển của HR (`/applications/[...id]`):**
  - Bố cục 2 cột: Cột trái hiển thị thông tin ứng viên, CV PDF viewer / Hybrid CV, Cover Letter; Cột phải hiển thị **Thẻ AI Candidate Screening (`AiCandidateScreeningCard`)** (Điểm Match Score, Breakdown 4 tiêu chí, Điểm mạnh / Điểm cần lưu ý, nút `"Quét lại"`), kèm cụm nút hành động đổi trạng thái & `"Đặt lịch phỏng vấn Google Meet"` / `"Gửi Email"`.

---

## 5. Components (Quy chuẩn từng thành phần)

### 5.1. Button

| Biến thể | Style chuẩn | Dùng khi |
| --- | --- | --- |
| **Primary** | Nền `#2563EB`, chữ trắng, hover `#1D4ED8` | Hành động chính duy nhất trên màn hình (`"Ứng tuyển ngay"`, `"Đăng tin"`, `"Lưu thay đổi"`) |
| **Secondary (Outline)** | Nền trắng, viền `border-slate-200`, chữ `#0F172A`, hover `bg-slate-50` | Hành động phụ (`"Hủy"`, `"Quay lại"`, `"Xem chi tiết"`) |
| **Soft Primary** | Nền `#EFF6FF`, chữ `#2563EB`, viền `border-blue-200` | Hành động AI / nổi bật cấp 2 (`"Quét lại AI"`, `"Nhập CV bằng AI"`) |
| **Ghost** | Nền trong suốt, chữ `#334155`, hover `bg-slate-100` | Nút hành động nhẹ trong bảng, icon đóng/mở |
| **Danger (Outline / Ghost)** | Nền trắng hoặc `#FEF2F2`, chữ `#DC2626`, viền `border-red-200` | Xác nhận xóa hoặc nút Xóa trong danh sách |

- **Kích thước chuẩn:**
  - `lg`: cao `44px–48px` (`h-11` / `h-12`), `px-6`, dùng cho Hero / Form CTA lớn.
  - `md` (mặc định): cao `40px` (`h-10`), `px-4`, dùng trong hầu hết form và thanh công cụ.
  - `sm`: cao `32px–36px` (`h-8` / `h-9`), `px-3`, dùng trong bảng dữ liệu, header card.
- **Bo góc:** `rounded-lg` (`8px`) cho nút hành động tiêu chuẩn; `rounded-full` cho chip lọc và nút pill trên banner.
- **Loading state:** Khi đang gọi API mutation, disable nút và hiển thị icon `Loader2` (`animate-spin`) bên trái nhãn (ví dụ: `"Đang lưu..."`).

### 5.2. Chip lọc & Tab trạng thái

- Dùng cho thanh lọc danh sách việc làm, đơn ứng tuyển (`CHO_DUYET`, `DA_XEM`, `PHU_HOP`, `PHONG_VAN`, `TU_CHOI`).
- Kiểu dáng: bo tròn `rounded-full` hoặc tab gạch dưới gọn gàng.
- **Chip đang chọn:** nền `#2563EB` (hoặc `#0F172A`), chữ trắng, kèm số lượng (ví dụ: `Phỏng vấn · 3`).
- **Chip chưa chọn:** nền `#F1F5F9` (hoặc trắng có viền `#E2E8F0`), chữ `#334155`, hover `bg-slate-200/70`.

### 5.3. Form, Trường nhập & Rich Text Editor

- **Label đặt phía trên** ô nhập (`text-sm font-medium text-slate-700 mb-1.5`). Trường bắt buộc có dấu `*` màu `#DC2626`.
- **Chiều cao ô nhập (Input / Select):** `40px–44px` (`h-10` hoặc `h-11`), bo góc `rounded-lg`, viền `border-slate-200`, focus `border-blue-600 ring-2 ring-blue-600/15`.
- **Lỗi validate:** Viền chuyển `#DC2626`, dòng thông báo lỗi `text-xs text-red-600 mt-1` kèm icon cảnh báo nhỏ nằm ngay dưới ô.
- **Rich Text Editor (Tiptap):** Bắt buộc bọc khung có thanh công cụ (Bold, Italic, Bullet List, Ordered List) gọn gàng, chiều cao tối thiểu `160px`, nội dung render ra ngoài dùng `@tailwindcss/typography` (`prose prose-sm prose-slate max-w-none`).
- **Select / Dropdown lớn (> 10 lựa chọn như Kỹ năng, Thành phố):** Phải hỗ trợ tìm kiếm (Searchable Select / Multi-select Tags).

### 5.4. Card Việc làm (`JobCard`)

Thứ tự thông tin cố định trên mỗi `JobCard` để mắt người dùng quét nhanh trong 2 giây:

1. **Hàng đầu:** Logo công ty (`48×48px`, `rounded-lg`, `border border-slate-200 bg-white object-contain p-1`) + Tên công việc (`text-base font-semibold text-slate-900 line-clamp-2`) + Badge AI Match (nếu có) hoặc Badge `"Mới"` / `"Hot"`.
2. **Hàng 2:** Tên công ty (`text-sm text-slate-600 font-medium`).
3. **Hàng 3 (Điểm nhấn):** Mức lương (`text-sm font-bold text-emerald-600` hoặc `text-blue-600`, ví dụ `"35 - 55 triệu"` hoặc `"Thỏa thuận"`).
4. **Hàng 4 (Metadata):** Thành phố · Hình thức (`Hybrid` / `Remote` / `Tại văn phòng`) · Cấp bậc.
5. **Hàng 5 (Skills):** Tối đa **3–4 tag kỹ năng** (`bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md`), nếu nhiều hơn hiển thị `+N`.
6. **Chân card (nếu ở danh sách quản lý):** Thời gian đăng tương đối (`2 ngày trước`) + Nút lưu tin (tim/bookmark) hoặc nút thao tác.

- **Tương tác Card:** Nền trắng, `border border-slate-200 rounded-xl p-5`, khi hover chuyển `border-blue-300 shadow-md transition-all`.

### 5.5. Badge trạng thái & AI Match Score

**Badge Trạng thái Đơn ứng tuyển (`DonXinViec`):**

| Trạng thái (DB) | Nhãn hiển thị UI | Nền | Chữ & Viền |
| --- | --- | --- | --- |
| `CHO_DUYET` | Chờ duyệt | `#FEF3C7` (`bg-amber-50`) | `#B45309` (`text-amber-700 border-amber-200`) |
| `DA_XEM` | Đã xem | `#E0F2FE` (`bg-sky-50`) | `#0369A1` (`text-sky-700 border-sky-200`) |
| `PHU_HOP` | Phù hợp | `#DCFCE7` (`bg-emerald-50`) | `#15803D` (`text-emerald-700 border-emerald-200`) |
| `PHONG_VAN` | Phỏng vấn | `#EFF6FF` (`bg-blue-50`) | `#1D4ED8` (`text-blue-700 border-blue-200`) |
| `TU_CHOI` | Chưa phù hợp | `#FEE2E2` (`bg-red-50`) | `#B91C1C` (`text-red-700 border-red-200`) |

**Badge Trạng thái Tin tuyển dụng (`CongViec`):**
- `Đang tuyển`: nền `#DCFCE7`, chữ `#15803D`.
- `Tạm dừng` / `Đã đóng`: nền `#F1F5F9`, chữ `#475569`.
- `Hết hạn`: nền `#FEE2E2`, chữ `#B91C1C`.

**Badge AI Match Score (`AiMatchBadge`):**
- `80 – 100%`: Xanh lá (`bg-emerald-50 text-emerald-700 border-emerald-200`) — Độ phù hợp cao.
- `50 – 79%`: Vàng hổ phách (`bg-amber-50 text-amber-700 border-amber-200`) — Tiềm năng, cần xem thêm.
- `0 – 49%`: Đỏ nhạt (`bg-red-50 text-red-700 border-red-200`) — Ít phù hợp.

### 5.6. Bảng dữ liệu (Employer & Admin)

- Header bảng nền `#F8FAFC`, chữ `text-xs font-semibold uppercase tracking-wider text-slate-500`, viền dưới `border-slate-200`.
- Chiều cao mỗi hàng tối thiểu `56px`, hover `hover:bg-slate-50/80`.
- **Căn lề:** Chữ và badge căn trái; Số lượng, tiền tệ, điểm số căn phải (`tabular-nums`); Cột hành động đặt cuối cùng bên phải.
- Có phân trang rõ ràng ở đáy bảng (hiển thị `"Hiển thị 1–10 trên tổng 45 kết quả"`).

### 5.7. Modal, Toast, Empty State & Skeleton Loading

- **Modal:** Nền overlay `bg-slate-900/50 backdrop-blur-[2px]`, hộp modal nền trắng `rounded-2xl shadow-lg max-w-lg` (hoặc `max-w-2xl` cho modal AI/Form dài), padding `24px`, luôn có nút đóng `X` góc trên phải và đóng được bằng phím `Esc`.
- **Toast (`react-hot-toast`):** Vị trí `top-right`, tự đóng sau 3–4 giây. Thành công dùng icon xanh lá, lỗi dùng icon đỏ.
- **Empty State:** Căn giữa trong khung nét đứt nhẹ hoặc card trắng (`py-12 px-6`), gồm Icon `48×48px` trong vòng tròn `#EFF6FF` (`text-blue-600`), tiêu đề ngắn, 1 câu giải thích và 1 nút CTA Primary/Soft Primary.
- **Skeleton Loading (Bắt buộc):**
  - Dùng `animate-pulse bg-slate-200/80 rounded-*` mô phỏng đúng tỷ lệ, số cột và số dòng của component thật.
  - Tuyệt đối không render màn hình trắng hoặc chỉ 1 vòng xoay `Loader2` chiếm toàn trang khi `isLoading === true`.

---

## 6. Nội dung & Định dạng dữ liệu

### 6.1. Định dạng chuẩn

| Loại dữ liệu | Định dạng chuẩn | Ví dụ đúng | Ví dụ sai |
| --- | --- | --- | --- |
| Mức lương (triệu VNĐ) | `XX - YY triệu` (hoặc `Từ XX triệu`, `Thỏa thuận`) | `25 - 45 triệu` | `25000000 - 45000000` |
| Giá gói dịch vụ | Đủ số VNĐ, dấu phẩy/chấm phân cách + `VNĐ` | `3,900,000 VNĐ` | `3900000` |
| Kinh nghiệm | `X năm` (hoặc `Không yêu cầu`) | `3 năm kinh nghiệm` | `3 yrs` |
| Ngày | `dd/MM/yyyy` | `13/11/2026` | `2026-11-13` |
| Ngày giờ phỏng vấn | `HH:mm · dd/MM/yyyy` | `14:00 · 15/11/2026` | `2:00 PM` |
| Thời gian tương đối | `X giờ trước`, `X ngày trước` | `2 ngày trước` | `2 days ago` |
| Điểm AI Match | Số nguyên kèm `%` hoặc `/100` | `91% phù hợp` | `91.45%` |

### 6.2. Câu chữ & Viết thông báo

- Ngắn gọn, đi thẳng vào hành động và kết quả:
  - Lỗi form: `"Vui lòng nhập tiêu đề công việc."` (không viết `"Invalid input"`).
  - Thành công: `"Đã lưu hồ sơ CV thành công."`, `"Đã gửi lịch phỏng vấn qua email."`.
  - Xác nhận xóa: `"Bạn có chắc chắn muốn xóa kinh nghiệm tại FPT Software?"`.

### 6.3. Thuật ngữ thống nhất

Sử dụng nhất quán trên toàn hệ thống:
- **Việc làm** (hoặc **Tin tuyển dụng**), không gọi lẫn thành "Bài đăng bán" hay "Sản phẩm".
- **Ứng viên**, **Nhà tuyển dụng (HR)**, **Công ty**, **Hồ sơ CV**, **Đơn ứng tuyển**, **Lịch phỏng vấn**.
- **Chấm điểm AI** / **Độ phù hợp AI**, **Nhập CV bằng AI**.

### 6.4. Những điều KHÔNG làm (Anti-patterns)

- Không dùng nền gradient sặc sỡ nhiều màu (tím-hồng-xanh neon) cho toàn trang hoặc card thông thường.
- Không nhồi nhét quá 4 thông tin phụ hoặc quá 4 tag kỹ năng trên một `JobCard` khiến card cao thấp không đều.
- Không hiển thị chuỗi HTML thô (`<p>`, `<ul>`) ra giao diện người dùng (luôn render qua `prose` hoặc strip HTML ở đoạn tóm tắt ngắn).
- Không dùng chữ tiếng Anh xen kẽ lộn xộn với tiếng Việt ở các nhãn điều hướng chính (ví dụ không để `"Applied Jobs"` cạnh `"Hồ sơ cá nhân"` — dùng tiếng Việt đồng nhất, trừ thuật ngữ IT chuẩn như `Frontend`, `Backend`, `Hybrid`, `Remote`, `CV`).
- Không dùng màn hình trắng khi đang tải API (`isLoading`).

---

## 7. Phân quyền hiển thị

- **Khách vãng lai:** Xem trang chủ, tìm kiếm việc làm, xem chi tiết việc làm & công ty. Khi bấm `"Ứng tuyển"` hoặc `"Theo dõi"`, điều hướng sang Đăng nhập kèm URL quay lại.
- **Ứng viên (`UNGVIEN`):** Toàn quyền quản lý Hybrid CV, Upload & AI Parse CV, Nộp đơn ứng tuyển, Xem lịch phỏng vấn, Theo dõi công ty, Đánh giá công ty. Không thấy menu Employer/Admin.
- **Nhà tuyển dụng (`NHATUYENDUNG`):** Quản lý tin tuyển dụng, xem & lọc hồ sơ ứng viên nộp vào công ty mình, xem/quét lại AI Match Score, đặt lịch Google Meet, quản lý trang công ty, mua gói quảng cáo.
- **Quản trị viên (`ADMIN`):** Toàn quyền theo dõi Dashboard hệ thống, duyệt/quản lý người dùng, tin tuyển dụng và doanh thu gói dịch vụ.

---

## 8. Khả năng truy cập (Accessibility)

- Độ tương phản chữ đạt chuẩn **WCAG AA** (`≥ 4.5:1`).
- Mọi phần tử tương tác (`button`, `a`, `input`, `select`) phải có trạng thái `focus-visible` rõ ràng (`ring-2 ring-blue-600`).
- Kích thước vùng bấm tối thiểu `36×36px` (khuyến nghị `40×40px` trên mobile).
- Logo công ty và ảnh đại diện luôn có `alt` mô tả rõ (ví dụ `alt="Logo MoMo"`), ảnh bị lỗi URL phải có fallback hiển thị chữ cái đầu tên công ty/ứng viên trên nền `#EFF6FF` chữ `#2563EB`.
- Hỗ trợ `Esc` để đóng Modal và `Tab` để di chuyển qua các trường nhập liệu.

---

## 9. Checklist trước khi chốt một màn hình

Trước khi hoàn thành hoặc review bất kỳ trang/component mới nào của ViecNgon, kiểm tra đủ 10 điểm sau:

1. Màu sắc, khoảng cách, bo góc đã lấy đúng từ token trong `globals.css` và Mục 3 chưa? (Giữ đúng chủ đạo `#2563EB` / `#0F172A` / `#F8FAFC`).
2. Mỗi màn hình/card chỉ có tối đa 1 nút Primary chưa?
3. Đã xử lý đủ 5 trạng thái: Bình thường, **Skeleton Loading**, Rỗng (Empty State), Lỗi (Error + Thử lại), Thành công (Toast) chưa?
4. Đã kiểm tra responsive trên Mobile (`375px`), Tablet (`768px`) và Desktop (`1440px`) không bị tràn ngang chưa?
5. Các chuỗi dài (tên công ty, tiêu đề job, email) đã có `truncate` hoặc `line-clamp-2` + `min-w-0` chưa?
6. Nội dung Rich Text từ Backend (`moTa`, `yeuCauCongViec`, `phucLoi`) đã render đúng bằng `prose` và không lộ thẻ HTML thô chưa?
7. Định dạng lương, ngày tháng, điểm AI Match đã tuân thủ Mục 6.1 chưa?
8. Ảnh logo công ty / avatar ứng viên đã có fallback khi ảnh lỗi hoặc `null` chưa?
9. Mọi lệnh `fetch` gọi Backend đã đính kèm `credentials: "include"` và Query Key khai báo trong `queryKeys.ts` chưa?
10. Không còn thuật ngữ Anh-Việt lẫn lộn ở nhãn UI hoặc vi phạm Mục 6.4?

---

**Lịch sử thay đổi**

- `v1.0` – `13/11/2026` – Khởi tạo tài liệu Design System Rule chuẩn hóa toàn bộ giao diện Web ViecNgon, giữ nguyên hệ màu chủ đạo `#2563EB` (Cobalt Blue) & `#0F172A` (Slate Dark), đồng bộ với `globals.css`, Tailwind CSS v4, font `Be Vietnam Pro` và quy chuẩn Skeleton Loading.
