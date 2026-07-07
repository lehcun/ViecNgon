import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import Html from "react-pdf-html";
import { CandidateProfileResponse } from "@viecngon/types";

// 1. ĐĂNG KÝ FONT TIẾNG VIỆT
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

// 2. KHAI BÁO STYLES (Thiết kế 2 cột: Trái màu Xanh ngọc tối, Phải nền Trắng)
const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 1.5,
  },
  // CỘT TRÁI
  leftColumn: {
    width: "35%",
    backgroundColor: "#0f766e",
    color: "#f0fdfa",
    padding: 30,
    paddingRight: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: "#ffffff",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: { fontSize: 13, color: "#99f6e4", marginBottom: 20, fontWeight: 700 },
  contactItem: { marginBottom: 6, fontSize: 10, color: "#ccfbf1" },
  leftSectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#ffffff",
    borderBottom: "1px solid #115e59",
    paddingBottom: 4,
    marginBottom: 10,
    marginTop: 20,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  skillPill: {
    backgroundColor: "#115e59",
    padding: "4px 8px",
    borderRadius: 4,
    marginBottom: 6,
    fontSize: 10,
    color: "#ffffff",
  },
  // CỘT PHẢI
  rightColumn: {
    width: "65%",
    backgroundColor: "#ffffff",
    padding: 30,
    paddingLeft: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#0f766e",
    borderBottom: "1px solid #e2e8f0",
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 15,
  },
  itemBlock: { marginBottom: 12 },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  itemTitle: { fontWeight: 700, fontSize: 11, color: "#0f172a" },
  itemDate: { fontSize: 9, color: "#0f766e", fontWeight: 700 },
  itemSubTitle: { fontStyle: "italic", color: "#475569", marginBottom: 4 },
  description: { fontSize: 10, color: "#334155" },
});

const htmlStyles = {
  p: {
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.4,
    marginBottom: 2,
  },
  div: {
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.4,
  },
  li: {
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.4,
    marginBottom: 2,
  },
  span: {
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#334155",
    lineHeight: 1.4,
  },
  ul: { marginBottom: 4, paddingLeft: 14 },
  ol: { marginBottom: 4, paddingLeft: 14 },
  strong: { fontWeight: 700, color: "#0f172a" },
  em: { color: "#475569" },
  u: { textDecoration: "underline" },
};

// HÀM HELPER
const formatDate = (dateValue: Date | string | null): string => {
  if (!dateValue) return "Hiện tại";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    return `${`0${d.getMonth() + 1}`.slice(-2)}/${d.getFullYear()}`;
  } catch (error) {
    return String(dateValue);
  }
};

const formatDOB = (dateValue: Date | string | null): string => {
  if (!dateValue) return "";
  try {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return String(dateValue);
    return `${`0${d.getDate()}`.slice(-2)}/${`0${d.getMonth() + 1}`.slice(-2)}/${d.getFullYear()}`;
  } catch (error) {
    return String(dateValue);
  }
};

// COMPONENT CHÍNH
export default function CVTemplateFormat({
  data,
}: {
  data: CandidateProfileResponse | null;
}) {
  const displayData: CandidateProfileResponse = data || ({} as any); // (Giữ nguyên fallback data của bạn ở đây nếu cần)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* CỘT BÊN TRÁI: Thông tin cá nhân, Kỹ năng, Ngoại ngữ */}
        <View style={styles.leftColumn}>
          <Text style={styles.name}>
            {displayData.candidateName || "Tên Ứng Viên"}
          </Text>
          <Text style={styles.title}>
            {displayData.profession || "Vị trí ứng tuyển"}
          </Text>

          <View style={{ marginTop: 10 }}>
            {displayData.dateOfBirth && (
              <Text style={styles.contactItem}>
                SN: {formatDOB(displayData.dateOfBirth)}
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
              <Text style={styles.contactItem}>Đ/C: {displayData.address}</Text>
            )}
          </View>

          {/* KỸ NĂNG */}
          {displayData.skills && displayData.skills.length > 0 && (
            <View>
              <Text style={styles.leftSectionTitle}>Kỹ năng</Text>
              {displayData.skills.map((skill) => (
                <View key={skill.skillId} style={styles.skillPill}>
                  <Text>
                    {skill.skillName} {skill.level ? `(${skill.level})` : ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* NGOẠI NGỮ */}
          {displayData.languages && displayData.languages.length > 0 && (
            <View>
              <Text style={styles.leftSectionTitle}>Ngoại ngữ</Text>
              {displayData.languages.map((lang) => (
                <View key={lang.id} style={styles.skillPill}>
                  <Text>
                    {lang.name} ({lang.proficiency})
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* CỘT BÊN PHẢI: Giới thiệu, Kinh nghiệm, Học vấn, Chứng chỉ */}
        <View style={styles.rightColumn}>
          {/* GIỚI THIỆU */}
          {displayData.aboutMe && (
            <View style={{ marginTop: 0 }}>
              <Text style={{ ...styles.sectionTitle, marginTop: 0 }}>
                Giới thiệu bản thân
              </Text>
              <Html stylesheet={htmlStyles}>{displayData.aboutMe}</Html>
            </View>
          )}

          {/* KINH NGHIỆM */}
          {displayData.experiences && displayData.experiences.length > 0 && (
            <View>
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
                  <Text style={styles.description}>
                    {exp.description?.replace(/<[^>]*>?/gm, "") || ""}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* HỌC VẤN */}
          {displayData.educations && displayData.educations.length > 0 && (
            <View>
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

          {/* CHỨNG CHỈ */}
          {displayData.certificates && displayData.certificates.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Chứng chỉ</Text>
              {displayData.certificates.map((cert) => (
                <View key={cert.id} style={styles.itemBlock} wrap={false}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{cert.name}</Text>
                    <Text style={styles.itemDate}>
                      {formatDate(cert.issueDate)}
                    </Text>
                  </View>
                  <Text style={styles.itemSubTitle}>{cert.organization}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
