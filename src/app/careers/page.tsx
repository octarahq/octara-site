import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Hero from "./_components/Hero";
import Mission from "./_components/Mission";
import Positions from "./_components/Positions";
import CTA from "./_components/CTA";
import { I18nProvider } from "@/lib/I18nProvider";
import { getMessages, getLocale } from "next-intl/server";

export default async function CareersPage() {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <I18nProvider locale={locale} messages={messages}>
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

