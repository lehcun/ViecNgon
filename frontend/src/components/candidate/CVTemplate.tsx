import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CandidateProfileResponse } from "@viecngon/types";

// 1. ĐĂNG KÝ FONT TIẾNG VIỆT (Bắt buộc để không bị lỗi dấu trên file PDF)
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

// 2. KHAI BÁO STYLES
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 11,
    color: "#333333",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 20,
    borderBottom: "2px solid #2563eb",
    paddingBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: "#1e293b",
    textTransform: "uppercase",
  },
  title: { fontSize: 14, color: "#2563eb", marginTop: 4, fontWeight: 700 },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    fontSize: 10,
    color: "#64748b",
  },
  contactItem: { marginRight: 15, marginBottom: 4 },
  section: { marginTop: 15 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: "#1e293b",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 4,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  itemBlock: { marginBottom: 10 },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  itemTitle: { fontWeight: 700, fontSize: 12, color: "#0f172a" },
  itemDate: { fontSize: 10, color: "#64748b" },
  itemSubTitle: { fontStyle: "italic", color: "#475569", marginBottom: 4 },
  description: { fontSize: 10, color: "#334155" },
  skillPill: {
    backgroundColor: "#f1f5f9",
    padding: "4px 8px",
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 10,
  },
  skillRow: { flexDirection: "row", flexWrap: "wrap" },
});

// HÀM HELPER: Format date (VD: 2021-08-01T... -> 08/2021)
const formatDate = (dateValue: Date | string | null): string => {
  if (!dateValue) return "Hiện tại";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${month}/${year}`;
  } catch (error) {
    return String(dateValue);
  }
};

const formatDOB = (dateValue: Date | string | null): string => {
  if (!dateValue) return "";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    const day = `0${d.getDate()}`.slice(-2);
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (error) {
    return String(dateValue);
  }
};

// 3. COMPONENT VẼ PDF
export default function CVTemplate({
  data,
}: {
  data: CandidateProfileResponse | null;
}) {
  // Dữ liệu mẫu hiển thị (Fallback Data) chuẩn khớp 100% với Interface
  const displayData: CandidateProfileResponse = data || {
    candidateId: "MOCK-123",
    accountId: "ACC-123",
    candidateName: "Nguyễn Lê Hoàng",
    dateOfBirth: "1996-05-12T00:00:00.000Z",
    gender: "Nam",
    yearsOfExperience: 5,
    avatarUrl: null,
    profession: "Senior Fullstack Developer",
    cvUrl: null,
    address: "Quận Bình Thạnh, TP. Hồ Chí Minh",
    aboutMe:
      "Lập trình viên Fullstack với hơn 5 năm kinh nghiệm phát triển các ứng dụng web quy mô lớn. Đam mê tối ưu hóa hiệu năng hệ thống và kiến trúc microservices.",
    defaultCvType: "ONLINE",
    defaultCvFileId: null,
    account: {
      email: "hoang.nguyen@gmail.com",
      userName: "hoangnguyen",
      phoneNumber: "0901234567",
    },
    skills: [
      { skillId: "1", skillName: "ReactJS", level: "Advanced" },
      { skillId: "2", skillName: "Node.js", level: "Advanced" },
      { skillId: "3", skillName: "PostgreSQL", level: "Intermediate" },
      { skillId: "4", skillName: "AWS", level: "Intermediate" },
    ],
    experiences: [
      {
        id: "exp-1",
        companyName: "TechCorp Vietnam",
        position: "Senior Frontend Engineer",
        startDate: "2021-08-01T00:00:00.000Z",
        endDate: null,
        description:
          "- Dẫn dắt đội ngũ 4 lập trình viên phát triển hệ thống ERP nội bộ.\n- Chuyển đổi toàn bộ hệ thống sang ReactJS, cải thiện 40% tốc độ tải trang.",
      },
      {
        id: "exp-2",
        companyName: "Innovate Digital JSC",
        position: "Fullstack Developer",
        startDate: "2018-09-01T00:00:00.000Z",
        endDate: "2021-07-31T00:00:00.000Z",
        description:
          "- Xây dựng API RESTful với Node.js.\n- Tối ưu hóa database query, giảm 30% thời gian phản hồi hệ thống.",
      },
    ],
    educations: [
      {
        id: "edu-1",
        schoolName: "Đại học Khoa học Tự nhiên - ĐHQG TP.HCM",
        major: "Công nghệ Phần mềm",
        startDate: "2014-09-05T00:00:00.000Z",
        endDate: "2018-07-15T00:00:00.000Z",
        gpa: "3.6/4.0",
      },
    ],
    certificates: [
      {
        id: "cert-1",
        name: "AWS Certified Solutions Architect",
        organization: "Amazon Web Services",
        issueDate: "2023-11-10T00:00:00.000Z",
        expirationDate: "2026-11-10T00:00:00.000Z",
      },
      {
        id: "cert-2",
        name: "TOEIC 850",
        organization: "IIG Vietnam",
        issueDate: "2022-05-20T00:00:00.000Z",
        expirationDate: "2024-05-20T00:00:00.000Z",
      },
    ],
    languages: [
      { id: "lang-1", name: "Tiếng Anh", proficiency: "Lưu loát" },
      { id: "lang-2", name: "Tiếng Nhật", proficiency: "N4" },
    ],
    uploadedCvs: [],
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER: Tên & Thông tin liên hệ cơ bản */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {displayData.candidateName || "Tên Ứng Viên"}
          </Text>
          <Text style={styles.title}>
            {displayData.profession || "Vị trí ứng tuyển"}
          </Text>

          <View style={styles.contactRow}>
            {displayData.dateOfBirth && (
              <Text style={styles.contactItem}>
                Ngày sinh: {formatDOB(displayData.dateOfBirth)}
              </Text>
            )}
            {displayData.gender && (
              <Text style={styles.contactItem}>
                Giới tính: {displayData.gender}
              </Text>
            )}
            <Text style={styles.contactItem}>
              Email: {displayData.account?.email}
            </Text>
            {displayData.account?.phoneNumber && (
              <Text style={styles.contactItem}>
                SĐT: {displayData.account.phoneNumber}
              </Text>
            )}
            {displayData.address && (
              <Text style={styles.contactItem}>
                Địa chỉ: {displayData.address}
              </Text>
            )}
            {displayData.yearsOfExperience !== null && (
              <Text style={styles.contactItem}>
                Kinh nghiệm: {displayData.yearsOfExperience} năm
              </Text>
            )}
          </View>
        </View>

        {/* 1. GIỚI THIỆU BẢN THÂN */}
        {displayData.aboutMe && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu bản thân</Text>
            <Text style={styles.description}>{displayData.aboutMe}</Text>
          </View>
        )}

        {/* 2. KINH NGHIỆM LÀM VIỆC */}
        {displayData.experiences && displayData.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kinh nghiệm làm việc</Text>
            {displayData.experiences.map((exp) => (
              <View key={exp.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </Text>
                </View>
                <Text style={styles.itemSubTitle}>{exp.companyName}</Text>
                {/* Loại bỏ HTML tag nếu dữ liệu backend trả về dạng Rich Text */}
                <Text style={styles.description}>
                  {exp.description?.replace(/<[^>]*>?/gm, "") || ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 3. HỌC VẤN */}
        {displayData.educations && displayData.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Học vấn</Text>
            {displayData.educations.map((edu) => (
              <View key={edu.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.schoolName}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </Text>
                </View>
                <Text style={styles.itemSubTitle}>
                  {edu.major} {edu.gpa ? `| GPA: ${edu.gpa}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 4. CHỨNG CHỈ */}
        {displayData.certificates && displayData.certificates.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chứng chỉ</Text>
            {displayData.certificates.map((cert) => (
              <View key={cert.id} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(cert.issueDate)}{" "}
                    {cert.expirationDate
                      ? `- ${formatDate(cert.expirationDate)}`
                      : ""}
                  </Text>
                </View>
                <Text style={styles.itemSubTitle}>{cert.organization}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 5. KỸ NĂNG CHUYÊN MÔN */}
        {displayData.skills && displayData.skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Kỹ năng chuyên môn</Text>
            <View style={styles.skillRow}>
              {displayData.skills.map((skill) => (
                <View key={skill.skillId} style={styles.skillPill}>
                  <Text>
                    {skill.skillName} {skill.level ? `(${skill.level})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 6. NGOẠI NGỮ */}
        {displayData.languages && displayData.languages.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Ngoại ngữ</Text>
            <View style={styles.skillRow}>
              {displayData.languages.map((lang) => (
                <View key={lang.id} style={styles.skillPill}>
                  <Text>
                    {lang.name} ({lang.proficiency})
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
