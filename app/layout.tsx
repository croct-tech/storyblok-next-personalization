import {CroctProvider} from '@croct/plug-next/CroctProvider';
import './globals.css';
import type {Metadata} from 'next';
import {Plus_Jakarta_Sans as Jakarta} from 'next/font/google';
import type {PropsWithChildren, ReactElement} from 'react';
import {cookies} from 'next/headers';
import type {ISbStoryData} from '@storyblok/react';
import {StoryblokServerComponent} from '@storyblok/react/rsc';
import type {AnnouncementBar} from '@/.storyblok/types/289964601464397/storyblok-components';
import {StoryblokProvider} from '@/components/core/StoryblokProvider';
import {CartProvider} from '@/components/core/CartProvider';
import {AuthProvider} from '@/components/core/AuthProvider';
import {SESSION_COOKIE} from '@/components/core/Auth';
import {Navigation} from '@/components/core/Navigation';
import {Footer} from '@/components/core/Footer';
import {ConciergeButton} from '@/components/core/ConciergeButton';
import {getStoryblokApi} from '@/lib/storyblok';

const plusJakarta = Jakarta({
    variable: '--font-fallback',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: {
        default: 'Croct + Storyblok',
        template: '%s — Croct + Storyblok',
    },
    description: 'Croct + Storyblok — Personalized Shopping Experience',
    icons: {
        icon: '/logo.svg',
    },
};

export default async function RootLayout({children}: PropsWithChildren): Promise<ReactElement> {
    const cookieStore = await cookies();
    const sessionEmail = cookieStore.get(SESSION_COOKIE)?.value;

    const storyblokApi = getStoryblokApi();
    const {data}: {data: {story: ISbStoryData<AnnouncementBar>}} = await storyblokApi.get('cdn/stories/announcement-bar', {
        version: 'draft',
        resolve_links: 'url',
    });

    return (<html lang="en">
        <body className={`${plusJakarta.variable} antialiased`}>
            <StoryblokProvider>
                <CroctProvider>
                    <AuthProvider sessionEmail={sessionEmail}>
                        <CartProvider>
                            <div className="min-h-screen flex flex-col">
                                <StoryblokServerComponent blok={data.story.content} />
                                <Navigation/>
                                <div className="flex-1">
                                    {children}
                                </div>
                                <Footer/>
                            </div>
                            <ConciergeButton />
                        </CartProvider>
                    </AuthProvider>
                </CroctProvider>
            </StoryblokProvider>
        </body>
    </html>);
}
