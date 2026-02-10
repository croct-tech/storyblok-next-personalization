'use client';

import {createContext, useCallback, useContext, useMemo, useSyncExternalStore} from 'react';
import type {PropsWithChildren, ReactElement} from 'react';

type CartItem = {
    id: string,
    name: string,
    slug: string,
    image: string,
    price: number,
    quantity: number,
};

type CartContextValue = {
    loaded: boolean,
    items: CartItem[],
    itemCount: number,
    total: number,
    addItem: (item: Omit<CartItem, 'quantity'>) => void,
    removeItem: (id: string) => void,
    updateQuantity: (id: string, quantity: number) => void,
};

const STORAGE_KEY = 'cart';

const CartContext = createContext<CartContextValue | null>(null);

let listeners: Array<() => void> = [];
let snapshot: CartItem[] | null = null;
const serverSnapshot: CartItem[] = [];

function readStorage(): CartItem[] {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        return stored !== null ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

function writeStorage(items: CartItem[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    snapshot = items;

    for (const listener of listeners) {
        listener();
    }
}

function subscribe(listener: () => void): () => void {
    listeners = [...listeners, listener];

    return () => {
        listeners = listeners.filter(l => l !== listener);
    };
}

function getSnapshot(): CartItem[] {
    if (snapshot === null) {
        snapshot = readStorage();
    }

    return snapshot;
}

function getServerSnapshot(): CartItem[] {
    return serverSnapshot;
}

function isLoaded(): boolean {
    return snapshot !== null;
}

function isServerLoaded(): boolean {
    return false;
}

export function CartProvider({children}: PropsWithChildren): ReactElement {
    const loaded = useSyncExternalStore(subscribe, isLoaded, isServerLoaded);
    const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const addItem = useCallback(
        (product: Omit<CartItem, 'quantity'>) => {
            const current = readStorage();
            const existing = current.find(item => item.id === product.id);

            if (existing !== undefined) {
                writeStorage(
                    current.map(
                        item => (
                            item.id === product.id
                                ? {...item, quantity: item.quantity + 1}
                                : item
                        ),
                    ),
                );
            } else {
                writeStorage([...current, {...product, quantity: 1}]);
            }
        },
        [],
    );

    const removeItem = useCallback(
        (id: string) => {
            writeStorage(readStorage().filter(item => item.id !== id));
        },
        [],
    );

    const updateQuantity = useCallback(
        (id: string, quantity: number) => {
            const current = readStorage();

            if (quantity <= 0) {
                writeStorage(current.filter(item => item.id !== id));
            } else {
                writeStorage(
                    current.map(
                        item => (item.id === id ? {...item, quantity: quantity} : item),
                    ),
                );
            }
        },
        [],
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const value = useMemo(
        () => ({
            loaded: loaded,
            items: items,
            itemCount: itemCount,
            total: total,
            addItem: addItem,
            removeItem: removeItem,
            updateQuantity: updateQuantity,
        }),
        [loaded, items, itemCount, total, addItem, removeItem, updateQuantity],
    );

    return (
        <CartContext value={value}>
            {children}
        </CartContext>
    );
}

export function useCart(): CartContextValue {
    const context = useContext(CartContext);

    if (context === null) {
        throw new Error('useCart must be used within a CartProvider');
    }

    return context;
}
