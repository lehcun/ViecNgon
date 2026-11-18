import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://viecngon.vn"
  ).replace(/\/+$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/jobs", "/company"],
        disallow: [
          "/admin",
          "/dashboard",
          "/employer-dashboard",
          "/employer-jobs",
          "/employer-company-profile",
          "/applications",
          "/cv-profile",
          "/my-jobs",
          "/settings",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
