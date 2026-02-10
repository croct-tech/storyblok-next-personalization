import {NextResponse} from 'next/server';
import {fetchContent} from '@croct/plug-next/server';

export type CouponResponse = {
    valid: true,
    code: string,
    title: string,
    discount: number,
    maxDiscount?: number,
    freeShipping: boolean,
} | {
    valid: false,
    reason: string,
};

export async function POST(request: Request): Promise<NextResponse<CouponResponse>> {
    const body = await request.json();
    const {code} = body as {code: string};

    if (typeof code !== 'string' || code.trim() === '') {
        return NextResponse.json({valid: false, reason: 'Please enter a coupon code.'});
    }

    const {content: {coupons}} = await fetchContent('coupons');

    const normalizedCode = code.trim().toUpperCase();
    const coupon = coupons.find(candidate => candidate.code.toUpperCase() === normalizedCode);

    if (coupon === undefined) {
        return NextResponse.json({valid: false, reason: 'This coupon code is not valid.'});
    }

    if (!coupon.eligible) {
        return NextResponse.json({valid: false, reason: coupon.rule});
    }

    return NextResponse.json({
        valid: true,
        code: coupon.code,
        title: coupon.title,
        discount: coupon.discount ?? 0,
        maxDiscount: coupon.maxDiscount,
        freeShipping: coupon.freeShipping,
    });
}
