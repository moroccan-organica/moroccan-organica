'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Heading1,
    Heading2,
    Undo,
    Redo,
    Code,
    Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SimpleTiptapEditorProps {
    content: string;
    onChange: (html: string) => void;
    placeholder?: string;
    dir?: 'ltr' | 'rtl';
}

const MenuButton = ({
    onClick,
    isActive = false,
    disabled = false,
    children,
    title
}: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={cn(
            "p-2 rounded-md transition-colors hover:bg-slate-100 text-slate-600",
            isActive && "bg-slate-200 text-[#606C38]",
            disabled && "opacity-50 cursor-not-allowed"
        )}
    >
        {children}
    </button>
);

export function SimpleTiptapEditor({ content, onChange, placeholder, dir = 'ltr' }: SimpleTiptapEditorProps) {
    const [mode, setMode] = React.useState<'visual' | 'code'>('visual');
    const [codeContent, setCodeContent] = React.useState(content);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setCodeContent(html);
            onChange(html);
        },
        immediatelyRender: false,
    });

    React.useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
            setCodeContent(content);
        }
    }, [content, editor]);

    const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setCodeContent(value);
        onChange(value);
    };

    const toggleMode = (newMode: 'visual' | 'code') => {
        if (newMode === 'visual' && editor) {
            editor.commands.setContent(codeContent);
        }
        setMode(newMode);
    };

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-slate-200 rounded-lg bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#606C38]/20 transition-all">
            <div className="flex flex-wrap items-center gap-1 p-1 border-b border-slate-100 bg-slate-50/50">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    title="Underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    isActive={editor.isActive({ textAlign: 'left' })}
                    title="Align Left"
                >
                    <AlignLeft className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    isActive={editor.isActive({ textAlign: 'center' })}
                    title="Align Center"
                >
                    <AlignCenter className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    isActive={editor.isActive({ textAlign: 'right' })}
                    title="Align Right"
                >
                    <AlignRight className="h-4 w-4" />
                </MenuButton>

                <div className="w-px h-4 bg-slate-200 mx-1" />

                <MenuButton
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        } else if (url === '') {
                            editor.chain().focus().unsetLink().run();
                        }
                    }}
                    isActive={editor.isActive('link')}
                    title="Link"
                >
                    <LinkIcon className="h-4 w-4" />
                </MenuButton>

                <div className="flex-1" />

                <MenuButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo className="h-4 w-4" />
                </MenuButton>
                <MenuButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo className="h-4 w-4" />
                </MenuButton>

                <div className="flex bg-slate-100 rounded-md p-0.5 ml-2">
                    <button
                        type="button"
                        onClick={() => toggleMode('visual')}
                        className={cn(
                            "px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded transition-all flex items-center gap-1",
                            mode === 'visual' ? "bg-white text-[#606C38] shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Eye className="h-3 w-3" />
                        Visual
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleMode('code')}
                        className={cn(
                            "px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded transition-all flex items-center gap-1",
                            mode === 'code' ? "bg-white text-[#606C38] shadow-sm" : "text-slate-500 hover:text-slate-700"
                        )}
                    >
                        <Code className="h-3 w-3" />
                        HTML
                    </button>
                </div>
            </div>

            <div className="relative">
                {mode === 'visual' ? (
                    <div className="prose prose-sm max-w-none p-4 min-h-[150px]" dir={dir}>
                        <EditorContent editor={editor} />
                    </div>
                ) : (
                    <div className="p-0 bg-slate-900 min-h-[150px]">
                        <textarea
                            value={codeContent}
                            onChange={handleCodeChange}
                            spellCheck={false}
                            className="w-full min-h-[150px] p-4 font-mono text-sm bg-transparent text-slate-300 border-none outline-none resize-y"
                            placeholder="Paste your HTML here..."
                        />
                    </div>
                )}
            </div>

            <style jsx global>{`
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror {
          min-height: 150px;
        }
      `}</style>
        </div>
    );
}
