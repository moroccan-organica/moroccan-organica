'use client';

import React from 'react';
import {
  Image as ImageIcon,
  Plus,
  X,
  Settings,
  Eye,
  Tag,
  Hash,
  Globe,
  Layout,
  Type,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { BlogCategory } from '@/types/blog';
import Image from 'next/image';
import { getValidImageUrl } from '@/lib/utils';

interface PostFormSidebarProps {
  t: any;
  categories: BlogCategory[];
  featuredImagePreview: string | null;
  featuredImageFile: File | null;
  featuredImageInputRef: React.RefObject<HTMLInputElement | null>;
  onFeaturedImageClick: () => void;
  onFeaturedImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFeaturedImage: () => void;
  categoryId: string;
  onChangeCategoryId: (id: string) => void;
  tagInput: string;
  onChangeTagInput: (val: string) => void;
  onAddTag: () => void;
  tags: string[];
  onRemoveTag: (tag: string) => void;
  metaTitle: string;
  onChangeMetaTitle: (val: string) => void;
  metaDescription: string;
  onChangeMetaDescription: (val: string) => void;
  titleFallback: string;
  isMediaDialogOpen: boolean;
}

export function PostFormSidebar({
  t,
  categories,
  featuredImagePreview,
  featuredImageInputRef,
  onFeaturedImageClick,
  onFeaturedImageChange,
  onRemoveFeaturedImage,
  categoryId,
  onChangeCategoryId,
  tagInput,
  onChangeTagInput,
  onAddTag,
  tags,
  onRemoveTag,
  metaTitle,
  onChangeMetaTitle,
  metaDescription,
  onChangeMetaDescription,
  titleFallback,
}: PostFormSidebarProps) {
  return (
    <aside className="w-full space-y-6 lg:w-80">
      {/* Article Settings */}
      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Settings className="h-4 w-4 text-[#606C38]" />
            {t.settings || 'Article Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.category || 'Category'}
            </Label>
            <Select value={categoryId} onValueChange={onChangeCategoryId}>
              <SelectTrigger id="category" className="rounded-xl border-slate-100 h-11">
                <SelectValue placeholder={t.selectCategory || "Select a category"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="bg-slate-50" />

          {/* Tags */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.tags || 'Tags'}
            </Label>
            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => onChangeTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddTag())}
                placeholder={t.addTag || "Add a tag..."}
                className="h-10 rounded-xl border-slate-100"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onAddTag}
                className="h-10 w-10 shrink-0 rounded-xl border-slate-100 text-[#606C38]"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer group"
                  onClick={() => onRemoveTag(tag)}
                >
                  <Hash className="h-3 w-3" />
                  {tag}
                  <X className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <ImageIcon className="h-4 w-4 text-[#606C38]" />
            {t.featuredImage || 'Featured Image'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {featuredImagePreview ? (
            <div className="group relative aspect-video overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
              <Image
                src={getValidImageUrl(featuredImagePreview)}
                alt="Featured"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={onFeaturedImageClick}
                  className="h-8 rounded-lg"
                >
                  Change
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onRemoveFeaturedImage}
                  className="h-8 rounded-lg"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onFeaturedImageClick}
              className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-[#606C38] hover:bg-[#606C38]/5 group"
            >
              <div className="mb-2 rounded-full bg-white p-3 shadow-sm group-hover:bg-[#606C38] group-hover:text-white transition-colors duration-300">
                <Plus className="h-6 w-6 text-slate-400 group-hover:text-inherit" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#606C38]">
                {t.uploadCover || 'Upload Cover'}
              </span>
            </button>
          )}
          <input
            ref={featuredImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onFeaturedImageChange}
          />
          <p className="mt-3 text-center text-[10px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
            {t.recommendedSize || 'Recommended size: 1200x630px. Max 5MB.'}
          </p>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Globe className="h-4 w-4 text-[#606C38]" />
            {t.seo || "SEO Optimization"}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="metaTitle" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.seoTitle || "SEO Title"}
            </Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => onChangeMetaTitle(e.target.value)}
              placeholder={titleFallback || 'Article Title'}
              className="rounded-xl border-slate-100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription" className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t.metaDescription || "Meta Description"}
            </Label>
            <textarea
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => onChangeMetaDescription(e.target.value)}
              placeholder={t.metaPlaceholder || "Brief summary for search engines..."}
              className="flex min-h-[100px] w-full rounded-xl border border-slate-100 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#606C38] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
            />
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
