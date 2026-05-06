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
  hinhThucLamViec: string; // [BỔ SUNG: Remote, Tại văn phòng...]
  maChiNhanh: string; // [BỔ SUNG: Tùy chọn chi nhánh]
  ngayHetHan: string;
  negotiable: boolean; // Field phụ trợ riêng cho UI (Lương thỏa thuận)
  kyNangs: string[];
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
  hinhThucLamViec?: string; // [BỔ SUNG]
  maChiNhanh?: string; // [BỔ SUNG]
  ngayDang: string; // Backend yêu cầu ISOString
  ngayHetHan?: string; // Backend yêu cầu ISOString
  trangThai: string;
  maTaiKhoan: string;
  kyNangs: string[];
}

export function useCreateJob(initialCredits: number = 0) {
  const { user } = useAuthStore();

  console.log(user);

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
    hinhThucLamViec: "", // [BỔ SUNG: Khởi tạo rỗng]
    maChiNhanh: "", // [BỔ SUNG: Khởi tạo rỗng]
    thanhPho: "",
    yeuCauKinhNghiem: "",
    ngayHetHan: "",
    mucLuongToiThieu: "",
    mucLuongToiDa: "",
    negotiable: false,
    moTa: "",
    yeuCauCongViec: "",
    phucLoi: "",
    kyNangs: [],
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

  // Xử lý riêng cho Rich Text Editor
  const handleRichTextChange = (field: keyof JobFormState, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Xử lý chọn/bỏ chọn Kỹ năng
  const handleToggleSkill = (skillId: string) => {
    setFormData((prev) => {
      const isSelected = prev.kyNangs.includes(skillId);
      if (isSelected) {
        // Nếu đã chọn thì gỡ ra (filter)
        return {
          ...prev,
          kyNangs: prev.kyNangs.filter((id) => id !== skillId),
        };
      } else {
        // Nếu chưa chọn thì thêm vào mảng
        return { ...prev, kyNangs: [...prev.kyNangs, skillId] };
      }
    });
  };

  // Hàm helper để Reset Form
  const resetForm = () => {
    setFormData({
      tenCongViec: "",
      capBac: "",
      loaiHinh: "",
      hinhThucLamViec: "",
      maChiNhanh: "",
      thanhPho: "",
      yeuCauKinhNghiem: "",
      ngayHetHan: "",
      mucLuongToiThieu: "",
      mucLuongToiDa: "",
      negotiable: false,
      moTa: "",
      yeuCauCongViec: "",
      phucLoi: "",
      kyNangs: [],
    });
  };

  // Xử lý Submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.sub) {
      alert("Bạn cần đăng nhập để thực hiện chức năng này!");
      return;
    }

    // 1. Kiểm tra Business Logic (Lượt đăng tin)
    if (remainingCredits <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    // Kiểm tra phải chọn ít nhất 1 kỹ năng
    if (formData.kyNangs.length === 0) {
      alert("Vui lòng chọn ít nhất 1 kỹ năng cho công việc này!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. CHUẨN HÓA DỮ LIỆU THÀNH DTO TRƯỚC KHI GỬI (Data Transformation)
      const payload: CreateCongViecPayload = {
        tenCongViec: formData.tenCongViec.trim(),
        capBac: formData.capBac || undefined,
        loaiHinh: formData.loaiHinh,

        // [BỔ SUNG] Nếu ko chọn gửi undefined để DB lưu null
        hinhThucLamViec: formData.hinhThucLamViec || undefined,
        maChiNhanh: formData.maChiNhanh || undefined,

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
        maTaiKhoan: user.sub, // Lấy từ authStore

        kyNangs: formData.kyNangs,
      };

      console.log("🚀 Payload chuẩn bị gửi lên NestJS:", payload);

      // 3. Gọi API (Giả lập)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lỗi khi gọi API Backend");

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
    handleToggleSkill,
    resetForm,

    // Close Modal
    closeModal: () => setShowUpgradeModal(false),
  };
}
