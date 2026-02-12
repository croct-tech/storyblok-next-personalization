import type {Account} from '@/components/core/Auth';

export function formatAccountDisplayName(account: Account): string {
    return `${account.firstName} ${account.lastName}`;
}

export function formatAccountInitials(account: Account): string {
    return `${account.firstName.charAt(0)}${account.lastName.charAt(0)}`.toUpperCase();
}

export async function formatUserId(email: string): Promise<string> {
    const data = new TextEncoder().encode(email.toLowerCase());
    const hash = await crypto.subtle.digest('SHA-256', data);
    const bytes = new Uint8Array(hash);

    bytes[6] = (bytes[6] & 0x0f) | 0x50;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes.slice(0, 16))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}
