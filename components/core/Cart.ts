export type CartItem = {
    readonly id: string,
    readonly name: string,
    readonly slug: string,
    readonly image: string,
    readonly price: number,
    readonly quantity: number,
};

export type Coupon = {
    readonly code: string,
    readonly title: string,
    readonly discount: number,
    readonly maxDiscount?: number,
    readonly freeShipping: boolean,
};

type CartAction =
    | {type: 'add_item', product: Omit<CartItem, 'quantity'>}
    | {type: 'remove_item', id: string}
    | {type: 'update_quantity', id: string, quantity: number}
    | {type: 'apply_coupon', coupon: Coupon}
    | {type: 'remove_coupon'}
    | {type: 'clear'}
    | {type: 'load', state: CartState};

type Dispatcher = (action: CartAction) => void;

export interface CartState {
    readonly loaded: boolean;
    readonly currency: string;
    readonly items: readonly CartItem[];
    readonly coupon: Coupon | null;
}

export interface ProjectedCartState extends CartState {
    readonly subtotal: number;
    readonly discount: number;
    readonly itemCount: number;
}

export interface Cart extends ProjectedCartState {
    addItem(product: Omit<CartItem, 'quantity'>): void;
    removeItem(id: string): void;
    updateQuantity(id: string, quantity: number): void;
    applyCoupon(coupon: Coupon): void;
    removeCoupon(): void;
    clear(): void;
}

export class LocalStorageCart implements Cart {
    private static readonly STORAGE_KEY = 'cart';

    public static readonly EMPTY_STATE: CartState = {
        loaded: false,
        currency: 'EUR',
        items: [],
        coupon: null,
    };

    private readonly state: CartState;

    private readonly dispatch: Dispatcher;

    public constructor(state: CartState, dispatch: Dispatcher) {
        this.state = state;
        this.dispatch = dispatch;
    }

    public get loaded(): boolean {
        return this.state.loaded;
    }

    public get items(): readonly CartItem[] {
        return this.state.items;
    }

    public get coupon(): Coupon | null {
        return this.state.coupon;
    }

    public get currency(): string {
        return this.state.currency;
    }

    public get subtotal(): number {
        return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    }

    public get discount(): number {
        if (this.coupon == null || this.coupon.discount <= 0) {
            return 0;
        }

        return Math.min((this.subtotal * this.coupon.discount) / 100, this.coupon.maxDiscount ?? Infinity);
    }

    public get itemCount(): number {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    public addItem(product: Omit<CartItem, 'quantity'>): void {
        this.dispatch({type: 'add_item', product: product});
    }

    public removeItem(id: string): void {
        this.dispatch({type: 'remove_item', id: id});
    }

    public updateQuantity(id: string, quantity: number): void {
        this.dispatch({type: 'update_quantity', id: id, quantity: quantity});
    }

    public applyCoupon(coupon: Coupon): void {
        this.dispatch({type: 'apply_coupon', coupon: coupon});
    }

    public removeCoupon(): void {
        this.dispatch({type: 'remove_coupon'});
    }

    public clear(): void {
        this.dispatch({type: 'clear'});
    }

    public persist(): boolean {
        const previous = LocalStorageCart.load();

        const changed =
            previous.currency !== this.currency
            || previous.coupon?.code !== this.coupon?.code
            || previous.items.length !== this.items.length
            || previous.items.some(
                (item, index) => item.id !== this.items[index].id
                    || item.quantity !== this.items[index].quantity,
            );

        if (!changed) {
            return false;
        }

        LocalStorageCart.writeState({
            loaded: true,
            currency: this.currency,
            items: this.items,
            coupon: this.coupon,
        });

        return true;
    }

    public static reduce(this: void, state: CartState, action: CartAction): CartState {
        switch (action.type) {
            case 'add_item': {
                const existing = state.items.find(item => item.id === action.product.id);

                return {
                    ...state,
                    items: existing !== undefined
                        ? state.items.map(
                            item => (
                                item.id === action.product.id
                                    ? {...item, quantity: item.quantity + 1}
                                    : item
                            ),
                        )
                        : [...state.items, {...action.product, quantity: 1}],
                };
            }

            case 'remove_item':
                return {...state, items: state.items.filter(item => item.id !== action.id)};

            case 'update_quantity': {
                if (action.quantity <= 0) {
                    return {...state, items: state.items.filter(item => item.id !== action.id)};
                }

                return {
                    ...state,
                    items: state.items.map(
                        item => (item.id === action.id ? {...item, quantity: action.quantity} : item),
                    ),
                };
            }

            case 'apply_coupon':
                return {...state, coupon: action.coupon};

            case 'remove_coupon':
                return {...state, coupon: null};

            case 'clear':
                return {...LocalStorageCart.EMPTY_STATE, loaded: true};

            case 'load':
                return {
                    ...action.state,
                    loaded: true,
                };
        }
    }

    public static load(this: void): CartState {
        try {
            const stored = localStorage.getItem(LocalStorageCart.STORAGE_KEY);

            if (stored === null) {
                return LocalStorageCart.EMPTY_STATE;
            }

            const parsed: Partial<CartState> = JSON.parse(stored);

            return {...LocalStorageCart.EMPTY_STATE, ...parsed};
        } catch {
            return LocalStorageCart.EMPTY_STATE;
        }
    }

    private static writeState(this: void, {loaded: _, ...state}: CartState): void {
        try {
            localStorage.setItem(LocalStorageCart.STORAGE_KEY, JSON.stringify(state));
        } catch {
            // Ignore write errors (e.g. quota exceeded)
        }
    }
}
