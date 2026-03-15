import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language') || 'en';
  const locale = acceptLanguage.startsWith('fr') ? 'fr' : 'en';
  
  const response = NextResponse.next();
  response.headers.set('x-next-intl-locale', locale);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
