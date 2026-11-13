"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  Eye,
  Info,
  Edit3,
  CheckCircle,
  Link2,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";
import { useApplyJob, useJobDetail } from "@/hooks/job/useJobDetail";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import toast from "react-hot-toast";
import AiMatchBadge from "@/components/job/AiMatchBadge";
import { formatDateVN } from "@/lib/formatters";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DetailPaneSkeleton, ErrorState } from "@/components/ui/StateViews";

export default function ApplyJobPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { user } = useAuthStore();
  const { job, isLoading: isJobLoading } = useJobDetail(slug);
  const { candidateProfile: profile, isLoading: isProfileLoading } =
    useCandidateProfile();
  const { mutate, isPending } = useApplyJob(slug);

  const [manualCvOption, setManualCvOption] = useState<
    "existing" | "new" | null
  >(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [cvUrl, setCvUrl] = useState("");

  const defaultCv = profile?.defaultCvFile;
  const existingCvName =
    defaultCv?.fileName ||
    profile?.cvUrl?.split("/").pop() ||
    `CV_ViecNgon_${profile?.candidateName?.replace(/\s+/g, "_") || "UngVien"}.pdf`;
  const existingCvUrl = defaultCv?.fileUrl || profile?.cvUrl;
  const existingCvDate = formatDateVN(defaultCv?.uploadedAt);
  const hasExistingCv = Boolean(existingCvUrl);

  const cvOption =
    manualCvOption !== null
      ? manualCvOption
      : hasExistingCv
        ? "existing"
        : "new";

  if (!user || isJobLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-surface-page py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <DetailPaneSkeleton />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-surface-page flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <ErrorState
            title="Không tìm thấy công việc"
            message="Tin tuyển dụng này không tồn tại hoặc đã bị gỡ khỏi hệ thống."
          />
        </div>
      </div>
    );
  }

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    const finalCvUrl =
      cvOption === "existing" ? existingCvUrl : cvUrl.trim();

    if (!finalCvUrl) {
      toast.error("Vui lòng cung cấp CV để ứng tuyển!");
      return;
    }

    mutate(
      {
        maCongViec: job.id,
        coverLetter: coverLetter.trim() || undefined,
        chiTiet: coverLetter.trim() || undefined,
        maCvFile:
          cvOption === "existing" ? defaultCv?.id || undefined : undefined,
        fileCvUrl: finalCvUrl,
      },
      {
        onSuccess: () => {
          router.push("/my-jobs/applied");
        },
      },
    );
  };

  const handleOpenExistingCV = (e: React.MouseEvent) => {
    e.preventDefault();
    if (existingCvUrl) {
      window.open(existingCvUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-surface-page relative">
      <div className="absolute top-0 left-0 w-full h-72 bg-primary-dark overflow-hidden z-0" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-6 pb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-1 text-white text-sm font-semibold hover:text-blue-200 transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} /> Quay lại
        </button>
        <Link href="/" className="flex items-center gap-1.5">
          <div className="bg-surface-card rounded-lg w-8 h-8 flex items-center justify-center text-primary font-bold shadow-xs">
            V
          </div>
          <span className="text-xl font-extrabold text-white tracking-tight">
            iecNgon
          </span>
        </Link>
        <div className="w-20" />
      </div>

      <main className="relative z-10 max-w-3xl mx-auto px-4 md:px-8 pb-20">
        <div className="bg-surface-card rounded-2xl shadow-lg border border-border-default p-6 md:p-9">
          <h1 className="text-xl md:text-2xl font-bold text-text-main mb-4 leading-tight">
            {job.title} tại{" "}
            <span className="text-primary">
              {job.company?.name || "Công ty"}
            </span>
          </h1>

          <AiMatchBadge jobId={job.id} />

          {job.isApplied ? (
            <div className="p-6 rounded-xl bg-success-light border border-success-border text-center space-y-4 mt-4">
              <CheckCircle size={40} className="mx-auto text-success-text" />
              <div className="space-y-1.5">
                <h2 className="text-lg font-bold text-text-main">
                  Bạn đã ứng tuyển công việc này
                </h2>
                {job.applicationStatus && (
                  <div className="flex justify-center">
                    <StatusBadge
                      type="application"
                      status={job.applicationStatus}
                    />
                  </div>
                )}
                <p className="text-sm text-text-secondary">
                  Bạn có thể theo dõi trạng thái hồ sơ trong danh sách việc làm
                  đã ứng tuyển.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Link
                  href={`/jobs/${slug}`}
                  className="px-4 py-2 rounded-lg border border-border-default bg-surface-card text-text-main text-sm font-semibold hover:bg-surface-subtle transition-colors"
                >
                  Xem lại tin tuyển dụng
                </Link>
                <Link
                  href="/my-jobs/applied"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-colors"
                >
                  Việc làm đã ứng tuyển
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-7 mt-4" onSubmit={handleApply}>
              <div>
                <h2 className="text-base font-bold text-text-main mb-3 flex items-center gap-1">
                  CV ứng tuyển <span className="text-danger">*</span>
                </h2>

                <div className="flex flex-col gap-3">
                  <label
                    className={`relative flex flex-col p-4 border rounded-xl transition-all ${
                      !hasExistingCv
                        ? "opacity-55 cursor-not-allowed bg-surface-subtle"
                        : "cursor-pointer"
                    } ${
                      cvOption === "existing" && hasExistingCv
                        ? "border-primary bg-primary-light/30 shadow-xs"
                        : "border-border-default hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="radio"
                        name="cvOption"
                        value="existing"
                        checked={cvOption === "existing"}
                        onChange={() => setManualCvOption("existing")}
                        disabled={!hasExistingCv}
                        className="w-4 h-4 text-primary focus:ring-primary border-border-default"
                      />
                      <span className="font-semibold text-text-main text-sm inline-flex items-center gap-2">
                        Sử dụng CV hiện tại{" "}
                        {hasExistingCv && (
                          <StatusBadge
                            type="custom"
                            tone="success"
                            label="Đề xuất"
                          />
                        )}
                      </span>
                    </div>

                    {hasExistingCv ? (
                      <div className="ml-7">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleOpenExistingCV}
                            className="text-sm font-medium text-primary hover:underline text-left truncate max-w-xs"
                          >
                            {existingCvName}
                          </button>
                          <Eye size={14} className="text-primary shrink-0" />
                        </div>
                        <p className="text-xs text-text-muted mt-1">
                          Ngày cập nhật: {existingCvDate}
                        </p>
                      </div>
                    ) : (
                      <div className="ml-7">
                        <p className="text-xs text-danger-text font-medium">
                          Bạn chưa lưu CV nào trên hệ thống.
                        </p>
                      </div>
                    )}
                  </label>

                  <label
                    className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all ${
                      cvOption === "new"
                        ? "border-primary bg-primary-light/30 shadow-xs"
                        : "border-border-default hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="cvOption"
                        value="new"
                        checked={cvOption === "new"}
                        onChange={() => setManualCvOption("new")}
                        className="w-4 h-4 text-primary focus:ring-primary border-border-default"
                      />
                      <span className="font-semibold text-text-main text-sm">
                        Nhập liên kết CV khác (Google Drive / Notion / Portfolio)
                      </span>
                    </div>

                    {cvOption === "new" && (
                      <div className="ml-7 mt-3">
                        <div className="relative flex items-center">
                          <Link2
                            size={16}
                            className="absolute left-3 text-text-subtle pointer-events-none"
                          />
                          <input
                            type="url"
                            placeholder="https://drive.google.com/... hoặc đường dẫn CV"
                            value={cvUrl}
                            onChange={(e) => setCvUrl(e.target.value)}
                            required={cvOption === "new"}
                            className="w-full h-10 pl-9 pr-3 text-sm border border-border-default rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 bg-surface-card"
                          />
                        </div>
                        <p className="text-xs text-text-muted mt-1.5">
                          Đảm bảo liên kết ở chế độ công khai để nhà tuyển dụng
                          có thể xem.
                        </p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-base font-bold text-text-main">
                    Thông tin liên hệ
                  </h2>
                  <button
                    type="button"
                    onClick={() => router.push("/cv-profile")}
                    className="text-primary hover:underline flex items-center gap-1 text-sm font-medium cursor-pointer"
                  >
                    <Edit3 size={15} /> Chỉnh sửa
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-border-default rounded-lg px-3.5 py-2.5 bg-surface-subtle">
                    <span className="block text-[11px] text-text-muted font-medium mb-0.5">
                      Họ và tên
                    </span>
                    <p className="text-sm font-semibold text-text-main truncate">
                      {profile?.candidateName || user.name || "Chưa cập nhật"}
                    </p>
                  </div>

                  <div className="border border-border-default rounded-lg px-3.5 py-2.5 bg-surface-subtle">
                    <span className="block text-[11px] text-text-muted font-medium mb-0.5">
                      Số điện thoại
                    </span>
                    <p className="text-sm font-semibold text-text-main truncate">
                      {profile?.account?.phoneNumber || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-2">
                  Thông tin liên hệ được đồng bộ tự động từ Hồ sơ ViecNgon của
                  bạn.
                </p>
              </div>

              <div>
                <h2 className="text-base font-bold text-text-main flex items-center gap-1.5 mb-2">
                  <span>Thư giới thiệu / Lời nhắn</span>
                  <Info size={14} className="text-text-subtle" />
                  <span className="text-text-muted font-normal text-xs ml-1">
                    (Không bắt buộc)
                  </span>
                </h2>

                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  maxLength={500}
                  placeholder="Tóm tắt ngắn gọn kỹ năng hoặc dự án nổi bật khiến bạn phù hợp với vị trí này..."
                  className="w-full p-3.5 text-sm text-text-main border border-border-default rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 bg-surface-card resize-y"
                />
                <p className="text-xs text-text-muted mt-1 text-right">
                  {coverLetter.length}/500 ký tự
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isPending}
                  loadingText="Đang gửi hồ sơ..."
                  disabled={!hasExistingCv && cvOption === "existing"}
                >
                  Nộp đơn ứng tuyển
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
