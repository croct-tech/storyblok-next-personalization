export const SESSION_COOKIE = process.env.NEXT_PUBLIC_SESSION_COOKIE ?? 'session_email';

export type Account = {
    readonly id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
    readonly phone: string,
    readonly address: string,
    readonly city: string,
    readonly state: string,
    readonly country: string,
    readonly postalCode: string,
    readonly birthday: string,
    readonly createdAt: string,
};

export type AccountFormData = Omit<Account, 'id' | 'createdAt'>;

export type AuthState = {
    readonly loaded: boolean,
    readonly accounts: readonly Account[],
    readonly currentAccountId: string | null,
};

type AuthAction =
    | {type: 'load', state: AuthState}
    | {type: 'create_account', account: Account}
    | {type: 'login', accountId: string}
    | {type: 'logout'}
    | {type: 'remove_account', accountId: string};

type Dispatcher = (action: AuthAction) => void;

export interface Auth {
    readonly loaded: boolean;
    readonly accounts: readonly Account[];
    readonly currentAccount: Account | null;
    readonly isLoggedIn: boolean;
    createAccount(data: AccountFormData): Promise<void>;
    login(email: string): Promise<void>;
    logout(): Promise<void>;
    removeAccount(accountId: string): void;
}

export class LocalStorageAuth implements Auth {
    private static readonly ACCOUNTS_KEY = 'accounts';

    public static readonly EMPTY_STATE: AuthState = {
        loaded: false,
        accounts: [],
        currentAccountId: null,
    };

    private readonly state: AuthState;

    private readonly dispatch: Dispatcher;

    public constructor(state: AuthState, dispatch: Dispatcher) {
        this.state = state;
        this.dispatch = dispatch;
    }

    public get loaded(): boolean {
        return this.state.loaded;
    }

    public get accounts(): readonly Account[] {
        return this.state.accounts;
    }

    public get currentAccount(): Account | null {
        if (this.state.currentAccountId === null) {
            return null;
        }

        return this.accounts.find(a => a.id === this.state.currentAccountId) ?? null;
    }

    public get isLoggedIn(): boolean {
        return this.currentAccount !== null;
    }

    public async createAccount(data: AccountFormData): Promise<void> {
        const account: Account = {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };

        this.dispatch({type: 'create_account', account: account});

        await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: data.email}),
        });
    }

    public async login(email: string): Promise<void> {
        const account = this.state
            .accounts
            .find(a => a.email === email);

        if (account === undefined) {
            return;
        }

        this.dispatch({type: 'login', accountId: account.id});

        await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email: email}),
        });
    }

    public async logout(): Promise<void> {
        this.dispatch({type: 'logout'});

        await fetch('/api/auth/logout', {method: 'POST'});
    }

    public removeAccount(accountId: string): void {
        this.dispatch({type: 'remove_account', accountId: accountId});
    }

    public persist(): void {
        try {
            localStorage.setItem(
                LocalStorageAuth.ACCOUNTS_KEY,
                JSON.stringify(this.state.accounts),
            );
        } catch {
            // Ignore write errors
        }
    }

    public static reduce(this: void, state: AuthState, action: AuthAction): AuthState {
        switch (action.type) {
            case 'load':
                return {
                    ...action.state,
                    loaded: true,
                };

            case 'create_account':
                return {
                    ...state,
                    accounts: [...state.accounts, action.account],
                    currentAccountId: action.account.id,
                };

            case 'login':
                return {
                    ...state,
                    currentAccountId: action.accountId,
                };

            case 'logout':
                return {
                    ...state,
                    currentAccountId: null,
                };

            case 'remove_account':
                return {
                    ...state,
                    accounts: state.accounts.filter(a => a.id !== action.accountId),
                    currentAccountId: state.currentAccountId === action.accountId
                        ? null
                        : state.currentAccountId,
                };
        }
    }

    public static load(this: void, sessionEmail?: string): AuthState {
        try {
            const storedAccounts = localStorage.getItem(LocalStorageAuth.ACCOUNTS_KEY);
            const accounts: Account[] = storedAccounts !== null ? JSON.parse(storedAccounts) : [];

            const account = sessionEmail !== undefined
                ? accounts.find(a => a.email === sessionEmail)
                : undefined;

            return {
                loaded: true,
                accounts: accounts,
                currentAccountId: account?.id ?? null,
            };
        } catch {
            return LocalStorageAuth.EMPTY_STATE;
        }
    }
}
