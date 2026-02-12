import type {Metadata} from 'next';
import type {ISbStoryData} from '@storyblok/react';
import type {ReactElement} from 'react';
import {StoryblokServerComponent} from '@storyblok/react/rsc';
import type {Page} from '@/.storyblok/types/289964601464397/storyblok-components';
import {getStoryblokApi} from '@/lib/storyblok';
import {CartView} from '@/components/core/CartView';

export const metadata: Metadata = {
    title: 'Cart',
};

export default async function CartPage(): Promise<ReactElement> {
    const storyblokApi = getStoryblokApi();
    const {data}: {data: {story: ISbStoryData<Page>}} = await storyblokApi.get('cdn/stories/checkout-callout', {
        version: 'draft',
    });

    const callout = data.story.content.body?.[0];

    return (<CartView callout={callout !== undefined ? <StoryblokServerComponent blok={callout} /> : null} />);
}
