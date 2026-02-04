"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminOrder } from "@/types/order";

export const orderQueryKeys = {
    all: ["orders"] as const,
    list: () => [...orderQueryKeys.all, "list"] as const,
};

export function useOrders() {
    return useQuery({
        queryKey: orderQueryKeys.list(),
        queryFn: async () => {
            const res = await fetch("/api/admin/orders");
            if (!res.ok) throw new Error("Failed to fetch orders");
            return res.json() as Promise<AdminOrder[]>;
        },
    });
}

export function useUpdateOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: string; status: string }) => {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update order");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderQueryKeys.list() });
        },
    });
}
