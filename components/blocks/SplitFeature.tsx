import Image from 'next/image';
import Link from 'next/link';
import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';
import {renderMarkdown} from '@/lib/markdown';

export type SplitFeatureProps = {
    blok: {
        headline: string,
        text: string,
        image: {
            filename: string,
            alt: string,
        },
        link?: {
            story?: {
                url: string,
            },
        },
        link_label?: string,
        layout?: 'image_left' | 'image_right',
    },
};

export function SplitFeature({blok}: SplitFeatureProps): ReactElement {
    const imageRight = blok.layout === 'image_right';

    const imageBlock = (
        <div className="relative aspect-[4/5] md:aspect-auto md:h-auto overflow-hidden rounded-3xl bg-surface-alt">
            <Image
                src={blok.image.filename}
                fill
                alt={blok.image?.alt ?? blok.headline}
                className="object-cover"
                unoptimized
            />
        </div>
    );

    const textBlock = (
        <div className="flex flex-col justify-center px-2 md:px-12 py-8">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary">
                {blok.headline}
            </h2>
            <div className="mt-4 text-lg text-muted leading-relaxed max-w-lg">
                {renderMarkdown(blok.text)}
            </div>
            {blok.link?.story?.url !== undefined && (
                <Link
                    href={blok.link.story.url}
                    className="mt-6 inline-flex items-center text-link text-lg hover:underline"
                >
                    {blok.link_label ?? 'Learn more'}
                    <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                </Link>
            )}
        </div>
    );

    return (
        <div {...storyblokEditable(blok)} className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
                {imageRight ? <>{textBlock}{imageBlock}</> : <>{imageBlock}{textBlock}</>}
            </div>
        </div>
    );
}
