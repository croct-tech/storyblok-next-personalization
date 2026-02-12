import Link from 'next/link';
import {storyblokEditable} from '@storyblok/react/rsc';
import type {ReactElement} from 'react';
import {useCroct} from '@croct/plug-next';

export type AnnouncementBarProps = {
    blok: {
        text: string,
        cta: Array<{
            label: string,
            link: {
                story?: {
                    url: string,
                },
            },
        }>,
    },
};

export function AnnouncementBar({blok}: AnnouncementBarProps): ReactElement {
    const croct = useCroct();
    const cta = blok.cta[0];

    return (
        <div {...storyblokEditable(blok)} className="bg-primary text-white text-sm text-center py-2.5 px-6">
            <p>
                {blok.text}{' '}
                {cta != null && (
                    <Link
                        onClick={() => void croct.track('goalCompleted', {goalId: 'announcement-bar-click'})}
                        href={cta.link.story?.url ?? '/'}
                        className="underline underline-offset-2 hover:text-white/80 transition-colors"
                    >
                        {cta.label}
                    </Link>
                )}
            </p>
        </div>
    );
}
