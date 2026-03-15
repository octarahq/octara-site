import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getTranslations, getPageLang } from "@/lib/getTranslations";
import { I18nProvider } from "@/lib/I18nProvider";
import TermsContent from "./TermsContent";

export default async function TermsPage() {
  const lang = await getPageLang();
  const translations = await getTranslations("/terms");

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header translations={translations} />
        <I18nProvider lang={lang} translations={translations}>
          <TermsContent translations={translations} />
        </I18nProvider>
        <Footer translations={translations} />
      </div>
    </div>
  );
}
