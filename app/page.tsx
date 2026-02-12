import type {ISbStoryData} from '@storyblok/react';
import {StoryblokServerStory} from '@storyblok/react/rsc';
import Link from 'next/link';
import type {ReactElement} from 'react';
import type {Page} from '@/.storyblok/types/289964601464397/storyblok-components';
import {NewsletterSignup} from '@/components/core/NewsletterSignup';
import {getStoryblokApi} from '@/lib/storyblok';

function Features(): ReactElement {
    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
            ),
            label: 'Free shipping',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
            ),
            label: '30-day returns',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
            ),
            label: 'Secure checkout',
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg>
            ),
            label: 'Curated selection',
        },
    ];

    return (
        <div className="border-y border-border/40">
            <div className="container mx-auto px-6 py-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {features.map(
                        feature => (
                            <div key={feature.label} className="flex flex-col items-center text-center gap-2">
                                <span className="text-primary/70">{feature.icon}</span>
                                <span className="text-sm font-medium text-primary">{feature.label}</span>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </div>
    );
}

function Statement(): ReactElement {
    return (
        <div className="bg-surface-alt py-24 md:py-32">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-primary max-w-4xl mx-auto">
                    Style that speaks for itself.
                </h2>
                <p className="mt-5 text-xl md:text-2xl text-muted max-w-2xl mx-auto">
                    Every piece is designed with intention, crafted with care, and made to last.
                </p>
            </div>
        </div>
    );
}

function Categories(): ReactElement {
    const categories = [
        {
            name: 'Sportswear',
            description: 'Performance meets style',
            href: '/catalog/sportswear',
        },
        {
            name: 'Elegant',
            description: 'Refined for every occasion',
            href: '/catalog/elegant',
        },
    ];

    return (
        <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-5">
                {categories.map(
                    category => (
                        <Link
                            key={category.name}
                            href={category.href}
                            className="group relative rounded-3xl overflow-hidden bg-surface-alt p-10 md:p-14 flex flex-col justify-end min-h-[240px] hover:bg-surface-hover transition-colors"
                        >
                            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">
                                {category.name}
                            </h3>
                            <p className="mt-1 text-muted">{category.description}</p>
                            <span className="mt-4 inline-flex items-center text-link text-sm font-medium group-hover:underline">
                                Browse collection
                                <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </span>
                        </Link>
                    ),
                )}
            </div>
        </div>
    );
}

export default async function Home(): Promise<ReactElement> {
    const {data} = await fetchData();

    return (
        <>
            <StoryblokServerStory story={data.story} />
            <Features />
            <Statement />
            <Categories />
            <NewsletterSignup />
        </>
    );
}

async function fetchData(): Promise<{data: {story: ISbStoryData<Page>}}> {
    const storyblokApi = getStoryblokApi();

    return storyblokApi.get('cdn/stories/home', {
        version: 'draft',
        resolve_links: 'url',
    });
}
