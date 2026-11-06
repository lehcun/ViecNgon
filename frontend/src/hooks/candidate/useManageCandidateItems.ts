import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateExperiencePayload,
  UpdateExperiencePayload,
  CreateEducationPayload,
  UpdateEducationPayload,
  CreateCertificatePayload,
  UpdateCertificatePayload,
  CreatePortfolioPayload,
  UpdatePortfolioPayload,
  CreateCvFilePayload,
} from "@viecngon/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper gọi fetch có đính kèm cookie và Content-Type
async function apiRequest<T>(
  endpoint: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `Yêu cầu thất bại (${res.status})`);
  }

  return res.json();
}

export const useManageCandidateItems = () => {
  const queryClient = useQueryClient();

  const invalidateProfile = () => {
    queryClient.invalidateQueries({ queryKey: ["candidateProfile"] });
  };

  // ==========================================
  // KINH NGHIỆM (EXPERIENCES)
  // ==========================================
  const createExperienceMutation = useMutation({
    mutationFn: (data: CreateExperiencePayload) =>
      apiRequest("/candidate/experiences", "POST", data),
    onSuccess: invalidateProfile,
  });

  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExperiencePayload }) =>
      apiRequest(`/candidate/experiences/${id}`, "PATCH", data),
    onSuccess: invalidateProfile,
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/candidate/experiences/${id}`, "DELETE"),
    onSuccess: invalidateProfile,
  });

  // ==========================================
  // HỌC VẤN (EDUCATIONS)
  // ==========================================
  const createEducationMutation = useMutation({
    mutationFn: (data: CreateEducationPayload) =>
      apiRequest("/candidate/educations", "POST", data),
    onSuccess: invalidateProfile,
  });

  const updateEducationMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEducationPayload }) =>
      apiRequest(`/candidate/educations/${id}`, "PATCH", data),
    onSuccess: invalidateProfile,
  });

  const deleteEducationMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/candidate/educations/${id}`, "DELETE"),
    onSuccess: invalidateProfile,
  });

  // ==========================================
  // CHỨNG CHỈ (CERTIFICATES)
  // ==========================================
  const createCertificateMutation = useMutation({
    mutationFn: (data: CreateCertificatePayload) =>
      apiRequest("/candidate/certificates", "POST", data),
    onSuccess: invalidateProfile,
  });

  const updateCertificateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCertificatePayload;
    }) => apiRequest(`/candidate/certificates/${id}`, "PATCH", data),
    onSuccess: invalidateProfile,
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/candidate/certificates/${id}`, "DELETE"),
    onSuccess: invalidateProfile,
  });

  // ==========================================
  // DỰ ÁN NỔI BẬT (PORTFOLIOS)
  // ==========================================
  const createPortfolioMutation = useMutation({
    mutationFn: (data: CreatePortfolioPayload) =>
      apiRequest("/candidate/portfolios", "POST", data),
    onSuccess: invalidateProfile,
  });

  const updatePortfolioMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePortfolioPayload }) =>
      apiRequest(`/candidate/portfolios/${id}`, "PATCH", data),
    onSuccess: invalidateProfile,
  });

  const deletePortfolioMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/candidate/portfolios/${id}`, "DELETE"),
    onSuccess: invalidateProfile,
  });

  // ==========================================
  // FILE CV (CV FILES)
  // ==========================================
  const createCvFileMutation = useMutation({
    mutationFn: (data: CreateCvFilePayload) =>
      apiRequest("/candidate/cv-files", "POST", data),
    onSuccess: invalidateProfile,
  });

  const deleteCvFileMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/candidate/cv-files/${id}`, "DELETE"),
    onSuccess: invalidateProfile,
  });

  return {
    // Experiences
    createExperience: createExperienceMutation.mutateAsync,
    isCreatingExperience: createExperienceMutation.isPending,
    updateExperience: updateExperienceMutation.mutateAsync,
    isUpdatingExperience: updateExperienceMutation.isPending,
    deleteExperience: deleteExperienceMutation.mutateAsync,
    isDeletingExperience: deleteExperienceMutation.isPending,

    // Educations
    createEducation: createEducationMutation.mutateAsync,
    isCreatingEducation: createEducationMutation.isPending,
    updateEducation: updateEducationMutation.mutateAsync,
    isUpdatingEducation: updateEducationMutation.isPending,
    deleteEducation: deleteEducationMutation.mutateAsync,
    isDeletingEducation: deleteEducationMutation.isPending,

    // Certificates
    createCertificate: createCertificateMutation.mutateAsync,
    isCreatingCertificate: createCertificateMutation.isPending,
    updateCertificate: updateCertificateMutation.mutateAsync,
    isUpdatingCertificate: updateCertificateMutation.isPending,
    deleteCertificate: deleteCertificateMutation.mutateAsync,
    isDeletingCertificate: deleteCertificateMutation.isPending,

    // Portfolios
    createPortfolio: createPortfolioMutation.mutateAsync,
    isCreatingPortfolio: createPortfolioMutation.isPending,
    updatePortfolio: updatePortfolioMutation.mutateAsync,
    isUpdatingPortfolio: updatePortfolioMutation.isPending,
    deletePortfolio: deletePortfolioMutation.mutateAsync,
    isDeletingPortfolio: deletePortfolioMutation.isPending,

    // CV Files
    createCvFile: createCvFileMutation.mutateAsync,
    isCreatingCvFile: createCvFileMutation.isPending,
    deleteCvFile: deleteCvFileMutation.mutateAsync,
    isDeletingCvFile: deleteCvFileMutation.isPending,
  };
};

