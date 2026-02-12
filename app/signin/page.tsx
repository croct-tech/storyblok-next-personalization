import type {Metadata} from 'next';
import {Suspense, type ReactElement} from 'react';
import {SignInView} from '@/components/core/SignInView';

export const metadata: Metadata = {
    title: 'Sign in',
};

export default function SignInPage(): ReactElement {
    return (
        <Suspense>
            <SignInView />
        </Suspense>
    );
}
