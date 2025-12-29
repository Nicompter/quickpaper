import { cookies, headers } from 'next/headers';
import { Locale } from './i18n';

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const savedLocale = cookieStore.get('locale')?.value as Locale | undefined;
  
  if (savedLocale === 'de' || savedLocale === 'en') {
    return savedLocale;
  }
  
  // Detect from Accept-Language header
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';
  
  if (acceptLanguage.toLowerCase().includes('de')) {
    return 'de';
  }
  
  return 'en';
}
