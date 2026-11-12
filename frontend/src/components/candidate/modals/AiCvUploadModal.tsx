"use client";

import React, { useRef, useState } from "react";
import {
  X,
  UploadCloud,
  Sparkles,
  FileText,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { ParsedCvData } from "@viecngon/types";
import { useParseCv } from "@/hooks/candidate/useParseCv";
import { useApplyParsedCv } from "@/hooks/candidate/useApplyParsedCv";

interface AiCvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "UPLOAD" | "PROCESSING" | "PREVIEW";

export default function AiCvUploadModal({
  isOpen,
  onClose,
}: AiCvUploadModalProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [step, setStep] = useState<Step>("UPLOAD");
  const [progressStep, setProgressStep] = useState<1 | 2 | 3>(1);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<ParsedCvData | null>(null);
  const [uploadedFileMeta, setUploadedFileMeta] = useState<{
    fileName: string;
    fileUrl: string;
  } | null>(null);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [setAsDefaultCv, setSetAsDefaultCv] = useState(true);
  const [replaceExisting, setReplaceExisting] = useState(true);

  const { mutateAsync: parseCv } = useParseCv();
  const { mutateAsync: applyParsedCv, isPending: isSaving } =
    useApplyParsedCv();

  if (!isOpen) return null;

  const resetAndClose = () => {
    setStep("UPLOAD");
    setProgressStep(1);
    setFormData(null);
    setUploadedFileMeta(null);
    setNewSkillInput("");
    onClose();
  };

  const handleFileProcess = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Chỉ hỗ trợ file định dạng PDF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước file PDF tối đa là 5MB.");
      return;
    }

    setStep("PROCESSING");
    setProgressStep(1);

    const timer = setTimeout(() => setProgressStep(2), 800);

    try {
      const res = await parseCv(file);
      clearTimeout(timer);
      setProgressStep(3);
      setFormData(res.parsedData);
      setUploadedFileMeta(res.uploadedFile);
      setTimeout(() => setStep("PREVIEW"), 350);
    } catch {
      clearTimeout(timer);
      setStep("UPLOAD");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFileProcess(file);
  };

  const handleAddSkill = () => {
    if (!formData || !newSkillInput.trim()) return;
    const trimmed = newSkillInput.trim();
    const exists = formData.skills.some(
      (s) => s.skillName.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!exists) {
      setFormData({
        ...formData,
        skills: [...formData.skills, { skillName: trimmed, level: null }],
      });
    }
    setNewSkillInput("");
  };

  const handleSaveProfile = async () => {
    if (!formData) return;
    await applyParsedCv({
      ...formData,
      fileName: uploadedFileMeta?.fileName,
      fileUrl: uploadedFileMeta?.fileUrl,
      setAsDefaultCv,
      replaceExisting,
    });
    resetAndClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                Tải lên CV để AI tự động điền hồ sơ
              </h3>
              <p className="text-xs text-slate-500">
                Hỗ trợ file PDF (tối đa 5MB), bóc tách thông minh bằng Gemini AI
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === "UPLOAD" && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-slate-300 hover:border-primary/60 hover:bg-slate-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleFileProcess(file);
                }}
              />
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <UploadCloud size={28} />
              </div>
              <p className="font-semibold text-slate-800 mb-1">
                Kéo thả file CV PDF vào đây hoặc bấm để chọn file
              </p>
              <p className="text-xs text-slate-500">
                Khuyên dùng CV PDF xuất từ Word, Canva, TopCV (không phải file
                ảnh scan)
              </p>
            </div>
          )}

          {step === "PROCESSING" && (
            <div className="py-10 max-w-md mx-auto space-y-6">
              <div className="flex flex-col items-center text-center">
                <Loader2 size={40} className="animate-spin text-primary mb-3" />
                <p className="font-bold text-slate-800">
                  Đang xử lý CV của bạn...
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Quá trình này thường mất khoảng 5–10 giây
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 1, label: "Đang đọc văn bản từ file PDF" },
                  { id: 2, label: "AI đang phân tích kỹ năng & kinh nghiệm" },
                  { id: 3, label: "Chuẩn bị dữ liệu điền vào hồ sơ" },
                ].map((item) => {
                  const done = progressStep > item.id;
                  const active = progressStep === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-sm ${
                        done
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : active
                            ? "bg-primary/5 border-primary/30 text-primary font-medium"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 size={18} />
                      ) : active ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <FileText size={18} />
                      )}
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === "PREVIEW" && formData && (
            <div className="space-y-6">
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>
                  Vui lòng kiểm tra và chỉnh sửa lại thông tin AI vừa bóc tách
                  trước khi bấm <strong>Lưu vào Hồ sơ</strong>.
                </span>
              </div>

              {/* Thông tin cơ bản */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    value={formData.fullName ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Chức danh / Chuyên môn
                  </label>
                  <input
                    type="text"
                    value={formData.profession ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, profession: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="text"
                    value={formData.phoneNumber ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Số năm kinh nghiệm
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.yearsOfExperience ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        yearsOfExperience: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Ngày sinh (YYYY-MM-DD)
                  </label>
                  <input
                    type="text"
                    value={formData.dateOfBirth ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfBirth: e.target.value || null,
                      })
                    }
                    placeholder="1999-05-20"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    value={formData.address ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Giới thiệu bản thân */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Giới thiệu bản thân
                </label>
                <textarea
                  rows={3}
                  value={formData.aboutMe ?? ""}
                  onChange={(e) =>
                    setFormData({ ...formData, aboutMe: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              {/* Kỹ năng */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Kỹ năng ({formData.skills.length})
                </label>
                <div className="flex flex-wrap gap-2 mb-2.5">
                  {formData.skills.map((skill, idx) => (
                    <span
                      key={`${skill.skillName}-${idx}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                    >
                      {skill.skillName}
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            skills: formData.skills.filter((_, i) => i !== idx),
                          })
                        }
                        className="hover:text-rose-600"
                      >
                        <X size={13} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Thêm kỹ năng (VD: Docker, Next.js...)"
                    className="flex-1 px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus size={14} /> Thêm
                  </button>
                </div>
              </div>

              {/* Kinh nghiệm làm việc */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Kinh nghiệm làm việc ({formData.experiences.length})
                </label>
                <div className="space-y-3">
                  {formData.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">
                          Kinh nghiệm #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              experiences: formData.experiences.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={exp.companyName}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[idx] = {
                              ...exp,
                              companyName: e.target.value,
                            };
                            setFormData({ ...formData, experiences: updated });
                          }}
                          placeholder="Tên công ty"
                          className="px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[idx] = { ...exp, position: e.target.value };
                            setFormData({ ...formData, experiences: updated });
                          }}
                          placeholder="Vị trí"
                          className="px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[idx] = {
                              ...exp,
                              startDate: e.target.value,
                            };
                            setFormData({ ...formData, experiences: updated });
                          }}
                          placeholder="Bắt đầu (YYYY-MM-DD)"
                          className="px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          value={exp.endDate ?? ""}
                          onChange={(e) => {
                            const updated = [...formData.experiences];
                            updated[idx] = {
                              ...exp,
                              endDate: e.target.value || null,
                            };
                            setFormData({ ...formData, experiences: updated });
                          }}
                          placeholder="Kết thúc (để trống nếu Hiện tại)"
                          className="px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Học vấn */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  Học vấn ({formData.educations.length})
                </label>
                <div className="space-y-3">
                  {formData.educations.map((edu, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-500">
                          Học vấn #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              educations: formData.educations.filter(
                                (_, i) => i !== idx,
                              ),
                            })
                          }
                          className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                        >
                          <Trash2 size={13} /> Xóa
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={edu.schoolName}
                          onChange={(e) => {
                            const updated = [...formData.educations];
                            updated[idx] = {
                              ...edu,
                              schoolName: e.target.value,
                            };
                            setFormData({ ...formData, educations: updated });
                          }}
                          placeholder="Tên trường"
                          className="px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          value={edu.major}
                          onChange={(e) => {
                            const updated = [...formData.educations];
                            updated[idx] = { ...edu, major: e.target.value };
                            setFormData({ ...formData, educations: updated });
                          }}
                          placeholder="Chuyên ngành"
                          className="px-2.5 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tùy chọn lưu */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replaceExisting}
                    onChange={(e) => setReplaceExisting(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>
                    Ghi đè danh sách kinh nghiệm, học vấn, kỹ năng cũ bằng dữ
                    liệu mới
                  </span>
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={setAsDefaultCv}
                    onChange={(e) => setSetAsDefaultCv(e.target.checked)}
                    className="rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <span>Đặt file CV PDF vừa tải lên làm CV mặc định</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={resetAndClose}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Hủy
          </button>
          {step === "PREVIEW" && (
            <button
              type="button"
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="px-5 py-2 text-sm font-semibold bg-primary hover:bg-primary-hover text-white rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-60"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              Lưu vào Hồ sơ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

