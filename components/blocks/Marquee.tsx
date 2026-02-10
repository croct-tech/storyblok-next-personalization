import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';

export type MarqueeProps = {
    blok: {
        headline: string,
        subheadline?: string,
    },
};

export function Marquee({blok}: MarqueeProps): ReactElement {
    return (
        <div {...storyblokEditable(blok)} className="bg-[#f5f5f7] py-24 md:py-32">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-[#1d1d1f] max-w-4xl mx-auto">
                    {blok.headline}
                </h2>
                {blok.subheadline !== undefined && (
                    <p className="mt-5 text-xl md:text-2xl text-[#86868b] max-w-2xl mx-auto">
                        {blok.subheadline}
                    </p>
                )}
            </div>
        </div>
    );
}
