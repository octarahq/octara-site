import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Hero from './_components/Hero'
import History from './_components/History'
import Mission from './_components/Mission'
import Values from './_components/Values'
import CTA from './_components/CTA'
import { getTranslations, getPageLang } from '@/lib/getTranslations'
import { I18nProvider } from '@/lib/I18nProvider'

export default async function Page() {
  const lang = await getPageLang();
  const translations = await getTranslations('/about');

  return (
    <I18nProvider lang={lang} translations={translations} pagePath="/about">
    <Header translations={translations} />
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-6">
          <Hero translations={translations} />
          <History translations={translations} />
          <Mission translations={translations} />
          <Values translations={translations} />
          <CTA translations={translations} />
        </div>
      </main>
      <Footer translations={translations} />
    </I18nProvider>
  )
}
