"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BlogPostFull, BlogCategory } from "@/types/blog";

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
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.status) params.set("status", filters.status);
      if (filters?.categoryId) params.set("categoryId", filters.categoryId);
      if (filters?.search) params.set("search", filters.search);
      if (filters?.page) params.set("page", String(filters.page));
      if (filters?.pageSize) params.set("pageSize", String(filters.pageSize));

      const res = await fetch(`/api/blog/posts?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      return res.json() as Promise<PaginatedResponse<BlogPostFull>>;
    },
  });
}

export function useBlogPost(postId: string | null) {
  return useQuery({
    queryKey: blogQueryKeys.post(postId || ""),
    queryFn: async () => {
      if (!postId) return null;
      const res = await fetch(`/api/blog/posts/${postId}`);
      if (!res.ok) throw new Error("Failed to fetch post");
      return res.json() as Promise<BlogPostFull>;
    },
    enabled: !!postId,
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: PostInput) => {
      const res = await fetch("/api/blog/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create post");
      }
      return res.json();
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
      const res = await fetch(`/api/blog/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update post");
      }
      return res.json();
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
      const res = await fetch(`/api/blog/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete post");
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
      const res = await fetch(`/api/blog/posts/${postId}/publish`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to publish post");
      return res.json();
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
      const res = await fetch(`/api/blog/posts/${postId}/archive`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to archive post");
      return res.json();
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
      const res = await fetch(`/api/blog/posts/${postId}/archive`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to unarchive post");
      return res.json();
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
    queryFn: async () => {
      const res = await fetch("/api/blog/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json() as Promise<BlogCategory[]>;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateBlogCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CategoryInput) => {
      const res = await fetch("/api/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create category");
      }
      return res.json();
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
      const res = await fetch(`/api/blog/categories/${categoryId}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete category");
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
