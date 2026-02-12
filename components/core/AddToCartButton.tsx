'use client';

import {useRouter} from 'next/navigation';
import type {ReactElement} from 'react';
import {useCroct} from '@croct/plug-next';
import {useCart} from '@/components/core/CartProvider';

type AddToCartButtonProps = {
    id: string,
    name: string,
    slug: string,
    image: string,
    price: number,
};

export function AddToCartButton(props: AddToCartButtonProps): ReactElement {
    const {id, name, slug, image, price} = props;
    const croct = useCroct();
    const cart = useCart();
    const router = useRouter();

    const handleClick = (): void => {
        cart.addItem({
            id: id,
            name: name,
            slug: slug,
            image: image,
            price: price,
        });

        void croct.track('goalCompleted', {
            goalId: 'cart-addition',
            value: price,
            currency: cart.currency,
        });

        router.push('/cart');
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="w-full max-w-xs rounded-full bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
        >
            Add to bag
        </button>
    );
}
