"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  FileText,
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import type { CompanyProfilePostItem } from "@viecngon/types";
import {
  useCreateCompanyPost,
  useDeleteCompanyPost,
  useUpdateCompanyPost,
  useUploadCompanyImage,
} from "@/hooks/recruiter/useEmployerProfile";
import { EmptyState } from "@/components/ui/StateViews";
import { formatDateVN } from "@/lib/formatters";

interface CompanyPostsManagerProps {
  posts: CompanyProfilePostItem[];
}

export function CompanyPostsManager({ posts }: CompanyPostsManagerProps) {
  const { mutateAsync: uploadCompanyImage } = useUploadCompanyImage();
  const { mutate: createPost, isPending: isCreating } = useCreateCompanyPost();
  const { mutate: updatePost, isPending: isUpdatingPost } =
    useUpdateCompanyPost();
  const { mutate: deletePost, isPending: isDeleting } = useDeleteCompanyPost();

  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [tieuDe, setTieuDe] = useState("");
  const [anhBiaUrl, setAnhBiaUrl] = useState("");
  const [noiDung, setNoiDung] = useState("");

  const resetComposer = () => {
    setIsComposerOpen(false);
    setEditingPostId(null);
    setTieuDe("");
    setAnhBiaUrl("");
    setNoiDung("");
  };

  const openCreateForm = () => {
    setEditingPostId(null);
    setTieuDe("");
    setAnhBiaUrl("");
    setNoiDung("");
    setIsComposerOpen(true);
  };

  const openEditForm = (post: CompanyProfilePostItem) => {
    setEditingPostId(post.maBaiViet);
    setTieuDe(post.tieuDe);
    setAnhBiaUrl(post.anhBiaUrl || "");
    setNoiDung(post.noiDung);
    setIsComposerOpen(true);
  };

  const handleUploadCover = async (file: File | undefined) => {
    if (!file) return;
    const allowedTypes = new Set([
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ]);
    if (!allowedTypes.has(file.type)) {
      toast.error("Chỉ hỗ trợ ảnh định dạng JPG, PNG, WEBP hoặc GIF.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Dung lượng ảnh bìa tối đa là 5MB.");
      return;
    }

    try {
      setIsUploadingCover(true);
      const { url } = await uploadCompanyImage(file);
      setAnhBiaUrl(url);
      toast.success("Đã tải ảnh bìa bài viết lên!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Không thể tải ảnh bìa.",
      );
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = tieuDe.trim();
    const cleanContent = noiDung.trim();
    if (!cleanTitle) {
      toast.error("Vui lòng nhập tiêu đề bài viết.");
      return;
    }
    if (!cleanContent) {
      toast.error("Vui lòng nhập nội dung bài viết.");
      return;
    }

    const payload = {
      tieuDe: cleanTitle,
      anhBiaUrl: anhBiaUrl.trim() || null,
      noiDung: cleanContent,
    };

    if (editingPostId) {
      updatePost(
        { postId: editingPostId, payload },
        {
          onSuccess: () => {
            toast.success("Đã cập nhật bài viết!");
            resetComposer();
          },
          onError: (err) => {
            toast.error(err.message || "Không thể cập nhật bài viết.");
          },
        },
      );
      return;
    }

    createPost(payload, {
      onSuccess: () => {
        toast.success("Đã đăng bài viết mới lên trang công ty!");
        resetComposer();
      },
      onError: (err) => {
        toast.error(err.message || "Không thể đăng bài viết mới.");
      },
    });
  };

  const handleConfirmDelete = (postId: string) => {
    deletePost(postId, {
      onSuccess: () => {
        toast.success("Đã xóa bài viết khỏi trang công ty.");
        setConfirmDeleteId(null);
        if (editingPostId === postId) {
          resetComposer();
        }
      },
      onError: (err) => {
        toast.error(err.message || "Không thể xóa bài viết.");
      },
    });
  };

  const isSavingPost = isCreating || isUpdatingPost;

  return (
    <div className="space-y-6">
      <input
        ref={coverInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          void handleUploadCover(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="bg-surface-card rounded-2xl border border-border-default p-6 shadow-2xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dashed border-border-default pb-3.5">
          <div className="min-w-0 flex-1">
            <h3 className="border-l-4 border-primary pl-3.5 pr-5 py-1 rounded-r-lg bg-linear-to-r from-primary-light via-primary-light/35 to-transparent font-bold text-text-primary text-base">
              Bài viết &amp; Tin tức công ty ({posts.length})
            </h3>
            <p className="text-xs text-text-muted mt-1.5">
              Các bài viết hiển thị trực tiếp tại tab &ldquo;Bài viết&rdquo; trên
              trang chi tiết doanh nghiệp.
            </p>
          </div>
          {!isComposerOpen && (
            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-light hover:bg-primary-subtle text-primary border border-primary-subtle rounded-lg text-xs font-semibold transition shrink-0"
            >
              <Plus size={15} />
              <span>Tạo bài viết mới</span>
            </button>
          )}
        </div>

        {isComposerOpen && (
          <form
            onSubmit={handleSubmitPost}
            className="rounded-xl border border-primary-subtle bg-surface-page p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2">
              <h4 className="text-sm font-bold text-text-primary">
                {editingPostId ? "Chỉnh sửa bài viết" : "Soạn bài viết mới"}
              </h4>
              <button
                type="button"
                onClick={resetComposer}
                aria-label="Đóng khung soạn bài viết"
                className="p-1 text-text-muted hover:text-text-primary transition"
              >
                <X size={16} />
              </button>
            </div>

            <div>
              <label
                htmlFor="company-post-title"
                className="block text-xs font-semibold text-text-secondary mb-1.5"
              >
                Tiêu đề bài viết <span className="text-danger">*</span>
              </label>
              <input
                id="company-post-title"
                type="text"
                maxLength={255}
                value={tieuDe}
                onChange={(e) => setTieuDe(e.target.value)}
                placeholder="VD: Hành trình chuyển đổi kiến trúc Microservices tại đội ngũ Engineering..."
                className="w-full px-3.5 py-2 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <span className="block text-xs font-semibold text-text-secondary mb-1.5">
                Ảnh bìa bài viết (Không bắt buộc)
              </span>
              {anhBiaUrl ? (
                <div className="relative h-44 w-full sm:w-80 rounded-xl overflow-hidden border border-border-default bg-surface-muted">
                  <Image
                    src={anhBiaUrl}
                    alt="Ảnh bìa bài viết"
                    fill
                    unoptimized
                    sizes="320px"
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setAnhBiaUrl("")}
                    aria-label="Xóa ảnh bìa"
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/65 hover:bg-danger text-white transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={isUploadingCover}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-dashed border-border-strong bg-surface-card hover:border-primary text-xs font-semibold text-text-secondary hover:text-primary transition"
                >
                  {isUploadingCover ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  <span>Tải ảnh bìa (tối đa 5MB)</span>
                </button>
              )}
            </div>

            <div>
              <label
                htmlFor="company-post-content"
                className="block text-xs font-semibold text-text-secondary mb-1.5"
              >
                Nội dung chi tiết <span className="text-danger">*</span>
              </label>
              <textarea
                id="company-post-content"
                rows={4}
                value={noiDung}
                onChange={(e) => setNoiDung(e.target.value)}
                placeholder="Chia sẻ câu chuyện văn hóa, bài toán kỹ thuật hoặc tin tức sự kiện của công ty..."
                className="w-full p-3.5 border border-border-default rounded-lg text-sm bg-surface-card text-text-primary leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={resetComposer}
                className="px-4 py-2 rounded-lg border border-border-default bg-surface-card hover:bg-surface-muted text-xs font-semibold text-text-secondary transition"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSavingPost}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:bg-primary-disabled text-white text-xs font-semibold transition"
              >
                {isSavingPost && <Loader2 size={14} className="animate-spin" />}
                <span>{editingPostId ? "Cập nhật bài viết" : "Đăng bài viết"}</span>
              </button>
            </div>
          </form>
        )}

        {posts.length === 0 ? (
          <EmptyState
            icon={<FileText size={22} />}
            title="Chưa có bài viết nào"
            description="Hãy đăng bài viết về môi trường làm việc, dự án công nghệ hoặc sự kiện để thu hút ứng viên IT."
            actionLabel="Tạo bài viết đầu tiên"
            onAction={openCreateForm}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => (
              <article
                key={post.maBaiViet}
                className="rounded-xl border border-border-default bg-surface-page overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {post.anhBiaUrl ? (
                    <div className="relative h-40 w-full bg-surface-muted">
                      <Image
                        src={post.anhBiaUrl}
                        alt={post.tieuDe}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-24 w-full bg-surface-subtle/60 flex items-center justify-center text-text-placeholder border-b border-border-default">
                      <ImageIcon size={24} />
                    </div>
                  )}
                  <div className="p-4 space-y-1.5">
                    <p className="text-xs text-text-muted tabular-nums">
                      Đăng ngày {formatDateVN(post.ngayDang)}
                    </p>
                    <h4 className="text-sm font-bold text-text-primary line-clamp-2">
                      {post.tieuDe}
                    </h4>
                    <p className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                      {post.noiDung}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-border-default bg-surface-card flex items-center justify-end gap-2">
                  {confirmDeleteId === post.maBaiViet ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleConfirmDelete(post.maBaiViet)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-danger hover:bg-danger-hover text-white text-xs font-semibold transition"
                      >
                        {isDeleting && (
                          <Loader2 size={12} className="animate-spin" />
                        )}
                        <span>Xác nhận xóa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-2.5 py-1 rounded-md border border-border-default text-xs font-semibold text-text-secondary hover:bg-surface-muted transition"
                      >
                        Hủy
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => openEditForm(post)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border-default hover:border-primary text-xs font-semibold text-text-secondary hover:text-primary transition"
                      >
                        <Pencil size={12} />
                        <span>Chỉnh sửa</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(post.maBaiViet)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-border-default hover:border-danger text-xs font-semibold text-text-muted hover:text-danger transition"
                      >
                        <Trash2 size={12} />
                        <span>Xóa</span>
                      </button>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
