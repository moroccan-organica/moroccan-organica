'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { JSONContent } from '@tiptap/core';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';
import TiptapPlaceholder from '@tiptap/extension-placeholder';
import TiptapYoutube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import { cn } from '@/lib/utils';
import { Video as CustomVideo } from '@/lib/tiptap-video';
import { BlogImage } from '@/lib/tiptap-image';
import {
  EditorHeader,
  EditorToolbar,
  LinkDialog,
  EditorCanvas,
  useBlogMediaManager,
  useSelectionToolbar,
  useNodeResize,
  useEditorCommands,
  useAutosaveStatus,
  type BlockType,
  type EditorMode,
} from './editor';
import './editor/styles/RichTextEditor.css';

export interface RichTextEditorProps {
  initialContent?: JSONContent | string;
  onChange: (html: string, json: unknown) => void;
  placeholder?: string;
  postId?: string;
  onMediaDialogChange?: (isOpen: boolean) => void;
  dir?: 'ltr' | 'rtl';
}

export function RichTextEditor({ initialContent = '', onChange, placeholder, postId, onMediaDialogChange, dir = 'ltr' }: RichTextEditorProps) {
  const [mode, setMode] = useState<EditorMode>('visual');
  const [blockType, setBlockType] = useState<BlockType>('p');
  const [wordCount, setWordCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [codeHtml, setCodeHtml] = useState('');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TiptapLink.configure({ openOnClick: false }),
      BlogImage.configure({
        HTMLAttributes: {
          class: 'editor-image',
        },
      }),
      TiptapYoutube.configure({ controls: false, nocookie: true }),
      CustomVideo,
      TiptapPlaceholder.configure({
        placeholder: placeholder || 'Start writing your article...',
      }),
    ],
    content: initialContent || '',
    onCreate: ({ editor }) => {
      const html = editor.getHTML();
      setCodeHtml(html);
      onChange(html, editor.getJSON());
      updateWordCount(editor.getText());
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getJSON());
      updateWordCount(editor.getText());
      scheduleAutoSave();
    },
    onSelectionUpdate: () => {
      handleSelectionUpdate();
    },
  });

  const updateWordCount = useCallback((text: string) => {
    const clean = text.replace(/\s+/g, ' ').trim();
    const count = clean ? clean.split(' ').filter(Boolean).length : 0;
    setWordCount(count);
  }, []);

  const {
    mediaDialogOpen,
    openMediaDialog,
  } = useBlogMediaManager({
    postId,
    onMediaSelect: (media) => {
      if (!editor) return;
      if (media.media_type === 'image') {
        editor.chain().focus().setImage({ src: media.url, alt: media.alt_text || '' }).run();
      }
    },
  });

  useEffect(() => {
    onMediaDialogChange?.(mediaDialogOpen);
  }, [mediaDialogOpen, onMediaDialogChange]);

  const {
    selectionToolbar,
    selectedImage,
    selectedVideo,
    handleSelectionUpdate,
    getResizeHandlesPosition: getSelectionResizePosition,
  } = useSelectionToolbar({ editor, editorContainerRef });

  const resizePosition = getSelectionResizePosition();
  const {
    isResizing,
    imageSize,
    handleResizeStart,
    getResizeHandlesPosition: getNodeResizePosition,
  } = useNodeResize({
    editor,
    selectedImage,
    selectedVideo,
    containerRect: resizePosition?.containerRect || new DOMRect(),
    selectedRect: resizePosition?.selectedRect || new DOMRect(),
  });

  const {
    handleCommand,
    handleImageAlign,
    handleImageDelete,
    handleImageReplace,
  } = useEditorCommands({ editor, selectedImage, selectedVideo });

  useEffect(() => {
    if (!editor) return;
    const text = editor.getText();
    const html = editor.getHTML();
    const id = window.setTimeout(() => {
      updateWordCount(text);
      setCodeHtml(html);
    }, 0);
    return () => clearTimeout(id);
  }, [editor, updateWordCount]);

  const {
    lastSaved,
    scheduleAutoSave,
    formatLastSaved,
  } = useAutosaveStatus({ delay: 600 });

  const handleBlockChange = (newBlock: BlockType) => {
    setBlockType(newBlock);
    handleCommand('formatBlock', newBlock.toUpperCase());
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const html = e.target.value;
    onChange(html, null);
    setCodeHtml(html);
    const text = html.replace(/<[^>]*>/g, ' ');
    updateWordCount(text);
    scheduleAutoSave();
  };

  const handleLink = useCallback(() => {
    setLinkDialogOpen(true);
  }, []);

  const handleLinkInsert = useCallback((url: string, text?: string) => {
    if (!editor) return;
    const chain = editor.chain().focus();
    const { from, to } = editor.state.selection;
    if (from !== to && !text) {
      chain.extendMarkRange('link').setLink({ href: url }).run();
    } else {
      const linkText = text || url;
      chain.insertContent(`<a href="${url}">${linkText}</a>`).run();
    }
  }, [editor]);

  return (
    <div className={cn(
      'rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col',
      isFullscreen && 'fixed inset-4 z-50 rounded-lg'
    )}>
      <EditorHeader
        onInsertImage={openMediaDialog}
        mode={mode}
        onModeChange={setMode}
        codeHtml={codeHtml}
        editor={editor}
      />

      <EditorToolbar
        blockType={blockType}
        onBlockChange={handleBlockChange}
        onCommand={handleCommand}
        onLink={handleLink}
        onFullscreenToggle={() => setIsFullscreen(!isFullscreen)}
        isFullscreen={isFullscreen}
        editor={editor}
      />

      <div className="flex-1 relative bg-white" ref={editorContainerRef} dir={dir}>
        {mode === 'visual' ? (
          <EditorCanvas
            editor={editor}
            isFullscreen={isFullscreen}
            editorContainerRef={editorContainerRef}
            selectionToolbar={selectionToolbar}
            selectedImage={selectedImage}
            selectedVideo={selectedVideo}
            isResizing={isResizing}
            imageSize={imageSize}
            resizePosition={resizePosition}
            handleCommand={handleCommand}
            handleLink={handleLink}
            handleImageAlign={handleImageAlign}
            handleImageReplace={handleImageReplace}
            handleImageDelete={handleImageDelete}
            handleResizeStart={handleResizeStart}
            getNodeResizePosition={getNodeResizePosition}
          />
        ) : (
          <div className="p-4 bg-slate-50 min-h-[400px]">
            <textarea
              value={codeHtml}
              onChange={handleCodeChange}
              className="w-full h-full min-h-[400px] p-4 font-mono text-sm bg-transparent border-none outline-none resize-none"
              placeholder="Paste your HTML code here..."
              spellCheck={false}
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
        <span>Word count: {wordCount}</span>
        {lastSaved && (
          <span>{formatLastSaved()}</span>
        )}
      </div>

      <LinkDialog
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
        onInsert={handleLinkInsert}
      />
    </div>
  );
}

export default RichTextEditor;
