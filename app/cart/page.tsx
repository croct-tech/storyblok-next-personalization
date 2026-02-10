'use client';

import Image from 'next/image';
import Link from 'next/link';
import type {ReactElement} from 'react';
import {useCart} from '@/components/core/CartContext';
import {PromoBanner} from '@/components/core/PromoBanner';

function Perks(): ReactElement {
    const perks = [
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
            ),
            label: 'Free shipping',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
            ),
            label: '30-day returns',
        },
        {
            icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
            ),
            label: 'Secure checkout',
        },
    ];

    return (
        <div className="flex flex-col gap-3 py-2 text-[#86868b]">
            {perks.map(
                perk => (
                    <div key={perk.label} className="flex items-center gap-3">
                        <span className="flex-shrink-0">{perk.icon}</span>
                        <span className="text-xs">{perk.label}</span>
                    </div>
                ),
            )}
        </div>
    );
}

function NeedHelp(): ReactElement {
    return (
        <div className="rounded-2xl border border-[#d2d2d7]/60 px-6 py-5 text-center">
            <p className="text-sm font-medium text-[#1d1d1f]">Need help?</p>
            <p className="text-xs text-[#86868b] mt-1">
                Chat with us or call <span className="text-[#1d1d1f]">1-800-CROCT</span>
            </p>
        </div>
    );
}

export default function CartPage(): ReactElement {
    const {items, total, removeItem, updateQuantity} = useCart();

    return (
        <main className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
                Your Bag
            </h1>

            {items.length === 0
                ? (
                    <div className="mt-12 text-center">
                        <p className="text-[#86868b] text-lg">Your bag is empty.</p>
                        <Link
                            href="/catalog"
                            className="mt-6 inline-block rounded-full bg-[#0071e3] px-8 py-3 text-sm font-medium text-white hover:bg-[#0077ed] transition-colors"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                )
                : (
                    <>
                        <div className="mt-8 grid md:grid-cols-[1fr_300px] gap-10">
                            {/* Cart items */}
                            <div>
                                <ul className="divide-y divide-[#d2d2d7]/40">
                                    {items.map(
                                        item => (
                                            <li key={item.id} className="py-6 flex gap-6">
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-[#f5f5f7]"
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
                                                            className="text-base font-medium text-[#1d1d1f] hover:text-[#0071e3] transition-colors"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <p className="mt-1 text-sm text-[#86868b]">
                                                            &euro; {item.price}
                                                        </p>
                                                        <div className="mt-3 flex items-center gap-3">
                                                            <div className="flex items-center border border-[#d2d2d7] rounded-lg">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="px-3 py-1 text-sm text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors"
                                                                    aria-label={`Decrease quantity of ${item.name}`}
                                                                >
                                                                    &minus;
                                                                </button>
                                                                <span className="px-3 py-1 text-sm text-[#1d1d1f] min-w-[2ch] text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="px-3 py-1 text-sm text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-colors"
                                                                    aria-label={`Increase quantity of ${item.name}`}
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeItem(item.id)}
                                                                className="text-xs text-[#0071e3] hover:underline"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-base font-medium text-[#1d1d1f] sm:text-right">
                                                        &euro; {(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </li>
                                        ),
                                    )}
                                </ul>

                                <div className="mt-4">
                                    <PromoBanner />
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-5">
                                <div className="rounded-2xl border border-[#d2d2d7]/60 px-6 py-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-[#86868b]">Subtotal</span>
                                        <span className="text-sm text-[#1d1d1f]">&euro; {total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-sm text-[#86868b]">Shipping</span>
                                        <span className="text-sm text-[#1d1d1f]">Free</span>
                                    </div>
                                    <div className="border-t border-[#d2d2d7]/40 mt-4 pt-4 flex items-center justify-between">
                                        <span className="text-base font-medium text-[#1d1d1f]">Total</span>
                                        <span className="text-xl font-semibold text-[#1d1d1f]">&euro; {total.toFixed(2)}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="mt-5 w-full rounded-full bg-[#0071e3] px-6 py-3 text-sm font-medium text-white hover:bg-[#0077ed] transition-colors"
                                    >
                                        Checkout
                                    </button>
                                    <Link
                                        href="/catalog"
                                        className="mt-3 flex items-center justify-center text-sm text-[#06c] hover:underline"
                                    >
                                        Continue Shopping
                                    </Link>
                                </div>

                                <Perks />
                                <NeedHelp />
                            </div>
                        </div>
                    </>
                )}
        </main>
    );
}
