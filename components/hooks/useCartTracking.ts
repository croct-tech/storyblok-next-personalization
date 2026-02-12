'use client';

import {useMemo} from 'react';
import {useCroct} from '@croct/plug-next';
import type {ExternalTrackingEventPayload as EventPayload} from '@croct/sdk/trackingEvents';
import type {ProjectedCartState} from '@/components/core/Cart';

type CartTracking = {
    trackView: (cart: ProjectedCartState) => void,
    trackCheckout: (cart: ProjectedCartState) => void,
    trackModification: (cart: ProjectedCartState) => void,
    trackOrder: (orderId: string, cart: ProjectedCartState) => void,
};

export function useCartTracking(): CartTracking {
    const croct = useCroct();

    return useMemo(
        () => ({
            trackView: cart => {
                void croct.track('cartViewed', createCartPayload(cart));
            },
            trackCheckout: cart => {
                void croct.track('checkoutStarted', createCartPayload(cart));
                void croct.track('goalCompleted', {
                    goalId: 'checkout-start',
                    value: cart.subtotal - cart.discount,
                    currency: cart.currency,
                });
            },
            trackModification: cart => {
                void croct.track('cartModified', createCartPayload(cart));
            },
            trackOrder: (orderId: string, cart: ProjectedCartState) => {
                void croct.track('orderPlaced', createOrderPayload(orderId, cart));
                void croct.track('goalCompleted', {
                    goalId: 'purchase-completion',
                    value: cart.subtotal - cart.discount,
                    currency: cart.currency,
                });
            },
        }),
        [croct],
    );
}

function createOrderPayload(orderId: string, cart: ProjectedCartState): EventPayload<'orderPlaced'> {
    return {
        order: {
            orderId: orderId,
            ...createCartPayload(cart).cart,
        },
    };
}

function createCartPayload(cart: ProjectedCartState): EventPayload<'cartModified' | 'cartViewed' | 'checkoutStarted'> {
    return {
        cart: {
            currency: cart.currency,
            items: cart.items.map(
                (item, index) => ({
                    index: index,
                    product: {
                        productId: item.id,
                        name: item.name,
                        displayPrice: item.price,
                        url: `${window.location.origin}/product/${item.slug}`,
                        imageUrl: item.image,
                    },
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                }),
            ),
            total: cart.subtotal - cart.discount,
            ...(cart.discount > 0 && {discount: cart.discount}),
            ...(cart.coupon != null && {coupon: cart.coupon.code}),
        },
    };
}
