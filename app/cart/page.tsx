'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState, type ReactElement} from 'react';
import {useCart} from '@/components/core/CartContext';
import {CouponInput, type AppliedCoupon} from '@/components/core/CouponInput';
import {PromoBanner} from '@/components/core/PromoBanner';

export default function CartPage(): ReactElement {
    const {loaded} = useCart();

    return (
        <main className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#1d1d1f]">
                Your Bag
            </h1>

            {!loaded ? <CartSkeleton /> : <CartContent />}
        </main>
    );
}

function CartContent(): ReactElement {
    const {items, total, removeItem, updateQuantity} = useCart();
    const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

    const discountAmount = coupon !== null && coupon.discount > 0
        ? Math.min((total * coupon.discount) / 100, coupon.maxDiscount ?? Infinity)
        : 0;

    const shippingCost = 4.99;
    const shippingFree = coupon?.freeShipping === true;
    const shipping = shippingFree ? 0 : shippingCost;
    const finalTotal = total - discountAmount + shipping;

    if (items.length === 0) {
        return <EmptyCart />;
    }

    return (
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
                    {discountAmount > 0 && (
                        <div className="flex items-center justify-between mt-2">
                            <span className="text-sm text-[#86868b]">Discount</span>
                            <span className="text-sm text-[#34c759]">
                                &minus;&euro; {discountAmount.toFixed(2)}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-[#86868b]">Shipping</span>
                        <span className={`text-sm ${shippingFree ? 'text-[#34c759]' : 'text-[#1d1d1f]'}`}>
                            {shippingFree ? 'Free' : `€ ${shippingCost.toFixed(2)}`}
                        </span>
                    </div>
                    <div className="border-t border-[#d2d2d7]/40 mt-4 pt-4">
                        <CouponInput
                            onApply={setCoupon}
                            onRemove={() => setCoupon(null)}
                        />
                    </div>
                    <div className="border-t border-[#d2d2d7]/40 mt-4 pt-4 flex items-center justify-between">
                        <span className="text-base font-medium text-[#1d1d1f]">Total</span>
                        <span className="text-xl font-semibold text-[#1d1d1f]">&euro; {finalTotal.toFixed(2)}</span>
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
    );
}

function Perks(): ReactElement {
    return (
        <div className="flex items-center justify-center gap-1.5 text-[#86868b] text-xs">
            <span>Free shipping</span>
            <span>&middot;</span>
            <span>30-day returns</span>
            <span>&middot;</span>
            <span>Secure checkout</span>
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

function CartSkeleton(): ReactElement {
    return (
        <div className="mt-8 grid md:grid-cols-[1fr_300px] gap-10 animate-pulse">
            <div>
                {[1, 2].map(
                    i => (
                        <div key={i} className="py-6 flex gap-6 border-b border-[#d2d2d7]/40">
                            <div className="w-24 h-24 rounded-xl bg-[#f5f5f7]" />
                            <div className="flex-1 space-y-3">
                                <div className="h-4 w-40 rounded bg-[#f5f5f7]" />
                                <div className="h-3 w-20 rounded bg-[#f5f5f7]" />
                                <div className="h-8 w-24 rounded-lg bg-[#f5f5f7]" />
                            </div>
                        </div>
                    ),
                )}
            </div>
            <div>
                <div className="rounded-2xl border border-[#d2d2d7]/60 px-6 py-6 space-y-4">
                    <div className="h-3 w-full rounded bg-[#f5f5f7]" />
                    <div className="h-3 w-full rounded bg-[#f5f5f7]" />
                    <div className="border-t border-[#d2d2d7]/40 pt-4">
                        <div className="h-5 w-32 rounded bg-[#f5f5f7]" />
                    </div>
                    <div className="h-11 w-full rounded-full bg-[#f5f5f7]" />
                </div>
            </div>
        </div>
    );
}

function EmptyCart(): ReactElement {
    return (
        <div className="mt-12 text-center">
            <p className="text-[#86868b] text-lg">Your bag is empty.</p>
            <Link
                href="/catalog"
                className="mt-6 inline-block rounded-full bg-[#0071e3] px-8 py-3 text-sm font-medium text-white hover:bg-[#0077ed] transition-colors"
            >
                Continue Shopping
            </Link>
        </div>
    );
}
