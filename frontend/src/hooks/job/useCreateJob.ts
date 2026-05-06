import { useAuthStore } from "@/store/authStore";
import { useState, ChangeEvent, FormEvent } from "react";

// 1. Định nghĩa Type cho Form State (Khớp với UI nhập liệu)
export interface JobFormState {
  tenCongViec: string;
  moTa: string;
  yeuCauCongViec: string;
  phucLoi: string;
  mucLuongToiThieu: number | "";
  mucLuongToiDa: number | "";
  yeuCauKinhNghiem: number | "";
  capBac: string;
  thanhPho: string;
  loaiHinh: string;
  ngayHetHan: string;
  negotiable: boolean; // Field phụ trợ riêng cho UI (Lương thỏa thuận)
}

// 2. Định nghĩa Type cho DTO gửi lên Backend (Khớp 100% với NestJS DTO)
export interface CreateCongViecPayload {
  tenCongViec: string;
  moTa?: string;
  yeuCauCongViec?: string;
  phucLoi?: string;
  mucLuongToiThieu?: number;
  mucLuongToiDa?: number;
  yeuCauKinhNghiem?: number;
  capBac?: string;
  thanhPho?: string;
  loaiHinh: string;
  ngayDang: string; // Backend yêu cầu ISOString
  ngayHetHan?: string; // Backend yêu cầu ISOString
  trangThai: string;
  maNTD: string;
}

export function useCreateJob(initialCredits: number = 0) {
  const { user } = useAuthStore();
  console.log("user: ", user);
  // --- UI STATES ---
  const [remainingCredits, setRemainingCredits] =
    useState<number>(initialCredits);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // --- FORM DATA STATE ---
  const [formData, setFormData] = useState<JobFormState>({
    tenCongViec: "",
    capBac: "",
    loaiHinh: "",
    thanhPho: "", // Trong UI cũ bạn gọi là diaDiem
    yeuCauKinhNghiem: "",
    ngayHetHan: "",
    mucLuongToiThieu: "",
    mucLuongToiDa: "",
    negotiable: false,
    moTa: "",
    yeuCauCongViec: "",
    phucLoi: "",
  });

  // --- HANDLERS ---

  // Xử lý thay đổi input chung với Type-safe
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => {
      // 1. Xử lý Checkbox
      if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        return { ...prev, [name]: checked };
      }

      // 2. Xử lý Input Number (Ép kiểu ngay khi nhập để tránh lỗi chuỗi)
      if (type === "number") {
        return { ...prev, [name]: value === "" ? "" : Number(value) };
      }

      // 3. Xử lý Input Text/Date/Select
      return { ...prev, [name]: value };
    });
  };

  // Thêm hàm này vào dưới hàm handleInputChange hiện tại
  const handleRichTextChange = (field: keyof JobFormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hàm helper để Reset Form
  const resetForm = () => {
    setFormData({
      tenCongViec: "",
      capBac: "",
      loaiHinh: "",
      thanhPho: "",
      yeuCauKinhNghiem: "",
      ngayHetHan: "",
      mucLuongToiThieu: "",
      mucLuongToiDa: "",
      negotiable: false,
      moTa: "",
      yeuCauCongViec: "",
      phucLoi: "",
    });
  };

  // Xử lý Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này!");
      return;
    }

    // 1. Kiểm tra Business Logic (Lượt đăng tin)
    if (remainingCredits <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    setIsLoading(true);

    try {
      // 2. CHUẨN HÓA DỮ LIỆU THÀNH DTO TRƯỚC KHI GỬI (Data Transformation)
      const payload: CreateCongViecPayload = {
        tenCongViec: formData.tenCongViec.trim(),
        capBac: formData.capBac || undefined,
        loaiHinh: formData.loaiHinh,
        thanhPho: formData.thanhPho.trim() || undefined,

        // Nếu chọn "Lương thỏa thuận", ta gửi undefined để DB lưu Null
        mucLuongToiThieu: formData.negotiable
          ? undefined
          : (formData.mucLuongToiThieu as number) || undefined,
        mucLuongToiDa: formData.negotiable
          ? undefined
          : (formData.mucLuongToiDa as number) || undefined,

        yeuCauKinhNghiem:
          formData.yeuCauKinhNghiem !== ""
            ? Number(formData.yeuCauKinhNghiem)
            : undefined,

        moTa: formData.moTa || undefined,
        yeuCauCongViec: formData.yeuCauCongViec || undefined,
        phucLoi: formData.phucLoi || undefined,

        // Format Date thành chuẩn ISO 8601 theo yêu cầu của Class-validator ở Backend
        ngayDang: new Date().toISOString(),
        ngayHetHan:
          formData.ngayHetHan && !isNaN(new Date(formData.ngayHetHan).getTime())
            ? new Date(formData.ngayHetHan).toISOString()
            : undefined,

        // Tự động gán các trường hệ thống
        trangThai: "Đang tuyển",
        maNTD: user.id, // TODO: Lấy từ Context/Redux (User đang đăng nhập)
      };

      console.log("🚀 Payload chuẩn bị gửi lên NestJS:", payload);

      // 3. Gọi API (Giả lập)
      /*
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cong-viec`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lỗi khi gọi API Backend");
      */

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập mạng 1s

      // 4. Thành công
      alert("Đăng tin thành công!");
      setRemainingCredits((prev) => prev - 1);
      resetForm();
    } catch (error) {
      console.error("❌ Lỗi đăng tin:", error);
      alert("Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // States
    formData,
    remainingCredits,
    showUpgradeModal,
    isLoading,

    // Actions
    handleInputChange,
    handleRichTextChange,
    handleSubmit,
    closeModal: () => setShowUpgradeModal(false),
  };
}
