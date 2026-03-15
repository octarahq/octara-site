import fs from "fs/promises";
import path from "path";
import i18next from "i18next";

export type Translations = Record<string, string>;

async function readJson(filePath: string): Promise<Translations | null> {
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw) as Translations;
  } catch (e) {
    return null;
  }
}

export async function loadTranslations(lang: string, pageRelativePath = "/"): Promise<Translations> {
  const root = process.cwd();
  const normalizedPage = pageRelativePath === "/" ? "" : pageRelativePath.replace(/^\/+/, "");
  const pageLocalesPath = path.join(root, "src", "app", normalizedPage, "_utils", "locales", `${lang}.json`);
  const rootLocalesPath = path.join(root, "src", "app", "_utils", "locales", `${lang}.json`);

  const rootTranslations = (await readJson(rootLocalesPath)) ?? {};
  const pageTranslations = (await readJson(pageLocalesPath)) ?? {};

  return {
    ...rootTranslations,
    ...pageTranslations,
  };
}

export type Locale = 'en' | 'fr';

export function detectLocale(acceptLanguage?: string): Locale {
  if (acceptLanguage) {
    const preferred = acceptLanguage.split(",")[0].trim().toLowerCase();
    return preferred.startsWith("fr") ? "fr" : "en";
  }

  if (typeof navigator !== "undefined" && navigator.language) {
    const lang = navigator.language.split("-")[0];
    return lang === "fr" ? "fr" : "en";
  }

  return "en";
}

export async function initializeI18n(lang: Locale, translations: Translations): Promise<typeof i18next> {
  const resources: Record<string, Record<string, any>> = {
    [lang]: {
      translation: translations,
    },
  };

  if (!i18next.isInitialized) {
    await i18next.init({
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

  return i18next;
}
