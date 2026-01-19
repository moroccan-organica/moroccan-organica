import { Node, mergeAttributes } from '@tiptap/core';

/**
 * Custom TipTap Video Extension for HTML5 videos
 * Used in both editor and preview/rendering
 */
const BASE_VIDEO_STYLE =
  'max-width: 100%; margin: 1em 0; border-radius: 0.5rem; display: block; background: #000;';

export const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      style: {
        default: null,
      },
      width: {
        default: null,
        parseHTML: element => {
          const attr = element.getAttribute('width') || element.style.width;
          return attr ? Number.parseInt(attr, 10) || attr : null;
        },
        renderHTML: attributes => (attributes.width ? { width: attributes.width } : {}),
      },
      height: {
        default: null,
        parseHTML: element => {
          const attr = element.getAttribute('height') || element.style.height;
          return attr ? Number.parseInt(attr, 10) || attr : null;
        },
        renderHTML: attributes => (attributes.height ? { height: attributes.height } : {}),
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const { width, height, style } = HTMLAttributes;
    const styleSegments = [BASE_VIDEO_STYLE.trim()];

    if (width) {
      const widthValue = typeof width === 'number' ? `${width}px` : width;
      styleSegments.push(`width: ${widthValue}`);
    }
    if (height) {
      const heightValue = typeof height === 'number' ? `${height}px` : height;
      styleSegments.push(`height: ${heightValue}`);
    }
    if (style) {
      styleSegments.push(style);
    }

    const mergedAttrs = {
      ...HTMLAttributes,
      style: styleSegments.join('; '),
    };

    return ['video', mergeAttributes(mergedAttrs)];
  },
});

export default Video;
