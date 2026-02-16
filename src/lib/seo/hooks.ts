"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SEOSettings } from "@/types/seo";
import * as actions from "@/actions/seo.actions";

export const seoQueryKeys = {
    settings: ["seo-settings"] as const,
};

export function useSEOSettings() {
    return useQuery({
        queryKey: seoQueryKeys.settings,
        queryFn: () => actions.getSEOSettings() as Promise<SEOSettings>,
    });
}

export function useUpdateSEOSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: SEOSettings) => {
            const result = await actions.updateSEOSettings(input);
            if (!result.success) {
                throw new Error(result.error || "Failed to save SEO settings");
            }
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: seoQueryKeys.settings });
        },
    });
}
