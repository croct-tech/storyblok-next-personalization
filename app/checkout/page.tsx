import type {Metadata} from 'next';
import type {ReactElement} from 'react';
import {CheckoutView} from '@/components/core/CheckoutView';

export const metadata: Metadata = {
    title: 'Checkout',
};

export default function CheckoutPage(): ReactElement {
    return <CheckoutView />;
}
