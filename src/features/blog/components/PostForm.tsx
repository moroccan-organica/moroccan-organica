'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { BlogPost, BlogCategory } from '@/types/blog';
import { RichTextEditor } from './RichTextEditor';
import { generateSlug } from '@/lib/slug';
import { PostFormHeader } from './post-form/PostFormHeader';
import { PostFormSidebar } from './post-form/PostFormSidebar';
import { PostPreviewDialog } from './post-form/PostPreviewDialog';
import { JSONContent } from '@tiptap/core';
import { uploadBlogImage } from '@/features/admin/actions/media.actions';

interface PostFormProps {
  post?: BlogPost;
  categories: BlogCategory[];
  onSave: (data: Partial<BlogPost>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PostForm({ post, categories, onSave, onCancel, isLoading }: PostFormProps) {
  const isEditing = !!post;

  // Form State - English
  const [title, setTitle] = useState(post?.title || '');
  const [contentJson, setContentJson] = useState<JSONContent>(post?.content || { type: 'doc', content: [] });
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');

  // Form State - Arabic
  const [titleAr, setTitleAr] = useState(post?.title_ar || '');
  const [contentArJson, setContentArJson] = useState<JSONContent>(post?.content_ar || { type: 'doc', content: [] });
  const [excerptAr, setExcerptAr] = useState(post?.excerpt_ar || '');
  const [editorInitialContentAr, setEditorInitialContentAr] = useState<JSONContent | string>(post?.content_ar ?? '');
  const [categoryId, setCategoryId] = useState(post?.category_id || '');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState(post?.featured_image_url || '');
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<string | null>(post?.featured_image_url || null);
  const [metaTitle, setMetaTitle] = useState(post?.title || '');
  const [metaDescription, setMetaDescription] = useState(post?.excerpt || '');
  const [editorInitialContent, setEditorInitialContent] = useState<JSONContent | string>(post?.content ?? '');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const editInitTimeoutRef = useRef<number | null>(null);
  const draftRestoreTimeoutRef = useRef<number | null>(null);

  const slugPreview = useMemo(() => {
    return title.trim() ? generateSlug(title) : '';
  }, [title]);

  const selectedCategoryName = useMemo(() => {
    if (!categoryId) return '';
    return categories.find((c) => c.id === categoryId)?.name || '';
  }, [categories, categoryId]);

  // LocalStorage key for draft
  const DRAFT_KEY = useMemo(() => {
    return isEditing ? `blog:postform:draft:${post?.id ?? ''}` : 'blog:postform:draft:new';
  }, [isEditing, post?.id]);

  // Update editor content when post data arrives (for edit mode)
  useEffect(() => {
    if (editInitTimeoutRef.current) {
      clearTimeout(editInitTimeoutRef.current);
      editInitTimeoutRef.current = null;
    }

    if (isEditing && post?.content) {
      const content = post.content;
      editInitTimeoutRef.current = window.setTimeout(() => {
        setEditorInitialContent((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(content)) return content;
          return prev;
        });
        setContentJson((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(content)) return content;
          return prev;
        });
      }, 0);
    }

    return () => {
      if (editInitTimeoutRef.current) {
        clearTimeout(editInitTimeoutRef.current);
        editInitTimeoutRef.current = null;
      }
    };
  }, [isEditing, post?.content]);

  // Restore draft from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (draftRestoreTimeoutRef.current) {
      clearTimeout(draftRestoreTimeoutRef.current);
      draftRestoreTimeoutRef.current = null;
    }

    draftRestoreTimeoutRef.current = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem(DRAFT_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);

        if (parsed.title) setTitle(parsed.title);
        if (parsed.content) {
          setContentJson(parsed.content);
          setEditorInitialContent(parsed.content);
        }
        if (parsed.excerpt) setExcerpt(parsed.excerpt);
        // Arabic fields
        if (parsed.title_ar) setTitleAr(parsed.title_ar);
        if (parsed.content_ar) {
          setContentArJson(parsed.content_ar);
          setEditorInitialContentAr(parsed.content_ar);
        }
        if (parsed.excerpt_ar) setExcerptAr(parsed.excerpt_ar);
        if (parsed.category_id) setCategoryId(parsed.category_id);
        if (parsed.tags) setTags(parsed.tags);
        if (parsed.featured_image_url) {
          setFeaturedImageUrl(parsed.featured_image_url);
          setFeaturedImagePreview(parsed.featured_image_url);
        }
        if (parsed.meta_title) setMetaTitle(parsed.meta_title);
        if (parsed.meta_description) setMetaDescription(parsed.meta_description);
      } catch {
        // ignore
      }
    }, 0);

    return () => {
      if (draftRestoreTimeoutRef.current) {
        clearTimeout(draftRestoreTimeoutRef.current);
        draftRestoreTimeoutRef.current = null;
      }
    };
  }, [DRAFT_KEY]);

  // Auto-save draft to localStorage (debounced)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      try {
        const toSave: Record<string, unknown> = {
          title,
          content: contentJson,
          excerpt,
          title_ar: titleAr,
          content_ar: contentArJson,
          excerpt_ar: excerptAr,
          category_id: categoryId,
          tags,
          featured_image_url: featuredImageUrl,
          meta_title: metaTitle,
          meta_description: metaDescription,
        };
        localStorage.setItem(DRAFT_KEY, JSON.stringify(toSave));
      } catch {
        // ignore
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [title, contentJson, excerpt, titleAr, contentArJson, excerptAr, categoryId, tags, featuredImageUrl, metaTitle, metaDescription, DRAFT_KEY]);

  // Featured Image Handlers
  const handleFeaturedImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        // Fallback if toast is not available
        console.error('Please select a valid image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        console.error('Image size must be less than 5MB');
        return;
      }
      setFeaturedImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setFeaturedImagePreview(previewUrl);
      setFeaturedImageUrl('');
    }
  }, []);

  const handleRemoveFeaturedImage = useCallback(() => {
    setFeaturedImageFile(null);
    if (featuredImagePreview && !post?.featured_image_url) {
      URL.revokeObjectURL(featuredImagePreview);
    }
    setFeaturedImagePreview(null);
    setFeaturedImageUrl('');
    if (featuredImageInputRef.current) {
      featuredImageInputRef.current.value = '';
    }
  }, [featuredImagePreview, post?.featured_image_url]);

  // Tag Handlers
  const handleAddTag = useCallback(() => {
    const next = tagInput.trim();
    if (next && !tags.includes(next)) {
      setTags([...tags, next]);
      setTagInput('');
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback(
    (tagToRemove: string) => {
      setTags(tags.filter((t) => t !== tagToRemove));
    },
    [tags]
  );

  // Submit Handler
  const handleSubmit = useCallback(async (saveStatus: 'draft' | 'published' | 'review') => {
    let finalFeaturedImageUrl = featuredImageUrl || '';

    // Upload new image if a file was selected
    if (featuredImageFile) {
      try {
        const formData = new FormData();
        formData.append('file', featuredImageFile);
        // Link to post if editing
        if (post?.id) {
          formData.append('postId', post.id);
        }

        const result = await uploadBlogImage(formData);

        if (!result.success || !result.media) {
          console.error('Upload failed:', result.error);
          // Fallback: keep existing URL or use preview (but warn user)
          if (!finalFeaturedImageUrl) {
            alert('Failed to upload image. Please try again.');
            return;
          }
        } else {
          finalFeaturedImageUrl = result.media.url;

          // Clean up blob URL if it was a preview
          if (featuredImagePreview && featuredImagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(featuredImagePreview);
          }
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        if (!finalFeaturedImageUrl) {
          alert('Failed to upload image. Please try again.');
          return;
        }
      }
    }
    else if (featuredImagePreview && featuredImagePreview.startsWith('blob:')) {
      // If we have a blob preview but no file, it means user selected but didn't save properly
      // In this case, we should not save the blob URL
      if (!finalFeaturedImageUrl) {
        finalFeaturedImageUrl = '';
      }
    }

    const postData: Partial<BlogPost> = {
      title,
      title_ar: titleAr || undefined,
      slug: slugPreview,
      content: contentJson,
      content_ar: contentArJson,
      excerpt,
      excerpt_ar: excerptAr || undefined,
      category_id: categoryId || undefined,
      tags,
      featured_image_url: finalFeaturedImageUrl,
      status: saveStatus,
    };

    await onSave(postData);

    // Clean up after successful save
    if (featuredImageFile) {
      setFeaturedImageFile(null);
    }
    if (featuredImagePreview && featuredImagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(featuredImagePreview);
      setFeaturedImagePreview(null);
    }

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
    }
  }, [
    DRAFT_KEY,
    categoryId,
    contentJson,
    contentArJson,
    excerpt,
    excerptAr,
    featuredImageFile,
    featuredImagePreview,
    featuredImageUrl,
    onSave,
    slugPreview,
    tags,
    title,
    titleAr,
  ]);

  return (
    <div className="min-h-screen bg-slate-50/30">
      {/* Header */}
      <PostFormHeader
        isEditing={isEditing}
        isLoading={isLoading}
        title={title}
        onCancel={onCancel}
        onOpenPreview={() => setPreviewOpen(true)}
        onSaveDraft={() => handleSubmit('draft')}
        onPublish={() => handleSubmit('published')}
      />

      {/* Form Content */}
      <div className="w-full px-4 py-8 md:px-10">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Article Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter article title..."
                className="text-2xl font-playfair font-bold h-16 rounded-2xl border-slate-100 shadow-sm focus:ring-[#606C38]"
              />
              {title && (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  Permanent Link: <span className="text-[#606C38] lowercase">/blog/{slugPreview}</span>
                </p>
              )}
            </div>

            {/* Content Editor */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Content</Label>
              <RichTextEditor
                initialContent={editorInitialContent}
                onChange={(_, json) => {
                  if (json) setContentJson(json);
                }}
                placeholder="Once upon a time in Morocco..."
                postId={post?.id}
                onMediaDialogChange={setMediaDialogOpen}
              />
            </div>

            {/* Excerpt */}
            <div className="space-y-3">
              <Label htmlFor="excerpt" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Summary / Excerpt
              </Label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary of your article..."
                className="flex min-h-[120px] w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#606C38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none shadow-sm"
              />
            </div>

            {/* Arabic Section Divider */}
            <div className="relative py-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-slate-50/30 px-4 text-sm font-bold text-slate-500 uppercase tracking-widest">
                  المحتوى بالعربية (Arabic Content)
                </span>
              </div>
            </div>

            {/* Arabic Title */}
            <div className="space-y-3">
              <Label htmlFor="titleAr" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                العنوان (Title Arabic)
              </Label>
              <Input
                id="titleAr"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="أدخل عنوان المقال..."
                dir="rtl"
                className="text-2xl font-bold h-16 rounded-2xl border-slate-100 shadow-sm focus:ring-[#606C38] text-right"
              />
            </div>

            {/* Arabic Content Editor */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">
                المحتوى (Content Arabic)
              </Label>
              <RichTextEditor
                initialContent={editorInitialContentAr}
                onChange={(_, json) => {
                  if (json) setContentArJson(json);
                }}
                placeholder="اكتب محتوى المقال بالعربية..."
                postId={post?.id}
                dir="rtl"
              />
            </div>

            {/* Arabic Excerpt */}
            <div className="space-y-3">
              <Label htmlFor="excerptAr" className="text-xs font-bold uppercase tracking-widest text-slate-400">
                الملخص (Summary Arabic)
              </Label>
              <textarea
                id="excerptAr"
                value={excerptAr}
                onChange={(e) => setExcerptAr(e.target.value)}
                placeholder="ملخص قصير للمقال..."
                dir="rtl"
                className="flex min-h-[120px] w-full rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#606C38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none shadow-sm text-right"
              />
            </div>
          </div>

          {/* Sidebar */}
          <PostFormSidebar
            t={{}} // Mock translations
            categories={categories}
            featuredImagePreview={featuredImagePreview}
            featuredImageFile={featuredImageFile}
            featuredImageInputRef={featuredImageInputRef}
            onFeaturedImageClick={() => featuredImageInputRef.current?.click()}
            onFeaturedImageChange={handleFeaturedImageChange}
            onRemoveFeaturedImage={handleRemoveFeaturedImage}
            categoryId={categoryId}
            onChangeCategoryId={setCategoryId}
            tagInput={tagInput}
            onChangeTagInput={setTagInput}
            onAddTag={handleAddTag}
            tags={tags}
            onRemoveTag={handleRemoveTag}
            metaTitle={metaTitle}
            onChangeMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            onChangeMetaDescription={setMetaDescription}
            titleFallback={title}
            isMediaDialogOpen={mediaDialogOpen}
          />
        </div>
      </div>

      {/* Preview Dialog */}
      <PostPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title={title}
        excerpt={excerpt}
        featuredImagePreview={featuredImagePreview}
        categoryLabel={selectedCategoryName || 'Uncategorized'}
        tags={tags}
        contentJson={contentJson}
      />
    </div>
  );
}

export default PostForm;
