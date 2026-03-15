"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/I18nProvider";
import PrivacyContent from "./PrivacyContent";

export default function PrivacyPage() {
  return (
    <I18nProvider pagePath="/privacy">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
            <PrivacyContent />
          <Footer />
        </div>
      </div>
    </I18nProvider>
  );
}
