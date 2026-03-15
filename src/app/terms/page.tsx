import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/I18nProvider";
import { getMessages, getLocale } from "next-intl/server";
import TermsContent from "./TermsContent";

export default async function TermsPage() {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <I18nProvider locale={locale} messages={messages}>
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


