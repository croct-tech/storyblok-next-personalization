import Image from 'next/image';
import type {SbBlokData} from '@storyblok/react/rsc';
import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';
import type {CheckoutCallout as CheckoutCalloutBlok} from '@/.storyblok/types/289964601464397/storyblok-components';

export type CheckoutCalloutProps = {
    blok: SbBlokData & CheckoutCalloutBlok,
};

export function CheckoutCallout({blok}: CheckoutCalloutProps): ReactElement {
    return (
        <div {...storyblokEditable(blok)} className="rounded-2xl bg-surface-alt px-6 py-5 flex items-center gap-4">
            {blok.icon.filename !== '' && (
                <Image
                    src={blok.icon.filename!}
                    alt={blok.icon.alt ?? ''}
                    width={28}
                    height={28}
                    unoptimized
                    className="shrink-0"
                />
            )}
            <div>
                <p className="text-sm font-medium text-primary">{blok.title}</p>
                <p className="text-xs text-muted mt-0.5">{blok.text}</p>
            </div>
        </div>
    );
}
