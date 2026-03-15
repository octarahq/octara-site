"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import i18next from "i18next";

type Translations = Record<string, any>;

type I18nContextValue = {
  t: (key: string, vars?: Record<string, any>) => string;
  i18n: typeof i18next;
  ready: boolean;
};

const I18nContext = createContext<I18nContextValue>({
  t: (k) => k,
  i18n: i18next,
  ready: false,
});

export function useI18n() {
  return useContext(I18nContext);
}

export function I18nProvider({
  children,
  lang,
  translations = {},
  pagePath = "/",
}: {
  children: React.ReactNode;
  lang?: string;
  translations?: Translations;
  pagePath?: string;
}) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initFromServerOrClient() {
      try {
        if (lang) {
          const resources: Record<string, Record<string, any>> = {
            [lang]: { translation: translations },
          };
          if (!i18next.isInitialized) {
            await i18next.init({
              lng: lang,
              fallbackLng: "en",
              ns: ["translation"],
              defaultNS: "translation",
              resources,
              interpolation: { escapeValue: false },
            });
          } else {
            i18next.changeLanguage(lang);
            Object.keys(translations).forEach((key) => {
              i18next.addResource(lang, "translation", key, translations[key]);
            });
          }
          if (mounted) setIsReady(true);
          try {
            if (typeof window !== "undefined" && navigator.language) {
              const clientLang = navigator.language.split("-")[0].toLowerCase();
              if (clientLang && clientLang !== lang && pagePath) {
                const res = await fetch(`/api/translations?lang=${encodeURIComponent(clientLang)}&page=${encodeURIComponent(pagePath)}`);
                const clientTranslations = await res.json();
                Object.keys(clientTranslations || {}).forEach((key) => {
                  i18next.addResource(clientLang, "translation", key, clientTranslations[key]);
                });
                i18next.changeLanguage(clientLang);
                if (mounted) setIsReady(true);
              }
            }
          } catch (e) {
            // ignore
          }
        } else {
          if (typeof window !== "undefined" && navigator.language) {
            const clientLang = navigator.language.split("-")[0].toLowerCase() || "en";
            try {
              const res = await fetch(`/api/translations?lang=${encodeURIComponent(clientLang)}&page=${encodeURIComponent(pagePath)}`);
              const clientTranslations = await res.json();
              const resources: Record<string, Record<string, any>> = {
                [clientLang]: { translation: clientTranslations || {} },
              };
              if (!i18next.isInitialized) {
                await i18next.init({
                  lng: clientLang,
                  fallbackLng: "en",
                  ns: ["translation"],
                  defaultNS: "translation",
                  resources,
                  interpolation: { escapeValue: false },
                });
              } else {
                Object.keys(clientTranslations || {}).forEach((key) => {
                  i18next.addResource(clientLang, "translation", key, clientTranslations[key]);
                });
                i18next.changeLanguage(clientLang);
              }
            } catch (e) {
              if (!i18next.isInitialized) {
                await i18next.init({ lng: "en", fallbackLng: "en" });
              }
            }
          }
          if (mounted) setIsReady(true);
        }
      } catch (err) {
        if (mounted) setIsReady(true);
      }
    }

    initFromServerOrClient();
    return () => {
      mounted = false;
    };
  }, [lang, translations, pagePath]);

  const safeT = (key: string, vars?: Record<string, any>) => {
    try {
      const res = i18next.t(key, vars as any);
      if (res === null || res === undefined) return key;
      if (typeof res === "string") return res;
      return String(res);
    } catch (e) {
      return key;
    }
  };

  return (
    <I18nContext.Provider value={{ t: safeT, i18n: i18next, ready: isReady }}>
      {children}
    </I18nContext.Provider>
  );
}
