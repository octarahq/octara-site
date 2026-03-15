"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import i18next from "i18next";

export type Translations = Record<string, string>;

type I18nContextValue = {
  t: (key: string, defaultValue?: string) => string;
  lang: string;
  translations: Translations;
  i18n: typeof i18next;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}

export function I18nProvider({
  children,
  lang,
  translations = {},
  pagePath = "/",
}: {
  children: React.ReactNode;
  lang: string;
  translations?: Translations;
  pagePath?: string;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!i18next.isInitialized) {
      const resources: Record<string, Record<string, any>> = {
        [lang]: {
          translation: translations,
        },
      };
      i18next.init({
        lng: lang,
        fallbackLng: "en",
        ns: ["translation"],
        defaultNS: "translation",
        resources,
        interpolation: {
          escapeValue: false,
        },
      });
    } else {
      i18next.changeLanguage(lang);
      
      Object.keys(translations).forEach((key) => {
        i18next.addResource(lang, "translation", key, translations[key]);
      });
    }
    setIsReady(true);

    // If the browser prefers a different language than the server-provided one,
    // try to fetch translations for the client-preferred language and apply them.
    try {
      if (typeof window !== "undefined" && navigator.language) {
        const clientLang = navigator.language.split("-")[0].toLowerCase();
        if (clientLang && clientLang !== lang && pagePath) {
          // fetch translations for the client language for this page
          setIsReady(false);
          fetch(`/api/translations?lang=${encodeURIComponent(clientLang)}&page=${encodeURIComponent(pagePath)}`)
            .then((r) => r.json())
            .then((clientTranslations) => {
              const resources: Record<string, Record<string, any>> = {
                [clientLang]: { translation: clientTranslations || {} },
              };
              Object.keys(clientTranslations || {}).forEach((key) => {
                i18next.addResource(clientLang, "translation", key, clientTranslations[key]);
              });
              i18next.changeLanguage(clientLang);
            })
            .catch(() => {})
            .finally(() => setIsReady(true));
        }
      }
    } catch (e) {
      // ignore
    }
  }, [lang, translations]);

  const t = (key: string, defaultValue?: string): string => {
    if (!isReady) {
      return translations[key] ?? defaultValue ?? key;
    }
    return i18next.t(key, {
      defaultValue: defaultValue ?? translations[key] ?? key,
    }) as string;
  };

  return (
    <I18nContext.Provider value={{ t, lang, translations, i18n: i18next }}>
      {children}
    </I18nContext.Provider>
  );
}
