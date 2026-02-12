'use client';

import {createContext, useContext, useEffect, useMemo, useReducer} from 'react';
import type {PropsWithChildren, ReactElement} from 'react';
import type {Auth} from '@/components/core/Auth';
import {LocalStorageAuth} from '@/components/core/Auth';

const AuthContext = createContext<Auth | null>(null);

export type AuthProviderProps = PropsWithChildren<{
    sessionEmail?: string,
}>;

export function AuthProvider({children, sessionEmail}: AuthProviderProps): ReactElement {
    const [authState, dispatch] = useReducer(LocalStorageAuth.reduce, LocalStorageAuth.EMPTY_STATE);
    const auth = useMemo(() => new LocalStorageAuth(authState, dispatch), [authState, dispatch]);

    useEffect(
        () => {
            dispatch({
                type: 'load',
                state: LocalStorageAuth.load(sessionEmail),
            });
        },
        [sessionEmail],
    );

    useEffect(
        () => {
            if (auth.loaded) {
                auth.persist();
            }
        },
        [auth],
    );

    return (
        <AuthContext value={auth}>
            {children}
        </AuthContext>
    );
}

export function useAuth(): Auth {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
