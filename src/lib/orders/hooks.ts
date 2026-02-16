"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminOrder } from "@/types/order";
import * as actions from "@/actions/order.actions";

export const orderQueryKeys = {
    all: ["orders"] as const,
    list: () => [...orderQueryKeys.all, "list"] as const,
};

export function useOrders() {
    return useQuery({
        queryKey: orderQueryKeys.list(),
        queryFn: () => actions.getOrders() as Promise<AdminOrder[]>,
    });
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const result = await actions.updateOrderStatus(id, status);
            if (!result.success) {
                throw new Error(result.error || "Failed to update order");
            }
            return result.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderQueryKeys.list() });
        },
    });
}
