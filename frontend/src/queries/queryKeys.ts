import { JobFilterParams } from "@viecngon/types";

// --- QUẢN LÝ JOBS ---
export const jobKeys = {
  all: ["jobs"],

  // Danh sách việc làm nói chung
  lists: () => [...jobKeys.all, "list"],

  // Danh sách việc làm có bộ lọc (ví dụ: title, mức lương, ReactJS, Java...)
  list: (filters: JobFilterParams) => [...jobKeys.lists(), { filters }],

  // Chi tiết một công việc
  details: () => [...jobKeys.all, "detail"],
  detail: (id: string) => [...jobKeys.details(), id],

  // (Tính năng mở rộng) Việc làm đã lưu, đã ứng tuyển của ứng viên
  saved: () => [...jobKeys.all, "saved"],
  applied: () => [...jobKeys.all, "applied"],
};

// --- QUẢN LÝ COMPANIES ---
export const companyKeys = {
  all: ["companies"],

  // Danh sách công ty (Top IT companies...)
  lists: () => [...companyKeys.all, "list"],
  list: (filters: JobFilterParams) => [...companyKeys.lists(), { filters }],

  // Chi tiết hồ sơ công ty
  details: () => [...companyKeys.all, "detail"],
  detail: (id: string) => [...companyKeys.details(), id],

  // Lấy danh sách các jobs thuộc về 1 công ty cụ thể
  // (Rất hữu ích khi hiển thị trên trang chi tiết công ty hoặc dashboard nhà tuyển dụng)
  jobs: (companyId: string) => [...companyKeys.detail(companyId), "jobs"],
};
