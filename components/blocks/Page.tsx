'use client';

import type {SbBlokData} from '@storyblok/react/rsc';
import {storyblokEditable, StoryblokServerComponent} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';
import type {Page as PageBlok} from '@/.storyblok/types/289964601464397/storyblok-components';

export type PageProps = {
    blok: SbBlokData & PageBlok,
};

export function Page({blok}: PageProps): ReactElement {
    return (
        <main {...storyblokEditable(blok)}>
            <h1 className="sr-only">{String(blok.name)}</h1>
            <div className="flex flex-col">
                {blok.body?.map(
                    nestedBlok => (
                        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
                    ),
                )}
            </div>
        </main>
    );
}
