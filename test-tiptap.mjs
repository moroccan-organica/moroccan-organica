import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import TiptapLink from '@tiptap/extension-link';

const editor = new Editor({
  extensions: [
    StarterKit,
    TiptapLink.configure({
      openOnClick: true,
      HTMLAttributes: {
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    }),
  ],
  content: '<p>Hello <a href="https://example.com">world</a></p>',
});

console.log("JSON:", JSON.stringify(editor.getJSON(), null, 2));

editor.commands.insertContent('<a href="https://test.com">test link</a>');

console.log("JSON after insert:", JSON.stringify(editor.getJSON(), null, 2));
