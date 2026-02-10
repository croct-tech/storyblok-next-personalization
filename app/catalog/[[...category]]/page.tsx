import type {ISbStoriesParams} from '@storyblok/react';
import type {ReactElement} from 'react';
import type {Product} from '@/components/blocks/Catalog';
import {Catalog} from '@/components/blocks/Catalog';
import {getStoryblokApi} from '@/lib/storyblok';

export default async function CatalogPage({params}: PageProps<'/catalog/[[...category]]'>): Promise<ReactElement> {
    const {category = []} = await params;
    const products = await fetchData(category[0]);

    const title = category.length > 0
        ? category[0].charAt(0).toUpperCase() + category[0].slice(1)
        : 'All Products';

    return (
        <>
            <main>
                <div className="pt-10 pb-2 text-center">
                    <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f]">
                        {title}
                    </h1>
                    <p className="mt-2 text-[#86868b] text-lg">
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
