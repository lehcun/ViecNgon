export const getRelativeTime = (dateInput: string | Date): string => {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const now = new Date();

  // Tính khoảng cách thời gian bằng mili-giây
  const diffInMs = now.getTime() - date.getTime();

  // Chuyển đổi ra các đơn vị
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return "Vừa xong";
  } else if (diffInMinutes < 60) {
    return `Đăng ${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `Đăng ${diffInHours} giờ trước`;
  } else if (diffInDays < 30) {
    return `Đăng ${diffInDays} ngày trước`;
  } else if (diffInMonths < 12) {
    return `Đăng ${diffInMonths} tháng trước`;
  } else {
    return `Đăng ${diffInYears} năm trước`;
  }
};
