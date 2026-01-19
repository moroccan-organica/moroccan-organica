import { Editor } from '@tiptap/core';

export type EditorInstance = Editor | null;

export interface SelectedNode {
  node: any;
  pos: number;
}

export interface EditorState {
  selectionToolbar: { top: number; left: number } | null;
  selectedImage: SelectedNode | null;
  selectedVideo: SelectedNode | null;
  isResizing: boolean;
  imageSize: { width: number; height: number } | null;
}

export interface MediaToolbarPosition {
  top: number;
  left: number;
}

export interface ResizeHandlesPosition {
  containerRect: DOMRect;
  selectedRect: DOMRect;
}

export type BlockType = 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'pre';
export type EditorMode = 'visual' | 'code';
export type ImageAlign = 'left' | 'center' | 'right';
