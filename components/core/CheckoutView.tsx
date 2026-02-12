'use client';

import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useEffect, type ReactElement, type ReactNode} from 'react';
import {useCart} from '@/components/core/CartProvider';
import {useAuth} from '@/components/core/AuthProvider';
import {formatAccountDisplayName} from '@/lib/account';
import {useCartTracking} from '@/components/hooks/useCartTracking';
import {useTrackingOnce} from '@/components/hooks/useTrackingOnce';

function FormSection({title, children}: {title: string, children: ReactNode}): ReactElement {
    return (
        <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">{title}</h3>
            <div className="rounded-xl border border-border/60 bg-white px-4 py-3 space-y-2">
                {children}
            </div>
        </div>
    );
}

function ReadOnlyField({label, value}: {label: string, value: string}): ReactElement {
    return (
        <div className="flex items-center justify-between py-1">
            <span className="text-sm text-muted">{label}</span>
            <span className="text-sm text-primary">{value}</span>
        </div>
    );
}

function CheckoutAuthPrompt(): ReactElement {
    return (
        <div className="flex flex-col items-center justify-center text-center py-8 space-y-4">
            <svg className="w-12 h-12 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
            <div>
                <h3 className="text-lg font-semibold text-primary">Sign in to check out</h3>
                <p className="mt-1 text-sm text-muted">
                    Create an account or sign in to complete your purchase.
                </p>
            </div>
            <Link
                href="/signin?returnTo=/checkout"
                className="rounded-full bg-accent px-8 py-2.5 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
            >
                Continue
            </Link>
        </div>
    );
}

export function CheckoutView(): ReactElement {
    const cart = useCart();
    const auth = useAuth();
    const router = useRouter();
    const {trackCheckout} = useCartTracking();

    useTrackingOnce(() => trackCheckout(cart), cart.itemCount > 0 && cart.loaded);

    useEffect(
        () => {
            if (cart.items.length === 0) {
                router.replace('/cart');
            }
        },
        [cart.items.length, router],
    );

    const shippingCost = 4.99;
    const shippingFree = cart.coupon?.freeShipping === true;
    const shipping = shippingFree ? 0 : shippingCost;
    const finalTotal = cart.subtotal - cart.discount + shipping;

    const account = auth.currentAccount;
    const cityLine = account !== null
        ? [account.city, account.state, account.postalCode].filter(Boolean).join(', ')
        : '';

    const handleConfirm = (): void => {
        router.push('/confirmation');
    };

    if (cart.items.length === 0) {
        return <></>;
    }

    return (
        <main className="container mx-auto px-6 py-12 max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary">
                Checkout
            </h1>
            <div className="checkout-enter mt-8 grid md:grid-cols-[1fr_300px] gap-10">
                <div className="space-y-6">
                    {auth.isLoggedIn && account !== null
                        ? (
                            <>
                                <FormSection title="Contact">
                                    <ReadOnlyField label="Email" value={account.email} />
                                    <ReadOnlyField label="Phone" value={account.phone} />
                                </FormSection>

                                <FormSection title="Shipping">
                                    <ReadOnlyField label="Name" value={formatAccountDisplayName(account)} />
                                    <ReadOnlyField label="Address" value={account.address} />
                                    <ReadOnlyField label="City" value={cityLine} />
                                    <ReadOnlyField label="Country" value={account.country} />
                                </FormSection>

                                <FormSection title="Payment">
                                    <ReadOnlyField label="Card" value="**** **** **** 4242" />
                                    <ReadOnlyField label="Expires" value="12/28" />
                                </FormSection>
                            </>
                        )
                        : <CheckoutAuthPrompt />}
                </div>

                <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Summary</h3>
                    <div className="rounded-2xl border border-border/60 px-6 py-5">
                        <div className="space-y-2">
                            {cart.items.map(
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
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted">Subtotal</span>
                                <span className="text-primary">&euro; {cart.subtotal.toFixed(2)}</span>
                            </div>
                            {cart.discount > 0 && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted">Discount</span>
                                    <span className="text-success">&minus;&euro; {cart.discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted">Shipping</span>
                                <span className={shippingFree ? 'text-success' : 'text-primary'}>
                                    {shippingFree ? 'Free' : `€ ${shippingCost.toFixed(2)}`}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-base font-medium mt-3 pt-3 border-t border-border/40">
                                <span className="text-primary">Total</span>
                                <span className="text-primary font-semibold">&euro; {finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {auth.isLoggedIn
                        ? (
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white hover:bg-accent-hover transition-colors"
                            >
                                Confirm order
                            </button>
                        )
                        : null}
                </div>
            </div>
        </main>
    );
}
