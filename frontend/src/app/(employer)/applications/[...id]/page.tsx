"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronLeft,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  GraduationCap,
  Calendar,
  CalendarClock,
  CheckCircle2,
  XCircle,
  UserCheck,
  ExternalLink,
} from "lucide-react";
import { useApplicationDetail } from "@/hooks/recruiter/useApplicationDetail";
import { useUpdateApplicationStatus } from "@/hooks/recruiter/useUpdateApplicationStatus";
import SendEmailModal from "@/components/employer/SendEmailModel";
import ScheduleInterviewModal from "@/components/employer/ScheduleInterviewModal";
import AiCandidateScreeningCard from "@/components/employer/AiCandidateScreeningCard";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/Button";
import { DetailPaneSkeleton, ErrorState } from "@/components/ui/StateViews";
import { formatDateVN } from "@/lib/formatters";

export default function ApplicationDetailPage() {
  const params = useParams();
  const maDon = Array.isArray(params.id)
    ? params.id[0]
    : (params.id as string);

  const {
    data: application,
    isLoading,
    isError,
    refetch,
  } = useApplicationDetail(maDon);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateApplicationStatus();

  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pb-12 space-y-6">
        <div className="h-5 w-48 bg-surface-subtle rounded animate-pulse" />
        <DetailPaneSkeleton />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="bg-surface-card border border-border-default rounded-xl p-6">
          <ErrorState
            title="Không tìm thấy hồ sơ ứng tuyển"
            message="Hồ sơ có thể đã bị xóa hoặc bạn không có quyền truy cập."
            onRetry={() => refetch()}
          />
          <div className="text-center mt-4">
            <Link
              href="/applications"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Quay lại danh sách ứng viên
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleUpdateStatus = (newStatus: string) => {
    updateStatus({ maDon: application.applicationId, status: newStatus });
  };

  return (
    <div className="max-w-6xl mx-auto pb-14 space-y-6">
      {/* Breadcrumb Back */}
      <div>
        <Link
          href="/applications"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-primary transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Quay lại danh sách ứng viên</span>
        </Link>
      </div>

      {/* Header Hồ sơ Ứng viên */}
      <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4 min-w-0">
          <CompanyLogo
            src={application.avatarUrl}
            name={application.candidateName}
            size="lg"
            shape="circle"
          />
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-bold text-text-primary">
                {application.candidateName}
              </h1>
              <StatusBadge status={application.status} type="application" />
            </div>

            <p className="text-sm font-semibold text-primary">
              {application.profession || "Ứng viên IT"}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Briefcase size={14} className="text-text-secondary" />
                Vị trí ứng tuyển:{" "}
                <strong className="text-text-primary">
                  {application.jobTitle}
                </strong>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={14} className="text-text-secondary" />
                Nộp ngày {formatDateVN(application.appliedAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {application.cvUrl && (
            <a
              href={application.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-10 px-4 text-sm font-semibold text-text-primary bg-surface-muted hover:bg-surface-subtle border border-border-default rounded-lg transition-colors"
            >
              <FileText size={16} className="text-primary" />
              <span>Xem CV PDF</span>
              <ExternalLink size={13} className="text-text-muted" />
            </a>
          )}

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsEmailModalOpen(true)}
          >
            <Mail size={16} />
            Gửi Email
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsScheduleModalOpen(true)}
          >
            <CalendarClock size={16} />
            Mời phỏng vấn
          </Button>
        </div>
      </div>

      {/* Thanh chuyển trạng thái nhanh */}
      <div className="bg-surface-card border border-border-default rounded-xl px-5 py-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-sm font-semibold text-text-primary">
          Cập nhật nhanh trạng thái tuyển dụng:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={isUpdatingStatus || application.status === "DANG_XEM_XET"}
            onClick={() => handleUpdateStatus("DANG_XEM_XET")}
          >
            <UserCheck size={14} />
            Đánh dấu đang xem xét
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={isUpdatingStatus || application.status === "DUOC_NHAN"}
            onClick={() => handleUpdateStatus("DUOC_NHAN")}
            className="text-success-text border-success-border hover:bg-success-light"
          >
            <CheckCircle2 size={14} />
            Đánh dấu trúng tuyển
          </Button>
          <Button
            variant="danger"
            size="sm"
            disabled={isUpdatingStatus || application.status === "BI_LOAI"}
            onClick={() => handleUpdateStatus("BI_LOAI")}
          >
            <XCircle size={14} />
            Chưa phù hợp
          </Button>
        </div>
      </div>

      {/* AI Screening Block */}
      <AiCandidateScreeningCard applicationId={application.applicationId} />

      {/* Chi tiết hồ sơ 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột trái: Thông tin liên hệ & Kỹ năng */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-surface-card border border-border-default rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-text-primary pb-2.5 border-b border-border-default">
              Thông tin liên hệ
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Mail size={16} className="text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-text-muted">Email</p>
                  <p className="font-medium text-text-primary break-all">
                    {application.contact.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Số điện thoại</p>
                  <p className="font-medium text-text-primary">
                    {application.contact.phoneNumber || "Chưa cập nhật"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-text-muted">Địa chỉ</p>
                  <p className="font-medium text-text-primary">
                    {application.contact.address || "Chưa cập nhật"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-card border border-border-default rounded-xl p-5 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-text-primary pb-2.5 border-b border-border-default">
              Kỹ năng chuyên môn ({application.skills.length})
            </h2>
            {application.skills.length === 0 ? (
              <p className="text-sm text-text-muted">
                Ứng viên chưa cập nhật kỹ năng trên hồ sơ trực tuyến.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {application.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-surface-muted text-text-primary border border-border-default"
                  >
                    <span>{skill.skillName}</span>
                    {skill.level && (
                      <span className="text-text-muted">· {skill.level}</span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Cột phải: Thư xin việc, Kinh nghiệm, Học vấn */}
        <div className="lg:col-span-8 space-y-6">
          {/* Giới thiệu & Thư ứng tuyển */}
          {(application.coverLetter || application.aboutMe) && (
            <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-xs space-y-4">
              {application.coverLetter && (
                <div>
                  <h2 className="text-base font-bold text-text-primary mb-2">
                    Thư giới thiệu ứng tuyển
                  </h2>
                  <div className="p-4 bg-surface-muted border border-border-default rounded-lg text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                    {application.coverLetter}
                  </div>
                </div>
              )}

              {application.aboutMe && (
                <div>
                  <h2 className="text-base font-bold text-text-primary mb-2">
                    Giới thiệu bản thân
                  </h2>
                  <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                    {application.aboutMe}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Kinh nghiệm làm việc */}
          <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2 pb-2.5 border-b border-border-default">
              <Briefcase size={18} className="text-primary" />
              Kinh nghiệm làm việc ({application.experiences.length})
            </h2>

            {application.experiences.length === 0 ? (
              <p className="text-sm text-text-muted">
                Chưa có kinh nghiệm làm việc được khai báo.
              </p>
            ) : (
              <div className="space-y-5">
                {application.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="relative pl-4 border-l-2 border-primary/30 space-y-1"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-text-primary">
                        {exp.position}
                      </h3>
                      <span className="text-xs font-medium text-text-muted tabular-nums">
                        {formatDateVN(exp.startDate)} –{" "}
                        {exp.endDate ? formatDateVN(exp.endDate) : "Hiện tại"}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-primary">
                      {exp.companyName}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed pt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Học vấn */}
          <div className="bg-surface-card border border-border-default rounded-xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-text-primary flex items-center gap-2 pb-2.5 border-b border-border-default">
              <GraduationCap size={18} className="text-primary" />
              Học vấn ({application.educations.length})
            </h2>

            {application.educations.length === 0 ? (
              <p className="text-sm text-text-muted">
                Chưa có thông tin học vấn.
              </p>
            ) : (
              <div className="space-y-4">
                {application.educations.map((edu) => (
                  <div
                    key={edu.id}
                    className="p-4 rounded-lg bg-surface-muted border border-border-default space-y-1"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-bold text-text-primary">
                        {edu.schoolName}
                      </h3>
                      <span className="text-xs text-text-muted tabular-nums">
                        {formatDateVN(edu.startDate)} –{" "}
                        {edu.endDate ? formatDateVN(edu.endDate) : "Hiện tại"}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      Chuyên ngành: {edu.major}
                    </p>
                    {edu.gpa && (
                      <p className="text-xs font-medium text-text-muted">
                        GPA: {edu.gpa}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        candidateEmail={application.contact.email}
        jobTitle={application.jobTitle}
        applicationId={application.applicationId}
      />

      <ScheduleInterviewModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        applicationId={application.applicationId}
        candidateName={application.candidateName}
        jobTitle={application.jobTitle}
      />
    </div>
  );
}
