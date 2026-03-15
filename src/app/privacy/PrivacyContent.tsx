import { } from "react";

export default function PrivacyContent({ translations }: { translations?: Record<string,string> }) {
  const t = (key: string) => translations?.[key] ?? key;

  return (
    <main className="flex flex-1 justify-center py-10 px-6 lg:px-40">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h1 className="text-slate-900 dark:text-white text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              {t("privacy.title")}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              {t("privacy.updated")}
            </p>
          </div>

          <div className="flex flex-col gap-12 text-slate-700 dark:text-slate-300">
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.introTitle")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.intro")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section1.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section1.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section2.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section2.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section3.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section3.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section4.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section4.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section5.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section5.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section6.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section6.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section7.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section7.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section8.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section8.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section9.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section9.body")}</p>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <h2 className="text-slate-900 dark:text-white text-2xl font-bold tracking-tight">
                  {t("privacy.section10.title")}
                </h2>
              </div>
              <div className="pl-5 border-l border-slate-200 dark:border-slate-800">
                <p className="text-base leading-relaxed">{t("privacy.section10.body")}</p>
              </div>
            </section>
          </div>

          <div className="mt-16 p-8 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-slate-900 dark:text-white text-lg font-bold">{t("privacy.contact.title")}</h3>
              <p className="text-slate-500 dark:text-slate-400">{t("privacy.contact.desc")}</p>
            </div>
            <button className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:brightness-110 transition-all">
              {t("privacy.contact.button")}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
