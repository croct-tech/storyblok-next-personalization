import {withCroct} from '@croct/plug-next/proxy';
import {formatUserId} from '@/lib/account';
import {SESSION_COOKIE} from '@/components/core/Auth';

export const proxy = withCroct({
    userIdResolver: request => {
        const sessionEmail = request.cookies
            .get(SESSION_COOKIE)
            ?.value
            ?.trim();

        if (typeof sessionEmail === 'string' && sessionEmail !== '') {
            return formatUserId(sessionEmail);
        }

        return null;
    },
});

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
};
