"use client";

import React, { useState } from "react";
import { Mail, ChevronDown, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LogoViecNgon from "@/components/LogoViecNgon";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FieldError,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  validateEmail,
  validatePhoneVN,
  validatePositiveNumber,
  validateRequiredText,
  validateUrl,
} from "@/lib/validation";

interface EmployerConsultForm {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  location: string;
  website: string;
  agreed: boolean;
  budget: string;
  hiringDemand: string;
  biggestChallenge: string;
}

export default function EmployerRegistrationPage() {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<EmployerConsultForm>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    title: "",
    location: "",
    website: "",
    agreed: false,
    budget: "",
    hiringDemand: "",
    biggestChallenge: "",
  });

  const step1Validation = useFormValidation<
    Pick<
      EmployerConsultForm,
      | "fullName"
      | "email"
      | "phone"
      | "company"
      | "title"
      | "location"
      | "website"
      | "agreed"
    >
  >({
    fieldOrder: [
      "fullName",
      "email",
      "phone",
      "company",
      "title",
      "location",
      "website",
      "agreed",
    ],
    validators: {
      fullName: (val) =>
        validateRequiredText(val, "họ và tên", { maxLength: 100 }),
      email: (val) => validateEmail(val, true),
      phone: (val) => validatePhoneVN(val, true),
      company: (val) =>
        validateRequiredText(val, "tên công ty", { maxLength: 150 }),
      title: (val) => validateRequiredText(val, "chức vụ", { maxLength: 100 }),
      location: (val) => (val ? "" : "Vui lòng chọn địa điểm công ty."),
      website: (val) =>
        validateUrl(val, { required: false, label: "website công ty" }),
      agreed: (checked) =>
        checked
          ? ""
          : "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.",
    },
  });

  const step2Validation = useFormValidation<
    Pick<EmployerConsultForm, "budget" | "hiringDemand">
  >({
    fieldOrder: ["budget", "hiringDemand"],
    validators: {
      budget: (val) =>
        val ? "" : "Vui lòng chọn ngân sách tuyển dụng dự kiến.",
      hiringDemand: (val) =>
        validatePositiveNumber(val, {
          required: true,
          min: 1,
          max: 10000,
          label: "số lượng nhân sự dự kiến",
        }),
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const nextValue = type === "checkbox" ? checked : value;

    const nextForm = {
      ...formData,
      [name]: nextValue,
    };
    setFormData(nextForm);

    if (
      name === "fullName" ||
      name === "email" ||
      name === "phone" ||
      name === "company" ||
      name === "title" ||
      name === "location" ||
      name === "website" ||
      name === "agreed"
    ) {
      step1Validation.handleFieldChange(name, nextValue as never, nextForm);
    }

    if (name === "hiringDemand") {
      step2Validation.handleFieldChange("hiringDemand", value, nextForm);
    }
  };

  const handleBudgetSelect = (budgetOption: string) => {
    const nextForm = {
      ...formData,
      budget: budgetOption,
    };
    setFormData(nextForm);
    step2Validation.handleFieldChange("budget", budgetOption, nextForm);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1Validation.validateAll(formData)) {
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2Validation.validateAll(formData)) {
      return;
    }
    toast.success(
      "Đã gửi yêu cầu tư vấn! Đội ngũ ViecNgon sẽ liên hệ với bạn trong vòng 24 giờ.",
    );
  };

  const budgetOptions = [
    { label: "< 50M", value: "<50M" },
    { label: "50 - 200M", value: "50-200M" },
    { label: "200 - 500M", value: "200-500M" },
    { label: "500M - 1B", value: "500M-1B" },
    { label: "> 1B", value: ">1B" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      <nav className="bg-primary-dark text-white flex justify-between items-center px-4 md:px-8 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <LogoViecNgon logoTextColor="text-white" role={"NHATUYENDUNG"} />

          <div className="hidden md:flex gap-6 text-sm font-semibold text-slate-300 ml-6">
            <a
              href="#"
              className="text-white hover:text-primary-light transition-colors"
            >
              Tổng quan
            </a>
            <a href="#" className="hover:text-white transition-colors">
              AI Match
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-semibold">
          <button className="hidden md:flex items-center gap-2 border border-slate-600 rounded px-4 py-2 hover:bg-slate-800 transition-colors">
            <Mail size={16} /> Liên hệ với chúng tôi
          </button>
          <Link href="/employer/login" className="hover:text-white transition-colors">
            Đăng nhập
          </Link>
          <span className="border-l border-slate-600 pl-4 text-slate-400">
            EN | VI
          </span>
        </div>
      </nav>

      <main className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-8 py-12 gap-12 items-center relative overflow-hidden">
        <div className="absolute right-0 bottom-0 w-200 h-125 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/4 translate-y-1/4"></div>
        <div className="absolute top-0 left-[-10%] w-150 h-150 bg-primary-light/50 rounded-full blur-3xl -z-10"></div>

        <div className="w-full lg:w-1/2 flex flex-col gap-8 z-10">
          <div className="space-y-4">
            <h2 className="text-sm font-bold tracking-widest text-slate-800 uppercase">
              Giải pháp tuyển dụng
            </h2>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Tuyển dụng <br />
              <span className="text-blue-600 inline-flex items-center border-r-4 border-blue-600 pr-1 animate-pulse">
                chính xác hơn
              </span>
            </h1>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base max-w-md">
              Với cơ sở dữ liệu hồ sơ chất lượng cao, ViecNgon giúp doanh nghiệp
              tuyển dụng nhân tài hiệu quả hơn thông qua các giải pháp toàn diện
              và linh hoạt.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-6 md:p-8 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>

            {step === 1 ? (
              <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm">
                    Đăng ký để nhận tư vấn
                  </h3>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    1/2
                  </span>
                </div>

                <form
                  onSubmit={handleNextStep}
                  noValidate
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="md:col-span-2">
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      onBlur={() =>
                        step1Validation.handleFieldBlur(
                          "fullName",
                          formData.fullName,
                          formData,
                        )
                      }
                      placeholder="Họ và tên *"
                      className={getInputClassName({
                        hasError: Boolean(step1Validation.errors.fullName),
                      })}
                      {...getFieldA11yProps(
                        "fullName",
                        step1Validation.errors.fullName,
                      )}
                    />
                    <FieldError
                      id="fullName-error"
                      message={step1Validation.errors.fullName}
                    />
                  </div>

                  <div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() =>
                        step1Validation.handleFieldBlur(
                          "email",
                          formData.email,
                          formData,
                        )
                      }
                      placeholder="Email công việc *"
                      className={getInputClassName({
                        hasError: Boolean(step1Validation.errors.email),
                      })}
                      {...getFieldA11yProps(
                        "email",
                        step1Validation.errors.email,
                      )}
                    />
                    <FieldError
                      id="email-error"
                      message={step1Validation.errors.email}
                    />
                  </div>

                  <div>
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() =>
                        step1Validation.handleFieldBlur(
                          "phone",
                          formData.phone,
                          formData,
                        )
                      }
                      placeholder="Số điện thoại *"
                      className={getInputClassName({
                        hasError: Boolean(step1Validation.errors.phone),
                      })}
                      {...getFieldA11yProps(
                        "phone",
                        step1Validation.errors.phone,
                      )}
                    />
                    <FieldError
                      id="phone-error"
                      message={step1Validation.errors.phone}
                    />
                  </div>

                  <div>
                    <input
                      id="company"
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      onBlur={() =>
                        step1Validation.handleFieldBlur(
                          "company",
                          formData.company,
                          formData,
                        )
                      }
                      placeholder="Tên công ty *"
                      className={getInputClassName({
                        hasError: Boolean(step1Validation.errors.company),
                      })}
                      {...getFieldA11yProps(
                        "company",
                        step1Validation.errors.company,
                      )}
                    />
                    <FieldError
                      id="company-error"
                      message={step1Validation.errors.company}
                    />
                  </div>

                  <div>
                    <input
                      id="title"
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      onBlur={() =>
                        step1Validation.handleFieldBlur(
                          "title",
                          formData.title,
                          formData,
                        )
                      }
                      placeholder="Chức vụ *"
                      className={getInputClassName({
                        hasError: Boolean(step1Validation.errors.title),
                      })}
                      {...getFieldA11yProps(
                        "title",
                        step1Validation.errors.title,
                      )}
                    />
                    <FieldError
                      id="title-error"
                      message={step1Validation.errors.title}
                    />
                  </div>

                  <div>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      onBlur={() =>
                        step1Validation.handleFieldBlur(
                          "location",
                          formData.location,
                          formData,
                        )
                      }
                      className={getInputClassName({
                        hasError: Boolean(step1Validation.errors.location),
                        className: formData.location
                          ? "text-text-primary"
                          : "text-text-muted",
                      })}
                      {...getFieldA11yProps(
                        "location",
                        step1Validation.errors.location,
                      )}
                    >
                      <option value="">Địa điểm công ty *</option>
                      <option value="HCM">Hồ Chí Minh</option>
                      <option value="HN">Hà Nội</option>
                      <option value="DN">Đà Nẵng</option>
                      <option value="OTHER">Khác</option>
                    </select>
                    <FieldError
                      id="location-error"
                      message={step1Validation.errors.location}
                    />
                  </div>

                  <div>
                    <input
                      id="website"
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      onBlur={() =>
                        step1Validation.handleFieldBlur(
                          "website",
                          formData.website,
                          formData,
                        )
                      }
                      placeholder="Website URL (https://...)"
                      className={getInputClassName({
                        hasError: Boolean(step1Validation.errors.website),
                      })}
                      {...getFieldA11yProps(
                        "website",
                        step1Validation.errors.website,
                      )}
                    />
                    <FieldError
                      id="website-error"
                      message={step1Validation.errors.website}
                    />
                  </div>

                  <div className="md:col-span-2 mt-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="agreed"
                        id="agreed"
                        checked={formData.agreed}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer accent-primary"
                        {...getFieldA11yProps(
                          "agreed",
                          step1Validation.errors.agreed,
                        )}
                      />
                      <label
                        htmlFor="agreed"
                        className="text-[13px] text-slate-600 leading-relaxed cursor-pointer select-none"
                      >
                        Tôi đã đọc và đồng ý với{" "}
                        <a
                          href="#"
                          className="text-blue-600 font-bold hover:underline"
                        >
                          Điều khoản dịch vụ
                        </a>{" "}
                        và{" "}
                        <a
                          href="#"
                          className="text-blue-600 font-bold hover:underline"
                        >
                          Chính sách bảo mật
                        </a>{" "}
                        của ViecNgon liên quan đến thông tin cá nhân của tôi.
                      </label>
                    </div>
                    <FieldError
                      id="agreed-error"
                      message={step1Validation.errors.agreed}
                    />
                  </div>

                  <div className="md:col-span-2 mt-4">
                    <button
                      type="submit"
                      className="w-full font-bold py-3.5 rounded-lg transition-all duration-300 bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover cursor-pointer"
                    >
                      Tiếp tục để nhận tư vấn
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="p-1 text-slate-400 hover:text-primary hover:bg-primary-light rounded-full transition-colors"
                      title="Quay lại"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <h3 className="font-bold text-slate-900 tracking-wide uppercase text-sm md:text-base">
                      Hoàn tất thông tin
                    </h3>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full">
                    2/2
                  </span>
                </div>

                <form
                  onSubmit={handleStep2Submit}
                  noValidate
                  className="flex flex-col gap-6"
                >
                  <div>
                    <label className="block text-[15px] font-medium text-slate-800 mb-3">
                      Ngân sách tuyển dụng hàng năm (VNĐ){" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {budgetOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => handleBudgetSelect(option.value)}
                          className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                            formData.budget === option.value
                              ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                              : step2Validation.errors.budget
                                ? "bg-danger-soft/30 text-danger-text border-danger hover:bg-danger-soft"
                                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    <FieldError
                      id="budget-error"
                      message={step2Validation.errors.budget}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="hiringDemand"
                      className="block text-[15px] font-medium text-slate-800 mb-2"
                    >
                      Nhu cầu tuyển dụng trong 6 tháng tới{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      id="hiringDemand"
                      type="number"
                      name="hiringDemand"
                      min={1}
                      value={formData.hiringDemand}
                      onChange={handleChange}
                      onBlur={() =>
                        step2Validation.handleFieldBlur(
                          "hiringDemand",
                          formData.hiringDemand,
                          formData,
                        )
                      }
                      placeholder="Nhập số lượng nhân sự dự kiến..."
                      className={getInputClassName({
                        hasError: Boolean(step2Validation.errors.hiringDemand),
                      })}
                      {...getFieldA11yProps(
                        "hiringDemand",
                        step2Validation.errors.hiringDemand,
                      )}
                    />
                    <FieldError
                      id="hiringDemand-error"
                      message={step2Validation.errors.hiringDemand}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="biggestChallenge"
                      className="block text-[15px] font-medium text-slate-800 mb-2"
                    >
                      Thách thức lớn nhất khi tuyển dụng
                    </label>
                    <div className="relative">
                      <select
                        id="biggestChallenge"
                        name="biggestChallenge"
                        value={formData.biggestChallenge}
                        onChange={handleChange}
                        className="w-full border border-slate-200 rounded-lg px-4 py-3.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-600 bg-white hover:border-slate-300 cursor-pointer"
                      >
                        <option value="" disabled className="text-slate-400">
                          Chọn một lý do...
                        </option>
                        <option value="quality">
                          Chất lượng ứng viên chưa đạt
                        </option>
                        <option value="time">
                          Thời gian tuyển dụng quá lâu
                        </option>
                        <option value="cost">Chi phí tuyển dụng cao</option>
                        <option value="retention">
                          Tỷ lệ giữ chân nhân sự thấp
                        </option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <ChevronDown size={18} className="text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 w-fit border border-slate-200 rounded-lg p-2.5 flex items-center justify-between gap-12 bg-white shadow-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle size={22} className="text-emerald-500" />
                      <span className="text-sm text-slate-700 font-medium">
                        Xác thực thành công!
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="text-[10px] font-black text-slate-700 tracking-wider">
                        CLOUDFLARE
                      </div>
                      <div className="text-[9px] text-slate-500 flex gap-1">
                        <a href="#" className="hover:underline">
                          Privacy
                        </a>{" "}
                        •{" "}
                        <a href="#" className="hover:underline">
                          Help
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="submit"
                      className="w-full font-bold py-4 rounded-lg transition-all duration-300 text-sm md:text-base bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover cursor-pointer"
                    >
                      Gửi yêu cầu tư vấn
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex w-1/2 relative justify-center items-center z-10">
          <div className="relative w-full aspect-square max-w-lg">
            <div className="absolute top-10 left-10 w-full h-full border-2 border-primary-light rounded-3xl -z-10"></div>

            <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl relative bg-white group">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Tuyển dụng nhân sự"
                fill
                unoptimized
                loading="lazy"
                quality={75}
                sizes="100%"
                className="group-hover:scale-105 transition-transform duration-700 object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 via-transparent to-transparent"></div>

              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm p-4 md:p-5 rounded-xl shadow-lg border border-white/50 transition-all duration-300">
                {step === 1 ? (
                  <div className="flex items-center gap-3 animate-in fade-in zoom-in duration-500">
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary font-black text-lg shrink-0">
                      AI
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Kết nối thông minh
                      </p>
                      <p className="text-xs text-slate-500">
                        Tìm kiếm ứng viên phù hợp nhanh chóng, chính xác.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5 animate-in fade-in zoom-in duration-500">
                    <p className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-2">
                      <CheckCircle size={18} className="text-emerald-500" /> Sẵn
                      sàng tối ưu hóa quy trình!
                    </p>
                    <p className="text-xs text-slate-600">
                      Đội ngũ chuyên gia của ViecNgon sẽ liên hệ và thiết kế gói
                      giải pháp dành riêng cho bạn trong vòng 24h.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
