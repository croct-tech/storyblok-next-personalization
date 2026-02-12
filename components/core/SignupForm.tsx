'use client';

import {type FormEvent, type ReactElement, useEffect, useRef, useState} from 'react';
import {useEvaluation} from '@croct/plug-next';
import type {AccountFormData} from '@/components/core/Auth';

type LocationInfo = {
    cityName: string | null,
    regionName: string | null,
    countryName: string | null,
    postalCode: string | null,
    phoneCode: string | null,
};

type SignupFormProps = {
    onSubmit: (data: AccountFormData) => Promise<void>,
    onBack: (() => void) | null,
};

const groupClass = 'rounded-xl border border-border/60 overflow-hidden bg-surface-alt divide-y divide-border/60';

const inputClass = 'w-full bg-transparent px-4 py-3 text-[15px] text-primary placeholder:text-muted/60 outline-none focus:bg-white transition-colors';

const requiredInputClass = 'w-full bg-white px-4 py-3 text-[15px] text-primary placeholder:text-muted/60 outline-none transition-colors';

export function SignupForm(props: SignupFormProps): ReactElement {
    const {onSubmit, onBack} = props;

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('1990-01-01');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [postalCode, setPostalCode] = useState('');

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    const touched = useRef<Set<string>>(new Set());

    const location = useEvaluation<LocationInfo | null>(
        'location',
        {
            initial: null,
            fallback: {
                cityName: 'San Francisco',
                regionName: 'CA',
                countryName: 'United States',
                postalCode: '94105',
                phoneCode: '+1',
            },
        },
    );

    useEffect(
        () => {
            if (location === null) {
                return;
            }

            if (!touched.current.has('phone') && location.phoneCode !== null) {
                setPhone(`${location.phoneCode} 800 555 0199`);
            }

            if (!touched.current.has('address')) {
                setAddress('742 Evergreen Terrace');
            }

            if (!touched.current.has('city') && location.cityName !== null) {
                setCity(location.cityName);
            }

            if (!touched.current.has('state') && location.regionName !== null) {
                setState(location.regionName);
            }

            if (!touched.current.has('country') && location.countryName !== null) {
                setCountry(location.countryName);
            }

            if (!touched.current.has('postalCode') && location.postalCode !== null) {
                setPostalCode(location.postalCode);
            }
        },
        [location],
    );

    function markTouched(field: string): void {
        touched.current.add(field);
    }

    function clearError(field: string): void {
        setErrors(prev => {
            const next = {...prev};

            delete next[field];

            return next;
        });
    }

    function validate(): Record<string, string> {
        const result: Record<string, string> = {};

        if (firstName.trim() === '') {
            result.personal = 'Please enter your first name.';
        } else if (lastName.trim() === '') {
            result.personal = 'Please enter your last name.';
        } else if (email.trim() === '') {
            result.personal = 'Please enter your email address.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            result.personal = 'Please enter a valid email address.';
        }

        return result;
    }

    async function handleSubmit(event: FormEvent): Promise<void> {
        event.preventDefault();

        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);

            return;
        }

        if (submitting) {
            return;
        }

        setSubmitting(true);

        try {
            await onSubmit({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                phone: phone.trim(),
                address: address.trim(),
                city: city.trim(),
                state: state.trim(),
                country: country.trim(),
                postalCode: postalCode.trim(),
                birthday: birthday,
            });
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-surface-alt flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-primary">Create account</h1>
                <p className="mt-2 text-[15px] text-muted">
                    Enter your details to get started.
                </p>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Personal info
                    </label>
                    <div className={groupClass}>
                        <div className="flex divide-x divide-border/60">
                            <input
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                disabled={submitting}
                                onChange={event => {
                                    setFirstName(event.target.value);
                                    clearError('personal');
                                }}
                                className={`flex-1 ${requiredInputClass} disabled:opacity-60`}
                            />
                            <input
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                disabled={submitting}
                                onChange={event => {
                                    setLastName(event.target.value);
                                    clearError('personal');
                                }}
                                className={`flex-1 ${requiredInputClass} disabled:opacity-60`}
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            disabled={submitting}
                            onChange={event => {
                                setEmail(event.target.value);
                                clearError('personal');
                            }}
                            className={`${requiredInputClass} disabled:opacity-60`}
                        />
                        <input
                            type="date"
                            placeholder="Birthday"
                            value={birthday}
                            disabled={submitting}
                            onChange={event => setBirthday(event.target.value)}
                            className={`${inputClass} disabled:opacity-60`}
                        />
                        <input
                            type="tel"
                            placeholder="Phone"
                            value={phone}
                            disabled={submitting}
                            onChange={event => {
                                markTouched('phone');
                                setPhone(event.target.value);
                            }}
                            className={`${inputClass} disabled:opacity-60`}
                        />
                    </div>
                    {errors.personal !== undefined && (
                        <p className="text-[13px] text-red-500 px-1">{errors.personal}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-muted">
                        Address
                    </label>
                    <div className={groupClass}>
                        <input
                            type="text"
                            placeholder="Address"
                            value={address}
                            disabled={submitting}
                            onChange={event => {
                                markTouched('address');
                                setAddress(event.target.value);
                            }}
                            className={`${inputClass} disabled:opacity-60`}
                        />
                        <div className="flex divide-x divide-border/60">
                            <input
                                type="text"
                                placeholder="City"
                                value={city}
                                disabled={submitting}
                                onChange={event => {
                                    markTouched('city');
                                    setCity(event.target.value);
                                }}
                                className={`flex-1 ${inputClass} disabled:opacity-60`}
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={state}
                                disabled={submitting}
                                onChange={event => {
                                    markTouched('state');
                                    setState(event.target.value);
                                }}
                                className={`flex-1 ${inputClass} disabled:opacity-60`}
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Country"
                            value={country}
                            disabled={submitting}
                            onChange={event => {
                                markTouched('country');
                                setCountry(event.target.value);
                            }}
                            className={`${inputClass} disabled:opacity-60`}
                        />
                        <input
                            type="text"
                            placeholder="Postal code"
                            value={postalCode}
                            disabled={submitting}
                            onChange={event => {
                                markTouched('postalCode');
                                setPostalCode(event.target.value);
                            }}
                            className={`${inputClass} disabled:opacity-60`}
                        />
                    </div>
                    {errors.address !== undefined && (
                        <p className="text-[13px] text-red-500 px-1">{errors.address}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-accent px-4 py-3 text-[15px] font-medium text-white hover:bg-accent-hover active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {submitting
                        ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Creating account...
                            </>
                        )
                        : 'Continue'}
                </button>
            </form>
            {onBack !== null && (
                <button
                    type="button"
                    onClick={onBack}
                    disabled={submitting}
                    className="w-full text-center text-[13px] text-accent hover:text-accent-hover transition-colors disabled:opacity-60"
                >
                    Sign in to an existing account
                </button>
            )}
        </div>
    );
}
