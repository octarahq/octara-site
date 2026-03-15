import "./globals.css";
import { headers } from "next/headers";
import { detectLocale, loadTranslations } from "@/lib/i18n";
import { I18nProvider } from "@/lib/I18nProvider";

export async function generateMetadata() {
  const acceptLanguage = (headers() as any)["accept-language"] ?? "";
  const preferredLang = acceptLanguage.split(",")[0].trim().toLowerCase();
  const isFrench = preferredLang.startsWith("fr");

  return {
    title: isFrench
      ? "Octara - outils et communauté open source"
      : "Octara - tools and open source community",
    description: isFrench
      ? "Octara - outils et communauté open source"
      : "Octara - tools and open source community",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const acceptLanguage = (headers() as any)["accept-language"] ?? "";
  const lang = detectLocale(acceptLanguage);
  const translations = await loadTranslations(lang, "/");

  return (
    <html lang={lang} className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@100..700,0..1&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <script id="tailwind-config">
          {`tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "primary": "#330df2",
                  "background-light": "#f6f5f8",
                  "background-dark": "#131022",
                },
                fontFamily: {
                  "display": ["Inter"]
                },
                borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
              },
            },
          }`}
        </script>
        <style>{`body { font-family: 'Inter', sans-serif; }`}</style>
      </head>
      <body className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased font-display">
        <I18nProvider lang={lang} translations={translations}>{children}</I18nProvider>
      </body>
    </html>
  );
}
