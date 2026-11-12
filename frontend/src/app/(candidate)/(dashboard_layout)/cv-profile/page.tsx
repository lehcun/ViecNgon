"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Edit3,
  PlusCircle,
  Trash2,
  Mail,
  Phone,
  Calendar,
  User,
  MapPin,
  Link as LinkIcon,
  Bot,
  FileText,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
  Sparkles,
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
import { useCandidateProfile } from "@/hooks/candidate/useCandidateProfile";
import { useManageCandidateItems } from "@/hooks/candidate/useManageCandidateItems";
import { formatDateToDDMMYYYY } from "@/utils/date";
import { CandidateProfileResponse } from "@viecngon/types";

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

  // State các Modal chỉnh sửa
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [isAboutMeOpen, setIsAboutMeOpen] = useState(false);
  const [isAiCvModalOpen, setIsAiCvModalOpen] = useState(false);

  // Modal cho Experiences
  const [experienceModal, setExperienceModal] = useState<{
    isOpen: boolean;
    data: CandidateProfileResponse["experiences"][number] | null;
  }>({ isOpen: false, data: null });

  // Modal cho Educations
  const [educationModal, setEducationModal] = useState<{
    isOpen: boolean;
    data: CandidateProfileResponse["educations"][number] | null;
  }>({ isOpen: false, data: null });

  // Modal cho Certificates
  const [certificateModal, setCertificateModal] = useState<{
    isOpen: boolean;
    data: CandidateProfileResponse["certificates"][number] | null;
  }>({ isOpen: false, data: null });

  // Modal cho Portfolios
  const [portfolioModal, setPortfolioModal] = useState<{
    isOpen: boolean;
    data: CandidateProfileResponse["portfolios"][number] | null;
  }>({ isOpen: false, data: null });

  // Modal xác nhận xoá
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

  const profileCompletion = 75;
  const arcLength = 220;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-pulse">
        <div className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 bg-slate-200 rounded-full"></div>
              <div className="space-y-3 flex-1">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            </div>
          </div>
          <div className="h-40 bg-white rounded-xl border border-slate-200 p-6"></div>
          <div className="h-60 bg-white rounded-xl border border-slate-200 p-6"></div>
        </div>
        <div className="flex flex-col gap-6">
          <div className="h-64 bg-white rounded-xl border border-slate-200 p-6"></div>
        </div>
      </div>
    );
  }

  if (isError || !candidateProfile) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-red-200 shadow-sm text-red-600 font-medium">
        Không thể tải thông tin hồ sơ ứng viên. Vui lòng thử đăng nhập lại.
      </div>
    );
  }

  const candidateDisplayName =
    candidateProfile.candidateName || candidateProfile.account.userName;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative">
      {/* ========================================================
          CÁC MODAL THÊM / SỬA / XOÁ
      ======================================================== */}
      {/* 1. Modal Thông tin cá nhân */}
      <PersonalInfoModal
        key={isEditInfoOpen ? "personal-open" : "personal-closed"}
        isOpen={isEditInfoOpen}
        onClose={() => setIsEditInfoOpen(false)}
        initialData={candidateProfile}
      />

      {/* 2. Modal Giới thiệu bản thân */}
      <AboutMeModal
        key={isAboutMeOpen ? "aboutme-open" : "aboutme-closed"}
        isOpen={isAboutMeOpen}
        onClose={() => setIsAboutMeOpen(false)}
        initialValue={candidateProfile.aboutMe}
      />

      {/* 3. Modal Kinh nghiệm làm việc */}
      <ExperienceModal
        key={experienceModal.isOpen ? `exp-${experienceModal.data?.id || "new"}` : "exp-closed"}
        isOpen={experienceModal.isOpen}
        onClose={() => setExperienceModal({ isOpen: false, data: null })}
        initialData={experienceModal.data}
      />

      {/* 4. Modal Học vấn */}
      <EducationModal
        key={educationModal.isOpen ? `edu-${educationModal.data?.id || "new"}` : "edu-closed"}
        isOpen={educationModal.isOpen}
        onClose={() => setEducationModal({ isOpen: false, data: null })}
        initialData={educationModal.data}
      />

      {/* 5. Modal Chứng chỉ */}
      <CertificateModal
        key={certificateModal.isOpen ? `cert-${certificateModal.data?.id || "new"}` : "cert-closed"}
        isOpen={certificateModal.isOpen}
        onClose={() => setCertificateModal({ isOpen: false, data: null })}
        initialData={certificateModal.data}
      />

      {/* 6. Modal Dự án nổi bật */}
      <PortfolioModal
        key={portfolioModal.isOpen ? `port-${portfolioModal.data?.id || "new"}` : "port-closed"}
        isOpen={portfolioModal.isOpen}
        onClose={() => setPortfolioModal({ isOpen: false, data: null })}
        initialData={portfolioModal.data}
      />

      {/* 7. Modal Xác nhận xoá chung */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
        title={deleteModal.title}
        message={deleteModal.message}
        isPending={isDeletingAny}
      />

      {/* 8. Modal Tải lên CV để AI tự động điền hồ sơ */}
      <AiCvUploadModal
        isOpen={isAiCvModalOpen}
        onClose={() => setIsAiCvModalOpen(false)}
      />

      {/* ==================== CỘT TRÁI & GIỮA (NỘI DUNG CHÍNH) ==================== */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        {/* 1. Header Profile Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative group">
          <button
            onClick={() => setIsEditInfoOpen(true)}
            className="absolute top-6 right-6 text-slate-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-50"
            title="Chỉnh sửa thông tin cơ bản"
          >
            <Edit3 size={20} />
          </button>

          <div className="flex items-center gap-5 mb-6">
            <div className="shrink-0">
              {candidateProfile.avatarUrl ? (
                <img
                  src={candidateProfile.avatarUrl}
                  alt={candidateDisplayName}
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />
              ) : (
                <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold shadow-md">
                  {candidateDisplayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {candidateDisplayName}
              </h1>
              <p className="text-slate-600 font-medium mt-1">
                {candidateProfile.profession || "Chưa cập nhật chuyên môn"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span className="truncate">{candidateProfile.account.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone size={16} className="text-slate-400 shrink-0" />
              <span>{candidateProfile.account.phoneNumber || "Chưa cập nhật SĐT"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <span>{formatDateToDDMMYYYY(candidateProfile.dateOfBirth)}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <User size={16} className="text-slate-400 shrink-0" />
              <span>{candidateProfile.gender || "Chưa cập nhật"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <MapPin size={16} className="text-slate-400 shrink-0" />
              <span className="truncate">{candidateProfile.address || "Chưa cập nhật địa chỉ"}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <LinkIcon size={16} className="text-slate-400 shrink-0" />
              {candidateProfile.cvUrl ? (
                <Link
                  href={
                    candidateProfile.cvUrl.startsWith("http")
                      ? candidateProfile.cvUrl
                      : `https://${candidateProfile.cvUrl}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline transition-colors truncate max-w-[200px]"
                >
                  {candidateProfile.cvUrl.replace(/^https?:\/\//, "")}
                </Link>
              ) : (
                <span className="text-slate-400 italic">
                  Chưa cập nhật website / link
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Giới thiệu bản thân */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm relative group">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">
              Giới thiệu bản thân
            </h2>
            <button
              onClick={() => setIsAboutMeOpen(true)}
              className="text-slate-400 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
              title="Chỉnh sửa giới thiệu bản thân"
            >
              <Edit3 size={18} />
            </button>
          </div>
          {candidateProfile.aboutMe ? (
            <div
              className="prose prose-slate prose-li:marker:text-primary max-w-none text-slate-700 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: candidateProfile.aboutMe }}
            />
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa cập nhật phần giới thiệu bản thân. Bấm vào biểu tượng chỉnh sửa để thêm thông tin thu hút nhà tuyển dụng.
            </p>
          )}
        </div>

        {/* 3. Kinh nghiệm làm việc */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-slate-800">
                Kinh nghiệm làm việc
              </h2>
            </div>
            <button
              onClick={() => setExperienceModal({ isOpen: true, data: null })}
              className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <PlusCircle size={20} />
              <span>Thêm mới</span>
            </button>
          </div>

          {candidateProfile?.experiences?.length > 0 ? (
            candidateProfile.experiences.map((item) => (
              <div
                key={item.id}
                className="group relative mb-6 last:mb-0 border-b border-dashed border-slate-100 pb-6 last:border-none last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 text-base">
                    {item.position}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setExperienceModal({ isOpen: true, data: item })}
                      className="text-slate-400 hover:text-primary p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                      title="Sửa"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: "experience",
                          id: item.id,
                          title: "Xoá kinh nghiệm làm việc",
                          message: `Bạn có chắc chắn muốn xoá kinh nghiệm làm việc "${item.position} tại ${item.companyName}" không?`,
                        })
                      }
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-700 font-medium mb-1">
                  {item.companyName}
                </p>

                <p className="text-xs text-slate-500 mb-2 uppercase font-medium">
                  {item.startDate} - {item.endDate ? item.endDate : "HIỆN TẠI"}
                </p>

                {item.description && (
                  <div
                    className="text-sm text-slate-600 prose prose-sm max-w-none mt-2 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa có thông tin kinh nghiệm làm việc.
            </p>
          )}
        </div>

        {/* 4. Học vấn */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <GraduationCap size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-slate-800">Học vấn</h2>
            </div>
            <button
              onClick={() => setEducationModal({ isOpen: true, data: null })}
              className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <PlusCircle size={20} />
              <span>Thêm mới</span>
            </button>
          </div>

          {candidateProfile?.educations?.length > 0 ? (
            candidateProfile.educations.map((item) => (
              <div
                key={item.id}
                className="group relative mb-6 last:mb-0 border-b border-dashed border-slate-100 pb-6 last:border-none last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 text-base">
                    {item.schoolName}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEducationModal({ isOpen: true, data: item })}
                      className="text-slate-400 hover:text-primary p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                      title="Sửa"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: "education",
                          id: item.id,
                          title: "Xoá thông tin học vấn",
                          message: `Bạn có chắc chắn muốn xoá học vấn tại trường "${item.schoolName}" không?`,
                        })
                      }
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-700 font-medium mb-1">
                  {item.major}
                </p>

                <p className="text-xs text-slate-500 mb-2 uppercase font-medium">
                  {item.startDate} - {item.endDate ? item.endDate : "HIỆN TẠI"}
                </p>

                {item.gpa && (
                  <p className="text-sm text-slate-600 font-medium">
                    GPA: <span className="text-slate-800">{item.gpa}</span>
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa có thông tin học vấn.
            </p>
          )}
        </div>

        {/* 5. Dự án nổi bật (Portfolio) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <FolderGit2 size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-slate-800">Dự án nổi bật</h2>
            </div>
            <button
              onClick={() => setPortfolioModal({ isOpen: true, data: null })}
              className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <PlusCircle size={20} />
              <span>Thêm mới</span>
            </button>
          </div>

          {candidateProfile?.portfolios && candidateProfile.portfolios.length > 0 ? (
            candidateProfile.portfolios.map((item) => (
              <div
                key={item.id}
                className="group relative mb-6 last:mb-0 border-b border-dashed border-slate-100 pb-6 last:border-none last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 text-base">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setPortfolioModal({ isOpen: true, data: item })}
                      className="text-slate-400 hover:text-primary p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                      title="Sửa"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: "portfolio",
                          id: item.id,
                          title: "Xoá dự án nổi bật",
                          message: `Bạn có chắc chắn muốn xoá dự án "${item.title}" không?`,
                        })
                      }
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 size={16} />
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
                  <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa có dự án nào được cập nhật. Hãy thêm các dự án tâm đắc của bạn!
            </p>
          )}
        </div>

        {/* 6. Chứng chỉ */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-primary" />
              <h2 className="text-lg font-bold text-slate-800">Chứng chỉ</h2>
            </div>
            <button
              onClick={() => setCertificateModal({ isOpen: true, data: null })}
              className="text-primary hover:bg-primary-light p-1.5 rounded-md transition-colors flex items-center gap-1 text-sm font-semibold cursor-pointer"
            >
              <PlusCircle size={20} />
              <span>Thêm mới</span>
            </button>
          </div>

          {candidateProfile?.certificates?.length > 0 ? (
            candidateProfile.certificates.map((item) => (
              <div
                key={item.id}
                className="group relative mb-6 last:mb-0 border-b border-dashed border-slate-100 pb-4 last:border-none last:pb-0"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-bold text-slate-800 text-base">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setCertificateModal({ isOpen: true, data: item })}
                      className="text-slate-400 hover:text-primary p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                      title="Sửa"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        setDeleteModal({
                          isOpen: true,
                          type: "certificate",
                          id: item.id,
                          title: "Xoá chứng chỉ",
                          message: `Bạn có chắc chắn muốn xoá chứng chỉ "${item.name}" không?`,
                        })
                      }
                      className="text-slate-400 hover:text-rose-500 p-1.5 rounded-md hover:bg-slate-50 cursor-pointer"
                      title="Xoá"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-700 font-medium mb-1">
                  {item.organization}
                </p>

                <p className="text-xs text-slate-500 uppercase font-medium">
                  {item.issueDate}
                  {item.expirationDate
                    ? ` - ${item.expirationDate}`
                    : " - Vô thời hạn"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa có thông tin chứng chỉ.
            </p>
          )}
        </div>

        {/* 7. Kỹ năng */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Kỹ năng</h2>
          </div>

          {candidateProfile?.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {candidateProfile.skills.map((skill) => (
                <span
                  key={skill.skillId}
                  className="inline-flex items-center px-3 py-1.5 rounded-full border border-slate-200 text-sm text-slate-700 bg-white shadow-sm hover:border-primary transition-colors cursor-default"
                >
                  <strong>{skill.skillName}</strong>
                  {skill.level && (
                    <span className="text-slate-500 ml-1.5 text-xs font-medium">
                      ({skill.level})
                    </span>
                  )}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">
              Chưa có thông tin kỹ năng.
            </p>
          )}
        </div>
      </div>

      {/* ==================== CỘT PHẢI (WIDGETS) ==================== */}
      <div className="xl:col-span-1 flex flex-col gap-6">
        {/* Widget 1: Độ hoàn thiện hồ sơ */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm sticky top-24">
          <h2 className="text-center font-bold text-slate-800 mb-6">
            Độ hoàn thiện hồ sơ
          </h2>

          <div className="flex justify-center mb-6">
            <div className="relative w-40 h-24 overflow-hidden">
              <svg viewBox="0 0 200 100" className="w-full h-auto drop-shadow-sm">
                <path
                  d="M 20 90 A 70 70 0 0 1 180 90"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="18"
                  strokeLinecap="round"
                />
                <path
                  d="M 20 90 A 70 70 0 0 1 180 90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="18"
                  strokeLinecap="round"
                  className="text-primary transition-all duration-1000 ease-out"
                  strokeDasharray={arcLength}
                  strokeDashoffset={
                    arcLength - arcLength * (profileCompletion / 100)
                  }
                />
              </svg>
              <div className="absolute bottom-2 left-0 right-0 flex flex-col items-center">
                <span className="text-3xl font-black text-slate-800 leading-none">
                  {profileCompletion}%
                </span>
                <span className="text-[11px] text-slate-500 font-medium mt-1">
                  hoàn thành
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-end gap-3 mb-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-br-none p-3 text-[13px] text-slate-600 relative flex-1 shadow-sm">
              Chúc mừng! Bạn đã sẵn sàng để tạo CV. Tiếp tục hoàn thiện hồ sơ để
              CV của bạn thêm thu hút.
              <div className="absolute -bottom-px -right-2 w-2 h-2 bg-slate-50 border-b border-r border-slate-200 transform rotate-45"></div>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center shrink-0 border border-slate-200 text-slate-500">
              <Bot size={24} />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAiCvModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 mb-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-all shadow-md shadow-emerald-600/20 text-sm"
          >
            <Sparkles size={18} />
            Tải lên CV để AI tự điền hồ sơ
          </button>

          <Link
            href="/cv-template"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-all shadow-md shadow-primary/20 text-sm"
          >
            <FileText size={18} />
            Xem và tải CV mẫu
          </Link>
        </div>
      </div>
    </div>
  );
}
