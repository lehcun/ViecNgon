/**
 * =====================================================================
 * AI CV PARSING & MATCH SCORING TYPES
 * ---------------------------------------------------------------------
 * ⚠️ QUY TẮC MONOREPO: Chỉ chứa `type` và `interface` (không export const/enum).
 * =====================================================================
 */

export interface ParsedExperienceItem {
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export interface ParsedEducationItem {
  schoolName: string;
  major: string;
  startDate: string;
  endDate: string | null;
  gpa: string | null;
}

export interface ParsedCertificateItem {
  name: string;
  organization: string;
  issueDate: string;
  expirationDate: string | null;
}

export interface ParsedSkillItem {
  skillName: string;
  level: string | null;
}

export interface ParsedCvData {
  fullName: string | null;
  phoneNumber: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  profession: string | null;
  yearsOfExperience: number | null;
  aboutMe: string | null;
  skills: ParsedSkillItem[];
  experiences: ParsedExperienceItem[];
  educations: ParsedEducationItem[];
  certificates: ParsedCertificateItem[];
}

export interface ParseCvResponse {
  message: string;
  parsedData: ParsedCvData;
  uploadedFile: {
    fileName: string;
    fileUrl: string;
  };
}

export interface ApplyParsedCvPayload extends ParsedCvData {
  fileName?: string;
  fileUrl?: string;
  setAsDefaultCv?: boolean;
  replaceExisting?: boolean;
}

export interface AiMatchBreakdown {
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  domainScore: number;
}

export interface AiMatchResult {
  matchScore: number;
  strengths: string[];
  weaknesses: string[];
  summary: string;
  breakdown?: AiMatchBreakdown;
}

