import Header from "@/components/Header";
import Hero from "./_components/Hero";
import Stats from "./_components/Stats";
import Projects from "./_components/Projects";
import Footer from "@/components/Footer";
import { I18nProvider } from '@/lib/I18nProvider';
import { getMessages, getLocale } from "next-intl/server";

export default async function Home() {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <I18nProvider locale={locale} messages={messages}>
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <Header />
          <main className="flex flex-col flex-1">
            <Hero />
            <Stats />
            <Projects />
            <Footer />
          </main>
        </div>
      </div>
    </I18nProvider>
  );
}


