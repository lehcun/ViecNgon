import React from "react";

// --- BẮT ĐẦU MOCK (Dành riêng cho môi trường Preview trên web) ---
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { CandidateProfileResponse } from "@viecngon/types";

// 1. ĐĂNG KÝ FONT TIẾNG VIỆT (Bắt buộc để không bị lỗi dấu trên file PDF thật)
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

// 2. KHAI BÁO STYLES (Cú pháp của @react-pdf/renderer)
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
    borderBottom: "2px solid #2563eb", // Màu Primary của dự án
    paddingBottom: 10,
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
    marginTop: 8,
    fontSize: 10,
    color: "#64748b",
  },
  contactItem: { marginRight: 15 },
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

// 3. COMPONENT VẼ PDF
export default function CVTemplate({
  data,
}: {
  data: CandidateProfileResponse | null;
}) {
  // Dữ liệu mẫu hiển thị (Fallback Data) nếu chưa có data từ Backend truyền vào
  const displayData = data || {
    candidateName: "Nguyễn Văn A",
    profession: "Senior Fullstack Developer",
    account: { email: "nguyenvana@gmail.com", phoneNumber: "0901234567" },
    address: "Quận 1, TP. Hồ Chí Minh",
    aboutMe:
      "Lập trình viên Fullstack với hơn 5 năm kinh nghiệm làm việc trong các dự án quy mô lớn. Đam mê xây dựng hệ thống tối ưu hiệu suất và kiến trúc mở rộng.",
    experiences: [
      {
        position: "Tech Lead",
        companyName: "XYZ Tech Company",
        startDate: "06/2022",
        endDate: "Hiện tại",
        description:
          "Dẫn dắt team 5 người xây dựng Payment Gateway xử lý 10.000 TPS. Thiết kế hệ thống Microservices với NestJS và Kafka.",
      },
      {
        position: "Frontend Developer",
        companyName: "ABC Software",
        startDate: "01/2019",
        endDate: "05/2022",
        description:
          "Phát triển giao diện người dùng bằng ReactJS, tối ưu hóa Web Vitals, giảm 40% thời gian tải trang.",
      },
    ],
    educations: [
      {
        schoolName: "Đại học Bách Khoa",
        major: "Kỹ thuật phần mềm",
        startDate: "09/2014",
        endDate: "06/2018",
        gpa: "3.4/4.0",
      },
    ],
    skills: [
      { skillName: "ReactJS", level: "Giỏi" },
      { skillName: "NestJS", level: "Khá" },
      { skillName: "SQL Server", level: "Khá" },
      { skillName: "AWS", level: "Trung bình" },
    ],
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER: Tên & Thông tin liên hệ */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {displayData.candidateName || "Tên Ứng Viên"}
          </Text>
          <Text style={styles.title}>
            {displayData.profession || "Vị trí ứng tuyển"}
          </Text>
          <View style={styles.contactRow}>
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
          </View>
        </View>

        {/* GIỚI THIỆU BẢN THÂN */}
        {displayData.aboutMe && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Giới thiệu bản thân</Text>
            <Text style={styles.description}>{displayData.aboutMe}</Text>
          </View>
        )}

        {/* KINH NGHIỆM LÀM VIỆC */}
        {displayData.experiences && displayData.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kinh nghiệm làm việc</Text>
            {displayData.experiences.map((exp: any, index: number) => (
              <View key={index} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {exp.startDate} - {exp.endDate || "Hiện tại"}
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Học vấn</Text>
            {displayData.educations.map((edu: any, index: number) => (
              <View key={index} style={styles.itemBlock} wrap={false}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.schoolName}</Text>
                  <Text style={styles.itemDate}>
                    {edu.startDate} - {edu.endDate || "Hiện tại"}
                  </Text>
                </View>
                <Text style={styles.itemSubTitle}>
                  {edu.major} {edu.gpa ? `- GPA: ${edu.gpa}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* KỸ NĂNG */}
        {displayData.skills && displayData.skills.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Kỹ năng chuyên môn</Text>
            <View style={styles.skillRow}>
              {displayData.skills.map((skill: any, index: number) => (
                <View key={index} style={styles.skillPill}>
                  <Text>
                    {skill.skillName} {skill.level ? `(${skill.level})` : ""}
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
