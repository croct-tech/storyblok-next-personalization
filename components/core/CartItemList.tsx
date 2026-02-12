'use client';

import Image from 'next/image';
import Link from 'next/link';
import type {ReactElement} from 'react';
import {useCart} from '@/components/core/CartProvider';

export function CartItemList(): ReactElement {
    const cart = useCart();

    return (
        <ul className="divide-y divide-border/40">
            {cart.items.map(
                item => (
                    <li key={item.id} className="py-6 flex gap-6">
                        <Link
                            href={`/product/${item.slug}`}
                            className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-surface-alt"
                        >
                            <Image
                                src={item.image}
                                fill
                                alt={item.name}
                                className="object-cover"
                                unoptimized
                            />
                        </Link>
                        <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div>
                                <Link
                                    href={`/product/${item.slug}`}
                                    className="text-base font-medium text-primary hover:text-accent transition-colors"
                                >
                                    {item.name}
                                </Link>
                                <p className="mt-1 text-sm text-muted">
                                    &euro; {item.price}
                                </p>
                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex items-center border border-border rounded-lg">
                                        <button
                                            type="button"
                                            onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                                            className="px-3 py-1 text-sm text-primary/60 hover:text-primary transition-colors"
                                            aria-label={`Decrease quantity of ${item.name}`}
                                        >
                                            &minus;
                                        </button>
                                        <span className="px-3 py-1 text-sm text-primary min-w-[2ch] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                                            className="px-3 py-1 text-sm text-primary/60 hover:text-primary transition-colors"
                                            aria-label={`Increase quantity of ${item.name}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => cart.removeItem(item.id)}
                                        className="text-xs text-accent hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <p className="text-base font-medium text-primary sm:text-right">
                                &euro; {(item.price * item.quantity).toFixed(2)}
                            </p>
                        </div>
                    </li>
                ),
            )}
        </ul>
    );
}
