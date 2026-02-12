import {withCroct} from '@croct/plug-storyblok/next';
import {apiPlugin, storyblokInit} from '@storyblok/react/rsc';
import {AnnouncementBar} from '@/components/blocks/AnnouncementBar';
import {CheckoutCallout} from '@/components/blocks/CheckoutCallout';
import {HeroSection} from '@/components/blocks/HeroSection';
import {Catalog} from '@/components/blocks/Catalog';
import {FeatureStrip} from '@/components/blocks/FeatureStrip';
import {Marquee} from '@/components/blocks/Marquee';
import {Note} from '@/components/blocks/Note';
import {Page} from '@/components/blocks/Page';
import {SplitFeature} from '@/components/blocks/SplitFeature';

export const getStoryblokApi = storyblokInit(withCroct({
    accessToken: process.env.NEXT_PUBLIC_STORYBLOK_CONTENT_API_ACCESS_TOKEN,
    use: [apiPlugin],
    components: {
        'announcement-bar': AnnouncementBar,
        'checkout-callout': CheckoutCallout,
        'hero-section': HeroSection,
        catalog: Catalog,
        'feature-strip': FeatureStrip,
        marquee: Marquee,
        note: Note,
        page: Page,
        'split-feature': SplitFeature,
    },
}));
