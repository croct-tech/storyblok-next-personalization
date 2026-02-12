import Image from 'next/image';
import type {ReactElement} from 'react';

export function Footer(): ReactElement {
    return (
        <footer className="border-t border-border/60">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-muted">
                    Powered by Storyblok, Croct &amp; Next.js
                </p>
                <Image
                    src="/storyblok-croct-muted.svg"
                    width={68}
                    height={23}
                    alt="Storyblok + Croct"
                />
            </div>
        </footer>
    );
}
