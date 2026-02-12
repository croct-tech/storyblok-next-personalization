'use client';

import {useState, type ReactElement} from 'react';
import {preload} from 'react-dom';
import {ConciergeWidget} from '@/components/core/ConciergeWidget';

export function ConciergeButton(): ReactElement {
    const [open, setOpen] = useState(false);

    preload('/concierge.webp', {as: 'image'});

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed bottom-6 right-6 sm:bottom-6 sm:right-6 bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:scale-105 hover:bg-accent-hover transition-all"
                aria-label="Open personal stylist"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
                </svg>
            </button>
            <ConciergeWidget
                open={open}
                onClose={() => setOpen(false)}
            />
        </>
    );
}
