'use client';

import Link from 'next/link';
import type {ReactElement} from 'react';
import {useCart} from '@/components/core/CartProvider';
import {CouponInput} from '@/components/core/CouponInput';

export function OrderSummary(): ReactElement {
    const cart = useCart();
    const shippingCost = 4.99;
    const shippingFree = cart.coupon?.freeShipping === true;
    const shipping = shippingFree ? 0 : shippingCost;
    const finalTotal = cart.subtotal - cart.discount + shipping;

    return (
        <div className="rounded-2xl border border-border/60 px-6 py-6">
            <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Subtotal</span>
                <span className="text-sm text-primary">&euro; {cart.subtotal.toFixed(2)}</span>
            </div>
            {cart.discount > 0 && (
                <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted">Discount</span>
                    <span className="text-sm text-success">
                        &minus;&euro; {cart.discount.toFixed(2)}
                    </span>
                </div>
            )}
            <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-muted">Shipping</span>
                <span className={`text-sm ${shippingFree ? 'text-success' : 'text-primary'}`}>
                    {shippingFree ? 'Free' : `€ ${shippingCost.toFixed(2)}`}
                </span>
            </div>
            <div className="border-t border-border/40 mt-4 pt-4">
                <CouponInput
                    onApply={coupon => cart.applyCoupon(coupon)}
                    onRemove={() => cart.removeCoupon()}
                />
            </div>
            <div className="border-t border-border/40 mt-4 pt-4 flex items-center justify-between">
                <span className="text-base font-medium text-primary">Total</span>
                <span className="text-xl font-semibold text-primary">&euro; {finalTotal.toFixed(2)}</span>
            </div>
            <Link
                href="/checkout"
                className="mt-5 block w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-white text-center hover:bg-accent-hover transition-colors"
            >
                Checkout
            </Link>
            <Link
                href="/catalog"
                className="mt-3 flex items-center justify-center text-sm text-link hover:underline"
            >
                Continue shopping
            </Link>
        </div>
    );
}
