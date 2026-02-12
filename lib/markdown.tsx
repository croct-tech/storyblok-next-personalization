import Image from 'next/image';
import {render} from '@croct/md-lite';
import type {ReactElement} from 'react';

type ClassOverrides = {
    fragment?: string,
    text?: string,
    bold?: string,
    italic?: string,
    strike?: string,
    code?: string,
    link?: string,
    image?: string,
    paragraph?: string,
};

const defaultClasses = {
    bold: 'font-semibold text-primary',
    code: 'bg-surface-alt px-1.5 py-0.5 rounded text-sm',
    link: 'text-link hover:underline',
    paragraph: 'mt-3 first:mt-0',
};

export function renderMarkdown(text: string, classes?: ClassOverrides): ReactElement {
    const cls = {...defaultClasses, ...classes};

    return render<ReactElement>(text, {
        fragment: node => <span key={node.index} className={cls.fragment}>{node.children}</span>,
        text: node => <span key={node.index} className={cls.text}>{node.content}</span>,
        bold: node => <strong key={node.index} className={cls.bold}>{node.children}</strong>,
        italic: node => <em key={node.index} className={cls.italic}>{node.children}</em>,
        strike: node => <s key={node.index} className={cls.strike}>{node.children}</s>,
        code: node => <code key={node.index} className={cls.code}>{node.content}</code>,
        link: node => <a key={node.index} href={node.href} className={cls.link}>{node.children}</a>,
        image: node => <Image key={node.index} src={node.src} alt={node.alt} width={600} height={400} className={cls.image} />,
        paragraph: node => <p key={node.index} className={cls.paragraph}>{node.children}</p>,
    });
}
