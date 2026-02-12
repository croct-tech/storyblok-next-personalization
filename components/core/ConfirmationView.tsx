'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, useState, type ReactElement} from 'react';
import {useCart} from '@/components/core/CartProvider';
import {useCartTracking} from '@/components/hooks/useCartTracking';
import type {Cart, CartItem, Coupon} from '@/components/core/Cart';
import {useTrackingOnce} from '@/components/hooks/useTrackingOnce';

export type Order = {
    id: string,
    items: readonly CartItem[],
    total: number,
    discount: number,
    coupon: Coupon | null,
};

export function ConfirmationView(): ReactElement {
    const cart = useCart();
    const router = useRouter();
    const {trackOrder} = useCartTracking();
    const order = useOrderSnapshot(cart);

    useTrackingOnce(
        () => {
            if (order !== null) {
                trackOrder(order.id, cart);
            }
        },
        order !== null,
    );

    useEffect(
        () => {
            if (cart.loaded) {
                if (order === null) {
                    router.replace('/cart');

                    return;
                }

                if (cart.itemCount > 0) {
                    cart.clear();
                }
            }
        },
        [cart, order, router],
    );

    if (order === null) {
        return <></>;
    }

    const shippingCost = 4.99;
    const shippingFree = order.coupon?.freeShipping === true;
    const shipping = shippingFree ? 0 : shippingCost;
    const finalTotal = order.total - order.discount + shipping;

    return (
        <main className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">
                Thank you
            </h1>
            <div className="mt-12 max-w-lg mx-auto text-center">
                <div className="flex justify-center mb-6">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-success">
                        <circle
                            cx="32"
                            cy="32"
                            r="26"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeDasharray="166"
                            strokeDashoffset="166"
                            strokeLinecap="round"
                            style={{animation: 'checkmarkCircleDraw 0.6s ease-out 0.1s forwards'}}
                        />
                        <path
                            d="M21 33l7 7 15-15"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeDasharray="36"
                            strokeDashoffset="36"
                            style={{animation: 'checkmarkCheckDraw 0.4s ease-out 0.6s forwards'}}
                        />
                    </svg>
                </div>

                <h2
                    className="text-2xl font-semibold text-primary confirmation-fade-in"
                    style={{animationDelay: '0.4s'}}
                >
                    Order confirmed
                </h2>

                <p
                    className="text-sm text-muted mt-2 confirmation-fade-in"
                    style={{animationDelay: '0.6s'}}
                >
                    Order #{order.id}
                </p>

                <p
                    className="text-sm text-muted mt-1 confirmation-fade-in"
                    style={{animationDelay: '0.7s'}}
                >
                    Thank you for your purchase.
                </p>

                <div
                    className="mt-8 rounded-2xl border border-border/60 px-6 py-5 text-left confirmation-fade-in"
                    style={{animationDelay: '0.9s'}}
                >
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">Order
                        Details</h3>
                    <div className="space-y-2">
                        {order.items.map(
                            item => (
                                <div key={item.id} className="flex items-center justify-between text-sm">
                                    <span className="text-primary truncate mr-4">
                                        {item.name} <span className="text-muted">&times; {item.quantity}</span>
                                    </span>
                                    <span className="text-primary shrink-0">
                                        &euro; {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ),
                        )}
                    </div>
                    <div className="border-t border-border/40 mt-3 pt-3 space-y-1">
                        {order.discount > 0 && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted">Discount</span>
                                <span className="text-success">&minus;&euro; {order.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted">Shipping</span>
                            <span className={shippingFree ? 'text-success' : 'text-primary'}>
                                {shippingFree ? 'Free' : `€ ${shippingCost.toFixed(2)}`}
                            </span>
                        </div>
                        <div
                            className="flex items-center justify-between text-base font-medium pt-2 border-t border-border/40">
                            <span className="text-primary">Total</span>
                            <span className="text-primary font-semibold">&euro; {finalTotal.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-8 confirmation-fade-in"
                    style={{animationDelay: '1.1s'}}
                >
                    <Link
                        href="/catalog"
                        className="inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        </main>
    );
}

function useOrderSnapshot(cart: Cart): Order | null {
    const [snapshot, setSnapshot] = useState<Order | null>(null);

    if (snapshot === null && cart.loaded && cart.items.length > 0) {
        setSnapshot({
            id: generateId(),
            items: cart.items,
            total: cart.subtotal,
            discount: cart.discount,
            coupon: cart.coupon,
        });
    }

    return snapshot;
}

function generateId(): string {
    return `CROCT-${Date.now()
        .toString(36)
        .toUpperCase()}-${Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase()}`;
}
