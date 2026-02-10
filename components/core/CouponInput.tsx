import {type FormEvent, type ReactElement, useState} from 'react';
import type {CouponResponse} from '@/app/api/coupon/route';

export type AppliedCoupon = {
    code: string,
    title: string,
    discount: number,
    maxDiscount?: number,
    freeShipping: boolean,
};

export type CouponInputProps = {
    onApply: (coupon: AppliedCoupon) => void,
    onRemove: () => void,
};

export function CouponInput({onApply, onRemove}: CouponInputProps): ReactElement {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [applied, setApplied] = useState<AppliedCoupon | null>(null);

    async function handleSubmit(event: FormEvent): Promise<void> {
        event.preventDefault();

        if (code.trim() === '' || loading) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/coupon', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({code: code.trim()}),
            });

            const data: CouponResponse = await response.json();

            if (data.valid) {
                const coupon: AppliedCoupon = {
                    code: data.code,
                    title: data.title,
                    discount: data.discount,
                    maxDiscount: data.maxDiscount,
                    freeShipping: data.freeShipping,
                };

                setApplied(coupon);
                setError('');
                onApply(coupon);
            } else {
                setError(data.reason);
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function handleRemove(): void {
        setApplied(null);
        setCode('');
        setError('');
        onRemove();
    }

    if (applied !== null) {
        return (
            <div>
                <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wide text-[#86868b]">{applied.code}</span>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="text-xs text-[#0071e3] hover:underline"
                    >
                        Remove
                    </button>
                </div>
                <p className="text-xs text-[#86868b] mt-0.5">{applied.title}</p>
            </div>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex items-center gap-3">
                <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="Coupon code"
                    className="flex-1 min-w-0 bg-transparent text-sm text-[#1d1d1f] placeholder:text-[#86868b] outline-none"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`text-sm transition-colors flex-shrink-0 ${code.trim() === '' || loading ? 'text-[#86868b] opacity-40' : 'text-[#0071e3] hover:text-[#0077ed]'}`}
                >
                    {loading ? 'Applying…' : 'Apply'}
                </button>
            </form>
            {error !== '' && (
                <p className="mt-2 text-xs text-[#ff3b30]">{error}</p>
            )}
        </div>
    );
}
