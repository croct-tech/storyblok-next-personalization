'use client';

import {createContext, useContext, useEffect, useMemo, useReducer} from 'react';
import type {PropsWithChildren, ReactElement} from 'react';
import type {Cart} from '@/components/core/Cart';
import {LocalStorageCart} from '@/components/core/Cart';
import {useCartTracking} from '@/components/hooks/useCartTracking';

const CartContext = createContext<Cart | null>(null);

export type CartProviderProps = PropsWithChildren;

export function CartProvider({children}: CartProviderProps): ReactElement {
    const {trackModification} = useCartTracking();
    const [cartState, dispatch] = useReducer(LocalStorageCart.reduce, LocalStorageCart.EMPTY_STATE);
    const cart = useMemo(() => new LocalStorageCart(cartState, dispatch), [cartState, dispatch]);

    useEffect(
        () => {
            dispatch({
                type: 'load',
                state: LocalStorageCart.load(),
            });
        },
        [],
    );

    useEffect(
        () => {
            if (cart.loaded && cart.persist()) {
                trackModification(cart);
            }
        },
        [cart, trackModification],
    );

    return (
        <CartContext value={cart}>
            {children}
        </CartContext>
    );
}

export function useCart(): Cart {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}
