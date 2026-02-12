import type {Metadata} from 'next';
import type {ReactElement} from 'react';
import {ConfirmationView} from '@/components/core/ConfirmationView';

export const metadata: Metadata = {
    title: 'Order confirmed',
};

export default function ConfirmationPage(): ReactElement {
    return <ConfirmationView />;
}
