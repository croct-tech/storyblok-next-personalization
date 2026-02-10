import Image from 'next/image';
import Link from 'next/link';
import type {ReactElement} from 'react';

export type Product = {
    uuid: string,
    name: string,
    slug: string,
    content: {
        image: {
            filename: string,
        },
        price: number,
        category?: string,
        title?: string,
        tagline?: string,
        description?: string,
    },
};

export type CatalogProps = {
    products: Product[],
    category?: string,
};

export function Catalog({products}: CatalogProps): ReactElement {
    return (
        <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {products.map(
                    product => (
                        <Link
                            key={product.uuid}
                            href={`/product/${product.slug}`}
                            className="group block rounded-3xl overflow-hidden bg-[#f5f5f7]"
                        >
                            <div className="relative aspect-[4/4] overflow-hidden">
                                <Image
                                    src={product.content.image.filename}
                                    fill
                                    alt={product.name}
                                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
                                    priority
                                    unoptimized
                                />
                            </div>
                            <div className="px-6 py-5">
                                <h3 className="text-lg font-medium text-[#1d1d1f]">{product.name}</h3>
                                <p className="mt-1 text-[#86868b]">&euro; {product.content.price}</p>
                            </div>
                        </Link>
                    ),
                )}
            </div>
        </div>
    );
}
