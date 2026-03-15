import { NextResponse } from 'next/server'
import { loadTranslations } from '@/lib/i18n'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const lang = (url.searchParams.get('lang') || 'en').toLowerCase()
    const page = url.searchParams.get('page') || '/'
    const translations = await loadTranslations(lang, page)
    return NextResponse.json(translations)
  } catch (err) {
    return NextResponse.json({}, { status: 500 })
  }
}
