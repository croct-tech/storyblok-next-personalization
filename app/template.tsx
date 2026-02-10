import type {PropsWithChildren, ReactElement} from 'react';

export default function Template({children}: PropsWithChildren): ReactElement {
    return <div className="page-transition">{children}</div>;
}
