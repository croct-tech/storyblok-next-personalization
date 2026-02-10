'use client';

import {useRouter} from 'next/navigation';
import type {ReactElement} from 'react';
import {useCart} from '@/components/core/CartContext';

type AddToCartButtonProps = {
    id: string,
    name: string,
    slug: string,
    image: string,
    price: number,
};

export function AddToCartButton(props: AddToCartButtonProps): ReactElement {
    const {id, name, slug, image, price} = props;
    const {addItem} = useCart();
    const router = useRouter();

    const handleClick = (): void => {
        addItem({id: id, name: name, slug: slug, image: image, price: price});
        router.push('/cart');
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-full rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white hover:bg-[#0077ed] transition-colors"
        >
            Add to Bag
        </button>
    );
}
