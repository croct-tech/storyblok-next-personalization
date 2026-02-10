'use client';

import type {SbBlokData} from '@storyblok/react/rsc';
import {storyblokEditable, StoryblokServerComponent} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';

export type PageProps = {
    blok: SbBlokData & {
        name: string,
        body: SbBlokData[],
    },
};

export function Page({blok}: PageProps): ReactElement {
    return (
        <main {...storyblokEditable(blok)}>
            <h1 className="sr-only">{blok.name}</h1>
            <div>
                {blok.body.map(
                    nestedBlok => (
                        <StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
                    ),
                )}
            </div>
        </main>
    );
}
