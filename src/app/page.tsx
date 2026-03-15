import Header from "@/components/Header";
import Hero from "./_components/Hero";
import Stats from "./_components/Stats";
import Projects from "./_components/Projects";
import Footer from "@/components/Footer";
import { getTranslations, getPageLang } from '@/lib/getTranslations';

export default async function Home() {
  const lang = await getPageLang();
  const translations = await getTranslations('/');

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <Header translations={translations} />
        <main className="flex flex-col flex-1">
          <Hero translations={translations} />
          <Stats translations={translations} />
          <Projects translations={translations} />
          <Footer translations={translations} />
        </main>
      </div>
    </div>
  );
}
