"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminHeader } from "@/features/admin/components/AdminHeader";
import { Package, ShoppingCart, DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { getDashboardStats, getRecentOrders, getTopProducts } from "@/features/admin/actions/dashboard.actions";
import type { DashboardStats, RecentOrder, TopProduct } from "@/features/admin/actions/dashboard.actions";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            const [statsData, ordersData, productsData] = await Promise.all([
                getDashboardStats(),
                getRecentOrders(5),
                getTopProducts(4),
            ]);
            setStats(statsData);
            setRecentOrders(ordersData);
            setTopProducts(productsData);
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatChange = (change: number) => {
        const sign = change >= 0 ? "+" : "";
        return `${sign}${change.toFixed(1)}%`;
    };

    const getStatusColor = (status: string) => {
        const statusColors: Record<string, string> = {
            PENDING: "bg-yellow-100 text-yellow-800",
            PROCESSING: "bg-blue-100 text-blue-800",
            SHIPPED: "bg-purple-100 text-purple-800",
            DELIVERED: "bg-green-100 text-green-800",
            CANCELLED: "bg-red-100 text-red-800",
        };
        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    const statCards = stats
        ? [
            {
                label: "Total Products",
                value: stats.totalProducts.toString(),
                icon: Package,
                color: "bg-blue-500",
                change: stats.productsChange,
            },
            {
                label: "Total Orders",
                value: stats.totalOrders.toString(),
                icon: ShoppingCart,
                color: "bg-green-500",
                change: stats.ordersChange,
            },
            {
                label: "Revenue",
                value: formatCurrency(stats.revenue),
                icon: DollarSign,
                color: "bg-purple-500",
                change: stats.revenueChange,
            },
            {
                label: "Growth",
                value: `${stats.revenueChange.toFixed(1)}%`,
                icon: TrendingUp,
                color: "bg-orange-500",
                change: stats.revenueChange,
            },
        ]
        : [];

    if (isLoading) {
        return (
            <div>
                <AdminHeader title="Dashboard" subtitle="Welcome back to Moroccan Organica" />
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-[#606C38]" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHeader title="Dashboard" subtitle="Welcome back to Moroccan Organica" />

            <div className="p-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        const isPositive = stat.change >= 0;
                        return (
                            <div
                                key={stat.label}
                                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`${stat.color} p-3 rounded-xl`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>
                                    <span
                                        className={cn(
                                            "text-sm font-medium px-2 py-1 rounded-full",
                                            isPositive
                                                ? "text-green-600 bg-green-50"
                                                : "text-red-600 bg-red-50"
                                        )}
                                    >
                                        {formatChange(stat.change)}
                                    </span>
                                </div>
                                <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Recent Orders & Top Products */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Orders</h3>
                        {recentOrders.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No recent orders</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {recentOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="flex items-center justify-between p-4 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {order.reference}
                                            </p>
                                            <p className="text-xs text-slate-500">{order.customerName}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className={getStatusColor(order.status)}>
                                                {order.status}
                                            </Badge>
                                            <p className="text-sm font-bold text-[#606C38]">
                                                {formatCurrency(order.totalAmount)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Top Products */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Top Products</h3>
                        {topProducts.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No product data available</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {topProducts.map((product) => (
                                    <div key={product.id} className="flex items-center gap-4">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            width={48}
                                            height={48}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                {product.name}
                                            </p>
                                            <p className="text-xs text-slate-500">{product.category}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#606C38]">
                                                {formatCurrency(product.price)}
                                            </p>
                                            <p className="text-xs text-slate-500">{product.orderCount} orders</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
