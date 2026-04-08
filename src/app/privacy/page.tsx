import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/I18nProvider";
import { getMessages, getLocale } from "next-intl/server";
import PrivacyContent from "./PrivacyContent";

export default async function PrivacyPage() {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <I18nProvider locale={locale} messages={messages}>
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

