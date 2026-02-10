'use client';

import type {PropsWithChildren, ReactNode} from 'react';
import {getStoryblokApi} from '@/lib/storyblok';

export function StoryblokProvider({children}: PropsWithChildren): ReactNode {
    getStoryblokApi();

    return children;
}
