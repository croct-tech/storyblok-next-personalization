import type {SbBlokData} from '@storyblok/react/rsc';
import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';
import {renderMarkdown} from '@/lib/markdown';

type NoteProps = {
    blok: SbBlokData & {
        content: string,
    },
};

export function Note({blok}: NoteProps): ReactElement {
    return (
        <div
            {...storyblokEditable(blok)}
            key={blok._uid}
            className="order-2 lg:order-none lg:h-0 bg-surface-alt lg:bg-transparent"
        >
            <div className="lg:-translate-y-full pointer-events-none px-8 lg:px-16 pb-4 text-sm text-muted/80 leading-normal w-full lg:w-1/2">
                {renderMarkdown(blok.content)}
            </div>
        </div>
    );
}
