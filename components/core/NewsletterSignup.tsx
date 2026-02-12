'use client';

import {type FormEvent, type ReactElement, useState} from 'react';
import {useCroct} from '@croct/plug-next';
import {useCart} from '@/components/core/CartProvider';

type State = 'idle' | 'submitting' | 'success';

export function NewsletterSignup(): ReactElement {
    const [email, setEmail] = useState('');
    const [error, setError] = useState<string | null>(null);
    const croct = useCroct();
    const cart = useCart();
    const [state, setState] = useState<State>('idle');

    function validate(value: string): string | null {
        if (value.trim() === '') {
            return 'Please enter your email address.';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address.';
        }

        return null;
    }

    function handleSubmit(event: FormEvent): void {
        event.preventDefault();

        const validationError = validate(email);

        if (validationError !== null) {
            setError(validationError);

            return;
        }

        if (state === 'submitting') {
            return;
        }

        setError(null);
        setState('submitting');

        setTimeout(
            () => {
                setState('success');

                void croct.track('leadGenerated', {
                    leadId: email,
                    lead: {
                        email: email,
                    },
                    value: cart.subtotal,
                    currency: cart.currency,
                });

                void croct.track('goalCompleted', {
                    goalId: 'newsletter-signup',
                    currency: cart.currency,
                    value: cart.subtotal,
                });
            },
            1000,
        );
    }

    return (
        <section className="bg-surface-alt">
            <div className="container mx-auto px-6 py-24 md:py-32">
                <div className="max-w-2xl mx-auto text-center">
                    {state === 'success'
                        ? (
                            <div className="newsletter-fade-in">
                                <div className="mx-auto mb-6 w-14 h-14 rounded-full bg-success flex items-center justify-center">
                                    <svg className="w-7 h-7 text-white newsletter-check" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary">
                                    You&apos;re on the list.
                                </h2>
                                <p className="mt-4 text-lg md:text-xl text-muted max-w-md mx-auto">
                                    We&apos;ll send the best deals and exclusive offers straight to your inbox.
                                </p>
                                <p className="mt-6 text-sm text-muted/70">
                                    {email}
                                </p>
                            </div>
                        )
                        : (
                            <>
                                <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-primary">
                                    Stay in the loop.
                                </h2>
                                <p className="mt-4 text-lg md:text-xl text-muted max-w-md mx-auto">
                                    Get early access to new arrivals, exclusive offers, and style tips — delivered to you.
                                </p>
                                <form onSubmit={handleSubmit} noValidate className="mt-10 flex flex-col sm:flex-row gap-3 max-w-lg mx-auto sm:items-start">
                                    <div className="flex-1 flex flex-col">
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={event => {
                                                setEmail(event.target.value);
                                                setError(null);
                                            }}
                                            disabled={state === 'submitting'}
                                            className={`w-full rounded-full px-6 py-3.5 text-base bg-white border text-primary placeholder:text-muted/60 outline-none transition-all disabled:opacity-60 ${error !== null ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' : 'border-border/60 focus:border-accent focus:ring-2 focus:ring-accent/20'}`}
                                        />
                                        <p className={`mt-2 text-sm text-left px-3 ${error !== null ? 'text-red-500' : 'text-muted/60'}`}>
                                            {error ?? 'No spam, ever. Unsubscribe anytime.'}
                                        </p>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={state === 'submitting'}
                                        className="rounded-full px-8 py-3.5 text-base font-medium bg-primary text-white hover:bg-primary/85 active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 min-w-[140px]"
                                    >
                                        {state === 'submitting'
                                            ? (
                                                <>
                                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Signing up...
                                                </>
                                            )
                                            : (
                                                'Subscribe'
                                            )}
                                    </button>
                                </form>
                            </>
                        )}
                </div>
            </div>
        </section>
    );
}
