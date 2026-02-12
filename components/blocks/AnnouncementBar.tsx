import Link from 'next/link';
import type {SbBlokData} from '@storyblok/react/rsc';
import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';
import {useCroct} from '@croct/plug-next';
import type {AnnouncementBar as AnnouncementBarBlok} from '@/.storyblok/types/289964601464397/storyblok-components';
import {renderMarkdown} from '@/lib/markdown';

export type AnnouncementBarProps = {
    blok: SbBlokData & AnnouncementBarBlok,
};

export function AnnouncementBar({blok}: AnnouncementBarProps): ReactElement {
    const croct = useCroct();
    const cta = blok.cta?.[0];

    return (
        <div {...storyblokEditable(blok)} className="bg-primary text-white text-sm text-center py-2.5 px-6">
            <p>
                {renderMarkdown(blok.text, {code: 'bg-white/15 rounded px-1.5 py-0.5 font-semibold tracking-wide'})}{' '}
                {cta != null && (
                    <Link
                        onClick={() => void croct.track('goalCompleted', {goalId: 'announcement-bar-click'})}
                        href={cta?.link.cached_url}
                        className="underline underline-offset-2 hover:text-white/80 transition-colors"
                    >
                        {cta.label}
                    </Link>
                )}
            </p>
        </div>
    );
}
