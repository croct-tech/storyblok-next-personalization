import Image from 'next/image';
import {render} from '@croct/md-lite';
import type {ReactElement} from 'react';

export function renderMarkdown(text: string): ReactElement {
    return render<ReactElement>(text, {
        fragment: node => <span key={node.index}>{node.children}</span>,
        text: node => <span key={node.index}>{node.content}</span>,
        bold: node => <strong key={node.index} className="font-semibold text-[#1d1d1f]">{node.children}</strong>,
        italic: node => <em key={node.index}>{node.children}</em>,
        strike: node => <s key={node.index}>{node.children}</s>,
        code: node => <code key={node.index} className="bg-[#f5f5f7] px-1.5 py-0.5 rounded text-sm">{node.content}</code>,
        link: node => <a key={node.index} href={node.href} className="text-[#06c] hover:underline">{node.children}</a>,
        image: node => <Image key={node.index} src={node.src} alt={node.alt} width={600} height={400} />,
        paragraph: node => <p key={node.index} className="mt-3 first:mt-0">{node.children}</p>,
    });
}
