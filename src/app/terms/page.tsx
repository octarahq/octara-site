"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/I18nProvider";
import TermsContent from "./TermsContent";

export default function TermsPage() {
  return (
    <I18nProvider pagePath="/terms">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <TermsContent />
          <Footer />
        </div>
      </div>
    </I18nProvider>
  );
}
