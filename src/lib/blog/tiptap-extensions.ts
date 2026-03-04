import Link from '@tiptap/extension-link';
import { mergeAttributes } from '@tiptap/core';

/**
 * Custom Link extension that forces target="_blank" and rel="noopener noreferrer nofollow"
 * for all links, ensuring they are correctly parsed from HTML and preserved in JSON.
 */
export const CustomLink = Link.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            href: {
                default: null,
            },
            rel: {
                default: 'noopener noreferrer nofollow',
            },
            target: {
                default: '_blank',
            },
        };
    },
});
