"use client";

import React, { useRef, useState } from "react";
import { X, Camera, Trash2, Calendar, ChevronDown, Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useUpdateCandidateProfile } from "@/hooks/candidate/useUpdateCandidateProfile";
import { useUploadCandidateAvatar } from "@/hooks/candidate/useUploadCandidateAvatar";
import {
  ImageCropperModal,
  validateAvatarImageFile,
} from "@/components/ui/ImageCropperModal";
import { CandidateProfileResponse } from "@viecngon/types";
import {
  FieldError,
  FormBannerError,
  getFieldA11yProps,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  validatePhoneVN,
  validateRequiredText,
  validateUrl,
} from "@/lib/validation";

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CandidateProfileResponse | null;
}

interface PersonalInfoFormValues {
  userName: string;
  profession: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  street: string;
  city: string;
  cvUrl: string;
  avatarUrl: string;
}

const getInitialFormData = (
  data?: CandidateProfileResponse | null,
): PersonalInfoFormValues => {
  const addressParts = data?.address
    ? data.address.split(", ")
    : ["", "Đà Nẵng"];
  const formattedDate = data?.dateOfBirth
    ? new Date(data.dateOfBirth).toISOString().split("T")[0]
    : "";

  return {
    userName: data?.candidateName || data?.account?.userName || "",
    profession: data?.profession || "",
    phoneNumber: data?.account?.phoneNumber || "",
    dateOfBirth: formattedDate,
    gender: data?.gender || "Nam",
    street: addressParts[0] || "",
    city: addressParts[1] || "Đà Nẵng",
    cvUrl: data?.cvUrl || "",
    avatarUrl: data?.avatarUrl || "",
  };
};

export default function PersonalInfoModal({
  isOpen,
  onClose,
  initialData,
}: PersonalInfoModalProps) {
  const { updateCandidateProfile, isPending } = useUpdateCandidateProfile();
  const { mutateAsync: uploadAvatarAsync, isPending: isUploadingAvatar } =
    useUploadCandidateAvatar();

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<PersonalInfoFormValues>(() =>
    getInitialFormData(initialData),
  );
  const [showAvatarInput, setShowAvatarInput] = useState(false);
  const [cropAvatarFile, setCropAvatarFile] = useState<File | null>(null);

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<PersonalInfoFormValues>({
    fieldOrder: [
      "userName",
      "profession",
      "phoneNumber",
      "dateOfBirth",
      "city",
      "cvUrl",
      "avatarUrl",
    ],
    validators: {
      userName: (val) =>
        validateRequiredText(val, "họ và tên", { minLength: 2, maxLength: 100 }),
      profession: (val) =>
        validateRequiredText(val, "chức danh", { maxLength: 100 }),
      phoneNumber: (val) => validatePhoneVN(val, true),
      dateOfBirth: (val) => {
        if (!val) return "Vui lòng chọn ngày sinh.";
        const dob = new Date(val);
        if (Number.isNaN(dob.getTime())) return "Ngày sinh không hợp lệ.";
        if (dob > new Date()) return "Ngày sinh không được ở tương lai.";
        return "";
      },
      city: (val) => (val ? "" : "Vui lòng chọn tỉnh/thành phố."),
      cvUrl: (val) =>
        validateUrl(val, {
          required: false,
          label: "liên kết cá nhân",
          maxLength: 255,
        }),
      avatarUrl: (val) =>
        validateUrl(val, {
          required: false,
          label: "đường dẫn ảnh đại diện",
          maxLength: 255,
        }),
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const field = name as keyof PersonalInfoFormValues;
    const next = { ...formData, [field]: value };
    setFormData(next);
    handleFieldChange(field, value, next);
  };

  const handleSave = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateAll(formData)) {
      if (errors.avatarUrl) setShowAvatarInput(true);
      return;
    }

    const fullAddress = formData.street.trim()
      ? `${formData.street.trim()}, ${formData.city}`
      : formData.city;

    const payload = {
      userName: formData.userName.trim(),
      profession: formData.profession.trim(),
      phoneNumber: formData.phoneNumber.trim(),
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: fullAddress,
      cvUrl: formData.cvUrl.trim(),
      avatarUrl: formData.avatarUrl.trim(),
    };

    updateCandidateProfile(payload, {
      onSuccess: () => {
        toast.success("Cập nhật thông tin thành công!");
        onClose();
      },
      onError: (error) => {
        const applied = applyServerError(error, {
          fallbackMessage: "Có lỗi xảy ra, vui lòng thử lại!",
        });
        toast.error(applied.message);
      },
    });
  };

  if (!isOpen) return null;

  const isAvatarUrlValid =
    Boolean(formData.avatarUrl.trim()) &&
    validateUrl(formData.avatarUrl, { required: false }) === "";

  const handleSelectAvatarFile = (file: File | undefined) => {
    if (!file) return;
    const validationError = validateAvatarImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setCropAvatarFile(file);
  };

  const handleConfirmCroppedAvatar = async (croppedFile: File) => {
    try {
      const { url } = await uploadAvatarAsync({
        file: croppedFile,
        persist: false,
      });
      const next = { ...formData, avatarUrl: url };
      setFormData(next);
      handleFieldChange("avatarUrl", url, next);
      setCropAvatarFile(null);
      toast.success("Đã cắt ảnh đại diện! Bấm 'Lưu' để hoàn tất cập nhật.");
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Không thể tải ảnh đại diện lên.";
      toast.error(msg);
    }
  };

  const boxClass = (hasError: boolean) =>
    `border rounded-lg px-4 py-2 transition-all bg-white ${
      hasError
        ? "border-danger bg-danger-soft/20 focus-within:border-danger focus-within:ring-2 focus-within:ring-danger/20"
        : "border-slate-300 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15"
    }`;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Thông tin cá nhân
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form
          id="personal-info-form"
          onSubmit={handleSave}
          noValidate
          className="flex-1 overflow-y-auto p-6 md:p-8"
        >
          <FormBannerError message={formError} className="mb-5" />

          <div className="flex flex-col md:flex-row gap-10">
            {/* Avatar section */}
            <div className="flex flex-col items-center gap-4 w-full md:w-1/4">
              <input
                ref={avatarFileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  handleSelectAvatarFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />

              <button
                type="button"
                onClick={() => avatarFileInputRef.current?.click()}
                title="Tải ảnh đại diện từ máy"
                className="relative group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {isAvatarUrlValid ? (
                  <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-md border-2 border-slate-200">
                    <Image
                      src={formData.avatarUrl.trim()}
                      alt={formData.userName || "Avatar"}
                      fill
                      unoptimized
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary text-white flex items-center justify-center text-5xl font-semibold shadow-md">
                    {formData.userName
                      ? formData.userName.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
                <span className="absolute inset-0 rounded-full bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Camera size={22} />
                </span>
              </button>

              <div className="flex items-center gap-4 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="flex items-center gap-1 text-primary hover:text-primary-hover transition-colors cursor-pointer"
                >
                  <Camera size={16} />{" "}
                  {formData.avatarUrl ? "Đổi ảnh" : "Thêm ảnh"}
                </button>
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = { ...formData, avatarUrl: "" };
                      setFormData(next);
                      handleFieldChange("avatarUrl", "", next);
                    }}
                    className="flex items-center gap-1 text-slate-500 hover:text-danger transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} /> Xoá
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowAvatarInput((prev) => !prev)}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted hover:text-primary transition-colors"
              >
                <LinkIcon size={11} />
                <span>{showAvatarInput ? "Ẩn nhập URL" : "Hoặc dán URL ảnh"}</span>
              </button>

              {(showAvatarInput || Boolean(errors.avatarUrl)) && (
                <div className="w-full mt-2 animate-in fade-in duration-150">
                  <label
                    htmlFor="avatarUrl"
                    className="block text-[11px] text-slate-500 font-medium mb-1 text-center"
                  >
                    Đường dẫn ảnh (URL)
                  </label>
                  <input
                    id="avatarUrl"
                    type="url"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleChange}
                    onBlur={() =>
                      handleFieldBlur("avatarUrl", formData.avatarUrl, formData)
                    }
                    placeholder="https://example.com/avatar.jpg"
                    className={`w-full text-xs p-2 border rounded-md outline-none transition-all ${
                      errors.avatarUrl
                        ? "border-danger bg-danger-soft/20 focus:border-danger focus:ring-2 focus:ring-danger/20"
                        : "border-slate-300 focus:border-primary focus:ring-1 focus:ring-primary"
                    }`}
                    {...getFieldA11yProps("avatarUrl", errors.avatarUrl)}
                  />
                  <FieldError
                    id="avatarUrl-error"
                    message={errors.avatarUrl}
                  />
                </div>
              )}
            </div>

            <div className="w-full md:w-3/4 flex flex-col gap-4">
              {/* Row 1 */}
              <div>
                <div className={boxClass(Boolean(errors.userName))}>
                  <label
                    htmlFor="userName"
                    className="block text-[11px] text-slate-500 font-medium mb-0.5"
                  >
                    Họ và Tên <span className="text-danger">*</span>
                  </label>
                  <input
                    id="userName"
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    onBlur={() =>
                      handleFieldBlur("userName", formData.userName, formData)
                    }
                    className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                    {...getFieldA11yProps("userName", errors.userName)}
                  />
                </div>
                <FieldError id="userName-error" message={errors.userName} />
              </div>

              {/* Row 2 */}
              <div>
                <div className={boxClass(Boolean(errors.profession))}>
                  <label
                    htmlFor="profession"
                    className="block text-[11px] text-slate-500 font-medium mb-0.5"
                  >
                    Chức danh <span className="text-danger">*</span>
                  </label>
                  <input
                    id="profession"
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleChange}
                    onBlur={() =>
                      handleFieldBlur(
                        "profession",
                        formData.profession,
                        formData,
                      )
                    }
                    className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                    {...getFieldA11yProps("profession", errors.profession)}
                  />
                </div>
                <FieldError
                  id="profession-error"
                  message={errors.profession}
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 cursor-not-allowed">
                  <label
                    htmlFor="personal-info-email"
                    className="block text-[11px] text-slate-500 font-medium mb-0.5"
                  >
                    Địa chỉ email (Không thể sửa)
                  </label>
                  <input
                    id="personal-info-email"
                    type="email"
                    value={initialData?.account?.email || ""}
                    disabled
                    className="w-full text-sm font-semibold text-slate-600 outline-none bg-transparent cursor-not-allowed"
                  />
                </div>
                <div>
                  <div className={boxClass(Boolean(errors.phoneNumber))}>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-[11px] text-slate-500 font-medium mb-0.5"
                    >
                      Số điện thoại <span className="text-danger">*</span>
                    </label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      onBlur={() =>
                        handleFieldBlur(
                          "phoneNumber",
                          formData.phoneNumber,
                          formData,
                        )
                      }
                      className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                      {...getFieldA11yProps("phoneNumber", errors.phoneNumber)}
                    />
                  </div>
                  <FieldError
                    id="phoneNumber-error"
                    message={errors.phoneNumber}
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div
                    className={`${boxClass(Boolean(errors.dateOfBirth))} relative`}
                  >
                    <label
                      htmlFor="dateOfBirth"
                      className="block text-[11px] text-slate-500 font-medium mb-0.5"
                    >
                      Ngày sinh <span className="text-danger">*</span>
                    </label>
                    <input
                      id="dateOfBirth"
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      onBlur={() =>
                        handleFieldBlur(
                          "dateOfBirth",
                          formData.dateOfBirth,
                          formData,
                        )
                      }
                      className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      {...getFieldA11yProps("dateOfBirth", errors.dateOfBirth)}
                    />
                    <Calendar
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                  <FieldError
                    id="dateOfBirth-error"
                    message={errors.dateOfBirth}
                  />
                </div>

                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white relative">
                  <label
                    htmlFor="gender"
                    className="block text-[11px] text-slate-500 font-medium mb-0.5"
                  >
                    Giới tính
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent appearance-none cursor-pointer"
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <ChevronDown
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>
              </div>

              {/* Row 5 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className={`${boxClass(Boolean(errors.city))} relative`}>
                    <label
                      htmlFor="city"
                      className="block text-[11px] text-slate-500 font-medium mb-0.5"
                    >
                      Tỉnh/Thành phố hiện tại{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      onBlur={() =>
                        handleFieldBlur("city", formData.city, formData)
                      }
                      className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent appearance-none cursor-pointer"
                      {...getFieldA11yProps("city", errors.city)}
                    >
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="TP HCM">TP. Hồ Chí Minh</option>
                    </select>
                    <ChevronDown
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                  <FieldError id="city-error" message={errors.city} />
                </div>
                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                  <label
                    htmlFor="street"
                    className="block text-[11px] text-slate-500 font-medium mb-0.5"
                  >
                    Địa chỉ (Tên đường, quận/huyện,...)
                  </label>
                  <input
                    id="street"
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="VD: K546 Tôn Đản"
                    className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Row 6 */}
              <div>
                <div className={boxClass(Boolean(errors.cvUrl))}>
                  <label
                    htmlFor="cvUrl"
                    className="block text-[11px] text-slate-500 font-medium mb-0.5"
                  >
                    Link cá nhân (Linkedin, portfolio,...)
                  </label>
                  <input
                    id="cvUrl"
                    type="url"
                    name="cvUrl"
                    value={formData.cvUrl}
                    onChange={handleChange}
                    onBlur={() =>
                      handleFieldBlur("cvUrl", formData.cvUrl, formData)
                    }
                    placeholder="https://linkedin.com/in/..."
                    className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                    {...getFieldA11yProps("cvUrl", errors.cvUrl)}
                  />
                </div>
                <FieldError id="cvUrl-error" message={errors.cvUrl} />
              </div>
            </div>
          </div>
        </form>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            form="personal-info-form"
            disabled={isPending}
            className="px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 rounded-lg transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
      <ImageCropperModal
        key={
          cropAvatarFile
            ? `${cropAvatarFile.name}-${cropAvatarFile.size}-${cropAvatarFile.lastModified}`
            : "candidate-modal-crop-closed"
        }
        isOpen={Boolean(cropAvatarFile)}
        file={cropAvatarFile}
        title="Cập nhật ảnh đại diện"
        cropShape="circle"
        isSubmitting={isUploadingAvatar}
        onClose={() => setCropAvatarFile(null)}
        onConfirm={handleConfirmCroppedAvatar}
      />
    </div>
  );
}
