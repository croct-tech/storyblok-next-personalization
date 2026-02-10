import Image from 'next/image';
import type {ReactElement} from 'react';

export function Footer(): ReactElement {
    return (
        <footer className="border-t border-[#d2d2d7]/60">
            <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                <p className="text-xs text-[#86868b]">
                    Powered by Storyblok, Croct &amp; Next.js
                </p>
                <Image
                    src="/storyblok-croct-muted.svg"
                    width={90}
                    height={30}
                    alt="Storyblok + Croct"
                />
            </div>
        </footer>
    );
}
