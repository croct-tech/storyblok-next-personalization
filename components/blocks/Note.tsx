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
            className="order-2 md:order-none md:h-0 bg-[#f5f5f7] md:bg-transparent"
        >
            <div className="md:-translate-y-full pointer-events-none px-8 md:px-16 pb-4 text-xs text-[#86868b]/80 leading-normal w-full md:w-1/2">
                {renderMarkdown(blok.content)}
            </div>
        </div>
    );
}
