import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {LOCALE_COOKIE, LOCALES} from '@/lib/locale';

export async function POST(request: Request): Promise<NextResponse> {
    const {locale} = await request.json() as {locale: string};

    if (!LOCALES.some(l => l.code === locale)) {
        return NextResponse.json({error: 'Invalid locale.'}, {status: 400});
    }

    const cookieStore = await cookies();

    cookieStore.set(LOCALE_COOKIE, locale, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.json({ok: true});
}
