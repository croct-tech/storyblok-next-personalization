export const LOCALE_COOKIE = 'locale';
export const DEFAULT_LOCALE = 'en';

export const LOCALES = [
    {code: 'en', label: 'EN'},
    {code: 'pt', label: 'PT'},
] as const;

export type Locale = typeof LOCALES[number]['code'];

export function getStoryblokLanguage(locale: Locale): string | undefined {
    if (locale === DEFAULT_LOCALE) {
        return undefined;
    }

    return locale;
}
