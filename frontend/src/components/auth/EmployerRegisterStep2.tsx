"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  FieldError,
  FormBannerError,
  FormLabel,
  getFieldA11yProps,
  getInputClassName,
} from "@/components/ui/FormField";

export interface EmployerStep2Values {
  companyName: string;
  location: string;
  address: string;
  website: string;
  companyModel: string;
  companySize: string;
  agreed: boolean;
}

interface EmployerRegisterStep2Props {
  values: EmployerStep2Values;
  errors: Partial<Record<keyof EmployerStep2Values, string>>;
  formError: string;
  isSubmitting: boolean;
  onChange: (
    field: keyof EmployerStep2Values,
    value: string | boolean,
  ) => void;
  onBlur: (field: keyof EmployerStep2Values) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CITY_OPTIONS = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Cần Thơ",
  "Hải Phòng",
  "Bình Dương",
  "Khác",
];

const COMPANY_MODEL_OPTIONS = [
  "Product",
  "Outsource",
  "Dịch vụ & Tư vấn IT",
  "Startup Công nghệ",
  "Tập đoàn / Enterprise",
];

const COMPANY_SIZE_OPTIONS = [
  "1 - 50 nhân viên",
  "51 - 150 nhân viên",
  "151 - 300 nhân viên",
  "301 - 1000 nhân viên",
  "1000+ nhân viên",
];

export default function EmployerRegisterStep2({
  values,
  errors,
  formError,
  isSubmitting,
  onChange,
  onBlur,
  onBack,
  onSubmit,
}: EmployerRegisterStep2Props) {
  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <FormBannerError message={formError} />

      <div>
        <FormLabel htmlFor="companyName" required>
          Tên công ty
        </FormLabel>
        <input
          id="companyName"
          name="companyName"
          type="text"
          placeholder="VD: Công ty TNHH Công nghệ ABC"
          value={values.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          onBlur={() => onBlur("companyName")}
          className={getInputClassName({
            hasError: Boolean(errors.companyName),
          })}
          {...getFieldA11yProps("companyName", errors.companyName)}
        />
        <FieldError id="companyName-error" message={errors.companyName} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="location" required>
            Thành phố / Trụ sở chính
          </FormLabel>
          <div className="relative">
            <select
              id="location"
              name="location"
              value={values.location}
              onChange={(e) => onChange("location", e.target.value)}
              onBlur={() => onBlur("location")}
              className={getInputClassName({
                hasError: Boolean(errors.location),
                className: "appearance-none pr-10 cursor-pointer",
              })}
              {...getFieldA11yProps("location", errors.location)}
            >
              <option value="">Chọn thành phố</option>
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
          <FieldError id="location-error" message={errors.location} />
        </div>

        <div>
          <FormLabel htmlFor="website">Website công ty</FormLabel>
          <input
            id="website"
            name="website"
            type="text"
            placeholder="https://company.com"
            value={values.website}
            onChange={(e) => onChange("website", e.target.value)}
            onBlur={() => onBlur("website")}
            className={getInputClassName({ hasError: Boolean(errors.website) })}
            {...getFieldA11yProps("website", errors.website)}
          />
          <FieldError id="website-error" message={errors.website} />
        </div>
      </div>

      <div>
        <FormLabel htmlFor="address">Địa chỉ văn phòng</FormLabel>
        <input
          id="address"
          name="address"
          type="text"
          placeholder="Số nhà, đường, quận/huyện..."
          value={values.address}
          onChange={(e) => onChange("address", e.target.value)}
          onBlur={() => onBlur("address")}
          className={getInputClassName({ hasError: Boolean(errors.address) })}
          {...getFieldA11yProps("address", errors.address)}
        />
        <FieldError id="address-error" message={errors.address} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FormLabel htmlFor="companyModel">Mô hình công ty</FormLabel>
          <div className="relative">
            <select
              id="companyModel"
              name="companyModel"
              value={values.companyModel}
              onChange={(e) => onChange("companyModel", e.target.value)}
              className={getInputClassName({
                className: "appearance-none pr-10 cursor-pointer",
              })}
            >
              <option value="">Chọn mô hình</option>
              {COMPANY_MODEL_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>

        <div>
          <FormLabel htmlFor="companySize">Quy mô nhân sự</FormLabel>
          <div className="relative">
            <select
              id="companySize"
              name="companySize"
              value={values.companySize}
              onChange={(e) => onChange("companySize", e.target.value)}
              className={getInputClassName({
                className: "appearance-none pr-10 cursor-pointer",
              })}
            >
              <option value="">Chọn quy mô</option>
              {COMPANY_SIZE_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted"
            />
          </div>
        </div>
      </div>

      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            id="agreed"
            name="agreed"
            type="checkbox"
            checked={values.agreed}
            onChange={(e) => onChange("agreed", e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-border-default text-primary focus:ring-primary cursor-pointer"
            {...getFieldA11yProps("agreed", errors.agreed)}
          />
          <span className="text-xs text-text-secondary leading-relaxed">
            Tôi đã đọc và đồng ý với{" "}
            <Link
              href="/terms"
              className="text-primary font-semibold hover:underline"
            >
              Điều khoản dịch vụ
            </Link>{" "}
            và{" "}
            <Link
              href="/privacy"
              className="text-primary font-semibold hover:underline"
            >
              Chính sách bảo mật
            </Link>{" "}
            của ViecNgon.
          </span>
        </label>
        <FieldError id="agreed-error" message={errors.agreed} />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-border-default bg-surface-card text-sm font-semibold text-text-secondary hover:bg-surface-muted transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ArrowLeft size={15} />
          <span>Quay lại</span>
        </button>

        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          loadingText="Đang gửi hồ sơ..."
          className="w-full sm:flex-1"
        >
          Hoàn tất đăng ký doanh nghiệp
        </Button>
      </div>
    </form>
  );
}
