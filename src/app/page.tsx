"use client";

import Header from "@/components/Header";
import Hero from "./_components/Hero";
import Stats from "./_components/Stats";
import Projects from "./_components/Projects";
import Footer from "@/components/Footer";
import { I18nProvider } from '@/lib/I18nProvider';

export default function Home() {
  return (
    <I18nProvider pagePath="/">
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
