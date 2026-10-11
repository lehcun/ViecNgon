"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGoogleLogin as useOAuthLogin } from "@react-oauth/google";
import { useGoogleLogin, useGoogleRegister } from "@/hooks/auth/useGoogleAuth";
import toast from "react-hot-toast";

interface GoogleButtonProps {
  mode: "login" | "register";
  disabled?: boolean;
}

export default function GoogleButton({
  mode,
  disabled = false,
}: GoogleButtonProps) {
  const router = useRouter();
  const { mutate: googleLogin, isPending: isLoginPending } = useGoogleLogin();
  const { mutate: googleRegister, isPending: isRegisterPending } =
    useGoogleRegister();

  const isPending = isLoginPending || isRegisterPending;

  const handleGoogleAuth = useOAuthLogin({
    onSuccess: (tokenResponse) => {
      const accessToken = tokenResponse.access_token;

      if (mode === "register") {
        googleRegister(
          { accessToken },
          {
            onSuccess: (user) => {
              toast.success(`Đăng ký thành công! Chào mừng ${user.name}`);
              router.push("/dashboard");
            },
            onError: (err) => toast.error(err.message),
          },
        );
      } else {
        googleLogin(
          { accessToken },
          {
            onSuccess: () => {
              toast.success("Đăng nhập bằng Google thành công!");
              router.push("/dashboard");
            },
            onError: (err) => toast.error(err.message),
          },
        );
      }
    },
    onError: () => toast.error("Xác thực Google thất bại!"),
  });

  return (
    <button
      type="button"
      disabled={disabled || isPending}
      onClick={() => handleGoogleAuth()}
      className="w-full flex items-center justify-center gap-3 py-3 border border-slate-300 rounded-lg text-slate-700 font-bold hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
    >
      <Image
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        alt="Google"
        width={20}
        height={20}
      />
      <span>
        {isPending
          ? "Đang xử lý..."
          : mode === "register"
            ? "Đăng ký với Google"
            : "Đăng nhập với Google"}
      </span>
    </button>
  );
}
