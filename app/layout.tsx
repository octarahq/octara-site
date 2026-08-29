import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/navbar";
import FooterWithCTA from "@/components/ui/footer-with-cta";

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
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body
        className={`${geistSans.className} min-h-screen flex flex-col dark overflow-x-hidden`}
      >
        <Navbar />
        {children}
        <FooterWithCTA />
      </body>
    </html>
  );
}
