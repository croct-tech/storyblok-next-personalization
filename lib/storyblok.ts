import {apiPlugin, storyblokInit} from '@storyblok/react/rsc';
import {CallToAction} from '@/components/blocks/CallToAction';
import {Catalog} from '@/components/blocks/Catalog';
import {FeatureStrip} from '@/components/blocks/FeatureStrip';
import {Marquee} from '@/components/blocks/Marquee';
import {Note} from '@/components/blocks/Note';
import {Page} from '@/components/blocks/Page';
import {SplitFeature} from '@/components/blocks/SplitFeature';

export const getStoryblokApi = storyblokInit({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
    use: [apiPlugin],
    components: {
        'call-to-action': CallToAction,
        catalog: Catalog,
        'feature-strip': FeatureStrip,
        marquee: Marquee,
        note: Note,
        page: Page,
        'split-feature': SplitFeature,
    },
});
