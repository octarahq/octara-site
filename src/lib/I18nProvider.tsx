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
}: {
  children: React.ReactNode;
  lang: string;
  translations?: Translations;
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
