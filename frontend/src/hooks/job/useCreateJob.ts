"use client";

import { useAuthStore } from "@/store/authStore";
import { JobFormState, CreateCongViecPayload } from "@viecngon/types";
import { useRouter } from "next/navigation";
import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  throwApiFormError,
  validatePositiveNumber,
  validateRequiredText,
} from "@/lib/validation";
import { stripHtmlTags } from "@/lib/formatters";
import { API_BASE_URL } from "@/lib/env";

function stripHtmlText(html: string): string {
  return stripHtmlTags(html).replace(/&nbsp;/g, " ").trim();
}

export function useCreateJob(initialCredits: number = 0) {
  const { user } = useAuthStore();
  const router = useRouter();

  const [remainingCredits, setRemainingCredits] =
    useState<number>(initialCredits);
  const [showUpgradeModal, setShowUpgradeModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
    clearErrors,
  } = useFormValidation<JobFormState>({
    fieldOrder: [
      "tenCongViec",
      "capBac",
      "loaiHinh",
      "hinhThucLamViec",
      "thanhPho",
      "kyNangs",
      "ngayHetHan",
      "mucLuongToiThieu",
      "mucLuongToiDa",
      "moTa",
      "yeuCauCongViec",
      "phucLoi",
    ],
    validators: {
      tenCongViec: (val) =>
        validateRequiredText(val, "tiêu đề công việc", { maxLength: 200 }),
      capBac: (val) => (val ? "" : "Vui lòng chọn cấp bậc."),
      loaiHinh: (val) => (val ? "" : "Vui lòng chọn loại hình làm việc."),
      hinhThucLamViec: (val) =>
        val ? "" : "Vui lòng chọn hình thức làm việc.",
      thanhPho: (val) =>
        validateRequiredText(val, "thành phố / khu vực làm việc", {
          maxLength: 100,
        }),
      kyNangs: (val) =>
        val.length > 0
          ? ""
          : "Vui lòng chọn ít nhất 1 kỹ năng chuyên môn.",
      ngayHetHan: (val) => {
        if (!val) return "Vui lòng chọn hạn chót nộp hồ sơ.";
        const today = new Date().toISOString().split("T")[0];
        if (val < today) return "Hạn nộp hồ sơ không được ở quá khứ.";
        return "";
      },
      mucLuongToiThieu: (val, all) => {
        if (all.negotiable) return "";
        return validatePositiveNumber(val, {
          required: true,
          min: 1,
          label: "mức lương tối thiểu",
        });
      },
      mucLuongToiDa: (val, all) => {
        if (all.negotiable) return "";
        const err = validatePositiveNumber(val, {
          required: true,
          min: 1,
          label: "mức lương tối đa",
        });
        if (err) return err;
        if (
          all.mucLuongToiThieu !== "" &&
          Number(val) < Number(all.mucLuongToiThieu)
        ) {
          return "Mức lương tối đa phải lớn hơn hoặc bằng mức lương tối thiểu.";
        }
        return "";
      },
      moTa: (val) =>
        stripHtmlText(val) ? "" : "Vui lòng nhập mô tả công việc.",
      yeuCauCongViec: (val) =>
        stripHtmlText(val) ? "" : "Vui lòng nhập yêu cầu ứng viên.",
      phucLoi: (val) =>
        stripHtmlText(val) ? "" : "Vui lòng nhập quyền lợi & đãi ngộ.",
    },
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    const field = name as keyof JobFormState;

    let nextValue: JobFormState[keyof JobFormState] = value;
    if (type === "checkbox") {
      nextValue = (e.target as HTMLInputElement).checked;
    } else if (type === "number") {
      nextValue = value === "" ? "" : Number(value);
    }

    const nextForm: JobFormState = {
      ...formData,
      [field]: nextValue,
      ...(name === "hinhThucLamViec" && value === "Remote"
        ? { maChiNhanh: "" }
        : {}),
    };

    setFormData(nextForm);
    handleFieldChange(field, nextValue as never, nextForm);
    if (name === "negotiable" || name === "mucLuongToiThieu") {
      handleFieldChange(
        "mucLuongToiThieu",
        nextForm.mucLuongToiThieu,
        nextForm,
      );
      handleFieldChange("mucLuongToiDa", nextForm.mucLuongToiDa, nextForm);
    }
  };

  const setFieldValue = <K extends keyof JobFormState>(
    field: K,
    value: JobFormState[K],
  ) => {
    const nextForm = { ...formData, [field]: value };
    setFormData(nextForm);
    handleFieldChange(field, value, nextForm);
  };

  const handleRichTextChange = (
    field: "moTa" | "yeuCauCongViec" | "phucLoi",
    value: string,
  ) => {
    const nextForm = { ...formData, [field]: value };
    setFormData(nextForm);
    handleFieldChange(field, value, nextForm);
  };

  const handleToggleSkill = (skillId: string) => {
    const isSelected = formData.kyNangs.includes(skillId);
    const nextSkills = isSelected
      ? formData.kyNangs.filter((id) => id !== skillId)
      : [...formData.kyNangs, skillId];
    const nextForm = { ...formData, kyNangs: nextSkills };
    setFormData(nextForm);
    handleFieldChange("kyNangs", nextSkills, nextForm);
  };

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
    clearErrors();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const userId = user?.id || user?.sub;
    if (!user || !userId) {
      toast.error("Bạn cần đăng nhập để thực hiện chức năng này!");
      return;
    }

    if (remainingCredits <= 0) {
      setShowUpgradeModal(true);
      return;
    }

    if (!validateAll(formData)) {
      toast.error("Vui lòng kiểm tra lại các trường thông tin bị thiếu hoặc chưa hợp lệ.");
      return;
    }

    setIsLoading(true);

    try {
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
          formData.ngayHetHan && !Number.isNaN(new Date(formData.ngayHetHan).getTime())
            ? new Date(formData.ngayHetHan).toISOString()
            : undefined,
        trangThai: "Đang tuyển",
        maTaiKhoan: userId,
        kyNangs: formData.kyNangs,
      };

      const res = await fetch(`${API_BASE_URL}/job`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        await throwApiFormError(res, "Lỗi khi gọi API tạo việc làm.");
      }

      toast.success("Đăng tin tuyển dụng thành công!");
      setRemainingCredits((prev) => prev - 1);
      resetForm();

      router.push("/employer-dashboard");
    } catch (error: unknown) {
      const applied = applyServerError(error, {
        fallbackMessage: "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.",
      });
      toast.error(applied.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    formError,
    remainingCredits,
    showUpgradeModal,
    isLoading,
    handleInputChange,
    handleFieldBlur,
    handleRichTextChange,
    handleSubmit,
    handleToggleSkill,
    setFieldValue,
    resetForm,
    closeModal: () => setShowUpgradeModal(false),
  };
}
