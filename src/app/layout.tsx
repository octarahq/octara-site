import "./globals.css";
import { headers } from "next/headers";
import { detectLocale } from "@/lib/i18n";
import { getMessages } from "next-intl/server";
import { I18nProvider } from "@/lib/I18nProvider";
import { AuthProvider } from "@/lib/AuthContext";

export async function generateMetadata() {
  const acceptLanguage = (headers() as any)["accept-language"] ?? "";
  const preferredLang = acceptLanguage.split(",")[0].trim().toLowerCase();
  const isFrench = preferredLang.startsWith("fr");

  return {
    title:
      isFrench || !preferredLang.startsWith("en")
        ? "Octara - outils et communauté open source"
        : "Octara - tools and open source community",
    description:
      isFrench || !preferredLang.startsWith("en")
        ? "Octara - outils et communauté open source"
        : "Octara - tools and open source community",
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const acceptLanguage = (headers() as any)["accept-language"] ?? "";
  const lang = detectLocale(acceptLanguage);
  const messages = await getMessages();

  return (
    <html lang={lang} className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-01Y243K139"
        ></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-01Y243K139');`}
        </script>
        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0"
          rel="stylesheet"
        />
        <script id="tailwind-config">
          {`tailwind.config = {
            darkMode: "class",
            theme: {
              extend: {
                colors: {
                  "primary": "#330df2",
                  "background-light": "#f6f5f8",
                  "background-dark": "#131022",
                  "surface": "#131022",
                  "on-surface": "#f6f5f8",
                  "on-surface-variant": "#aca9b6",
                  "surface-container": "rgba(15, 23, 42, 0.5)",
                  "surface-container-low": "rgba(15, 23, 42, 0.3)",
                  "surface-container-high": "rgba(30, 41, 59, 0.5)",
                  "outline": "#1e293b",
                  "error": "#ff6e84",
                },
                fontFamily: {
                  "display": ["Inter"],
                  "body": ["Inter"]
                },
                borderRadius: {
                  "DEFAULT": "0.25rem",
                  "lg": "0.5rem",
                  "xl": "0.75rem",
                  "full": "9999px"
                },
              },
            },
          }`}
        </script>
        <style>{`
          body { font-family: 'Inter', sans-serif; }
          .font-display { font-family: 'Inter', sans-serif; }
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
          .glass-panel {
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.05);
          }
          
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-track { background: #131022; }
          ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
          ::-webkit-scrollbar-thumb:hover { background: #330df2; }
        `}</style>
      </head>
      <body className="bg-background-light dark:bg-background-dark text-on-surface antialiased">
        <AuthProvider>
          <I18nProvider locale={lang} messages={messages}>
            {children}
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
