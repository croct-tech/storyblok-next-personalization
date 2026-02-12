'use client';

import Link from 'next/link';
import {type ReactElement, type ReactNode} from 'react';
import {useCart} from '@/components/core/CartProvider';
import {useCartTracking} from '@/components/hooks/useCartTracking';
import {CartItemList} from '@/components/core/CartItemList';
import {OrderSummary} from '@/components/core/OrderSummary';
import {useTrackingOnce} from '@/components/hooks/useTrackingOnce';

export type CartViewProps = {
    callout: ReactNode,
};

export function CartView({callout}: CartViewProps): ReactElement {
    const cart = useCart();
    const {trackView} = useCartTracking();

    useTrackingOnce(() => trackView(cart), cart.loaded);

    if (!cart.loaded) {
        return (
            <main className="container mx-auto px-6 py-12 max-w-4xl">
                <div className="h-9 w-40 bg-surface-alt rounded-lg animate-pulse" />
                <div className="mt-8 grid md:grid-cols-[1fr_300px] gap-10">
                    <div className="space-y-6">
                        {[1, 2].map(
                            i => (
                                <div key={i} className="flex gap-5">
                                    <div className="w-24 h-24 bg-surface-alt rounded-xl animate-pulse shrink-0" />
                                    <div className="flex-1 space-y-3 py-1">
                                        <div className="h-4 w-3/4 bg-surface-alt rounded animate-pulse" />
                                        <div className="h-4 w-1/4 bg-surface-alt rounded animate-pulse" />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>
                    <div className="space-y-4">
                        <div className="h-5 w-32 bg-surface-alt rounded animate-pulse" />
                        <div className="h-4 w-full bg-surface-alt rounded animate-pulse" />
                        <div className="h-4 w-full bg-surface-alt rounded animate-pulse" />
                        <div className="h-10 w-full bg-surface-alt rounded-full animate-pulse mt-4" />
                    </div>
                </div>
            </main>
        );
    }

    if (cart.items.length === 0) {
        return (
            <main className="container mx-auto px-6 py-12 max-w-4xl">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">
                    Your bag
                </h1>
                <EmptyCart />
            </main>
        );
    }

    return (
        <main className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">
                Your bag
            </h1>
            <div className="mt-8 grid md:grid-cols-[1fr_300px] gap-10">
                <div>
                    <CartItemList />

                    <div className="mt-4">
                        {callout}
                    </div>
                </div>

                <div className="space-y-5">
                    <OrderSummary />
                    <Perks />
                    <NeedHelp />
                </div>
            </div>
        </main>
    );
}

function Perks(): ReactElement {
    return (
        <div className="flex items-center justify-center gap-1.5 text-muted text-xs">
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
        <div className="rounded-2xl border border-border/60 px-6 py-5 text-center">
            <p className="text-sm font-medium text-primary">Need help?</p>
            <p className="text-xs text-muted mt-1">
                Chat with us or call <span className="text-primary">1-800-CROCT</span>
            </p>
        </div>
    );
}

function EmptyCart(): ReactElement {
    return (
        <div className="mt-12 text-center">
            <p className="text-muted text-lg">Your bag is empty.</p>
            <Link
                href="/catalog"
                className="mt-6 inline-block rounded-full bg-accent px-8 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
            >
                Continue shopping
            </Link>
        </div>
    );
}
