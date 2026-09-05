import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/status",
        "/privacy",
        "/tos",
        "/changelog",
        "/about",
        "/careers",
      ],
      disallow: ["/api/", "/account/", "/login", "/signup", "/admin/"],
    },
    sitemap: "https://octara.xyz/sitemap.xml",
  };
}
