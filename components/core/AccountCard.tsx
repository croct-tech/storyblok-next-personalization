'use client';

import type {ReactElement} from 'react';
import type {Account} from '@/components/core/Auth';
import {formatAccountDisplayName, formatAccountInitials} from '@/lib/account';

type AccountCardProps = {
    account: Account,
    onClick: () => void,
    onRemove: () => void,
    loading?: boolean,
};

export function AccountCard(props: AccountCardProps): ReactElement {
    const {account, onClick, onRemove, loading = false} = props;
    const displayName = formatAccountDisplayName(account);

    return (
        <div className="group flex items-center rounded-2xl border border-border/60 bg-white hover:border-accent/40 hover:shadow-sm transition-all">
            <button
                type="button"
                onClick={onClick}
                disabled={loading}
                className="flex-1 flex items-center gap-4 px-5 py-4 text-left min-w-0 disabled:opacity-60"
            >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-white text-sm font-semibold shrink-0">
                    {loading
                        ? (
                            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                        )
                        : formatAccountInitials(account)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-primary truncate">{displayName}</div>
                    <div className="text-[13px] text-muted truncate">{account.email}</div>
                </div>
            </button>
            <button
                type="button"
                onClick={onRemove}
                disabled={loading}
                className="pr-4 pl-2 py-4 text-muted/40 hover:text-red-500 transition-colors shrink-0 self-stretch flex items-center disabled:opacity-40"
                aria-label={`Remove ${displayName}`}
            >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
