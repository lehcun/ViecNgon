"use client";

import React, { useState, useEffect } from "react";
import { X, Camera, Trash2, Calendar, ChevronDown } from "lucide-react";
// Đảm bảo import đúng đường dẫn hook của bạn
import { useUpdateCandidateProfile } from "@/hooks/candidate/useUpdateCandidateProfile";
import { CandidateProfileResponse } from "@viecngon/types";

interface PersonalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: CandidateProfileResponse | null;
}

const getInitialFormData = (data?: CandidateProfileResponse | null) => {
  const addressParts = data?.address
    ? data.address.split(", ")
    : ["", "Đà Nẵng"];
  const formattedDate = data?.dateOfBirth
    ? new Date(data.dateOfBirth).toISOString().split("T")[0]
    : "";

  return {
    userName: data?.account?.userName || "",
    profession: data?.profession || "",
    phoneNumber: data?.account?.phoneNumber || "",
    dateOfBirth: formattedDate,
    gender: data?.gender || "Nam",
    street: addressParts[0] || "",
    city: addressParts[1] || "Đà Nẵng",
    cvUrl: data?.cvUrl || "",
  };
};

export default function PersonalInfoModal({
  isOpen,
  onClose,
  initialData,
}: PersonalInfoModalProps) {
  const { updateCandidateProfile, isPending } = useUpdateCandidateProfile();

  // Khởi tạo State lưu trữ dữ liệu form
  const [formData, setFormData] = useState(() =>
    getInitialFormData(initialData),
  );

  // Hàm xử lý chung khi người dùng gõ vào input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Hàm Submit gửi dữ liệu lên Backend
  const handleSave = () => {
    // Gom Tỉnh/Thành và Số nhà lại thành 1 chuỗi Địa chỉ chuẩn bị gửi
    const fullAddress = formData.street
      ? `${formData.street}, ${formData.city}`
      : formData.city;

    const payload = {
      userName: formData.userName,
      profession: formData.profession,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      address: fullAddress,
      cvUrl: formData.cvUrl,
    };

    updateCandidateProfile(payload, {
      onSuccess: () => {
        alert("Cập nhật thành công!");
        onClose(); // Đóng modal khi thành công
      },
      onError: (error) => {
        alert("Có lỗi xảy ra, vui lòng thử lại!");
        console.error(error);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            Thông tin cá nhân
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-10">
            {/* ... Phần Avatar giữ nguyên ... */}
            <div className="flex flex-col items-center gap-4 w-full md:w-1/4">
              <div className="w-32 h-32 rounded-full bg-[#044d3a] text-white flex items-center justify-center text-5xl font-semibold shadow-md">
                {formData.userName
                  ? formData.userName.charAt(0).toUpperCase()
                  : "C"}
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                <button className="flex items-center gap-1 text-primary hover:text-primary-hover transition-colors">
                  <Camera size={16} /> Sửa
                </button>
                <button className="flex items-center gap-1 text-slate-500 hover:text-rose-500 transition-colors">
                  <Trash2 size={16} /> Xoá
                </button>
              </div>
            </div>

            <div className="w-full md:w-3/4 flex flex-col gap-4">
              {/* Row 1 */}
              <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                  Họ và Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                />
              </div>

              {/* Row 2 */}
              <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                  Chức danh <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                />
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-lg px-4 py-2 bg-slate-50 cursor-not-allowed">
                  <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                    Địa chỉ email (Không thể sửa)
                  </label>
                  <input
                    type="email"
                    value={initialData?.account?.email || ""}
                    disabled
                    className="w-full text-sm font-semibold text-slate-600 outline-none bg-transparent cursor-not-allowed"
                  />
                </div>
                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                  <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white relative">
                  <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                    Ngày sinh <span className="text-red-500">*</span>
                  </label>
                  {/* Sửa thành type="date" để form tự bắt chuẩn format */}
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  />
                  <Calendar
                    size={18}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white relative">
                  <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                    Giới tính
                  </label>
                  <select
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
                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white relative">
                  <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                    Tỉnh/Thành phố hiện tại{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent appearance-none cursor-pointer"
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
                <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                  <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                    Địa chỉ (Tên đường, quận/huyện,...)
                  </label>
                  <input
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
              <div className="border border-slate-300 rounded-lg px-4 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                <label className="block text-[11px] text-slate-500 font-medium mb-0.5">
                  Link cá nhân (Linkedin, portfolio,...)
                </label>
                <input
                  type="text"
                  name="cvUrl"
                  value={formData.cvUrl}
                  onChange={handleChange}
                  className="w-full text-sm font-semibold text-slate-800 outline-none bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-4 bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={handleSave}
            disabled={isPending}
            className="px-8 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary-hover shadow-md shadow-primary/20 rounded-lg transition-all active:scale-95 disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isPending ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
}
