import type {ISbStoriesParams} from '@storyblok/react';
import type {Metadata} from 'next';
import type {ReactElement} from 'react';
import type {Product} from '@/components/blocks/Catalog';
import {Catalog} from '@/components/blocks/Catalog';
import {getStoryblokApi} from '@/lib/storyblok';

export async function generateMetadata({params}: PageProps<'/catalog/[[...category]]'>): Promise<Metadata> {
    const {category = []} = await params;
    const title = category.length > 0
        ? category[0].charAt(0).toUpperCase() + category[0].slice(1)
        : 'Catalog';

    return {
        title: title,
    };
}

export default async function CatalogPage({params}: PageProps<'/catalog/[[...category]]'>): Promise<ReactElement> {
    const {category = []} = await params;
    const products = await fetchData(category[0]);

    const title = category.length > 0
        ? category[0].charAt(0).toUpperCase() + category[0].slice(1)
        : 'All products';

    return (
        <>
            <main>
                <div className="pt-10 pb-2 text-center">
                    <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-primary">
                        {title}
                    </h1>
                    <p className="mt-2 text-muted text-lg">
                        Explore our collection
                    </p>
                </div>
                <Catalog products={products} category={category[0]} />
            </main>
        </>
    );
}

export async function fetchData(category?: string): Promise<Product[]> {
    const params: ISbStoriesParams = {
        version: 'draft',
        resolve_links: 'url',
        filter_query: {
            component: {
                in: 'product',
            },
        },
    };

    if (category !== undefined) {
        params.filter_query.category = {
            in: category,
        };
    }

    const storyblokApi = getStoryblokApi();

    return storyblokApi.getAll('cdn/stories', params);
}
