import {cookies} from 'next/headers';
import {DEFAULT_LOCALE, LOCALE_COOKIE, LOCALES} from '@/lib/locale';
import type {Locale} from '@/lib/locale';

export async function getLocale(): Promise<Locale> {
    const cookieStore = await cookies();
    const value = cookieStore.get(LOCALE_COOKIE)?.value;

    if (value !== undefined && LOCALES.some(l => l.code === value)) {
        return value as Locale;
    }

    return DEFAULT_LOCALE;
}
