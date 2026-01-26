"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SEOSettings } from "@/types/seo";

export const seoQueryKeys = {
    settings: ["seo-settings"] as const,
};

export function useSEOSettings() {
    return useQuery({
        queryKey: seoQueryKeys.settings,
        queryFn: async () => {
            const res = await fetch("/api/admin/settings/seo");
            if (res.status === 401) {
                // Let the component handle redirect or auth check, but throw here
                throw new Error("Unauthorized");
            }
            if (!res.ok) throw new Error("Failed to fetch SEO settings");
            return res.json() as Promise<SEOSettings>;
        },
    });
}

export function useUpdateSEOSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: SEOSettings) => {
            const res = await fetch("/api/admin/settings/seo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(input),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || "Failed to save SEO settings");
            }
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoQueryKeys.settings });
        },
    });
}
