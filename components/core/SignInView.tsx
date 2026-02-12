'use client';

import {type ReactElement, useEffect, useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useCroct} from '@croct/plug-next';
import {useAuth} from '@/components/core/AuthProvider';
import type {AccountFormData} from '@/components/core/Auth';
import {formatAccountDisplayName, formatAccountInitials, formatUserId} from '@/lib/account';
import {AccountCard} from '@/components/core/AccountCard';
import {SignupForm} from '@/components/core/SignupForm';
import {SignupSuccessView} from '@/components/core/SignupSuccessView';

type View = 'picker' | 'create' | 'success';

export function SignInView(): ReactElement {
    const auth = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const returnTo = searchParams.get('returnTo') ?? '/';
    const croct = useCroct();

    const pathname = usePathname();
    const [view, setView] = useState<View>('picker');
    const [loggingIn, setLoggingIn] = useState<string | null>(null);

    useEffect(
        () => {
            setView('picker');
        },

        [pathname, searchParams],
    );

    async function handleLogout(): Promise<void> {
        void croct.anonymize();
        await auth.logout();
    }

    async function handleLogin(email: string): Promise<void> {
        setLoggingIn(email);

        try {
            await auth.login(email);

            router.push(returnTo);
        } finally {
            setLoggingIn(null);
        }
    }

    async function handleCreateAccount(data: AccountFormData): Promise<void> {
        void croct.track('goalCompleted', {
            goalId: 'account-creation',
        });

        void croct.track('userSignedUp', {
            userId: await formatUserId(data.email),
            profile: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                birthDate: data.birthday,
                address: {
                    country: data.country,
                    region: data.state,
                    city: data.city,
                    postalCode: data.postalCode,
                    street: data.address,
                },
            },
        });

        await auth.createAccount(data);

        if (returnTo !== '/') {
            router.push(returnTo);

            return;
        }

        setView('success');
    }

    if (!auth.loaded) {
        return <></>;
    }

    if (view === 'success' && auth.currentAccount !== null) {
        return (
            <main className="container mx-auto px-6 py-16 max-w-sm">
                <SignupSuccessView account={auth.currentAccount} />
            </main>
        );
    }

    if (auth.isLoggedIn && view === 'picker') {
        const account = auth.currentAccount!;

        return (
            <main className="container mx-auto px-6 py-16 max-w-sm">
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-xl font-semibold">
                            {formatAccountInitials(account)}
                        </div>
                        <h1 className="text-2xl font-semibold tracking-tight text-primary">{formatAccountDisplayName(account)}</h1>
                        <p className="mt-1 text-[15px] text-muted">{account.email}</p>
                    </div>
                    <div className="space-y-2">
                        <button
                            type="button"
                            onClick={() => handleLogout()}
                            className="w-full rounded-xl bg-surface-alt px-4 py-3 text-[15px] font-medium text-primary hover:bg-surface-hover transition-colors"
                        >
                            Sign out
                        </button>
                        {auth.accounts.length > 1 && (
                            <button
                                type="button"
                                onClick={() => handleLogout()}
                                className="w-full text-center text-[13px] text-accent hover:text-accent-hover transition-colors py-1"
                            >
                                Switch account
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => auth.removeAccount(account.id)}
                            className="w-full text-center text-[13px] text-muted hover:text-red-500 transition-colors py-1"
                        >
                            Remove account
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    if (view === 'create' || auth.accounts.length === 0) {
        return (
            <main className="container mx-auto px-6 py-16 max-w-sm">
                <SignupForm
                    onSubmit={handleCreateAccount}
                    onBack={auth.accounts.length > 0 ? () => setView('picker') : null}
                />
            </main>
        );
    }

    return (
        <main className="container mx-auto px-6 py-16 max-w-sm">
            <div className="space-y-6">
                <div className="text-center">
                    <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center">
                        <svg className="w-8 h-8 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight text-primary">Sign in</h1>
                    <p className="mt-2 text-[15px] text-muted">
                        Select an account to continue.
                    </p>
                </div>
                <div className="space-y-2">
                    {auth.accounts.map(
                        account => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                onClick={() => void handleLogin(account.email)}
                                onRemove={() => auth.removeAccount(account.id)}
                                loading={loggingIn === account.email}
                            />
                        ),
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setView('create')}
                    disabled={loggingIn !== null}
                    className="w-full text-center text-[13px] text-accent hover:text-accent-hover transition-colors disabled:opacity-60"
                >
                    Create new account
                </button>
            </div>
        </main>
    );
}
