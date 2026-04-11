import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/account/", "/login", "/register", "/oauth/"],
    },
    sitemap: "https://octara.xyz/sitemap.xml",
  };
}
