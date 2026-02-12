import {NextResponse} from 'next/server';
import {cookies} from 'next/headers';
import {anonymize} from '@croct/plug-next/server';
import {SESSION_COOKIE} from '@/components/core/Auth';

export async function POST(): Promise<NextResponse> {
    const cookieStore = await cookies();

    cookieStore.delete(SESSION_COOKIE);

    await anonymize();

    return NextResponse.json({ok: true});
}
