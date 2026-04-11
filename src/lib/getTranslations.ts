import { headers } from "next/headers";
import { detectLocale, loadTranslations, Translations } from "./i18n";

export async function getTranslations(
  pageRelativePath = "/",
): Promise<Translations> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "";
  const lang = detectLocale(acceptLanguage);
  const translations = await loadTranslations(lang, pageRelativePath);
  return translations;
}

export async function getPageLang(): Promise<string> {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "";
  return detectLocale(acceptLanguage);
}
