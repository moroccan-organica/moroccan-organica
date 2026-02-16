"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { StaticPage, StaticPageInput } from "@/types/static-page";
import * as actions from "./actions";

export const staticPageQueryKeys = {
    all: ["static-pages"] as const,
    list: () => [...staticPageQueryKeys.all, "list"] as const,
};

export function useStaticPages() {
    return useQuery({
        queryKey: staticPageQueryKeys.list(),
        queryFn: () => actions.getStaticPages() as Promise<StaticPage[]>,
    });
}

export function useCreateStaticPage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: StaticPageInput) => {
            const result = await actions.createStaticPage(input);
            if (!result.success) {
                throw new Error(result.error || "Failed to create static page");
            }
            return result;
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
            const result = await actions.updateStaticPage(id, input);
            if (!result.success) {
                throw new Error(result.error || "Failed to update static page");
            }
            return result;
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
            const result = await actions.deleteStaticPage(id);
            if (!result.success) {
                throw new Error(result.error || "Failed to delete static page");
            }
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: staticPageQueryKeys.list() });
        },
    });
}
