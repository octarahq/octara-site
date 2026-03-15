"use client";

import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

export function I18nProvider({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="UTC">
      {children}
    </NextIntlClientProvider>
  );
}

export function useI18n() {
  const { useTranslations } = require('next-intl');
  // Return a bridge to next-intl t()
  const t = useTranslations();
  return { t };
}


