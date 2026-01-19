import TiptapImage from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

function parseSize(value: string | null | undefined): number | null {
  if (!value) return null;
  const trimmed = value.trim();
  const numeric = Number.parseInt(trimmed.replace(/px$/i, '').trim(), 10);
  return Number.isFinite(numeric) ? numeric : null;
}

function toCssSize(value: number | string | null | undefined): string | null {
  if (value == null) return null;
  if (typeof value === 'number') return `${value}px`;
  const trimmed = value.trim();
  if (trimmed.length === 0) return null;
  if (/^\d+$/.test(trimmed)) return `${trimmed}px`;
  return trimmed;
}

const BASE_IMAGE_STYLE = 'max-width: 100%; height: auto;';

export const BlogImage = TiptapImage.extend({
  addAttributes() {
    const parentAttrs = this.parent?.() || {};

    return {
      ...parentAttrs,
      title: {
        default: null,
        parseHTML: (element) => element.getAttribute('title'),
        renderHTML: (attributes) => {
          if (!attributes.title) return {};
          return { title: attributes.title };
        },
      },
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute('style'),
        renderHTML: (attributes) => {
          if (!attributes.style) return {};
          return { style: attributes.style };
        },
      },
      width: {
        default: null,
        parseHTML: (element) => parseSize(element.getAttribute('width') || element.style.width),
        renderHTML: (attributes) => (attributes.width ? { width: attributes.width } : {}),
      },
      height: {
        default: null,
        parseHTML: (element) => parseSize(element.getAttribute('height') || element.style.height),
        renderHTML: (attributes) => (attributes.height ? { height: attributes.height } : {}),
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height, style } = HTMLAttributes as {
      width?: number | string | null;
      height?: number | string | null;
      style?: string | null;
    };

    const styleSegments = [BASE_IMAGE_STYLE.trim()];

    const widthValue = toCssSize(width);
    if (widthValue) {
      styleSegments.push(`width: ${widthValue}`);
    }

    const heightValue = toCssSize(height);
    if (heightValue) {
      styleSegments.push(`height: ${heightValue}`);
    }

    if (style) {
      styleSegments.push(style);
    }

    const mergedAttrs = mergeAttributes(this.options.HTMLAttributes, {
      ...HTMLAttributes,
      style: styleSegments.join('; '),
    });

    return ['img', mergedAttrs];
  },
});

export default BlogImage;
