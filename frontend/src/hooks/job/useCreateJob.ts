"use client";

import { useAuthStore } from "@/store/authStore";
import { JobFormState, CreateCongViecPayload } from "@viecngon/types";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";

export function useCreateJob(initialCredits: number = 0) {
  const { user } = useAuthStore();
  const router = useRouter();

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

      // 2. Xử lý Input Number
      if (type === "number") {
        return { ...prev, [name]: value === "" ? "" : Number(value) };
      }

      // 3. Khi người dùng chọn hình thức "Remote" (Làm từ xa)
      // Tự động reset maChiNhanh về rỗng để tránh vướng khóa ngoại P2003
      if (name === "hinhThucLamViec" && value === "Remote") {
        return {
          ...prev,
          hinhThucLamViec: value,
          maChiNhanh: "",
        };
      }

      // 4. Xử lý Input Text/Date/Select
      return { ...prev, [name]: value };
    });
  };

  // Cập nhật giá trị trường tự do
  const setFieldValue = <K extends keyof JobFormState>(
    field: K,
    value: JobFormState[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
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
        return {
          ...prev,
          kyNangs: prev.kyNangs.filter((id) => id !== skillId),
        };
      } else {
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

    const userId = user?.id || user?.sub;
    if (!user || !userId) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này!");
      return;
    }

    // 1. Kiểm tra Business Logic (Lượt đăng tin)
    if (remainingCredits <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    // Kiểm tra phải chọn ít nhất 1 kỹ năng
    if (formData.kyNangs.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 kỹ năng chuyên môn cho công việc!");
      return;
    }

    setIsLoading(true);

    try {
      // 2. CHUẨN HÓA DỮ LIỆU THÀNH DTO TRƯỚC KHI GỬI (Data Transformation)
      // Đảm bảo maChiNhanh không bao giờ gửi chuỗi rỗng "" hoặc khoảng trắng
      const cleanBranchId =
        formData.hinhThucLamViec === "Remote" ||
          !formData.maChiNhanh ||
          formData.maChiNhanh.trim() === ""
          ? undefined
          : formData.maChiNhanh.trim();

      const payload: CreateCongViecPayload = {
        tenCongViec: formData.tenCongViec.trim(),
        capBac: formData.capBac || undefined,
        loaiHinh: formData.loaiHinh,
        hinhThucLamViec: formData.hinhThucLamViec || undefined,
        maChiNhanh: cleanBranchId,
        thanhPho: formData.thanhPho.trim() || undefined,

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

        ngayDang: new Date().toISOString(),
        ngayHetHan:
          formData.ngayHetHan && !isNaN(new Date(formData.ngayHetHan).getTime())
            ? new Date(formData.ngayHetHan).toISOString()
            : undefined,

        trangThai: "Đang tuyển",
        maTaiKhoan: userId,
        kyNangs: formData.kyNangs,
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        const errorMsg =
          (Array.isArray(errorData?.message)
            ? errorData.message.join(", ")
            : errorData?.message) || "Lỗi khi gọi API tạo việc làm.";
        throw new Error(errorMsg);
      }

      toast.success("Đăng tin tuyển dụng thành công!");
      setRemainingCredits((prev) => prev - 1);
      resetForm();

      router.push("/employer-dashboard");
    } catch (error: any) {
      console.error("❌ Lỗi đăng tin:", error);
      toast.error(error?.message || "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");
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
    setFieldValue,
    resetForm,

    // Close Modal
    closeModal: () => setShowUpgradeModal(false),
  };
}
