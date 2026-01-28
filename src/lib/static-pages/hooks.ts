"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StaticPage, StaticPageInput } from "@/types/static-page";

export const staticPageQueryKeys = {
    all: ["static-pages"] as const,
    list: () => [...staticPageQueryKeys.all, "list"] as const,
};

export function useStaticPages() {
    return useQuery({
        queryKey: staticPageQueryKeys.list(),
        queryFn: async () => {
            const res = await fetch("/api/admin/static-pages");
            if (!res.ok) throw new Error("Failed to fetch static pages");
            return res.json() as Promise<StaticPage[]>;
        },
    });
}

export function useCreateStaticPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: StaticPageInput) => {
            const res = await fetch("/api/admin/static-pages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to create static page");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staticPageQueryKeys.list() });
        },
    });
}

export function useUpdateStaticPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, input }: { id: string; input: StaticPageInput }) => {
            const res = await fetch(`/api/admin/static-pages/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to update static page");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staticPageQueryKeys.list() });
        },
    });
}

export function useDeleteStaticPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/admin/static-pages/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to delete static page");
            }
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staticPageQueryKeys.list() });
        },
    });
}
