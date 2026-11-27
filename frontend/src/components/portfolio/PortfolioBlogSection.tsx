"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Clock,
  ArrowRight,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  PORTFOLIO_BLOG_POSTS,
  type PortfolioBlogPreview,
} from "@/constants/portfolio-content";
import { Reveal } from "@/components/auth/employer-landing/EmployerMotionPrimitives";

export default function PortfolioBlogSection() {
  const [selectedPost, setSelectedPost] =
    useState<PortfolioBlogPreview | null>(null);

  useEffect(() => {
    if (!selectedPost) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPost(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPost]);

  const featuredPost =
    PORTFOLIO_BLOG_POSTS.find((p) => p.featured) || PORTFOLIO_BLOG_POSTS[0];
  const secondaryPosts = PORTFOLIO_BLOG_POSTS.filter(
    (p) => p.id !== featuredPost.id,
  );

  return (
    <section
      id="blog"
      className="py-20 sm:py-24 bg-slate-950 border-b border-white/8 scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Blog & Cẩm nang nghề nghiệp IT
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-[10px] font-semibold text-slate-300">
                Chuyên mục sắp ra mắt
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bài viết chọn lọc về CV, Portfolio & Phỏng vấn kỹ thuật
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Nhấn vào từng bài viết bên dưới để xem nhanh tóm tắt kiến thức cốt
            lõi dành cho lập trình viên.
          </p>
        </Reveal>

        {/* Featured Editorial Card */}
        <Reveal index={1}>
          <article
            onClick={() => setSelectedPost(featuredPost)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelectedPost(featuredPost);
              }
            }}
            className="group cursor-pointer rounded-2xl bg-slate-900/85 border border-white/10 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-5 p-6 sm:p-8 bg-linear-to-br from-primary-active via-primary to-ai text-white flex flex-col justify-between gap-6">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-[11px] font-bold">
                  <Sparkles size={11} />
                  {featuredPost.dateLabel}
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-white/85">
                  <Clock size={12} />
                  {featuredPost.readTime}
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-100">
                  {featuredPost.category}
                </p>
                <p className="text-lg sm:text-xl font-extrabold leading-snug">
                  Tối ưu từng dòng trên CV IT để vượt qua ATS & chinh phục Tech
                  Lead
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/85">
                <BookOpen size={14} />
                <span>Đọc nhanh bản tóm tắt · Không rời trang</span>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-blue-400 transition-colors leading-snug">
                  {featuredPost.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <ul className="space-y-2 pt-2">
                  {featuredPost.keyPoints.slice(0, 2).map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-emerald-400 shrink-0 mt-0.5"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-bold text-blue-400">
                <span>Đọc tóm tắt bài viết</span>
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </article>
        </Reveal>

        {/* 3 Secondary Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {secondaryPosts.map((post, idx) => (
            <Reveal key={post.id} index={idx} className="h-full">
              <article
                onClick={() => setSelectedPost(post)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedPost(post);
                  }
                }}
                className="group h-full cursor-pointer p-6 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-primary/50 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-200 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-blue-300 font-bold">
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock size={12} />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-blue-400">
                  <span>Xem nhanh tóm tắt</span>
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Modal đọc nhanh bài Blog (dark theme + data-lenis-prevent) */}
      {selectedPost && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-blog-modal-title"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
            className="emp-step-enter bg-slate-900 text-slate-100 rounded-2xl border border-white/15 shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          >
            <div className="sticky top-0 z-10 px-6 py-4 bg-slate-900/95 backdrop-blur-xs border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/35 text-blue-300 font-bold">
                  {selectedPost.category}
                </span>
                <span className="text-slate-400 inline-flex items-center gap-1">
                  <Clock size={12} />
                  {selectedPost.readTime}
                </span>
              </div>
              <button
                type="button"
                aria-label="Đóng bài viết"
                onClick={() => setSelectedPost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 sm:p-7 space-y-5">
              <h3
                id="portfolio-blog-modal-title"
                className="text-xl sm:text-2xl font-extrabold text-white leading-snug"
              >
                {selectedPost.title}
              </h3>

              <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
                {selectedPost.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-white/10 space-y-2.5">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  Điểm cốt lõi cần áp dụng
                </p>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                  {selectedPost.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2
                        size={15}
                        className="text-emerald-400 shrink-0 mt-0.5"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span>
                  Bài viết tóm tắt minh họa — Chuyên mục Blog IT đầy đủ đang
                  được phát triển.
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold cursor-pointer transition-colors"
                >
                  Đóng lại
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
