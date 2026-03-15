import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Hero from "./_components/Hero";
import Mission from "./_components/Mission";
import Positions from "./_components/Positions";
import CTA from "./_components/CTA";
import { getTranslations, getPageLang } from "@/lib/getTranslations";
import { I18nProvider } from "@/lib/I18nProvider";

export default async function CareersPage() {
  const lang = await getPageLang();
  const translations = await getTranslations("/careers");

  return (
    <I18nProvider lang={lang} translations={translations}>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
            <Header translations={translations} />
          <main className="flex-1 flex flex-col items-center">
              <Hero translations={translations} />
              <Mission translations={translations} />
              <Positions translations={translations} />
              <CTA />
          </main>
            <Footer translations={translations} />
        </div>
      </div>
    </I18nProvider>
  );
}
