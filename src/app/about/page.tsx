import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from './_components/Hero'
import History from './_components/History'
import Mission from './_components/Mission'
import Values from './_components/Values'
import CTA from './_components/CTA'
import { headers } from 'next/headers'
import { detectLocale, loadTranslations } from '@/lib/i18n'
import { I18nProvider } from '@/lib/I18nProvider'

export default async function Page() {
  const acceptLanguage = (headers() as any)['accept-language'] ?? '';
  const lang = detectLocale(acceptLanguage);
  const translations = await loadTranslations(lang, '/about');

  return (
    <I18nProvider lang={lang} translations={translations}>
      <Header />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6">
          <Hero />
          <History />
          <Mission />
          <Values />
          <CTA />
        </div>
      </main>
      <Footer />
    </I18nProvider>
  )
}
