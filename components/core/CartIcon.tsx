import Link from 'next/link';
import type {ReactElement} from 'react';
import {useCart} from '@/components/core/CartProvider';

export function CartIcon(): ReactElement {
    const cart = useCart();

    return (
        <Link
            href="/cart"
            className="relative p-2 text-primary/60 hover:text-primary transition-opacity"
            aria-label={`Shopping bag${cart.itemCount > 0 ? `, ${cart.itemCount} items` : ''}`}
        >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cart.itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-accent text-white text-[10px] font-medium leading-none">
                    {cart.itemCount}
                </span>
            )}
        </Link>
    );
}
