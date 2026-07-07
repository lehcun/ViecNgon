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

// STYLES TỐI GIẢN: Focus vào khoảng trắng (White space) và typography
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Roboto",
    fontSize: 10,
    color: "#1e293b",
    lineHeight: 1.5,
  },
  header: { marginBottom: 25, textAlign: "center" },
  name: {
    fontSize: 26,
    fontWeight: 700,
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  title: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 12,
    fontSize: 9,
    color: "#64748b",
  },
  contactItem: { marginHorizontal: 6, marginBottom: 4 },
  section: { marginTop: 15 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#000000",
    borderBottom: "1px solid #cbd5e1",
    paddingBottom: 4,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  itemBlock: { marginBottom: 10 },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  itemTitle: { fontWeight: 700, fontSize: 11, color: "#0f172a" },
  itemDate: { fontSize: 9, color: "#64748b" },
  itemSubTitle: { fontStyle: "italic", color: "#475569", marginBottom: 4 },
  description: { fontSize: 10, color: "#334155" },
  skillPill: {
    padding: "2px 0",
    marginRight: 12,
    marginBottom: 4,
    fontSize: 10,
  },
  skillRow: { flexDirection: "row", flexWrap: "wrap" },
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
  strong: { fontWeight: 700, color: "#000000" },
  em: { color: "#475569" },
};

const formatDate = (dateValue: Date | string | null): string => {
  if (!dateValue) return "Hiện tại";
  try {
    const d = new Date(dateValue);
    return isNaN(d.getTime())
      ? String(dateValue)
      : `${`0${d.getMonth() + 1}`.slice(-2)}/${d.getFullYear()}`;
  } catch (error) {
    return String(dateValue);
  }
};

export default function CVTemplateMinimal({
  data,
}: {
  data: CandidateProfileResponse | null;
}) {
  const displayData: CandidateProfileResponse = data || ({} as any);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER CĂN GIỮA */}
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
                {formatDate(displayData.dateOfBirth)}
              </Text>
            )}
            <Text style={styles.contactItem}>•</Text>
            <Text style={styles.contactItem}>{displayData.account?.email}</Text>
            <Text style={styles.contactItem}>•</Text>
            {displayData.account?.phoneNumber && (
              <Text style={styles.contactItem}>
                {displayData.account.phoneNumber}
              </Text>
            )}
            <Text style={styles.contactItem}>•</Text>
            {displayData.address && (
              <Text style={styles.contactItem}>{displayData.address}</Text>
            )}
          </View>
        </View>

        {/* GIỚI THIỆU */}
        {displayData.aboutMe && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tóm tắt cấu hình</Text>
            <Html stylesheet={htmlStyles}>{displayData.aboutMe}</Html>
          </View>
        )}

        {/* KINH NGHIỆM */}
        {displayData.experiences && displayData.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kinh nghiệm chuyên môn</Text>
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

        {/* HỌC VẤN & CHỨNG CHỈ (Hiển thị gộp cho gọn) */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Học vấn & Chứng chỉ</Text>
          {displayData.educations?.map((edu) => (
            <View key={edu.id} style={styles.itemBlock}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{edu.schoolName}</Text>
                <Text style={styles.itemDate}>
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </Text>
              </View>
              <Text style={styles.itemSubTitle}>{edu.major}</Text>
            </View>
          ))}
          {displayData.certificates?.map((cert) => (
            <View key={cert.id} style={styles.itemBlock}>
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

        {/* KỸ NĂNG & NGOẠI NGỮ */}
        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Kỹ năng & Ngoại ngữ</Text>
          <View style={styles.skillRow}>
            {displayData.skills?.map((skill) => (
              <View key={skill.skillId} style={styles.skillPill}>
                <Text>
                  • {skill.skillName} {skill.level ? `(${skill.level})` : ""}
                </Text>
              </View>
            ))}
            {displayData.languages?.map((lang) => (
              <View key={lang.id} style={styles.skillPill}>
                <Text>
                  • {lang.name} ({lang.proficiency})
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
