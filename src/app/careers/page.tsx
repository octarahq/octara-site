import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Hero from "./_components/Hero";
import Mission from "./_components/Mission";
import Positions from "./_components/Positions";
import CTA from "./_components/CTA";
import { headers } from "next/headers";
import { detectLocale, loadTranslations } from "@/lib/i18n";
import { I18nProvider } from "@/lib/I18nProvider";

export default async function CareersPage() {
  const acceptLanguage = (headers() as any)["accept-language"] ?? "";
  const lang = detectLocale(acceptLanguage);
  const translations = await loadTranslations(lang, "/careers");

  return (
    <I18nProvider lang={lang} translations={translations}>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <main className="flex-1 flex flex-col items-center">
            <Hero />
            <Mission />
            <Positions />
            <CTA />
          </main>
          <Footer />
        </div>
      </div>
    </I18nProvider>
  );
}
