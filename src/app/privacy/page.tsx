import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { headers } from "next/headers";
import { detectLocale, loadTranslations } from "@/lib/i18n";
import { I18nProvider } from "@/lib/I18nProvider";
import PrivacyContent from "./PrivacyContent";

export default async function PrivacyPage() {
  const acceptLanguage = (headers() as any)["accept-language"] ?? "";
  const lang = detectLocale(acceptLanguage);
  const translations = await loadTranslations(lang, "/privacy");

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <I18nProvider lang={lang} translations={translations}>
          <PrivacyContent />
        </I18nProvider>
        <Footer />
      </div>
    </div>
  );
}
