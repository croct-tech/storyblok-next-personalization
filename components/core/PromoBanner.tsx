'use client';

import type {ReactElement, ReactNode} from 'react';

type Promo = {
    icon: ReactNode,
    title: string,
    subtitle: string,
};

const promos: Promo[] = [
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
        ),
        title: 'Free gift wrapping on orders over €100',
        subtitle: 'Add a personal touch to your order.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        ),
        title: 'Same-day delivery — order before 2 PM',
        subtitle: 'Available in select areas.',
    },
    {
        icon: (
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
            </svg>
        ),
        title: '10% off your next order',
        subtitle: 'Subscribe to our newsletter and save.',
    },
];

export type PromoBannerProps = {
    variant?: number,
};

export function PromoBanner({variant = 0}: PromoBannerProps): ReactElement {
    const promo = promos[variant % promos.length];

    return (
        <div className="rounded-2xl bg-[#f5f5f7] px-6 py-5 flex items-center gap-4">
            <span className="flex-shrink-0 text-[#0071e3]">{promo.icon}</span>
            <div>
                <p className="text-sm font-medium text-[#1d1d1f]">{promo.title}</p>
                <p className="text-xs text-[#86868b] mt-0.5">{promo.subtitle}</p>
            </div>
        </div>
    );
}
