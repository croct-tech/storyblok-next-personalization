'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useState} from 'react';
import type {ReactElement} from 'react';
import {CartIcon} from '@/components/core/CartIcon';

const links = [
    {href: '/', label: 'Home'},
    {href: '/catalog', label: 'Catalog'},
    {href: '/catalog/sportswear', label: 'Sportswear'},
    {href: '/catalog/elegant', label: 'Elegant Clothing'},
];

export function Navigation(): ReactElement {
    const [open, setOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-[rgba(251,251,253,0.8)] backdrop-blur-xl border-b border-[#d2d2d7]/60">
            <nav role="navigation">
                <div className="container mx-auto px-6 h-14 flex items-center">
                    <div className="mr-6">
                        <Link href="/" className="block">
                            <Image
                                src="/logo.svg"
                                width={34}
                                height={34}
                                alt="Logo"
                            />
                        </Link>
                    </div>
                    <div className="flex items-center ml-auto md:hidden">
                        <CartIcon />
                        <button
                            className="flex items-center p-2 text-[#1d1d1f]/60 hover:text-[#1d1d1f] transition-opacity"
                            type="button"
                            onClick={() => setOpen(prev => !prev)}
                            aria-expanded={open}
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                {open
                                    ? <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                                    : <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                                }
                            </svg>
                        </button>
                    </div>
                    <div className="hidden md:flex md:flex-grow md:items-center">
                        <ul className="flex flex-row items-center ml-auto">
                            {links.map(
                                link => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="block px-3 py-2 text-sm text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-opacity"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ),
                            )}
                        </ul>
                        <CartIcon />
                    </div>
                </div>
                {open && (
                    <div className="md:hidden border-t border-[#d2d2d7]/40 bg-[rgba(251,251,253,0.95)] backdrop-blur-xl">
                        <ul className="container mx-auto px-6 py-2">
                            {links.map(
                                link => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="block py-2.5 text-sm text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-opacity"
                                            onClick={() => setOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    );
}
