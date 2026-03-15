"use client";

import React, { createContext, useContext } from "react";

export type Translations = Record<string, string>;

type I18nContextValue = {
  t: (key: string) => string;
  lang: string;
  translations: Translations;
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
  const t = (key: string) => {
    return translations[key] ?? key;
  };

  return <I18nContext.Provider value={{ t, lang, translations }}>{children}</I18nContext.Provider>;
}
