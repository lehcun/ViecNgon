"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import EmployerRegisterHero from "@/components/auth/EmployerRegisterHero";
import EmployerRegisterStep1, {
  type EmployerStep1Values,
} from "@/components/auth/EmployerRegisterStep1";
import EmployerRegisterStep2, {
  type EmployerStep2Values,
} from "@/components/auth/EmployerRegisterStep2";
import EmployerRegisterSuccess from "@/components/auth/EmployerRegisterSuccess";
import { useRegisterEmployer } from "@/hooks/auth/useRegisterEmployer";
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  parseApiError,
  validateEmail,
  validatePassword,
  validatePhoneVN,
  validateRequiredText,
  validateUrl,
} from "@/lib/validation";

const STEP1_FIELDS: Array<keyof EmployerStep1Values> = [
  "employerName",
  "email",
  "phone",
  "title",
  "password",
  "confirmPassword",
];

const STEP2_FIELDS: Array<keyof EmployerStep2Values> = [
  "companyName",
  "location",
  "address",
  "website",
  "companyModel",
  "companySize",
  "agreed",
];

export default function EmployerRegistrationPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [step1, setStep1] = useState<EmployerStep1Values>({
    employerName: "",
    email: "",
    phone: "",
    title: "",
    password: "",
    confirmPassword: "",
  });
  const [step2, setStep2] = useState<EmployerStep2Values>({
    companyName: "",
    location: "",
    address: "",
    website: "",
    companyModel: "",
    companySize: "",
    agreed: false,
  });
  const [submittedInfo, setSubmittedInfo] = useState<{
    companyName: string;
    email: string;
  } | null>(null);

  const { mutateAsync: registerEmployer, isPending } = useRegisterEmployer();

  const step1Validation = useFormValidation<EmployerStep1Values>({
    fieldOrder: STEP1_FIELDS,
    validators: {
      employerName: (val) =>
        validateRequiredText(val, "họ và tên", { maxLength: 100 }),
      email: (val) => validateEmail(val, true),
      phone: (val) => validatePhoneVN(val, true),
      title: (val) => validateRequiredText(val, "chức vụ", { maxLength: 100 }),
      password: (val) => validatePassword(val, { minLength: 6 }),
      confirmPassword: (val, form) => {
        if (!val) return "Vui lòng xác nhận mật khẩu.";
        return val === form.password
          ? ""
          : "Mật khẩu xác nhận không khớp với mật khẩu đã nhập.";
      },
    },
  });

  const step2Validation = useFormValidation<EmployerStep2Values>({
    fieldOrder: STEP2_FIELDS,
    validators: {
      companyName: (val) =>
        validateRequiredText(val, "tên công ty", { maxLength: 150 }),
      location: (val) =>
        val ? "" : "Vui lòng chọn thành phố / trụ sở chính.",
      address: (val) =>
        val.trim().length > 255 ? "Địa chỉ tối đa 255 ký tự." : "",
      website: (val) =>
        validateUrl(val, { required: false, label: "website công ty" }),
      agreed: (checked) =>
        checked
          ? ""
          : "Bạn cần đồng ý với Điều khoản dịch vụ và Chính sách bảo mật.",
    },
  });

  const handleStep1Change = (
    field: keyof EmployerStep1Values,
    value: string,
  ) => {
    const next = { ...step1, [field]: value };
    setStep1(next);
    step1Validation.handleFieldChange(field, value, next);
    if (field === "password" && next.confirmPassword) {
      step1Validation.handleFieldChange(
        "confirmPassword",
        next.confirmPassword,
        next,
      );
    }
  };

  const handleStep2Change = (
    field: keyof EmployerStep2Values,
    value: string | boolean,
  ) => {
    const next = { ...step2, [field]: value };
    setStep2(next);
    step2Validation.handleFieldChange(field, value as never, next);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!step1Validation.validateAll(step1)) return;
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2Validation.validateAll(step2)) return;

    try {
      const res = await registerEmployer({
        employerName: step1.employerName.trim(),
        email: step1.email.trim(),
        phone: step1.phone.trim(),
        title: step1.title.trim(),
        password: step1.password,
        companyName: step2.companyName.trim(),
        location: step2.location.trim(),
        address: step2.address.trim() || undefined,
        website: step2.website.trim() || undefined,
        companyModel: step2.companyModel || undefined,
        companySize: step2.companySize || undefined,
      });

      toast.success(
        res.message ||
          "Đăng ký doanh nghiệp thành công! Hồ sơ đang chờ Quản trị viên duyệt.",
      );
      setSubmittedInfo({
        companyName: res.user.companyName || step2.companyName.trim(),
        email: res.user.email || step1.email.trim(),
      });
      setStep(3);
    } catch (err) {
      const { fieldErrors } = parseApiError(
        err,
        "Đăng ký doanh nghiệp thất bại.",
      );
      const hasStep1Error = STEP1_FIELDS.some((key) => Boolean(fieldErrors[key]));

      if (hasStep1Error) {
        setStep(1);
        step1Validation.applyServerError(err, {
          fallbackMessage: "Vui lòng kiểm tra lại thông tin ở Bước 1.",
        });
        return;
      }

      step2Validation.applyServerError(err, {
        fallbackMessage: "Đăng ký doanh nghiệp thất bại. Vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-surface-page flex items-center py-10 px-4 sm:px-6 lg:px-8">
      <main className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-between gap-10 lg:gap-12">
        <EmployerRegisterHero />

        <section className="w-full lg:w-7/12 max-w-xl bg-surface-card rounded-2xl border border-border-default shadow-sm p-6 sm:p-8">
          {step !== 3 && (
            <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-border-default">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-text-primary">
                  Đăng ký tài khoản Nhà tuyển dụng
                </h2>
                <p className="text-xs sm:text-sm text-text-muted mt-0.5">
                  {step === 1
                    ? "Bước 1: Thông tin tài khoản & người đại diện doanh nghiệp"
                    : "Bước 2: Thông tin doanh nghiệp để Quản trị viên xác thực"}
                </p>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-primary-light text-primary text-xs font-bold tabular-nums shrink-0">
                {step}/2
              </span>
            </div>
          )}

          {step === 1 && (
            <EmployerRegisterStep1
              values={step1}
              errors={step1Validation.errors}
              formError={step1Validation.formError}
              onChange={handleStep1Change}
              onBlur={(field) =>
                step1Validation.handleFieldBlur(field, step1[field], step1)
              }
              onNext={handleNextStep}
            />
          )}

          {step === 2 && (
            <EmployerRegisterStep2
              values={step2}
              errors={step2Validation.errors}
              formError={step2Validation.formError}
              isSubmitting={isPending}
              onChange={handleStep2Change}
              onBlur={(field) =>
                step2Validation.handleFieldBlur(field, step2[field], step2)
              }
              onBack={() => setStep(1)}
              onSubmit={handleFinalSubmit}
            />
          )}

          {step === 3 && submittedInfo && (
            <EmployerRegisterSuccess
              companyName={submittedInfo.companyName}
              email={submittedInfo.email}
            />
          )}
        </section>
      </main>
    </div>
  );
}
