import Link from 'next/link';
import Image from 'next/image';
import type {SbBlokData} from '@storyblok/react/rsc';
import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';
import {useCroct} from '@croct/plug-next';
import type {HeroSection as HeroSectionBlok} from '@/.storyblok/types/289964601464397/storyblok-components';
import {renderMarkdown} from '@/lib/markdown';

export type HeroSectionProps = {
    blok: SbBlokData & HeroSectionBlok,
};

export function HeroSection({blok}: HeroSectionProps): ReactElement {
    const cta = blok.cta[0];
    const croct = useCroct();

    return (
        <div {...storyblokEditable(blok)} className="contents lg:block">
            <div className="contents lg:block bg-surface-alt">
                <div className="contents lg:flex lg:flex-row lg:h-[80vh] lg:min-h-[500px]">
                    <div className="flex flex-col justify-center px-8 lg:px-16 py-8 lg:py-0 lg:w-1/2 order-1 lg:order-none bg-surface-alt lg:bg-transparent">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-primary">
                            {blok.headline}
                        </h2>
                        <div className="mt-3 lg:mt-6 text-muted text-xl md:text-2xl leading-relaxed">
                            {renderMarkdown(blok.tagline)}
                        </div>
                        <Link
                            onClick={() => croct.track('goalCompleted', {goalId: 'hero-cta-click'})}
                            href={cta?.link.cached_url}
                            className="mt-8 self-start rounded-full bg-primary px-8 py-3 text-base font-medium text-white text-center hover:bg-primary/85 transition-colors"
                        >
                            {cta?.label}
                        </Link>
                    </div>
                    <div className="relative min-h-[60vh] lg:min-h-0 lg:w-1/2 overflow-hidden order-3 lg:order-none">
                        <Image
                            src={blok.image.filename!}
                            fill
                            alt={blok.image?.alt ?? 'Call to Action Image'}
                            className="object-cover object-top"
                            priority
                            unoptimized
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
