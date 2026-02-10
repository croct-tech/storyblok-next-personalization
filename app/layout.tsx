import './globals.css';
import type {Metadata} from 'next';
import {Plus_Jakarta_Sans as Jakarta} from 'next/font/google';
import type {PropsWithChildren, ReactElement} from 'react';
import {StoryblokProvider} from '@/components/StoryblokProvider';
import {CartProvider} from '@/components/core/CartContext';
import {Navigation} from '@/components/core/Navigation';
import {TopBar} from '@/components/core/TopBar';
import {Footer} from '@/components/core/Footer';

const plusJakarta = Jakarta({
    variable: '--font-fallback',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Croct + Storyblok',
    description: 'Croct + Storyblok — Personalized Shopping Experience',
    icons: {
        icon: '/logo.svg',
    },
};

export default function RootLayout({children}: PropsWithChildren): ReactElement {
    return (<html lang="en">
        <body className={`${plusJakarta.variable} antialiased`}>
            <StoryblokProvider>
                <CartProvider>
                    <div className="min-h-screen flex flex-col">
                        <TopBar/>
                        <Navigation/>
                        <div className="flex-1">
                            {children}
                        </div>
                        <Footer/>
                    </div>
                </CartProvider>
            </StoryblokProvider>
        </body>
    </html>);
}
