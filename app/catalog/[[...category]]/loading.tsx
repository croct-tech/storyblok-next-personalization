import type {ReactElement} from 'react';

export default function CatalogLoading(): ReactElement {
    return (
        <main>
            <div className="pt-10 pb-2 text-center">
                <div className="mx-auto h-12 w-48 rounded-lg bg-surface-alt animate-pulse" />
                <div className="mx-auto mt-3 h-5 w-40 rounded-lg bg-surface-alt animate-pulse" />
            </div>
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {Array.from(
                        {length: 6},
                        (_, i) => (
                            <div key={i} className="rounded-3xl overflow-hidden bg-surface-alt">
                                <div className="aspect-[4/4] animate-pulse bg-skeleton" />
                                <div className="px-6 py-5">
                                    <div className="h-5 w-32 rounded bg-skeleton animate-pulse" />
                                    <div className="mt-2 h-4 w-16 rounded bg-skeleton animate-pulse" />
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>
        </main>
    );
}
