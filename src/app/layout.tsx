import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import FooterWithCTA from "@/components/ui/footer-with-cta";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { cookies } from "next/headers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Octara - Open Source Projects and Tools for Everyone",
  description:
    "Octara is a platform dedicated to providing open source projects and tools that are accessible to everyone. Our mission is to make computing accessible without barriers, while respecting privacy.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value || null;

  let initialUser = null;
  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(
          Buffer.from(parts[1], "base64").toString("utf-8")
        );
        initialUser = {
          email: payload.email,
          username: payload.username,
        };
      }
    } catch (e) {
      console.error("Failed to parse token payload", e);
    }
  }
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        className={`${geistSans.className} min-h-screen flex flex-col dark overflow-x-hidden`}
      >
        <AuthProvider initialUser={initialUser} initialToken={token}>
          <Navbar />
          {children}
          <FooterWithCTA />
        </AuthProvider>
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
