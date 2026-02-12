'use client';

import type {ReactElement} from 'react';
import Link from 'next/link';
import type {Account} from '@/components/core/Auth';

type SignupSuccessViewProps = {
    account: Account,
};

export function SignupSuccessView(props: SignupSuccessViewProps): ReactElement {
    const {account} = props;

    return (
        <div className="newsletter-fade-in text-center space-y-6">
            <div className="mx-auto w-16 h-16 rounded-full bg-success flex items-center justify-center">
                <svg className="w-8 h-8 text-white newsletter-check" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
            </div>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-primary">
                    Welcome, {account.firstName}
                </h1>
                <p className="mt-2 text-[15px] text-muted">
                    Your account has been created.
                </p>
            </div>
            <Link
                href="/"
                className="inline-block rounded-xl bg-accent px-8 py-3 text-[15px] font-medium text-white hover:bg-accent-hover active:scale-[0.98] transition-all"
            >
                Start shopping
            </Link>
        </div>
    );
}
