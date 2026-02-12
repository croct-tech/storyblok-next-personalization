import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {identify} from '@croct/plug-next/server';
import {formatUserId} from '@/lib/account';
import {SESSION_COOKIE} from '@/components/core/Auth';

export async function POST(request: Request): Promise<NextResponse> {
    const {email} = await request.json() as {email: string};

    if (typeof email !== 'string' || email.trim() === '') {
        return NextResponse.json({error: 'Email is required.'}, {status: 400});
    }

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE, email.trim(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    });

    await identify(await formatUserId(email.trim()));

    return NextResponse.json({ok: true});
}
