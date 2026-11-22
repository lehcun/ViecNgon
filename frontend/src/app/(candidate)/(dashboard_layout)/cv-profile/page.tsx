"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Camera,
  Edit3,
  PlusCircle,
  Trash2,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Link as LinkIcon,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
} from "lucide-react";
import toast from "react-hot-toast";
import PersonalInfoModal from "@/components/candidate/PersonalInfoModal";
import AboutMeModal from "@/components/candidate/modals/AboutMeModal";
import ExperienceModal from "@/components/candidate/modals/ExperienceModal";
import EducationModal from "@/components/candidate/modals/EducationModal";
import CertificateModal from "@/components/candidate/modals/CertificateModal";
import PortfolioModal from "@/components/candidate/modals/PortfolioModal";
import ConfirmDeleteModal from "@/components/candidate/modals/ConfirmDeleteModal";
import AiCvUploadModal from "@/components/candidate/modals/AiCvUploadModal";
import ProfileCompletionSidebarCard from "@/components/candidate/ProfileCompletionSidebarCard";
import type { ProfileSuggestionKey } from "@/lib/candidate-completion";
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { useUploadCandidateAvatar } from "@/hooks/candidate/useUploadCandidateAvatar";
import {
  ImageCropperModal,
  validateAvatarImageFile,
} from "@/components/ui/ImageCropperModal";
import { formatDateVN } from "@/lib/formatters";
import { CandidateProfileResponse } from "@viecngon/types";
import { ErrorState, ProfileHeaderSkeleton } from "@/components/ui/StateViews";

type SubEntityType = "experience" | "education" | "certificate" | "portfolio";

interface DeleteModalState {
  isOpen: boolean;
  type: SubEntityType | null;
  id: string | null;
  title: string;
  message: string;
}

export default function CandidateProfilePage() {
  const { candidateProfile, isLoading, isError } = useCandidateProfile();
  const {
    deleteExperience,
    isDeletingExperience,
    deleteEducation,
    isDeletingEducation,
    deleteCertificate,
    isDeletingCertificate,
    deletePortfolio,
    isDeletingPortfolio,
  } = useManageCandidateItems();

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadAvatarAsync, isPending: isUploadingAvatar } =
    useUploadCandidateAvatar();

  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [isAiCvModalOpen, setIsAiCvModalOpen] = useState(false);
  const [cropAvatarFile, setCropAvatarFile] = useState<File | null>(null);

  const [experienceModal, setExperienceModal] = useState<{
    isOpen: boolean;
    data: CandidateProfileResponse["experiences"][number] | null;
  }>({ isOpen: false, data: null });

  const [educationModal, setEducationModal] = useState<{
    isOpen: boolean;
    data: CandidateProfileResponse["educations"][number] | null;
  }>({ isOpen: false, data: null });

  const [certificateModal, setCertificateModal] = useState<{
    isOpen: boolean;
    data: CandidateProfileResponse["certificates"][number] | null;
  }>({ isOpen: false, data: null });

  const [portfolioModal, setPortfolioModal] = useState<{
    isOpen: boolean;
    data: CandidateProfileResponse["portfolios"][number] | null;
  }>({ isOpen: false, data: null });

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    type: null,
    id: null,
    title: "",
    message: "",
  });

  const isDeletingAny =
    isDeletingExperience ||
    isDeletingEducation ||
    isDeletingCertificate ||
    isDeletingPortfolio;

  const handleDeleteConfirm = async () => {
    if (!deleteModal.id || !deleteModal.type) return;

    try {
      switch (deleteModal.type) {
        case "experience":
          await deleteExperience(deleteModal.id);
          toast.success("Xoá kinh nghiệm làm việc thành công!");
          break;
        case "education":
          await deleteEducation(deleteModal.id);
          toast.success("Xoá học vấn thành công!");
          break;
        case "certificate":
          await deleteCertificate(deleteModal.id);
          toast.success("Xoá chứng chỉ thành công!");
          break;
        case "portfolio":
          await deletePortfolio(deleteModal.id);
          toast.success("Xoá dự án nổi bật thành công!");
          break;
      }
      setDeleteModal((prev) => ({ ...prev, isOpen: false }));
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Có lỗi xảy ra";
      toast.error(msg);
    }
  };

  const handleSelectQuickAvatar = (file: File | undefined) => {
    if (!file) return;
    const validationError = validateAvatarImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    setCropAvatarFile(file);
  };

  const handleConfirmQuickAvatar = async (croppedFile: File) => {
    try {
      await uploadAvatarAsync({ file: croppedFile, persist: true });
      setCropAvatarFile(null);
      toast.success("Đã cập nhật ảnh đại diện!");
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : "Không thể cập nhật ảnh đại diện.";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <ProfileHeaderSkeleton />
          <div className="h-40 bg-surface-card rounded-xl border border-border-default p-6 animate-pulse" />
          <div className="h-56 bg-surface-card rounded-xl border border-border-default p-6 animate-pulse" />
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-72 bg-surface-card rounded-xl border border-border-default p-6 animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError || !candidateProfile) {
    return (
      <ErrorState
        message="Không thể tải thông tin hồ sơ ứng viên. Vui lòng thử đăng nhập lại."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const handleSelectSuggestion = (key: ProfileSuggestionKey) => {
    switch (key) {
      case "personalInfo":
        setIsEditInfoOpen(true);
        break;
      case "aboutMe":
        setIsAboutMeOpen(true);
        break;
      case "education":
        setEducationModal({ isOpen: true, data: null });
        break;
      case "experience":
        setExperienceModal({ isOpen: true, data: null });
        break;
      case "portfolio":
        setPortfolioModal({ isOpen: true, data: null });
        break;
      case "certificate":
        setCertificateModal({ isOpen: true, data: null });
        break;
      case "skills":
        document
          .getElementById("skills-section")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        setIsAiCvModalOpen(true);
        break;
    }
  };

  const candidateDisplayName =
    candidateProfile.candidateName || candidateProfile.account.userName;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative">
      <PersonalInfoModal
        key={isEditInfoOpen ? "personal-open" : "personal-closed"}
        isOpen={isEditInfoOpen}
        onClose={() => setIsEditInfoOpen(false)}
        initialData={candidateProfile}
      />

      <AboutMeModal
        key={isAboutMeOpen ? "aboutme-open" : "aboutme-closed"}
        isOpen={isAboutMeOpen}
        onClose={() => setIsAboutMeOpen(false)}
        initialValue={candidateProfile.aboutMe}
      />

      <ExperienceModal
        key={
          experienceModal.isOpen
            ? `exp-${experienceModal.data?.id || "new"}`
            : "exp-closed"
        }
        isOpen={experienceModal.isOpen}
        onClose={() => setExperienceModal({ isOpen: false, data: null })}
        initialData={experienceModal.data}
      />

      <EducationModal
        key={
          educationModal.isOpen
            ? `edu-${educationModal.data?.id || "new"}`
            : "edu-closed"
        }
        isOpen={educationModal.isOpen}
        onClose={() => setEducationModal({ isOpen: false, data: null })}
        initialData={educationModal.data}
      />

      <CertificateModal
        key={
          certificateModal.isOpen
            ? `cert-${certificateModal.data?.id || "new"}`
            : "cert-closed"
        }
        isOpen={certificateModal.isOpen}
        onClose={() => setCertificateModal({ isOpen: false, data: null })}
        initialData={certificateModal.data}
      />

      <PortfolioModal
        key={
          portfolioModal.isOpen
            ? `port-${portfolioModal.data?.id || "new"}`
            : "port-closed"
        }
        isOpen={portfolioModal.isOpen}
        onClose={() => setPortfolioModal({ isOpen: false, data: null })}
        initialData={portfolioModal.data}
      />

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
        title={deleteModal.title}
        message={deleteModal.message}
        isPending={isDeletingAny}
      />

      <AiCvUploadModal
        isOpen={isAiCvModalOpen}
        onClose={() => setIsAiCvModalOpen(false)}
      />

      <input
        ref={avatarFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          handleSelectQuickAvatar(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <ImageCropperModal
        key={
          cropAvatarFile
            ? `${cropAvatarFile.name}-${cropAvatarFile.size}-${cropAvatarFile.lastModified}`
            : "quick-avatar-crop-closed"
        }
        isOpen={Boolean(cropAvatarFile)}
        file={cropAvatarFile}
        title="Cập nhật ảnh đại diện"
        cropShape="circle"
        isSubmitting={isUploadingAvatar}
        onClose={() => setCropAvatarFile(null)}
        onConfirm={handleConfirmQuickAvatar}
      />

      {/* CỘT CHÍNH */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs relative">
          <button
            type="button"
            onClick={() => setIsEditInfoOpen(true)}
            className="absolute top-5 right-5 text-text-subtle hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-subtle cursor-pointer"
            title="Chỉnh sửa thông tin cơ bản"
          >
            <Edit3 size={18} />
          </button>

          <div className="flex items-center gap-5 mb-6 pr-8">
            <div className="relative shrink-0">
              {candidateProfile.avatarUrl ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden border border-border-default shadow-xs">
                  <Image
                    src={candidateProfile.avatarUrl}
                    alt={candidateDisplayName}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-xs">
                  {candidateDisplayName.charAt(0).toUpperCase()}
                </div>
              )}

              <button
                type="button"
                onClick={() => avatarFileInputRef.current?.click()}
                title="Cập nhật ảnh đại diện"
                aria-label="Cập nhật ảnh đại diện"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface-card border border-border-default text-text-secondary hover:text-primary shadow-sm flex items-center justify-center transition cursor-pointer"
              >
                <Camera size={14} />
              </button>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-text-main truncate">
                {candidateDisplayName}
              </h1>
              <p className="text-text-secondary font-medium text-sm mt-1 truncate">
                {candidateProfile.profession || "Chưa cập nhật chuyên môn"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 pt-5 border-t border-border-subtle">
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <Mail size={16} className="text-text-subtle shrink-0" />
              <span className="truncate">{candidateProfile.account.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <Phone size={16} className="text-text-subtle shrink-0" />
              <span>
                {candidateProfile.account.phoneNumber || "Chưa cập nhật SĐT"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <Calendar size={16} className="text-text-subtle shrink-0" />
              <span>
                {candidateProfile.dateOfBirth
                  ? formatDateVN(candidateProfile.dateOfBirth)
                  : "Chưa cập nhật"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <User size={16} className="text-text-subtle shrink-0" />
              <span>{candidateProfile.gender || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <MapPin size={16} className="text-text-subtle shrink-0" />
              <span className="truncate">
                {candidateProfile.address || "Chưa cập nhật địa chỉ"}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-text-secondary">
              <LinkIcon size={16} className="text-text-subtle shrink-0" />
              {candidateProfile.cvUrl ? (
                <Link
                  href={
                    candidateProfile.cvUrl.startsWith("http")
                      ? candidateProfile.cvUrl
                      : `https://${candidateProfile.cvUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate max-w-50"
                >
                  {candidateProfile.cvUrl.replace(/^https?:\/\//, "")}
                </Link>
              ) : (
                <span className="text-text-subtle italic">
                  Chưa cập nhật website / link
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3.5">
            <h2 className="text-lg font-bold text-text-main">
              Giới thiệu bản thân
            </h2>
            <button
              type="button"
              onClick={() => setIsAboutMeOpen(true)}
              className="text-text-subtle hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-surface-subtle cursor-pointer"
              title="Chỉnh sửa giới thiệu bản thân"
            >
              <Edit3 size={18} />
            </button>
          </div>
          {candidateProfile.aboutMe ? (
            <div
              className="prose prose-slate prose-li:marker:text-primary max-w-none text-text-secondary text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: candidateProfile.aboutMe }}
            />
          ) : (
            <p className="text-sm text-text-muted italic">
              Chưa cập nhật phần giới thiệu bản thân. Bấm vào biểu tượng chỉnh
              sửa để bổ sung thông tin thu hút nhà tuyển dụng.
            </p>
          )}
        </div>

        <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-5 border-b border-border-subtle pb-3.5">
            <div className="flex items-center gap-2">
              <Briefcase size={19} className="text-primary" />
              <h2 className="text-lg font-bold text-text-main">
                Kinh nghiệm làm việc
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setExperienceModal({ isOpen: true, data: null })}
              className="text-primary hover:bg-primary-light px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Thêm mới</span>
            </button>
          </div>

          {candidateProfile?.experiences?.length > 0 ? (
            candidateProfile.experiences.map((item) => (
              <div
                key={item.id}
                className="group relative mb-5 last:mb-0 border-b border-dashed border-border-subtle pb-5 last:border-none last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-text-main text-base">
                    {item.position}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() =>
                        setExperienceModal({ isOpen: true, data: item })
                      }
                      className="text-text-subtle hover:text-primary p-1.5 rounded-lg hover:bg-surface-subtle cursor-pointer"
                      title="Sửa"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: "experience",
                          id: item.id,
                          title: "Xoá kinh nghiệm làm việc",
                          message: `Bạn có chắc chắn muốn xoá kinh nghiệm làm việc "${item.position} tại ${item.companyName}" không?`,
                        })
                      }
                      className="text-text-subtle hover:text-danger-text p-1.5 rounded-lg hover:bg-danger-soft cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-text-secondary font-medium mb-1">
                  {item.companyName}
                </p>

                <p className="text-xs text-text-muted mb-2 uppercase font-medium">
                  {item.startDate} - {item.endDate ? item.endDate : "HIỆN TẠI"}
                </p>

                {item.description && (
                  <div
                    className="text-sm text-text-secondary prose prose-sm max-w-none mt-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted italic">
              Chưa có thông tin kinh nghiệm làm việc.
            </p>
          )}
        </div>

        <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-5 border-b border-border-subtle pb-3.5">
            <div className="flex items-center gap-2">
              <GraduationCap size={19} className="text-primary" />
              <h2 className="text-lg font-bold text-text-main">Học vấn</h2>
            </div>
            <button
              type="button"
              onClick={() => setEducationModal({ isOpen: true, data: null })}
              className="text-primary hover:bg-primary-light px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Thêm mới</span>
            </button>
          </div>

          {candidateProfile?.educations?.length > 0 ? (
            candidateProfile.educations.map((item) => (
              <div
                key={item.id}
                className="group relative mb-5 last:mb-0 border-b border-dashed border-border-subtle pb-5 last:border-none last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-text-main text-base">
                    {item.schoolName}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() =>
                        setEducationModal({ isOpen: true, data: item })
                      }
                      className="text-text-subtle hover:text-primary p-1.5 rounded-lg hover:bg-surface-subtle cursor-pointer"
                      title="Sửa"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: "education",
                          id: item.id,
                          title: "Xoá thông tin học vấn",
                          message: `Bạn có chắc chắn muốn xoá học vấn tại trường "${item.schoolName}" không?`,
                        })
                      }
                      className="text-text-subtle hover:text-danger-text p-1.5 rounded-lg hover:bg-danger-soft cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-text-secondary font-medium mb-1">
                  {item.major}
                </p>

                <p className="text-xs text-text-muted mb-1.5 uppercase font-medium">
                  {item.startDate} - {item.endDate ? item.endDate : "HIỆN TẠI"}
                </p>

                {item.gpa && (
                  <p className="text-sm text-text-secondary font-medium">
                    GPA: <span className="text-text-main">{item.gpa}</span>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted italic">
              Chưa có thông tin học vấn.
            </p>
          )}
        </div>

        <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-5 border-b border-border-subtle pb-3.5">
            <div className="flex items-center gap-2">
              <FolderGit2 size={19} className="text-primary" />
              <h2 className="text-lg font-bold text-text-main">
                Dự án nổi bật
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setPortfolioModal({ isOpen: true, data: null })}
              className="text-primary hover:bg-primary-light px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Thêm mới</span>
            </button>
          </div>

          {candidateProfile?.portfolios &&
          candidateProfile.portfolios.length > 0 ? (
            candidateProfile.portfolios.map((item) => (
              <div
                key={item.id}
                className="group relative mb-5 last:mb-0 border-b border-dashed border-border-subtle pb-5 last:border-none last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-text-main text-base">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() =>
                        setPortfolioModal({ isOpen: true, data: item })
                      }
                      className="text-text-subtle hover:text-primary p-1.5 rounded-lg hover:bg-surface-subtle cursor-pointer"
                      title="Sửa"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: "portfolio",
                          id: item.id,
                          title: "Xoá dự án nổi bật",
                          message: `Bạn có chắc chắn muốn xoá dự án "${item.title}" không?`,
                        })
                      }
                      className="text-text-subtle hover:text-danger-text p-1.5 rounded-lg hover:bg-danger-soft cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {item.projectUrl && (
                  <div className="mb-2">
                    <Link
                      href={
                        item.projectUrl.startsWith("http")
                          ? item.projectUrl
                          : `https://${item.projectUrl}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      <ExternalLink size={12} />
                      {item.projectUrl}
                    </Link>
                  </div>
                )}

                {item.description && (
                  <p className="text-sm text-text-secondary whitespace-pre-line leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted italic">
              Chưa có dự án nào được cập nhật. Hãy thêm các dự án tâm đắc của
              bạn!
            </p>
          )}
        </div>

        <div className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs">
          <div className="flex items-center justify-between mb-5 border-b border-border-subtle pb-3.5">
            <div className="flex items-center gap-2">
              <Award size={19} className="text-primary" />
              <h2 className="text-lg font-bold text-text-main">Chứng chỉ</h2>
            </div>
            <button
              type="button"
              onClick={() => setCertificateModal({ isOpen: true, data: null })}
              className="text-primary hover:bg-primary-light px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <PlusCircle size={18} />
              <span>Thêm mới</span>
            </button>
          </div>

          {candidateProfile?.certificates?.length > 0 ? (
            candidateProfile.certificates.map((item) => (
              <div
                key={item.id}
                className="group relative mb-5 last:mb-0 border-b border-dashed border-border-subtle pb-4 last:border-none last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-text-main text-base">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() =>
                        setCertificateModal({ isOpen: true, data: item })
                      }
                      className="text-text-subtle hover:text-primary p-1.5 rounded-lg hover:bg-surface-subtle cursor-pointer"
                      title="Sửa"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: "certificate",
                          id: item.id,
                          title: "Xoá chứng chỉ",
                          message: `Bạn có chắc chắn muốn xoá chứng chỉ "${item.name}" không?`,
                        })
                      }
                      className="text-text-subtle hover:text-danger-text p-1.5 rounded-lg hover:bg-danger-soft cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-text-secondary font-medium mb-1">
                  {item.organization}
                </p>

                <p className="text-xs text-text-muted uppercase font-medium">
                  {item.issueDate}
                  {item.expirationDate
                    ? ` - ${item.expirationDate}`
                    : " - Vô thời hạn"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-muted italic">
              Chưa có thông tin chứng chỉ.
            </p>
          )}
        </div>

        <div
          id="skills-section"
          className="bg-surface-card rounded-xl border border-border-default p-6 sm:p-7 shadow-xs"
        >
          <div className="flex items-center justify-between mb-4 border-b border-border-subtle pb-3.5">
            <h2 className="text-lg font-bold text-text-main">Kỹ năng</h2>
          </div>

          {candidateProfile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {candidateProfile.skills.map((skill) => (
                <span
                  key={skill.skillId}
                  className="inline-flex items-center px-3 py-1.5 rounded-full border border-border-default text-sm text-text-main bg-surface-subtle/60 hover:border-primary/40 transition-colors cursor-default"
                >
                  <strong>{skill.skillName}</strong>
                  {skill.level && (
                    <span className="text-text-muted ml-1.5 text-xs font-medium">
                      ({skill.level})
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-muted italic">
              Chưa có thông tin kỹ năng.
            </p>
          )}
        </div>
      </div>

      {/* CỘT PHẢI: WIDGET HOÀN THIỆN HỒ SƠ & QUÉT CV AI */}
      <div className="xl:col-span-1">
        <ProfileCompletionSidebarCard
          profile={candidateProfile}
          onSelectSuggestion={handleSelectSuggestion}
          onOpenAiCvModal={() => setIsAiCvModalOpen(true)}
        />
      </div>
    </div>
  );
}
