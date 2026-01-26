"use client";

import { useQuery } from "@tanstack/react-query";
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
