"use client";

import { useCallback, useState } from "react";
import type { FieldErrorMap } from "@viecngon/types";
import { parseApiError } from "@/lib/validation";

export type FieldValidators<TValues extends object> = {
  [K in keyof TValues]?: (
    value: TValues[K],
    values: TValues,
  ) => string | undefined | null;
};

interface UseFormValidationOptions<TValues extends object> {
  validators: FieldValidators<TValues>;
  fieldOrder?: Array<keyof TValues & string>;
}

/**
 * Hook quản lý lỗi inline theo từng trường (`errors`, `touched`, `formError`),
 * hỗ trợ validate onBlur, tự clear/re-validate khi onChange và map `fieldErrors` từ Backend.
 */
export function useFormValidation<TValues extends object>({
  validators,
  fieldOrder,
}: UseFormValidationOptions<TValues>) {
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formError, setFormError] = useState<string>("");

  const runValidator = useCallback(
    <K extends keyof TValues & string>(
      field: K,
      value: TValues[K],
      values: TValues,
    ): string => {
      const fn = validators[field];
      if (!fn) return "";
      return fn(value, values) || "";
    },
    [validators],
  );

  const handleFieldBlur = useCallback(
    <K extends keyof TValues & string>(
      field: K,
      value: TValues[K],
      values: TValues,
    ) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const msg = runValidator(field, value, values);
      setErrors((prev) => {
        if (!msg) return prev;
        if (prev[field] === msg) return prev;
        return { ...prev, [field]: msg };
      });
    },
    [runValidator],
  );

  const handleFieldChange = useCallback(
    <K extends keyof TValues & string>(
      field: K,
      value: TValues[K],
      values: TValues,
    ) => {
      setFormError("");
      setErrors((prev) => {
        if (!touched[field] && !prev[field]) return prev;
        const msg = runValidator(field, value, values);
        const next = { ...prev };
        if (msg) {
          next[field] = msg;
        } else {
          delete next[field];
        }
        return next;
      });
    },
    [runValidator, touched],
  );

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) {
        next[field] = message;
      } else {
        delete next[field];
      }
      return next;
    });
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
    setFormError("");
  }, []);

  const focusField = useCallback((field: string) => {
    if (typeof document === "undefined") return;
    const target =
      document.getElementById(field) ||
      document.querySelector<HTMLElement>(`[name="${field}"]`);
    if (target && typeof target.focus === "function") {
      target.focus({ preventScroll: false });
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, []);

  const validateAll = useCallback(
    (values: TValues): boolean => {
      const nextErrors: FieldErrorMap = {};
      const nextTouched: Record<string, boolean> = {};

      const keys = Object.keys(validators) as Array<keyof TValues & string>;
      for (const key of keys) {
        nextTouched[key] = true;
        const msg = runValidator(key, values[key], values);
        if (msg) {
          nextErrors[key] = msg;
        }
      }

      setTouched((prev) => ({ ...prev, ...nextTouched }));
      setErrors(nextErrors);
      setFormError("");

      const errorKeys = Object.keys(nextErrors);
      if (errorKeys.length > 0) {
        const ordered = fieldOrder?.find((f) => nextErrors[f]);
        focusField(ordered || errorKeys[0]);
        return false;
      }

      return true;
    },
    [fieldOrder, focusField, runValidator, validators],
  );

  /**
   * Áp lỗi từ Backend vào từng trường khớp với form; nếu không có fieldErrors thì đưa vào `formError`.
   */
  const applyServerError = useCallback(
    (
      error: unknown,
      options?: {
        fallbackMessage?: string;
        fieldAliases?: Record<string, string>;
        knownFields?: string[];
      },
    ): { message: string; fieldErrors: FieldErrorMap } => {
      const parsed = parseApiError(error, options?.fallbackMessage);
      const mappedFields: FieldErrorMap = {};
      const allowed = new Set(
        options?.knownFields ||
          (Object.keys(validators) as Array<keyof TValues & string>),
      );

      for (const [rawKey, msg] of Object.entries(parsed.fieldErrors)) {
        const targetKey = options?.fieldAliases?.[rawKey] || rawKey;
        if (allowed.has(targetKey)) {
          mappedFields[targetKey] = msg;
        }
      }

      if (Object.keys(mappedFields).length > 0) {
        setErrors((prev) => ({ ...prev, ...mappedFields }));
        const firstKey =
          fieldOrder?.find((f) => mappedFields[f]) ||
          Object.keys(mappedFields)[0];
        if (firstKey) {
          focusField(firstKey);
        }
      } else {
        setFormError(parsed.message);
      }

      return {
        message: parsed.message,
        fieldErrors: mappedFields,
      };
    },
    [fieldOrder, focusField, validators],
  );

  return {
    errors,
    touched,
    formError,
    setFormError,
    setErrors,
    setFieldError,
    clearFieldError,
    clearErrors,
    handleFieldBlur,
    handleFieldChange,
    validateAll,
    applyServerError,
  };
}
