import Link from 'next/link';
import type {ReactElement} from 'react';

export function TopBar(): ReactElement {
    return (
        <div className="bg-[#1d1d1f] text-white text-xs text-center py-2.5 px-6">
            <p>
                Free shipping on all orders over &euro;50.{' '}
                <Link href="/catalog" className="underline underline-offset-2 hover:text-white/80 transition-colors">
                    Shop now
                </Link>
            </p>
        </div>
    );
}
