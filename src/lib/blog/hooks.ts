"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BlogPostFull, BlogCategory } from "@/types/blog";
import * as actions from "./actions";

// Query keys
export const blogQueryKeys = {
  all: ["blog"] as const,
  categories: () => [...blogQueryKeys.all, "categories"] as const,
  posts: () => [...blogQueryKeys.all, "posts"] as const,
  myPosts: (filters?: Record<string, unknown>) => [...blogQueryKeys.posts(), "my", filters] as const,
  post: (id: string) => [...blogQueryKeys.posts(), id] as const,
  stats: () => [...blogQueryKeys.all, "stats"] as const,
};

// Types
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

interface PostFilters {
  status?: string;
  categoryId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  [key: string]: unknown;
}

interface PostInput {
  title: string;
  titleAr?: string;
  content?: unknown;
  contentAr?: unknown;
  excerpt?: string;
  excerptAr?: string;
  categoryId?: string;
  tags?: string[];
  featuredImageUrl?: string;
  status?: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface CategoryInput {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

// ============================================
// POSTS HOOKS
// ============================================

export function useBlogPosts(filters?: PostFilters) {
  return useQuery({
    queryKey: blogQueryKeys.myPosts(filters),
    queryFn: () => actions.getBlogPosts({
      page: filters?.page,
      pageSize: filters?.pageSize,
      categoryId: filters?.categoryId,
      search: filters?.search,
      status: filters?.status,
    }),
  });
}

export function useBlogPost(postId: string | null) {
  return useQuery({
    queryKey: blogQueryKeys.post(postId || ""),
    queryFn: async () => {
      if (!postId) return null;
      return actions.getBlogPostById(postId);
    },
    enabled: !!postId,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PostInput) => {
      const result = await actions.createBlogPost(input);
      if (!result.success) {
        throw new Error(result.error || "Failed to create post");
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
    },
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, input }: { postId: string; input: Partial<PostInput> }) => {
      const result = await actions.updateBlogPost(postId, input);
      if (!result.success) {
        throw new Error(result.error || "Failed to update post");
      }
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.post(variables.postId) });
    },
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await actions.deleteBlogPost(postId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete post");
      }
      return postId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
    },
  });
}

export function usePublishBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await actions.publishBlogPost(postId);
      if (!result.success) {
        throw new Error(result.error || "Failed to publish post");
      }
      return result;
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.post(postId) });
    },
  });
}

export function useArchiveBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await actions.archiveBlogPost(postId);
      if (!result.success) {
        throw new Error(result.error || "Failed to archive post");
      }
      return result;
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.post(postId) });
    },
  });
}

export function useUnarchiveBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const result = await actions.unarchiveBlogPost(postId);
      if (!result.success) {
        throw new Error(result.error || "Failed to unarchive post");
      }
      return result;
    },
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.posts() });
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.post(postId) });
    },
  });
}

// ============================================
// CATEGORIES HOOKS
// ============================================

export function useBlogCategories() {
  return useQuery({
    queryKey: blogQueryKeys.categories(),
    queryFn: () => actions.getBlogCategories(),
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CategoryInput) => {
      const result = await actions.createBlogCategory(input);
      if (!result.success) {
        throw new Error(result.error || "Failed to create category");
      }
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.categories() });
    },
  });
}

export function useDeleteBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const result = await actions.deleteBlogCategory(categoryId);
      if (!result.success) {
        throw new Error(result.error || "Failed to delete category");
      }
      return categoryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogQueryKeys.categories() });
    },
  });
}

// ============================================
// STATS HOOKS
// ============================================

export function useBlogStats() {
  const { data: postsData, isLoading } = useBlogPosts({ pageSize: 1000 });

  const posts = postsData?.data || [];

  const stats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.status === "published").length,
    draftPosts: posts.filter((p) => p.status === "draft").length,
    inReviewPosts: posts.filter((p) => p.status === "review").length,
    archivedPosts: posts.filter((p) => p.status === "archived").length,
    totalViews: posts.reduce((sum, p) => sum + (p.view_count || 0), 0),
  };

  return { stats, isLoading };
}

// ============================================
// FORM HOOK
// ============================================

export function useBlogPostForm(postId?: string) {
  const { data: categories, isLoading: categoriesLoading } = useBlogCategories();
  const { data: post, isLoading: postLoading } = useBlogPost(postId || null);

  const createMutation = useCreateBlogPost();
  const updateMutation = useUpdateBlogPost();

  const isLoading = categoriesLoading || (postId ? postLoading : false);
  const isEditing = !!postId;

  const save = async (input: PostInput) => {
    if (isEditing && postId) {
      return updateMutation.mutateAsync({ postId, input });
    }
    return createMutation.mutateAsync(input);
  };

  return {
    categories: categories || [],
    post,
    isLoading,
    isEditing,
    isSaving: createMutation.isPending || updateMutation.isPending,
    save,
    saveError: createMutation.error || updateMutation.error,
  };
}
