'use client';

import {useRouter} from 'next/navigation';
import {useTransition} from 'react';
import type {ReactElement} from 'react';
import {LOCALES} from '@/lib/locale';
import type {Locale} from '@/lib/locale';

type LocaleSelectorProps = {
    current: Locale,
};

export function LocaleSelector({current}: LocaleSelectorProps): ReactElement {
    const router = useRouter();
    const [pending, startTransition] = useTransition();

    function handleChange(event: React.ChangeEvent<HTMLSelectElement>): void {
        const locale = event.target.value;

        startTransition(async () => {
            await fetch('/api/locale', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({locale}),
            });

            router.refresh();
        });
    }

    return (
        <select
            value={current}
            onChange={handleChange}
            disabled={pending}
            aria-label="Select language"
            className="appearance-none bg-transparent text-sm text-primary/60 hover:text-primary transition-opacity cursor-pointer px-2 py-2 focus:outline-none disabled:opacity-50"
        >
            {LOCALES.map(locale => (
                <option key={locale.code} value={locale.code}>
                    {locale.label}
                </option>
            ))}
        </select>
    );
}
