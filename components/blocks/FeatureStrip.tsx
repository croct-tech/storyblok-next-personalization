import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';

export type FeatureStripProps = {
    blok: {
        features: Array<{
            _uid: string,
            icon: string,
            label: string,
        }>,
    },
};

const icons: Record<string, ReactElement> = {
    shipping: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H6.375m11.25-4.5V6.75A2.25 2.25 0 0 0 15.375 4.5H2.25m17.25 7.5h2.25a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75h-3.75" />
        </svg>
    ),
    returns: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
    ),
    secure: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
        </svg>
    ),
    support: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
    ),
};

export function FeatureStrip({blok}: FeatureStripProps): ReactElement {
    return (
        <div {...storyblokEditable(blok)} className="border-y border-border/40">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {blok.features.map(
                        feature => (
                            <div key={feature._uid} className="flex flex-col items-center text-center gap-2">
                                <span className="text-primary/70">
                                    {icons[feature.icon] ?? icons.shipping}
                                </span>
                                <span className="text-sm font-medium text-primary">
                                    {feature.label}
                                </span>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}
