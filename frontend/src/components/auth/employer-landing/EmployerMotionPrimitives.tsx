"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

interface RevealProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

/**
 * Scroll-triggered staggered reveal (`data-reveal` -> `data-reveal="visible"`)
 * thao tác trực tiếp trên DOM node để tránh re-render React và đạt 60fps.
 */
export function Reveal({ children, index = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-reveal", "visible");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.setAttribute("data-reveal", "visible");
            observer.unobserve(el);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-reveal=""
      style={{ "--enter-i": index } as React.CSSProperties}
      className={className}
    >
      {children}
    </div>
  );
}

interface CountUpNumberProps {
  value?: number;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/**
 * Đếm số mượt bằng requestAnimationFrame cập nhật trực tiếp textContent (0 re-render).
 */
export function CountUpNumber({
  value,
  suffix = "+",
  durationMs = 900,
  className,
}: CountUpNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof value !== "number" || Number.isNaN(value)) {
      el.textContent = "—";
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || value === 0 || typeof IntersectionObserver === "undefined") {
      el.textContent = `${value.toLocaleString("vi-VN")}${suffix}`;
      return;
    }

    let rafId = 0;
    let started = false;

    const runAnimation = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(value * eased);
        el.textContent = `${current.toLocaleString("vi-VN")}${suffix}`;
        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          runAnimation();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [value, suffix, durationMs]);

  const initialText =
    typeof value === "number" && !Number.isNaN(value)
      ? `${value.toLocaleString("vi-VN")}${suffix}`
      : "—";

  return (
    <span ref={ref} className={className}>
      {initialText}
    </span>
  );
}

/**
 * Kích hoạt Lenis smooth scroll cho trang Landing `/employer` và tự dọn dẹp khi rời trang.
 */
export function EmployerSmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
    });

    const handleAnchorClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!target) return;
      const hash = target.getAttribute("href");
      if (!hash || hash === "#") return;
      const dest = document.querySelector<HTMLElement>(hash);
      if (!dest) return;
      event.preventDefault();
      lenis.scrollTo(dest, { offset: -76 });
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return null;
}
