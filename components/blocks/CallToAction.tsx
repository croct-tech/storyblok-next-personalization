import Link from 'next/link';
import Image from 'next/image';
import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';
import {renderMarkdown} from '@/lib/markdown';

export type CallToActionProps = {
    blok: {
        headline: string,
        text: string,
        link: {
            story?: {
                url: string,
            },
        },
        image: {
            filename: string,
            alt: string,
        },
    },
};

export function CallToAction({blok}: CallToActionProps): ReactElement {
    return (
        <div {...storyblokEditable(blok)}>
            <Link
                href={`${blok.link.story?.url ?? '/catalog/'}`}
                className="block bg-[#f5f5f7]"
            >
                <div className="flex flex-col md:flex-row md:h-[80vh] md:min-h-[500px]">
                    <div className="flex flex-col justify-center px-8 md:px-16 py-12 md:py-0 md:w-1/2">
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#1d1d1f]">
                            {blok.headline}
                        </h2>
                        <div className="mt-6 text-[#86868b] text-lg leading-relaxed">
                            {renderMarkdown(blok.text)}
                        </div>
                        <span className="mt-5 inline-flex items-center text-base font-medium text-[#06c] hover:underline">
                            Shop now
                            <svg className="w-3.5 h-3.5 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </span>
                    </div>
                    <div className="relative min-h-[60vh] md:min-h-0 md:w-1/2 overflow-hidden">
                        <Image
                            src={blok.image.filename}
                            fill
                            alt={blok.image?.alt ?? 'Call to Action Image'}
                            className="object-cover"
                            priority
                            unoptimized
                        />
                    </div>
                </div>
            </Link>
        </div>
    );
}
