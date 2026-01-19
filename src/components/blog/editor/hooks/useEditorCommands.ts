'use client';

import { useCallback } from 'react';
import type { EditorInstance, SelectedNode, ImageAlign } from '../types/types';

function sanitizeStyle(style: unknown): string {
  return typeof style === 'string' ? style : '';
}

function stripAlignCss(style: string): string {
  return style
    .replace(/display\s*:\s*block\s*;?/gi, '')
    .replace(/margin-left\s*:\s*[^;]+;?/gi, '')
    .replace(/margin-right\s*:\s*[^;]+;?/gi, '')
    .replace(/;{2,}/g, ';')
    .trim();
}

export interface UseEditorCommandsProps {
  editor: EditorInstance;
  selectedImage?: SelectedNode | null;
  selectedVideo?: SelectedNode | null;
}

export function useEditorCommands({ editor, selectedImage, selectedVideo }: UseEditorCommandsProps) {
  const handleCommand = useCallback((command: string, value?: string) => {
    if (!editor) return;
    const chain = editor.chain().focus();

    switch (command) {
      case 'bold':
        chain.toggleBold().run();
        return;
      case 'italic':
        chain.toggleItalic().run();
        return;
      case 'insertUnorderedList':
        chain.toggleBulletList().run();
        return;
      case 'insertOrderedList':
        chain.toggleOrderedList().run();
        return;
      case 'createLink':
        if (!value) return;
        chain.extendMarkRange('link').setLink({ href: value }).run();
        return;
      case 'insertImage':
        if (!value) return;
        chain.setImage({ src: value }).run();
        return;
      case 'formatBlock':
        if (!value) return;
        if (value.toLowerCase() === 'blockquote') {
          const { from, to } = editor.state.selection;
          if (from !== to) {
            const selectedText = editor.state.doc.textBetween(from, to, ' ');
            editor
              .chain()
              .focus()
              .deleteSelection()
              .insertContent({
                type: 'blockquote',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: selectedText }],
                  },
                ],
              })
              .run();
          } else {
            chain.toggleBlockquote().run();
          }
          return;
        }
        if (value === 'P') {
          chain.setParagraph().run();
          return;
        }
        if (value === 'PRE') {
          chain.setCodeBlock().run();
          return;
        }
        if (value === 'H1' || value === 'H2' || value === 'H3' || value === 'H4' || value === 'H5' || value === 'H6') {
          const level = Number(value.replace('H', '')) as 1 | 2 | 3 | 4 | 5 | 6;
          const { from, to } = editor.state.selection;

          if (from !== to) {
            const selectedText = editor.state.doc.textBetween(from, to, ' ');
            editor
              .chain()
              .focus()
              .deleteSelection()
              .insertContent({
                type: 'heading',
                attrs: { level },
                content: [{ type: 'text', text: selectedText }],
              })
              .run();
          } else {
            chain.toggleHeading({ level }).run();
          }
          return;
        }
        return;
      default:
        return;
    }
  }, [editor]);

  const handleImageAlign = useCallback((align: ImageAlign) => {
    const selected = selectedImage || selectedVideo;
    if (!editor || !selected) return;
    const { pos, node } = selected;
    const nodeType = node?.type?.name || (selectedImage ? 'image' : 'video');
    
    const alignStyle =
      align === 'center'
        ? 'display: block; margin-left: auto; margin-right: auto;'
        : align === 'right'
          ? 'display: block; margin-left: auto; margin-right: 0;'
          : 'display: block; margin-left: 0; margin-right: auto;';

    const existingStyle = sanitizeStyle(node?.attrs?.style);
    const baseStyle = stripAlignCss(existingStyle);
    const mergedStyle = `${baseStyle} ${alignStyle}`.trim();

    editor.chain().focus().setNodeSelection(pos).updateAttributes(nodeType, {
      style: mergedStyle,
    }).run();
  }, [editor, selectedImage, selectedVideo]);

  const handleImageDelete = useCallback(() => {
    const selected = selectedImage || selectedVideo;
    if (!editor || !selected) return;
    editor.chain().focus().deleteSelection().run();
  }, [editor, selectedImage, selectedVideo]);

  const handleImageReplace = useCallback(() => {
    // This will be handled by the parent component opening the media dialog
  }, []);

  const handleLink = useCallback(() => {
    // This will be replaced by LinkDialog component
  }, []);

  const handleInsertImage = useCallback(() => {
    // This will be handled by the parent component opening the media dialog
  }, []);

  return {
    handleCommand,
    handleImageAlign,
    handleImageDelete,
    handleImageReplace,
    handleLink,
    handleInsertImage,
  };
}
