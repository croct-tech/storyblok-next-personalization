import type {Metadata} from 'next';
import type {ISbStoriesParams} from '@storyblok/react';
import Image from 'next/image';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import type {ReactElement} from 'react';
import type {Product} from '@/components/blocks/Catalog';
import {AddToCartButton} from '@/components/core/AddToCartButton';
import {getStoryblokApi} from '@/lib/storyblok';
import {renderMarkdown} from '@/lib/markdown';

async function getProduct(slug: string): Promise<Product> {
    const storyblokApi = getStoryblokApi();

    const params: ISbStoriesParams = {
        version: 'draft',
        resolve_links: 'url',
        filter_query: {
            component: {
                in: 'product',
            },
        },
        search_term: slug,
    };

    const stories: Product[] = await storyblokApi.getAll('cdn/stories', params);

    const product = stories.find(story => story.slug === slug);

    if (product === undefined) {
        notFound();
    }

    return product;
}

function capitalize(value: string | number): string {
    return String(value).charAt(0).toUpperCase() + String(value).slice(1);
}

export async function generateMetadata({params}: PageProps<'/product/[slug]'>): Promise<Metadata> {
    const {slug} = await params;
    const product = await getProduct(slug);

    return {
        title: product.name,
        description: product.content.tagline ?? product.content.description ?? `Shop ${product.name} — €${product.content.price}`,
    };
}

export default async function ProductPage({params}: PageProps<'/product/[slug]'>): Promise<ReactElement> {
    const {slug} = await params;
    const product = await getProduct(slug);
    const {category} = product.content;

    const jsonLd: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        identifier: product.slug,
        name: product.name,
        url: `/product/${product.slug}`,
        image: product.content.image.filename!,
        offers: {
            '@type': 'Offer',
            price: product.content.price,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
        },
    };

    if (category !== undefined) {
        jsonLd.category = capitalize(category);
    }

    if (product.content.description !== undefined) {
        jsonLd.description = product.content.description;
    }

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />

            <div className="md:grid md:grid-cols-2 md:min-h-[calc(100vh-64px)]">
                <div className="relative bg-surface-alt min-h-[50vh] md:sticky md:top-0 md:h-screen">
                    <Image
                        src={product.content.image.filename!}
                        fill
                        alt={product.name}
                        className="object-cover"
                        priority
                        unoptimized
                    />
                </div>

                <div className="px-8 md:px-16 py-12 md:py-20 flex flex-col justify-center">
                    {category !== undefined && (
                        <Link
                            href={`/catalog/${category}`}
                            className="text-xs font-medium uppercase tracking-widest text-muted hover:text-primary transition-colors"
                        >
                            {capitalize(category)}
                        </Link>
                    )}

                    <h1 className="mt-2 text-4xl md:text-5xl font-semibold tracking-tight text-primary">
                        {product.name}
                    </h1>

                    {product.content.tagline !== undefined && (
                        <p className="mt-3 text-lg text-muted">
                            {product.content.tagline}
                        </p>
                    )}

                    <p className="mt-3 text-xl text-primary">
                        &euro; {product.content.price}
                    </p>

                    <div className="mt-6">
                        <AddToCartButton
                            id={product.uuid}
                            name={product.name}
                            slug={product.slug}
                            image={product.content.image.filename!}
                            price={Number.parseFloat(product.content.price)}
                        />
                    </div>

                    {product.content.description !== undefined && (
                        <div className="mt-8 text-primary/80 leading-relaxed">
                            {renderMarkdown(product.content.description)}
                        </div>
                    )}

                    <div className="mt-10">
                        <Link
                            href={category !== undefined ? `/catalog/${category}` : '/catalog'}
                            className="text-link hover:underline"
                        >
                            &larr; Back to catalog
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
