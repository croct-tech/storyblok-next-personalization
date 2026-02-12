'use client';

import type {ISbStoryData} from '@storyblok/react';
import Image from 'next/image';
import Link from 'next/link';
import type {ReactElement} from 'react';
import {useCroct} from '@croct/plug-next';
import type {Product as ProductContent} from '@/.storyblok/types/289964601464397/storyblok-components';
import {useTrackingOnce} from '@/components/hooks/useTrackingOnce';

export type Product = ISbStoryData<ProductContent>;

export type CatalogProps = {
    products: Product[],
    category?: string,
};

export function Catalog({products, category}: CatalogProps): ReactElement {
    const croct = useCroct();

    useTrackingOnce(
        () => {
            if (category !== undefined) {
                void croct.track('interestShown', {
                    interests: [category],
                });
            }
        },
        category !== undefined,
        category,
    );

    return (
        <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(
                    product => (
                        <Link
                            key={product.uuid}
                            href={`/product/${product.slug}`}
                            className="group block rounded-3xl overflow-hidden bg-surface-alt"
                        >
                            <div className="relative aspect-[4/4] overflow-hidden">
                                <Image
                                    src={product.content.image.filename!}
                                    fill
                                    alt={product.name}
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                    priority
                                    unoptimized
                                />
                            </div>
                            <div className="px-6 py-5">
                                <h3 className="text-lg font-medium text-primary">{product.name}</h3>
                                <p className="mt-1 text-muted">&euro; {product.content.price}</p>
                            </div>
                        </Link>
                    ),
                )}
            </div>
        </div>
    );
}
