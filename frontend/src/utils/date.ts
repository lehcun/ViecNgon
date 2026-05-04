export const formatDateToDDMMYYYY = (dateString: string | Date | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  // Dùng toLocaleDateString của VN để tự ra chuẩn DD/MM/YYYY
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Chuyển chuỗi ISO thành YYYY-MM-DD để nhét vào giá trị của <input type="date">
export const formatDateForInput = (dateString: string | Date | null) => {
  if (!dateString) return "";
  const date = new Date(dateString);

  // Lấy ra phần YYYY-MM-DD bằng cách cắt chuỗi từ ISO string
  return date.toISOString().split("T")[0];
};
