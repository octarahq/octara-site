import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { detectLocale } from '@/lib/i18n';

export async function GET() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  const xNextIntl = headersList.get('x-next-intl-locale') || null;
  const host = headersList.get('host') || null;

  const detected = detectLocale(acceptLanguage);

  const info = {
    serverTime: new Date().toISOString(),
    acceptLanguage,
    xNextIntl,
    host,
    detected,
  };

  console.log('[i18n-debug] request headers', info);

  return NextResponse.json(info);
}
