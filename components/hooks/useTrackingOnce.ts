import {useEffect, useRef} from 'react';

export function useTrackingOnce(callback: () => void, flag = true, key = ''): void {
    const tracked = useRef<string | null>(null);

    useEffect(
        () => {
            if (tracked.current !== key && flag) {
                tracked.current = key;
                callback();
            }
        },
        [callback, flag, key],
    );
}
