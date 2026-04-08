import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { I18nProvider } from "@/lib/I18nProvider";
import { getMessages, getLocale } from "next-intl/server";
import StatusContent from "./StatusContent";

export default async function Page() {
  const messages = await getMessages();
  const locale = await getLocale();

  return (
    <I18nProvider locale={locale} messages={messages}>
      <Header />
      <StatusContent />
      <Footer />
    </I18nProvider>
  );
}

