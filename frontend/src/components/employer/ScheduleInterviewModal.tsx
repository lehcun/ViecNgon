"use client";

import React, { useState } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Video,
  AlignLeft,
  Send,
  Loader2,
} from "lucide-react";
import { useScheduleInterview } from "@/hooks/recruiter/useScheduleInterview";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateRequiredText } from "@/lib/validation";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
}

interface ScheduleInterviewValues {
  title: string;
  date: string;
  time: string;
  description: string;
}

export default function ScheduleInterviewModal({
  isOpen,
  onClose,
  applicationId,
  candidateName,
  jobTitle,
}: ScheduleInterviewModalProps) {
  const [values, setValues] = useState<ScheduleInterviewValues>({
    title: `Phỏng vấn vị trí ${jobTitle}`,
    date: "",
    time: "",
    description:
      "Chào bạn,\nChúng tôi rất ấn tượng với hồ sơ của bạn và muốn mời bạn tham gia buổi phỏng vấn trực tuyến...",
  });
  const [isGoogleMeet, setIsGoogleMeet] = useState(true);

  const { mutate: scheduleInterview, isPending } = useScheduleInterview();

  const {
    errors,
    formError,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  } = useFormValidation<ScheduleInterviewValues>({
    fieldOrder: ["title", "date", "time"],
    validators: {
      title: (val) =>
        validateRequiredText(val, "tiêu đề phỏng vấn", { maxLength: 150 }),
      date: (val) => {
        if (!val) return "Vui lòng chọn ngày phỏng vấn.";
        const today = new Date().toISOString().split("T")[0];
        if (val < today) return "Ngày phỏng vấn không được ở quá khứ.";
        return "";
      },
      time: (val, all) => {
        if (!val) return "Vui lòng chọn giờ phỏng vấn.";
        if (all.date) {
          const dt = new Date(`${all.date}T${val}`);
          if (!Number.isNaN(dt.getTime()) && dt.getTime() < Date.now()) {
            return "Thời gian phỏng vấn phải ở tương lai.";
          }
        }
        return "";
      },
    },
  });

  const updateField = (
    field: keyof ScheduleInterviewValues,
    nextVal: string,
  ) => {
    const next = { ...values, [field]: nextVal };
    setValues(next);
    handleFieldChange(field, nextVal, next);
    if (field === "date" && next.time) {
      handleFieldChange("time", next.time, next);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAll(values)) {
      return;
    }

    const interviewDateTime = new Date(
      `${values.date}T${values.time}`,
    ).toISOString();

    scheduleInterview(
      {
        maDon: applicationId,
        tieuDe: values.title.trim(),
        thoiGian: interviewDateTime,
        moTa: values.description.trim(),
        taoGoogleMeet: isGoogleMeet,
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (error) => {
          applyServerError(error, {
            fallbackMessage: "Không thể đặt lịch phỏng vấn. Vui lòng thử lại.",
            fieldAliases: {
              tieuDe: "title",
              thoiGian: "date",
            },
          });
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Lên lịch phỏng vấn
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Ứng viên:{" "}
              <span className="font-semibold text-primary">
                {candidateName}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="p-6 space-y-5">
          <FormBannerError message={formError} />

          <div>
            <FormLabel htmlFor="title" required>
              Tiêu đề phỏng vấn
            </FormLabel>
            <input
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => handleFieldBlur("title", values.title, values)}
              className={getInputClassName({
                hasError: Boolean(errors.title),
                className: "h-10",
              })}
              {...getFieldA11yProps("title", errors.title)}
            />
            <FieldError id="title-error" message={errors.title} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FormLabel
                htmlFor="date"
                required
                className="flex items-center gap-1.5"
              >
                <CalendarIcon size={16} className="text-slate-400" /> Ngày
                phỏng vấn
              </FormLabel>
              <input
                id="date"
                name="date"
                type="date"
                value={values.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => updateField("date", e.target.value)}
                onBlur={() => handleFieldBlur("date", values.date, values)}
                className={getInputClassName({
                  hasError: Boolean(errors.date),
                  className: "h-10 cursor-pointer",
                })}
                {...getFieldA11yProps("date", errors.date)}
              />
              <FieldError id="date-error" message={errors.date} />
            </div>

            <div>
              <FormLabel
                htmlFor="time"
                required
                className="flex items-center gap-1.5"
              >
                <Clock size={16} className="text-slate-400" /> Thời gian
              </FormLabel>
              <input
                id="time"
                name="time"
                type="time"
                value={values.time}
                onChange={(e) => updateField("time", e.target.value)}
                onBlur={() => handleFieldBlur("time", values.time, values)}
                className={getInputClassName({
                  hasError: Boolean(errors.time),
                  className: "h-10 cursor-pointer",
                })}
                {...getFieldA11yProps("time", errors.time)}
              />
              <FieldError id="time-error" message={errors.time} />
            </div>
          </div>

          <div className="p-4 border border-indigo-100 bg-indigo-50/50 rounded-xl flex items-start gap-3">
            <div className="mt-0.5 p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Video size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-800">
                Tự động tạo Google Meet
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Hệ thống sẽ tạo link họp trực tuyến và đính kèm vào email gửi
                cho ứng viên.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isGoogleMeet}
                onChange={(e) => setIsGoogleMeet(e.target.checked)}
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div>
            <FormLabel
              htmlFor="description"
              className="flex items-center gap-1.5"
            >
              <AlignLeft size={16} className="text-slate-400" /> Lời nhắn cho
              ứng viên
            </FormLabel>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={values.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-border-default rounded-lg outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm resize-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-sm font-bold rounded-lg transition-all shadow-md shadow-primary/20 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
              {isPending ? "Đang xử lý..." : "Xác nhận tạo lịch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
